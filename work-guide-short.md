# 작품 파일 형식 요약 (byok-character-chat-work, 버전 1)

BYOK 오픈 캐릭터챗의 **작품 파일**(JSON 하나, 확장자 `.byok-work.json`) 형식 요약입니다. 앱의 "작품 파일로 가져오기"에 붙여 넣으면 새 작품이 만들어집니다. 오류가 나면 "오류 복사"로 받은 글을 보고 고칩니다. 기존 작품을 고칠 때도 같은 형식으로 내고, 다시 가져오면 새 작품이 됩니다. 칸별 효과 설명은 전체판에 있습니다.

## LLM에게 주는 지시

당신은 이 문서의 형식으로 작품 파일을 만든다. 아래를 지켜 **JSON 객체 하나만** 출력한다. 형식 명세 표가 전부다.

1. 출력은 `{`로 시작해 `}`로 끝나는 JSON 객체 하나다. `json` 코드 울타리 하나로 감싸도 된다(앱이 벗긴다). 울타리 밖에 설명을 쓰지 않는다. JSON에는 주석(`//`)과 끝 쉼표가 없다.
2. `format`은 `"byok-character-chat-work"`, `version`은 숫자 `1`이다.
3. 형식 명세 표에 있는 칸만 쓴다. 표에 없는 칸, `id`, 시각, 이미지 코드(`[[img:…]]`)는 만들지 않는다.
4. 필수 칸은 모두 쓴다. 모르거나 필요 없는 선택 칸은 **생략**한다(빈 값으로 채우려고 만들지 않는다). `work.recommendedModel`은 실제 모델 이름을 알 때만 쓰고 모르면 칸 전체를 생략한다. `work.userControls`는 사람이 요청하지 않으면 쓰지 않는다.
5. 한도와 권장 길이를 넘기지 않는다(권장도 넘기지 않는다). 목록 개수와 글자 수를 쓰기 전에 센다.
6. 참조는 이름과 번호로 한다. 사건의 `when`·`effects`의 `name`은 `guide.state.vars[].name` 중 하나(`when`에서만 `챕터`도 가능)이고, 챕터 번호는 `guide.chapters` 배열의 1부터 순서다.
7. 글 안의 큰따옴표는 `\"`, 줄바꿈은 `\n`으로 쓴다. 한 줄 칸에는 줄바꿈을 넣지 않는다.
8. 사람이 요청한 내용(제목, 장르, 분위기, 인물)을 따른다. 요청에 없는 칸은 작품에 어울리게 정하되 요청에 없는 설정을 늘어놓지 않는다. 등급(`rating`)은 사람이 정해 주지 않았다면 내용에 맞춰 고르되 **애매하면 더 높은 등급**을 고른다(`all` 누가 봐도 되는 내용, `teen` 15세 이상 수위, `mature` 성적이거나 잔혹한 성인(19세) 수위. 앱은 표시만 하고 내용을 걸러 주지 않는다). 사람이 "다 채워 줘"처럼 말하면 상태·조건부·챕터·장면·사건·엔딩을 **모두** 만든다(서로의 이름과 번호가 맞게).
9. 키워드(`keys`)는 모두 두 글자 이상이다. `책`·`문`·`방` 같은 한 글자는 `도서관`·`철문`·`서재`처럼 풀어 쓴다. 출력 전에 모든 `keys`의 글자 수를 센다.
10. 기존 작품을 고쳐 달라고 하면 **고치라고 한 칸만 바꾸고 나머지 칸은 글자 하나도 바꾸지 않고 그대로 옮긴다**(문체·어미·띄어쓰기·줄바꿈 포함). 요청하지 않은 문장을 다듬거나 되풀이해 쓰지 않는다. 고친 칸만 바꾼 전체 JSON을 낸다.
11. 출력 직전에 아래 "자주 틀리는 것"의 점검 목록을 하나씩 확인한다.

## 형식 명세

경로의 `[]`는 목록의 항목 하나를 뜻합니다(키가 아닙니다). 필수는 그 객체가 있을 때를 말합니다. 글의 길이는 코드 포인트(한글 한 글자 = 1자)로 셉니다. **한도**는 앱이 거부하는 값이고 **권장**은 AI가 지킬 크기입니다(넘기면 붙여 넣어 가져올 때는 경고, 앱 안의 AI 생성에서는 오류입니다. 만들 때는 권장을 넘기지 않습니다). 파일 전체는 1 MiB 안이어야 합니다.

### 최상위

