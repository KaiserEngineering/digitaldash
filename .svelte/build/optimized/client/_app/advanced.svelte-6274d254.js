import{S as a,i as s,s as t,b as e,c as r,f as c,g as l,h as n,j as i,l as o,a as d,m as f,d as h,k as u,E as m,B as p,C as v,D as g,w as b,z as S}from"./start-fa4db3b4.js";import{s as E}from"./stores-543d5c2a.js";function y(a){let s,t;return{c(){s=e("div"),t=r("Invalid JSON"),this.h()},l(a){s=c(a,"DIV",{class:!0});var e=l(s);t=n(e,"Invalid JSON"),e.forEach(i),this.h()},h(){o(s,"class","alert alert-danger")},m(a,e){d(a,s,e),f(s,t)},d(a){a&&i(s)}}}function O(a){let s,t,b,S,E,O,j,N,T=a[1]&&y();return{c(){s=e("div"),T&&T.c(),t=h(),b=e("textarea"),S=h(),E=e("button"),O=r("Save"),this.h()},l(a){s=c(a,"DIV",{class:!0});var e=l(s);T&&T.l(e),t=u(e),b=c(e,"TEXTAREA",{class:!0}),l(b).forEach(i),S=u(e),E=c(e,"BUTTON",{disabled:!0,class:!0,type:!0});var r=l(E);O=n(r,"Save"),r.forEach(i),e.forEach(i),this.h()},h(){o(b,"class","form-control svelte-rfhj3t"),E.disabled=a[1],o(E,"class","mt-2 form-control"),o(E,"type","submit"),o(s,"class","col-12 pr-4 pl-4 advanced")},m(e,r){d(e,s,r),T&&T.m(s,null),f(s,t),f(s,b),m(b,a[0]),f(s,S),f(s,E),f(E,O),j||(N=[p(b,"input",a[3]),p(E,"click",a[2])],j=!0)},p(a,[e]){a[1]?T||(T=y(),T.c(),T.m(s,t)):T&&(T.d(1),T=null),1&e&&m(b,a[0]),2&e&&(E.disabled=a[1])},i:v,o:v,d(a){a&&i(s),T&&T.d(),j=!1,g(N)}}}function j(a,s,t){let e;b(a,E,(a=>t(4,e=a)));let r=JSON.stringify(e.configuration,null,2);let c=!1;return a.$$.update=()=>{if(1&a.$$.dirty)try{JSON.parse(r),t(1,c=!1)}catch(a){t(1,c=!0)}},[r,c,function(){fetch("/api/config",{method:"POST",body:r}).then((a=>a.json())).then((a=>{S(E,e.configuration=a.config,e),S(E,e.actions=[{id:e.count,msg:a.message,theme:a.ret?"alert-info":"alert-danger"},...e.actions],e)}))},function(){r=this.value,t(0,r)}]}export default class extends a{constructor(a){super(),s(this,a,j,O,t,{})}}
//# sourceMappingURL=advanced.svelte-6274d254.js.map
