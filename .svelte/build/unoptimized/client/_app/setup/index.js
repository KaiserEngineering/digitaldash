import * as cookie from "../../_snowpack/pkg/cookie.js";
import {get_user} from "../routes/api/user.js";
import {get} from "../routes/api/config.js";
import {getConstants} from "../routes/api/constants.js";
export async function prepare(headers) {
  let cookies;
  if (headers.cookie) {
    cookies = cookie.parse(headers.cookie);
  }
  return {
    context: {
      user: headers.cookie ? await get_user(cookies["ke_web_app"]) : void 0,
      configuration: await get(),
      constants: await getConstants()
    }
  };
}
;
export async function getSession(context) {
  return {
    user: context.user && context.user && {
      username: context.user.Username
    },
    actions: [],
    configuration: context.configuration,
    constants: context.constants,
    count: 0
  };
}
;
//# sourceMappingURL=index.js.map
