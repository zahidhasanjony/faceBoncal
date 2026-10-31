import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {theme} from '../theme';

export const Backdrop:React.FC<{frame?:number}>=({frame})=>{
 const current=useCurrentFrame(); const f=frame??current;const {durationInFrames}=useVideoConfig();
 return <AbsoluteFill style={{background:`linear-gradient(158deg,${theme.colors.deep} 0%,${theme.colors.bg} 55%,#F4EFE7 100%)`,overflow:'hidden'}}>
   <AbsoluteFill style={{backgroundImage:`linear-gradient(${theme.colors.line}38 1px,transparent 1px),linear-gradient(90deg,${theme.colors.line}38 1px,transparent 1px)`,backgroundSize:'90px 90px',opacity:.20,transform:`translate(${Math.sin(f/72)*23}px,${Math.cos(f/89)*21}px)`}}/>
   <div style={{position:'absolute',left:-280+Math.sin(f/100)*110,top:-320+Math.cos(f/90)*80,width:940,height:940,borderRadius:'50%',background:`radial-gradient(circle,${theme.colors.cyan}1F,transparent 65%)`}}/>
   <div style={{position:'absolute',right:-320+Math.cos(f/130)*70,bottom:180+Math.sin(f/145)*70,width:850,height:850,borderRadius:'50%',background:`radial-gradient(circle,${theme.colors.mint}10,transparent 65%)`}}/>
   <div style={{position:'absolute',inset:0,border:'12px solid transparent',pointerEvents:'none',background:'radial-gradient(ellipse at center,transparent 53%,#6B4D2612 99%)'}}/>


 </AbsoluteFill>;
};