| 경로 | 타입 | 필수 | 한도 | 허용값·참조 | 뜻 |
| --- | --- | --- | --- | --- | --- |
| `format` | 글 | 예 | - | - | 고정 글자 `byok-character-chat-work` |
| `version` | 정수 | 예 | - | - | 정수 1(따옴표 없음) |
| `work` | 객체 | 예 | - | - | 공개 소개 묶음. 게시하면 받는 사람에게 보임 |
| `guide` | 객체 | 예 | - | - | 비공개 지침 묶음. 쓸 것이 없어도 `{}`는 필요 |

### work (공개)

| 경로 | 타입 | 필수 | 한도 | 허용값·참조 | 뜻 |
| --- | --- | --- | --- | --- | --- |
| `work.title` | 글(한 줄) | 예 | 1~60자 | - | 작품 제목. `{{work}}`의 값 |
| `work.genre` | 글(한 줄) | 예 | 최대 200자, 권장 30자 | - | 장르. 빈 글 가능 |
| `work.rating` | 고정값 | 예 | - | `all`, `teen`, `mature` | 등급. 기본값 없음 |
| `work.synopsis` | 글 | 예 | 최대 20000자, 권장 500자 | - | 공개 줄거리. 빈 글 가능 |
| `work.tags` | 목록 | 예 | 최대 50개, 권장 10개 | - | 태그 목록. 빈 목록 가능 |
| `work.tags[]` | 글(한 줄) | 예 | 1~60자, 권장 20자 | - | 태그 하나. 쉼표·`{{`·`[[` 불가 |
| `work.openings` | 목록 | 예 | 최대 50개, 권장 5개 | - | 시작 상황 목록. 빈 목록 가능 |
| `work.openings[]` | 글 | 예 | 1~20000자, 권장 800자 | - | 시작 상황 하나. 첫 AI 메시지의 후보 |
| `work.narration` | 객체 | 아니오 | - | - | 기본 서술 설정 |
| `work.narration.pov` | 고정값 | 아니오 | - | `first`, `second`, `third` | 시점 |
| `work.narration.length` | 고정값 | 아니오 | - | `short`, `medium`, `long` | 응답 분량 |
| `work.narration.style` | 글(한 줄) | 아니오 | 최대 200자 | - | 문체 한 줄 |
| `work.userControls` | 목록 | 아니오 | 최대 3개 | - | 받는 사람이 바꿀 수 있는 항목. 생략하면 모두 열림, 빈 목록이면 모두 닫힘 |
| `work.userControls[]` | 고정값 | 예 | - | `pov`, `length`, `style` | 항목 하나. 중복 불가 |
| `work.recommendedModel` | 객체 | 아니오 | - | - | 권장 모델 안내 |
| `work.recommendedModel.model` | 글(한 줄) | 예 | 1~80자 | - | 모델 이름 안내 |
| `work.recommendedModel.note` | 글(한 줄) | 아니오 | 최대 100자 | - | 덧붙이는 말 |

### guide (비공개)

