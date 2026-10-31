import React from 'react';
import {AbsoluteFill} from 'remotion';
import {theme} from '../theme';
/** The only persistent top overlay: the channel identity. */
export const Chrome:React.FC<{frame?:number}>=()=> <AbsoluteFill style={{pointerEvents:'none',fontFamily:theme.font}}>
  <div style={{position:'absolute',top:75,left:74,display:'flex',alignItems:'center',gap:12,padding:'11px 22px',borderRadius:100,background:'#FFFDF8E8',border:`1px solid ${theme.colors.line}`,boxShadow:'0 6px 24px #3A2D1A19'}}>
    <svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill={theme.colors.mint}/><path d="M14 6v16M6 14h16" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/></svg>
    <span style={{color:theme.colors.white,fontSize:26,fontWeight:700,letterSpacing:1.4}}>EDUTALK</span>
  </div>
</AbsoluteFill>;
