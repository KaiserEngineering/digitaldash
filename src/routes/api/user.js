// import fs from 'fs';
// import { exec } from 'child_process';
// import util from 'util';
// const execute = util.promisify(exec);

// let sessionCache;

// export async function get_user( sid ) {
//   if ( sessionCache ) {
//     return sessionCache;
//   }
//   else {
//     fs.readFile('auth.json', 'utf8', function(err, jsonString) {
//       authObj = JSON.parse( jsonString );

//       if ( !authObj || !authObj.Session ) {
//         console.log( "No session found on file." );
//         return undefined;
//       }
//       else {
//         return authObj.Session.token && authObj.Session.token == sid ? authObj.User : undefined;
//       }
//     });
//   }
// }

// export function updateSessionCache( credentials ) {
//   sessionCache = {
//     User: {
//       "Username": credentials.Username,
//       "Password": credentials.Password,
//     },
//     "Session" : {
//       "token" : credentials.Username
//     }
//   };
// }
