import{S as c,i as s,s as a,b as e,d as l,f as t,g as n,k as r,j as h,l as k,a as i,m as b,B as d,C as o,D as g}from"./start-fa4db3b4.js";function u(c){let s,a,u,f,p,A;return{c(){s=e("label"),a=e("input"),u=l(),f=e("span"),this.h()},l(c){s=t(c,"LABEL",{class:!0});var e=n(s);a=t(e,"INPUT",{type:!0,class:!0}),u=r(e),f=t(e,"SPAN",{class:!0}),n(f).forEach(h),e.forEach(h),this.h()},h(){k(a,"type","checkbox"),k(a,"class","svelte-1wgc2n4"),k(f,"class","slider round svelte-1wgc2n4"),k(s,"class","switch svelte-1wgc2n4")},m(e,l){i(e,s,l),b(s,a),a.checked=c[0],b(s,u),b(s,f),p||(A=[d(a,"click",c[3]),d(a,"change",c[4])],p=!0)},p(c,[s]){1&s&&(a.checked=c[0])},i:o,o:o,d(c){c&&h(s),p=!1,g(A)}}}function f(c,s,a){let{callback:e}=s,{checked:l}=s,{callbackArgs:t}=s;return c.$$set=c=>{"callback"in c&&a(1,e=c.callback),"checked"in c&&a(0,l=c.checked),"callbackArgs"in c&&a(2,t=c.callbackArgs)},[l,e,t,()=>{e(t)},function(){l=this.checked,a(0,l)}]}class p extends c{constructor(c){super(),s(this,c,f,u,a,{callback:1,checked:0,callbackArgs:2})}}export{p as S};
//# sourceMappingURL=Slider.svelte-4447f5c9.js.map
