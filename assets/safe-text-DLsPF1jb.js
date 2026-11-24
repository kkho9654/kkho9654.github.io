import{r as e,t}from"./tokens-HKCBY6fS.js";import{i as n}from"./prompt-CDnx18O_.js";import{r}from"./text-clean-C2WFwdMw.js";var i=e=>r(e.replace(/\r\n?/g,`
`)),a=/\{\{\s*([\p{L}\p{N}_.]+)\s*(?:\|([^{}]*))?\}\}/gu,o=new Set(n.map(e=>e.name)),s=/^[ \t]*\[상태/,c=16;function l(t){return e(i(t)).replace(a,(e,t)=>o.has(t.toLowerCase())?e:``).replace(/(\{\{\s*[\p{L}\p{N}_.]+\s*(?:\|[^{}]*)?\}\})|\{\{|\}\}/gu,(e,t)=>t??``).split(`
`).filter(e=>!s.test(e)).join(`
`)}function u(e){let t=e;for(let e=0;e<c;e++){let e=l(t);if(e===t)return t;t=e}return t}function d(n){if(t(n).length>0||e(n)!==n||n.split(`
`).some(e=>s.test(e)))return!1;let r=n.replace(a,(e,t)=>o.has(t.toLowerCase())?``:e);return r.includes(`{{`)||r.includes(`}}`)?!1:l(n)===n}export{i as n,d as r,u as t};