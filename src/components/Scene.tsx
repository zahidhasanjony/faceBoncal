import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {clamp,In,pop} from './motion';
import {SceneGraphic} from '../graphics/SceneGraphic';
export type SceneSpec={id:string;kind:string;title:string;kicker:string;detail:string;motion:string;durationFrames:number;startFrame:number;endFrame:number;firstCue:number;lastCue:number};

export const Scene:React.FC<{scene:SceneSpec}>=({scene})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const outro=clamp(f,[Math.max(0,scene.durationFrames-20),Math.max(1,scene.durationFrames-2)],[1,0],'exit');
 const press=pop(f,fps,4);
 const headingSize=scene.title.length>25?69:scene.title.length>19?74:scene.kind==='wrong'?132:85;
 return <AbsoluteFill style={{overflow:'hidden',opacity:outro,transform:`scale(${1+0.03*(1-outro)})`,fontFamily:theme.font}}>
   <div style={{position:'absolute',left:80,right:80,top:310,height:230,display:'flex',alignItems:'flex-start',justifyContent:'flex-start'}}>
    <In delay={3} style={{width:'100%'}}><h1 style={{margin:0,fontSize:headingSize,lineHeight:1.36,letterSpacing:-.7,fontWeight:700,color:scene.kind==='wrong'?theme.colors.coral:theme.colors.white,textShadow:'0 8px 26px #4A352322'}}>{scene.title}</h1></In>
   </div>
   <div style={{position:'absolute',left:68,right:68,top:552,height:800,borderRadius:48,border:`1px solid ${theme.colors.line}99`,background:'linear-gradient(145deg,#FFFDF7,#F6F0E7)',overflow:'hidden',boxShadow:'0 24px 60px #4A35231F'}}>
     <div style={{position:'absolute',left:-45,top:-20,borderRadius:'50%',height:420,width:420,background:`radial-gradient(circle,${theme.colors.cyan}11,transparent 70%)`}}/>
     <SceneGraphic kind={scene.kind} frame={f*30/fps} fps={30} duration={scene.durationFrames*30/fps}/>
     <div style={{position:'absolute',bottom:28,left:42,right:42,display:'flex',justifyContent:'space-between',alignItems:'center',gap:22}}>
        <div style={{maxWidth:'82%',background:'#FFFFFFEE',color:theme.colors.dim,fontSize:29,lineHeight:1.4,padding:'13px 22px',borderRadius:17,border:`1px solid ${theme.colors.line}`,opacity:press,transform:`translateY(${(1-press)*20}px)`}}>{scene.detail}</div>
        <div style={{width:44,height:44,flexShrink:0,borderRadius:'50%',border:`2px solid ${theme.colors.mint}`,display:'grid',placeItems:'center',color:theme.colors.mint,fontSize:22}}>+</div>
     </div>
   </div>
 </AbsoluteFill>;
};
