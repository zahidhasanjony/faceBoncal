import React from 'react';
import {AbsoluteFill,Sequence,useCurrentFrame} from 'remotion';
import {Backdrop} from './components/Backdrop';
import {Scene,SceneSpec} from './components/Scene';
import {Captions} from './components/Captions';
import {Chrome} from './components/Chrome';
import {AudioTracks} from './components/AudioTracks';
import scenes from './data/scenes.json';

export const Main:React.FC<{voiceover?:boolean;soundEffects?:boolean}>=({voiceover=true,soundEffects=true})=>{
 const rootFrame=useCurrentFrame();
 return <AbsoluteFill><Backdrop frame={rootFrame}/>
 {(scenes as SceneSpec[]).map((scene)=><Sequence key={scene.id} from={scene.startFrame} durationInFrames={scene.durationFrames} layout="none"><Scene scene={scene}/></Sequence>)}
 <Captions/><Chrome frame={rootFrame}/>
 <AudioTracks voiceover={voiceover} soundEffects={soundEffects}/>
 </AbsoluteFill>;
};