| 경로 | 타입 | 필수 | 한도 | 허용값·참조 | 뜻 |
| --- | --- | --- | --- | --- | --- |
| `guide.head` | 글 | 아니오 | 최대 100000자 | - | 지침 맨 앞에 놓이는 글. 상시 지침 합계 6000토큰 안 |
| `guide.sections` | 객체 | 아니오 | - | - | 글 섹션 묶음. 머리말·인물·규칙과 합쳐 6000토큰 안 |
| `guide.sections.overview` | 글 | 아니오 | 최대 100000자 | - | 작품 개요. 글 |
| `guide.sections.world` | 글 | 아니오 | 최대 100000자 | - | 세계관. 글 |
| `guide.sections.userRole` | 글 | 아니오 | 최대 100000자 | - | 이용자 역할. 글 |
| `guide.sections.narration` | 글 | 아니오 | 최대 100000자 | - | 서술 규칙. 글 |
| `guide.sections.progress` | 글 | 아니오 | 최대 100000자 | - | 진행 규칙. 글 |
| `guide.sections.chapters` | 글 | 아니오 | 최대 100000자 | - | 챕터와 엔딩. 글 |
| `guide.sections.state` | 글 | 아니오 | 최대 100000자 | - | 상태 변수. 글 |
| `guide.sections.secrets` | 글 | 아니오 | 최대 100000자 | - | 비밀과 공개 순서. 글 |
| `guide.sections.format` | 글 | 아니오 | 최대 100000자 | - | 출력 형식과 예시. 글 |
| `guide.cast` | 목록 | 아니오 | 최대 100개, 권장 8개 | - | 등장인물 목록 |
| `guide.cast[]` | 객체 | 예 | - | - | 인물 하나. 이름 중복 불가 |
| `guide.cast[].name` | 글(한 줄) | 예 | 1~20자 | - | 이름. 글자·숫자·단어 사이 공백 한 칸만 |
| `guide.cast[].tier` | 고정값 | 예 | - | `lead`, `support` | `lead` 주연, `support` 조연. 첫 주연이 `{{char}}` |
| `guide.cast[].description` | 글 | 예 | 최대 20000자, 권장 600자 | - | 3인칭 인물 소개 |
| `guide.cast[].stubbornness` | 정수 | 아니오 | 1~5 | - | 성향: 1 유연함 ~ 5 완고함 |
| `guide.rules` | 목록 | 아니오 | 최대 12개 | - | 세계 규칙 목록 |
| `guide.rules[]` | 객체 | 예 | - | - | 규칙 하나 |
| `guide.rules[].text` | 글(한 줄) | 예 | 1~100자 | - | 규칙 한 줄. 같은 글 중복 불가 |
| `guide.rules[].lock` | 고정값 | 예 | - | `fixed`, `event`, `free` | `fixed` 고정, `event` 사건으로만, `free` 자유 |
| `guide.state` | 객체 | 아니오 | - | - | 상태 추적. 없으면 상태가 꺼짐(챕터가 있으면 챕터만 켜짐) |
| `guide.state.builtin` | true/false | 예 | - | - | true면 `시간`·`장소` 항목이 앞에 붙음 |
| `guide.state.vars` | 목록 | 예 | 최대 8개 | - | 직접 만드는 항목 목록. `[]` 가능 |
| `guide.state.vars[]` | 객체 | 예 | - | - | 항목 하나. 이름 중복 불가(대소문자 무시) |
| `guide.state.vars[].name` | 글(한 줄) | 예 | 1~12자 | - | 이름. 글자·숫자·`_`만. 예약·`__proto__` 불가 |
| `guide.state.vars[].kind` | 고정값 | 예 | - | `text`, `number` | `text` 글, `number` 숫자 |
| `guide.state.vars[].min` | 숫자 | 아니오 | - | - | 숫자 항목의 최솟값. 절댓값 1000000 이하 |
| `guide.state.vars[].max` | 숫자 | 아니오 | - | - | 숫자 항목의 최댓값. `min` 이상. 절댓값 1000000 이하 |
| `guide.state.vars[].initial` | 글 또는 숫자 | 아니오 | - | - | 시작값. `kind`와 같은 종류, 범위 안. 글은 40자까지 |
| `guide.state.vars[].rule` | 글(한 줄) | 아니오 | 최대 120자 | - | 값이 바뀌는 규칙(모델에게만 감) |
| `guide.state.vars[].pinned` | true/false | 예 | - | - | 방 위 상태 줄에 보일지 |
| `guide.conditional` | 목록 | 아니오 | 최대 30개 | - | 조건부 설정 목록 |
| `guide.conditional[]` | 객체 | 예 | - | - | 항목 하나. 이름 중복 불가 |
| `guide.conditional[].name` | 글(한 줄) | 예 | 1~30자 | - | 항목 이름(제목으로 들어감) |
| `guide.conditional[].keys` | 목록 | 예 | 최대 8개 | - | 키워드 목록. 비우면 챕터 범위 필수 |
| `guide.conditional[].keys[]` | 글(한 줄) | 예 | 2~20자 | - | 키워드 하나. 중복 불가 |
| `guide.conditional[].content` | 글 | 예 | 1~800자 | - | 조건이 맞을 때 들어가는 글 |
| `guide.conditional[].chapterFrom` | 정수 | 아니오 | 1~12 | 챕터 번호 | 이 챕터부터(`guide.chapters` 번호) |
| `guide.conditional[].chapterTo` | 정수 | 아니오 | 1~12 | 챕터 번호 | 이 챕터까지. `chapterFrom` 이상 |
| `guide.chapters` | 목록 | 아니오 | 최대 12개 | - | 챕터 목록. 순서가 진행 순서이자 번호 |
| `guide.chapters[]` | 객체 | 예 | - | - | 챕터 하나. 이름 중복 불가 |
| `guide.chapters[].name` | 글(한 줄) | 예 | 1~30자 | - | 챕터 이름 |
| `guide.chapters[].goal` | 글 | 예 | 1~600자 | - | 이 챕터 동안 모델이 따를 목표 |
| `guide.chapters[].advance` | 글 | 아니오 | 최대 200자 | - | 다음 챕터로 넘어가는 조건. 마지막 챕터는 없음 |
| `guide.chapters[].ending` | true/false | 아니오 | - | - | 마지막 챕터만 true 가능 |
| `guide.scenes` | 목록 | 아니오 | 최대 12개 | - | 고정 장면 목록 |
| `guide.scenes[]` | 객체 | 예 | - | - | 장면 하나. 이름 중복 불가 |
| `guide.scenes[].name` | 글(한 줄) | 예 | 1~30자 | - | 장면 이름 |
| `guide.scenes[].text` | 글 | 예 | 1~1500자, 권장 1200자 | - | 이용자에게 그대로 나가는 글 |
| `guide.scenes[].keys` | 목록 | 예 | 최대 8개 | - | 키워드 목록. 비우면 챕터 범위 필수 |
| `guide.scenes[].keys[]` | 글(한 줄) | 예 | 2~20자 | - | 키워드 하나. 중복 불가 |
| `guide.scenes[].chapterFrom` | 정수 | 아니오 | 1~12 | 챕터 번호 | 이 챕터부터 |
| `guide.scenes[].chapterTo` | 정수 | 아니오 | 1~12 | 챕터 번호 | 이 챕터까지 |
| `guide.events` | 목록 | 아니오 | 최대 20개 | - | 사건 카드·엔딩 목록 |
| `guide.events[]` | 객체 | 예 | - | - | 카드 하나. 이름 중복 불가 |
| `guide.events[].name` | 글(한 줄) | 예 | 1~30자 | - | 카드 이름. 엔딩이면 도달했을 때 이용자에게 보임 |
| `guide.events[].content` | 글 | 예 | 1~800자 | - | 모델에게 주는 지시(엔딩이면 마무리 방향) |
| `guide.events[].ending` | true/false | 아니오 | true는 최대 6개 | - | true면 엔딩 카드. `mode`는 `once`, `effects` 없음 |
| `guide.events[].mode` | 고정값 | 예 | - | `once`, `repeat`, `hold` | `once` 한 번, `repeat` 되풀이, `hold` 조건이 맞는 동안 계속 |
| `guide.events[].keys` | 목록 | 예 | 최대 8개 | - | 키워드 목록. 빈 목록 가능 |
| `guide.events[].keys[]` | 글(한 줄) | 예 | 2~20자 | - | 키워드 하나. 중복 불가 |
| `guide.events[].chapterFrom` | 정수 | 아니오 | 1~12 | 챕터 번호 | 이 챕터부터 |
| `guide.events[].chapterTo` | 정수 | 아니오 | 1~12 | 챕터 번호 | 이 챕터까지 |
| `guide.events[].when` | 목록 | 아니오 | 최대 4개 | - | 상태 값 조건 목록. 모두 맞아야 함 |
| `guide.events[].when[]` | 객체 | 예 | - | - | 조건 하나 |
| `guide.events[].when[].name` | 글(한 줄) | 예 | 1~12자 | 상태 항목 이름 | 상태 항목 이름 또는 `챕터` |
| `guide.events[].when[].op` | 고정값 | 예 | - | `gte`, `gt`, `lte`, `lt`, `eq`, `ne` | 비교. 글 항목은 `eq`·`ne`만 |
| `guide.events[].when[].value` | 글 또는 숫자 | 예 | - | - | 비교할 값. 항목 종류와 같은 형(숫자 또는 글) |
| `guide.events[].effects` | 목록 | 아니오 | 최대 4개 | - | 발동한 뒤 반영되는 결과 목록. 엔딩·`hold`는 못 씀 |
| `guide.events[].effects[]` | 객체 | 예 | - | - | 결과 하나 |
| `guide.events[].effects[].name` | 글(한 줄) | 예 | 1~12자 | 상태 항목 이름 | 상태 항목 이름. `챕터` 불가 |
| `guide.events[].effects[].op` | 고정값 | 예 | - | `add`, `set` | `add` 더하기(숫자만), `set` 바꾸기 |
| `guide.events[].effects[].value` | 글 또는 숫자 | 예 | - | - | 더하거나 바꿀 값. 항목 종류와 같은 형 |

