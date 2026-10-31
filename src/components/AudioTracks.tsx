import React from 'react';
import {Audio,Sequence,staticFile} from 'remotion';
import scenes from '../data/scenes.json';

type Sound='hit'|'whoosh'|'spark'|'tap';
const sfx:Record<string,Sound>={S01:'whoosh',S02:'hit',S03:'tap',S04:'spark',S05:'hit',S06:'whoosh',S08:'hit',S09:'spark',S11:'tap',S12:'hit',S14:'hit',S15:'whoosh',S17:'hit',S18:'spark',S20:'spark',S21:'tap',S23:'spark',S24:'tap',S25:'spark',S26:'spark'};
const levels:Record<Sound,number>={hit:.12,whoosh:.13,spark:.14,tap:.12};
export const AudioTracks:React.FC<{voiceover?:boolean;soundEffects?:boolean}>=({voiceover=true,soundEffects=true})=>{
 return <>
  {voiceover&&<Audio src={staticFile('voiceover.mp3')} volume={1}/>}
  {soundEffects&&(scenes as {id:string;startFrame:number}[]).filter(s=>sfx[s.id]).map(s=>{
    const effect=sfx[s.id];return <Sequence key={s.id} from={Math.max(0,s.startFrame-2)}><Audio src={staticFile(`sfx/${effect}.wav`)} volume={levels[effect]}/></Sequence>
  })}
 </>;
};
