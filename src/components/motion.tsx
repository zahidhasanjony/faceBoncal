import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

export const clamp = (f: number, input: [number,number], output: [number,number], mode: 'out'|'inOut'|'exit'='out') => interpolate(f,input,output,{easing:theme.easing[mode],extrapolateLeft:'clamp',extrapolateRight:'clamp'});
export const pop = (f:number, fps:number, at=0) => spring({frame:f-at,fps,config:theme.spring.pop});
export const smooth = (f:number, fps:number, at=0) => spring({frame:f-at,fps,config:theme.spring.smooth});
export const float = (f:number, frequency=24, amplitude=6) => Math.sin(f/frequency)*amplitude;

export const In:React.FC<{children:React.ReactNode;delay?:number;direction?:'up'|'left'|'right';distance?:number;style?:React.CSSProperties}> = ({children,delay=0,direction='up',distance=28,style})=>{
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const p=pop(frame,fps,delay);
  const x=direction==='left'?-distance*(1-p):direction==='right'?distance*(1-p):0;
  const y=direction==='up'?distance*(1-p):0;
  return <div style={{opacity:Math.max(0,Math.min(1,p)),transform:`translate3d(${x}px,${y}px,0) scale(${0.95+0.05*p})`,...style}}>{children}</div>;
};

export const PulseBar:React.FC<{f:number;start:number;speed?:number;color?:string}> = ({f,start,speed=50,color=theme.colors.mint})=>{
  const width=clamp(f,[start,start+speed],[0,100]);
  return <div style={{width:'100%',height:9,borderRadius:99,background:theme.colors.line,overflow:'hidden'}}><div style={{height:'100%',width:`${width}%`,background:color,borderRadius:99}}/></div>;
};
