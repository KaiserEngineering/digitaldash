import fs from 'fs';

const gui_path: String = import.meta.env.VITE_KEGUIHome;

export function ReadLog() {
  const logNames = fs.readdirSync( gui_path+'/etc/kivy/logs' );

  let logHash = {};
  logNames.forEach((log) => {
    logHash[log] = fs.readFileSync(gui_path+'/etc/kivy/logs/'+log).toString()
  });

  return {
    body: logHash
  }
}