`work`·`guide` 안의 객체에는 표에 없는 키를 두지 않습니다. 어디서든 `__proto__`, `constructor`, `prototype` 키는 오류입니다. `guide.sections`의 키는 `overview`, `world`, `userRole`, `narration`, `progress`, `chapters`, `state`, `secrets`, `format` 9개뿐입니다(`cast`는 여기 못 둡니다).

## 자주 틀리는 것

실제 모델이 자주 어기거나 앱이 오류로 돌려보내는 것들이다. 오류 목록을 받으면 경로와 이유를 읽고 아래에서 같은 문제를 찾아 고친다.

1. **예약 상태 이름**: `시간`, `장소`, `챕터`는 `guide.state.vars[].name`으로 못 쓴다. `시간`·`장소`는 `"builtin": true`로 이미 생기고, `챕터`는 `guide.chapters`가 있으면 자동으로 생긴다. `신뢰`, `경과일`, `분위기`처럼 다른 이름을 쓴다.
2. **한 글자 키워드**: 키워드는 한 개가 2~20자이다. "손", "책", "검" 같은 한 글자 낱말은 오류이니 늘린다(손→손끝, 책→교과서, 검→장검). 같은 키워드를 두 번 쓰지 않는다. 키워드는 대화에서 실제로 나올 낱말이고 그 카드의 내용과 맞아야 한다. 대표 인물 이름처럼 거의 매 턴 나오는 낱말은 피한다.
3. **목록 한도 초과**: `work.tags` 최대 50개, 권장 10개 / `work.openings` 최대 50개, 권장 5개 / `guide.cast` 최대 100개, 권장 8개 / `guide.rules` 최대 12개 / `guide.state.vars` 최대 8개 / `guide.conditional` 최대 30개 / `guide.conditional[].keys` 최대 8개 / `guide.chapters` 최대 12개 / `guide.scenes` 최대 12개 / `guide.scenes[].keys` 최대 8개 / `guide.events` 최대 20개 / `guide.events[].keys` 최대 8개 / `guide.events[].when` 최대 4개 / `guide.events[].effects` 최대 4개. 권장이 있는 목록은 권장 안에서 쓴다.
4. **이름이 겹치는 두 칸**: 글 섹션 `guide.sections.chapters`·`guide.sections.state`는 모델에게 가는 **글 메모**일 뿐 챕터나 상태 항목을 만들지 않는다. 동작하는 것은 구조 배열 `guide.chapters`·`guide.state`다. 챕터와 상태가 필요하면 배열을 쓰고, 메모는 짧게 요약만 쓴다. `work.narration`(시점·분량·문체 설정값)과 `guide.sections.narration`(서술 규칙 글)도 서로 다른 칸이다.
5. **상태 추적**: 상태는 `guide.state`(또는 `guide.chapters`)가 있어야 켜진다. 사건·엔딩 카드는 상태가 켜져 있어야 움직이므로 `guide.events`를 쓰면 `guide.state`나 `guide.chapters`도 쓴다. `시간`·`장소`만 필요하면 `"state": {"builtin": true, "vars": []}`로 쓴다.
6. **없는 이름·번호 참조**: 사건이 가리키는 상태 항목은 `guide.state.vars`에 있어야 하고, `chapterFrom`·`chapterTo`는 `guide.chapters` 개수 이하여야 한다(챕터가 없으면 쓰지 않는다). 숫자 항목에는 숫자 `value`, 글 항목에는 글 `value`와 `eq`·`ne`만 쓴다. `챕터`는 `when`에만 쓰고 `effects`에는 못 쓴다. 범위의 최솟값 이상·최댓값 이하처럼 늘 참이 되는 조건과 범위 밖이라 늘 거짓인 조건은 쓰지 않는다(예: 0~100인 항목에 `청결도 gte 0`. 챕터는 1부터라 `챕터 gte 1`·`gte 0`도 항상 참이다). 챕터 조건이 필요 없으면 `when`에서 빼고 구간은 `chapterFrom`·`chapterTo`로 쓴다. 마지막 번호보다 큰 값은 영원히 거짓이다.
7. **따옴표 없는 값**: `version`, `stubbornness`, `chapterFrom`, `chapterTo`, 숫자 항목의 `min`·`max`·`initial`과 사건의 숫자 `value`는 숫자이고, `pinned`·`builtin`·`ending`은 `true`·`false`다. 모두 따옴표를 붙이지 않는다.
8. **조건 없는 카드**: `conditional`·`scenes`는 키워드나 챕터 범위 중 하나는 있어야 하고, `events`는 키워드·챕터 범위·`when` 중 하나는 있어야 한다. `keys`는 비워도 되지만 생략하지 않는다.
9. **엔딩**: `"ending": true`인 사건 카드는 `mode`가 `once`이고 `effects`가 없다. `guide.chapters[].ending`은 마지막 챕터가 챕터 진행으로 끝을 맡을 때만, 엔딩 카드는 상태 조건으로 끝날 때 쓴다. 시작 값에서 이미 조건이 모두 맞는 엔딩은 쓰지 않는다. `hold` 카드에도 `effects`를 쓰지 않는다.
10. **값의 범위**: `min`은 `max` 이하, `initial`은 그 안, 글 항목에는 `min`·`max`를 쓰지 않는다. 숫자는 절댓값 1000000 이하이다. 사건의 조건이나 결과 값이 항목 범위 밖이면 오류다.
11. **한 줄 칸**: `work.title`, `work.genre`, `work.tags[]`, `work.narration.style`, `work.recommendedModel.model`, `work.recommendedModel.note`, `guide.cast[].name`, `guide.rules[].text`, `guide.state.vars[].name`, `guide.state.vars[].rule`, `guide.conditional[].name`, `guide.conditional[].keys[]`, `guide.chapters[].name`, `guide.scenes[].name`, `guide.scenes[].keys[]`, `guide.events[].name`, `guide.events[].keys[]`, `guide.events[].when[].name`, `guide.events[].effects[].name`는 줄바꿈을 넣지 않는다. 제목·장르·태그에는 `{{`·`}}`·`[[`를 쓰지 않고, 태그 한 개에 쉼표를 넣지 않는다.
12. **글 속 변수와 줄 머리**: 조건부·챕터·장면·사건의 글에는 `{{user}}`·`{{char}}`·`{{work}}`·`{{state.항목이름}}`만 쓸 수 있고(장면 글은 `{{state.…}}` 불가), 줄 머리에 `#`, `=====`, `[상태`, `[세계관]`처럼 구역 이름을 대괄호로 쓴 줄을 두지 않는다.
13. **이미지는 넣을 수 없다**: `[[img:…]]` 이미지 코드를 쓰지 않는다. 이미지는 앱에서 따로 붙인다.
14. **이름 중복**: 인물 이름, 규칙 글, 조건부·챕터·장면·사건 이름, 태그, 상태 항목 이름(대소문자 무시)이 겹치면 오류다. 인물 이름은 20자 안에서 글자·숫자·단어 사이 공백 한 칸만 쓴다.
15. **공개 글에 비밀을 쓰지 않는다**: `synopsis`·`openings`·`tags`는 게시하면 모두에게 보인다. 반전과 비밀은 `guide.sections.secrets`나 챕터·사건에 쓴다. 공개 글이 비공개 글과 16자 이상 그대로 겹치면 경고가 난다.

