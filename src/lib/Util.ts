import fs from 'fs';
import { exec } from 'child_process';
import util from 'util';
const execute = util.promisify(exec);

const guiHome: string | boolean = import.meta.env.VITE_KEGUIHome;

// Cache all our goodies
let cache: any = {};

export function ReadFile( File: string, Force: boolean = false ) {
  if ( cache[File] && !Force ) {
    return cache[File];
  }
  else {
    cache[File] = JSON.parse( fs.readFileSync( `${guiHome}/${File}` ).toString() );
    return cache[File];
  }
}

export function WriteFile( File: string, Value: any ) {
  fs.writeFileSync( `${guiHome}/${File}`, JSON.stringify( Value, null, 2 ) );
}

export async function GetPythonDictionary( File: string, Force: boolean = false ) {
  const { stdout, stderr } = await execute( `python3 ${guiHome}/${File}`);
  if ( stderr ) {
    console.error( "Could not read ${File}" );
  }
  else {
    cache[File] = JSON.parse( stdout );
    return cache[File];
  }
}
