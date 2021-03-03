import {writeFile, readFile} from "fs/promises";
import fs from "fs";
const config_path = process.env.KEGUIHome;
let configCache;
function readConfig() {
  let json = fs.readFile(`config_path/etc/config.json`, "utf-8", (error) => {
    if (error) {
      console.log("Failed to read config file");
    }
  });
  return JSON.parse(json);
}
;
export async function get() {
  if (configCache) {
    return configCache;
  } else {
    return await readFile(`${config_path}/etc/config.json`, "utf8").then((result) => {
      configCache = JSON.parse(result);
      return configCache;
    }).catch(function(error) {
      console.error(error);
      return {};
    });
  }
}
export async function post(request) {
  const newConfig = JSON.parse(request.body);
  return await writeFile(`${config_path}/etc/config.json`, JSON.stringify(newConfig, null, 2)).then(() => {
    configCache = readConfig();
    return {body: {ret: 1, message: "Config updated", config: configCache}};
  }).catch(function(error) {
    return {body: {ret: 0, message: "Config failed to update: " + error, config: configCache}};
  });
}
export async function put(request) {
  const id = request.body.id;
  let temp = configCache;
  temp.views[id].enabled = temp.views[id].enabled ? false : true;
  let count = 0;
  for (var key in temp.views) {
    if (temp.views[key].enabled) {
      count = 1;
      break;
    }
  }
  if (count === 0) {
    temp.views[id].enabled = temp.views[id].enabled ? false : true;
    return {body: {ret: 0, views: configCache, message: "Need at least one enabled view"}};
  } else {
    return await writeFile(`${config_path}/etc/config.json`, JSON.stringify(temp, null, 2)).then(() => {
      configCache = readConfig();
      return {body: {ret: 1, views: configCache, message: "Config updated"}};
    }).catch(function(error) {
      return {body: {ret: 0, message: "Config failed to update", config: configCache}};
    });
  }
}
//# sourceMappingURL=config.js.map
