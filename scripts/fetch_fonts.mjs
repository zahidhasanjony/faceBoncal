/**
 * Font installer for local and GitHub render hosts. No remote fonts during frame capture.
 * Hind Siliguri is distributed under SIL Open Font License 1.1 by Indian Type Foundry.
 * Source: google/fonts ofl/hindsiliguri. Run once before `npm run studio` / `npm run render`.
 */
import {mkdir,writeFile,readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const dir=path.resolve('public/fonts');
const root='https://raw.githubusercontent.com/google/fonts/main/ofl/hindsiliguri';
const weights=['Regular','Medium','SemiBold','Bold'];
await mkdir(dir,{recursive:true});
const files=weights.map(w=>`HindSiliguri-${w}.ttf`).concat(['OFL.txt']);
for(const filename of files){
  const target=path.join(dir,filename);
  try {const s=await stat(target);if(s.size>3000){console.log(`Cached ${filename}`);continue;}} catch{}
  const response=await fetch(`${root}/${filename}`,{signal:AbortSignal.timeout(60000)});
  if(!response.ok)throw new Error(`Font download ${filename}: HTTP ${response.status}`);
  const data=Buffer.from(await response.arrayBuffer());
  if(data.length<(filename.endsWith('.ttf')?40000:500))throw new Error(`Font file too short: ${filename}`);
  await writeFile(target,data);
  console.log(`Installed ${filename} (${data.length} bytes)`);
}
console.log('Hind Siliguri ready; renderer will use local font files.');
