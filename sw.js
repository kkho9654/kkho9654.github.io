// 서비스 워커: 앱 셸만 캐시해 오프라인 실행과 홈 화면 설치를 지원한다.
// 같은 출처의 GET만 다룬다. LLM 제공사 요청(다른 출처, POST)은 절대 건드리지 않는다.
const CACHE = 'app-shell-v1';

// index.html이 참조하는 같은 출처 /assets/ 경로 목록
const assetPaths = (html) => {
  const found = new Set();
  for (const m of html.matchAll(/["'(](\/assets\/[^"'()\s?#]+)/g)) found.add(m[1]);
  return [...found];
};

// 지울 /assets/ 캐시 키: keep 목록에 없는 같은 출처 /assets/ 항목
const staleAssetKeys = (urls, origin, keep) =>
  urls.filter((u) => {
    const x = new URL(u);
    return x.origin === origin && x.pathname.startsWith('/assets/') && !keep.has(x.pathname);
  });

// 앱 셸로 저장해도 되는 응답인가: 정상이고 content-type이 text/html이며 정적 파일 경로(마지막 구간에 확장자)가 아닐 때만.
// /work-guide.md 같은 정적 파일을 열어도 셸이 덮어써지지 않게 한다.
const isShellResponse = (pathname, res) => {
  if (!res || !res.ok) return false;
  const type = (res.headers && res.headers.get('content-type')) || '';
  if (!/^text\/html\b/i.test(type)) return false;
  const last = pathname.split('/').pop() || '';
  return !/\.[A-Za-z0-9]+$/.test(last);
};

// 새 셸 응답을 저장한다. 순서: 새 셸의 자산 저장 -> 셸 저장 -> 옛 자산 삭제.
// 자산 하나라도 못 받으면 예외를 던지고, 옛 셸과 옛 자산은 그대로 둔다.
const storeShell = async (res) => {
  const cache = await caches.open(CACHE);
  const paths = assetPaths(await res.clone().text());
  await Promise.all(
    paths.map(async (p) => {
      if (!(await cache.match(p))) await cache.add(p);
    }),
  );
  await cache.put('/', res);
  const keep = new Set(paths);
  const keys = await cache.keys();
  const stale = new Set(staleAssetKeys(keys.map((k) => k.url), self.location.origin, keep));
  await Promise.all(keys.filter((k) => stale.has(k.url)).map((k) => cache.delete(k)));
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(['/manifest.webmanifest', '/icon.svg']);
      const res = await fetch('/', { cache: 'reload' });
      if (!res.ok) throw new Error('shell fetch failed');
      await storeShell(res);
    })(),
  );
  self.skipWaiting();
});

// 현재 저장된 셸이 참조하지 않는 /assets/ 캐시 항목(이전 배포의 해시 파일)을 지운다
const pruneOldAssets = async () => {
  const cache = await caches.open(CACHE);
  const shell = await cache.match('/');
  if (!shell) return;
  const keep = new Set(assetPaths(await shell.text()));
  const keys = await cache.keys();
  const stale = new Set(staleAssetKeys(keys.map((k) => k.url), self.location.origin, keep));
  await Promise.all(keys.filter((k) => stale.has(k.url)).map((k) => cache.delete(k)));
};

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
      pruneOldAssets(),
    ]),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  // 페이지 이동: 네트워크 우선, 실패하면 캐시된 셸
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // 앱의 HTML 문서 응답만 오프라인 셸로 저장한다(오류 페이지·마크다운 같은 정적 파일이 셸이 되지 않도록)
          // 새 셸의 자산을 모두 받은 뒤에만 셸을 바꾸고 옛 자산을 지운다. 실패하면 옛 셸을 유지한다.
          if (isShellResponse(url.pathname, res)) event.waitUntil(storeShell(res.clone()).catch(() => undefined));
          return res;
        })
        .catch(() => caches.match('/')),
    );
    return;
  }

  // 해시가 붙은 빌드 산출물: 캐시 우선
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
  }
});
