import{c as s,s as e,d as r}from"./app.js";import{s as i}from"./stores.js";import"@sveltejs/kit/renderer";import"fs";import"child_process";import"util";import"fs/promises";const d=s(((s,d,a,o)=>{let t;return t=e(i,(s=>s)),t(),`<form><div class="p-4 col-md-12 order-md-1"><div class="row"><div class="col-md-6 mb-3"><label for="username">Username</label>\n          <input type="text" class="form-control" name="username" required${r("value",undefined,1)}>\n          <div class="invalid-feedback">Username is required\n          </div></div>\n\n        <div class="col-md-6 mb-3"><label for="password">Password</label>\n          <input type="password" class="form-control" name="password" required${r("value",undefined,1)}>\n          <div class="invalid-feedback">Password is required\n          </div></div></div>\n\n    <button class="btn btn-lg btn-primary btn-block" type="submit">Update settings</button></div></form>`}));export default d;
//# sourceMappingURL=settings.svelte.js.map
