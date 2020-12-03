import fs from 'fs';

export async function get( username, password ) {
  fs.readFile('auth.txt', 'utf8', function(err, data) {
      return { body: data };
  });
}