### 출력 전 점검 목록

- [ ] 최상위는 `format`·`version`·`work`·`guide` 네 개뿐이다.
- [ ] `work`의 필수 칸(`title`·`genre`·`rating`·`synopsis`·`tags`·`openings`)이 모두 있고 `rating`이 `all`, `teen`, `mature` 중 하나다.
- [ ] 목록 개수와 글 길이가 권장 안이다. 지침 전체는 상시 6000토큰·합계 12000토큰(한글 한 글자 ≒ 1토큰) 안이다.
- [ ] 사건이 가리키는 상태 항목 이름과 챕터 번호가 실제로 있다.
- [ ] 예약 이름이 없고, 모든 `keys[]`의 글자 수를 하나씩 세어 2자 이상이며, 한 줄 칸에 줄바꿈이 없다.
- [ ] `챕터 gte 1`·`청결도 gte 0`(0~100인 항목)처럼 범위의 최솟값 이상·최댓값 이하라 늘 참이거나 범위 밖이라 영원히 거짓인 조건이 없다.
- [ ] JSON 하나만 출력했고 문법(따옴표 이스케이프, 쉼표)이 맞다.

## 최소 예시

필수 칸만 쓴 작품입니다. 인물이 없으면 `{{char}}`는 "등장인물"로 보입니다.

```json
{
  "format": "byok-character-chat-work",
  "version": 1,
  "work": {
    "title": "비 오는 날의 서점",
    "genre": "일상",
    "rating": "all",
    "synopsis": "비 오는 날에만 문을 여는 작은 서점에서 주인과 나누는 이야기.",
    "tags": [
      "서점"
    ],
    "openings": [
      "빗소리 사이로 서점 문의 종이 울린다. 주인이 책에서 눈을 들어 인사한다."
    ]
  },
  "guide": {}
}
```
