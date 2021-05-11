import fs from 'fs';

const gui_path: String = import.meta.env.VITE_KEGUIHome;

export function ReadLog() {
  return {
    headers: {
      'Content-Type': 'text'
    },
    body: fs.readFileSync(gui_path+'/etc/kivy/logs/ke_log.txt').toString()
  }
}
