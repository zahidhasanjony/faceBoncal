import React from 'react';
import {Sequence,useCurrentFrame,useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {clamp,pop} from './motion';
import cues from '../data/cues.json';

type Cue={id:number;startFrame:number;endFrame:number;text:string};
const Card:React.FC<{text:string;duration:number}>=({text,duration})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const p=pop(f,fps,0);
 const exit=clamp(f,[Math.max(0,duration-22),Math.max(1,duration-2)],[1,0],'exit');
 const length=Array.from(text).length;
 const size=length>83?45:length>63?48:54;
 return <div style={{position:'absolute',left:76,right:76,bottom:155,pointerEvents:'none',opacity:Math.min(1,p)*exit,transform:`translateY(${22*(1-p)+12*(1-exit)}px) scale(${0.983+0.017*p})`}}>
  <div style={{border:`1.5px solid ${theme.colors.line}`,background:'linear-gradient(145deg,#FFFDF9F9,#F7F1EAF8)',borderRadius:32,padding:'29px 37px 32px',boxShadow:'0 18px 48px #4A35232A',position:'relative'}}>
    <div style={{position:'absolute',left:0,top:25,bottom:25,width:5,borderRadius:100,background:theme.colors.mint}}/>
    <div style={{fontFamily:theme.font,color:theme.colors.white,fontSize:size,fontWeight:600,lineHeight:1.46,textAlign:'center',wordBreak:'normal',overflowWrap:'break-word'}}>{text}</div>
  </div>
 </div>;
};
export const Captions:React.FC=()=>{
 return <>{(cues as Cue[]).map((cue)=><Sequence key={cue.id} from={cue.startFrame} durationInFrames={Math.max(1,cue.endFrame-cue.startFrame)}><Card text={cue.text} duration={cue.endFrame-cue.startFrame}/></Sequence>)}</>;
};
