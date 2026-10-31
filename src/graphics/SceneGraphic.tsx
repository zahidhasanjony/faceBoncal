import React from 'react';
import {theme} from '../theme';
import {clamp,pop,float,smooth} from '../components/motion';

const C=theme.colors;
type Graphics={kind:string;frame:number;fps:number;duration:number};
type G={f:number;fps:number;delay?:number;dx?:number;dy?:number;scale?:number;children:React.ReactNode};
const Arrive:React.FC<G>=({f,fps,delay=0,dx=0,dy=40,scale=.9,children})=>{
 const p=pop(f,fps,delay);
 return <g opacity={Math.max(0,Math.min(1,p))} transform={`translate(${dx*(1-p)} ${dy*(1-p)}) scale(${scale+(1-scale)*p})`}>{children}</g>;
};
const svgText=(text:string,x:number,y:number,size=36,fill:string=C.white,weight=700,anchor:'middle'|'start'|'end'='middle')=><text x={x} y={y} fontFamily={theme.font} fontSize={size} fontWeight={weight} textAnchor={anchor} fill={fill}>{text}</text>;
const ring=(x:number,y:number,r:number,c=C.mint,stroke=4)=><circle cx={x} cy={y} r={r} fill="none" stroke={c} strokeWidth={stroke}/>;
const line=(x1:number,y1:number,x2:number,y2:number,c=C.line,w=4)=><path d={`M${x1} ${y1}L${x2} ${y2}`} stroke={c} strokeWidth={w} strokeLinecap="round"/>;
const pill=(x:number,y:number,rotate:number,fill=C.white)=><g transform={`translate(${x} ${y}) rotate(${rotate})`}><rect x="-58" y="-26" width="116" height="52" rx="26" fill={fill} stroke="#FFFFFF66" strokeWidth="3"/><path d="M0 -25V25" stroke={C.boneDark} strokeWidth="3"/><path d="M-55 0H-7" stroke={C.mint} strokeWidth="47" strokeLinecap="round" opacity=".75"/></g>;
const calcium=(x:number,y:number,s=1)=><g transform={`translate(${x} ${y}) scale(${s})`}><circle r="56" fill={C.surfaceLight} stroke={C.mint} strokeWidth="4"/>{svgText('Ca',0,18,51,C.white,700)}</g>;

const BONE='M205 335 C145 263 83 277 80 357 C80 422 141 455 212 422 C250 406 270 405 309 405 L617 405 C649 405 670 414 704 436 C776 480 851 412 834 347 C819 271 746 267 703 318 C675 344 649 352 616 352 L308 352 C258 352 237 356 205 335Z';
const pores=[[140,361,17],[193,383,13],[258,363,7],[305,385,11],[358,370,9],[405,391,8],[460,372,9],[520,385,7],[576,372,8],[645,382,12],[703,371,14],[772,369,20],[735,408,9],[164,412,8],[785,324,11]];
const Bone:React.FC<{f:number;fps:number;pores?:boolean;crack?:boolean;heal?:boolean;y?:number;scale?:number}>=({f,fps,pores:porous=false,crack=false,heal=false,y=0,scale=1})=>{
 const grow=smooth(f,fps,7),seal=heal?clamp(f,[8,70],[0,1]):0;
 return <g transform={`translate(${(1-scale)*460} ${y+(1-scale)*375}) scale(${scale})`}>
   <ellipse cx="465" cy="483" rx="325" ry="30" fill="#53402B20"/>
   <path d={BONE} fill="url(#boneGrad)" stroke={C.bone} strokeWidth="9" strokeLinejoin="round"/>
   <path d="M269 360 C370 353 531 361 644 361" stroke="#FFFFFF88" strokeWidth="7" strokeLinecap="round"/>
   <g clipPath="url(#boneClip)">
    {Array.from({length:25}).map((_,i)=>{
      const x=180+(i%9)*64,y1=350+Math.floor(i/9)*24;
      return <path key={i} d={`M${x} ${y1}l27 18m-11 -22l30 25`} stroke={heal?C.mint:C.boneDark} strokeWidth={2.2} opacity={.52+Math.sin(f/23+i)*.1}/>;
    })}
    {porous&&pores.map(([x,y1,r],i)=><circle key={i} cx={x} cy={y1} r={r*(.22+.78*pop(f,fps,7+i*3))} fill={C.deep} stroke={C.coral+'90'} strokeWidth="2" opacity={Math.min(1,grow)}/>)}
    {(crack||heal)&&<path d="M400 346l-20 25 19 6-13 25 M538 353l13 24-20 6 8 24" stroke={heal?C.mint:C.coral} strokeWidth={heal?5:6} strokeLinecap="round" strokeDasharray={heal?`${seal*90} 140`:'6 3'} fill="none" opacity={heal?.15+.85*seal:.9}/>}
    {heal&&<rect x={260} y={349} width={475*seal} height="60" rx="25" fill={C.mint+'66'}/>} 
   </g>
  </g>;
};

const Worker:React.FC<{x:number;y:number;f:number;team?:'build'|'break';sleep?:boolean;size?:number}>=({x,y,f,team='build',sleep=false,size=1})=>{
 const color=team==='build'?C.mint:C.coral;
 const rot=sleep?23:Math.sin(f/6)*(team==='build'?14:22);
 const sway=sleep?0:Math.sin(f/11)*6;
 return <g transform={`translate(${x} ${y+sway}) scale(${size})`}>
   <ellipse cx="0" cy="104" rx="78" ry="15" fill="#53402B24"/>
   <path d="M-22 55L-35 102 M22 55L37 102" stroke={C.bone} strokeWidth="20" strokeLinecap="round"/>
   <rect x="-37" y="-6" width="74" height="76" rx="23" fill={team==='build'?C.surfaceLight:'#3A263A'} stroke={color} strokeWidth="5"/>
   <g transform={`rotate(${sleep?15:0} 0 -52)`}>
     <circle cx="0" cy="-53" r="33" fill="#D2A98B"/>
     <path d="M-37 -61Q-30 -108 0 -100Q32 -105 38 -61Z" fill={color}/>
     <rect x="-45" y="-65" width="90" height="13" rx="6" fill={color}/>
     {sleep?<path d="M-15 -52q9 7 18 0 M9 -52q9 7 18 0" fill="none" stroke={C.ink} strokeWidth="4"/>:<><circle cx="-12" cy="-55" r="3.8" fill={C.ink}/><circle cx="12" cy="-55" r="3.8" fill={C.ink}/></>}
   </g>
   <path d="M-28 12l-37 37" stroke="#D2A98B" strokeWidth="14" strokeLinecap="round"/>
   <g transform={`rotate(${rot} 27 10)`}>
     <path d="M27 9L65 -22" stroke="#D2A98B" strokeWidth="14" strokeLinecap="round"/>
     <path d="M67 -23L96 -82" stroke="#C7D6E2" strokeWidth="10" strokeLinecap="round"/>
     {team==='break'?<path d="M80 -77L123 -91" stroke={C.coral} strokeWidth="16" strokeLinecap="round"/>:<path d="M80 -80l33 19-12 18" stroke={C.mint} strokeWidth="9" strokeLinejoin="round" fill="none"/>}
   </g>
 </g>;
};

const Stack:React.FC<{f:number;fps:number;count?:number}>=({f,fps,count=5})=><g>{Array.from({length:count}).map((_,i)=>{
 const p=pop(f,fps,4+i*7);
 const x=245+(i%3)*146, finalY=445-Math.floor(i/3)*89;
 return <g key={i} transform={`translate(${x} ${-250*(1-p)+finalY}) rotate(${(1-p)*-16})`} opacity={Math.min(1,p)}><rect width="125" height="76" rx="13" fill={i%2?C.mint:C.bone} stroke="#FFF7" strokeWidth="3"/><path d="M10 17H105" stroke={C.ink} strokeWidth="3" opacity=".22"/></g>;
})}</g>;

const Check:React.FC<{x:number;y:number;f:number;fps:number;delay?:number;size?:number}>=({x,y,f,fps,delay=0,size=1})=>{
 const p=pop(f,fps,delay);
 return <g transform={`translate(${x} ${y}) scale(${Math.max(0,p)*size})`} opacity={Math.min(1,p)}>
  {ring(0,0,51,C.mint,6)}<path d="M-24 1l17 17 32-38" fill="none" stroke={C.mint} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
 </g>;
};

const Sun:React.FC<{x:number;y:number;f:number;fps:number;size?:number}>=({x,y,f,fps,size=1})=>{
 const p=pop(f,fps,0);
 return <g transform={`translate(${x} ${y}) scale(${Math.max(0,p)*size})`}>
    <g transform={`rotate(${f*.46})`}>{Array.from({length:12}).map((_,i)=><path key={i} d="M0 -108V-150" stroke={C.amber} strokeWidth="10" strokeLinecap="round" transform={`rotate(${i*30})`}/>)}</g>
    <circle r="94" fill="url(#sunGrad)"/><circle r="111" fill="none" stroke={C.amber+'55'} strokeWidth="3"/>
 </g>;
};

const IconCard:React.FC<{x:number;y:number;f:number;fps:number;delay:number;label:string;children:React.ReactNode;width?:number;height?:number}>=({x,y,f,fps,delay,label,children,width=240,height=200})=>{
 const p=pop(f,fps,delay);
 return <g transform={`translate(${x} ${y+32*(1-p)}) scale(${.9+.1*p})`} opacity={Math.min(1,p)}>
  <rect width={width} height={height} rx="28" fill={C.surfaceLight} stroke={C.line} strokeWidth="3"/>
  {children}
  {svgText(label,width/2,height-21,29,C.white,600)}
 </g>;
};

const Key:React.FC<{x:number;y:number;f:number;fps:number;delay?:number;angle?:number}>=({x,y,f,fps,delay=0,angle=-25})=>{
 const p=pop(f,fps,delay);
 return <g transform={`translate(${x+90*(1-p)} ${y-50*(1-p)}) rotate(${angle*(1-p)}) scale(${.78+.22*p})`} opacity={Math.min(1,p)}>
   <circle cx="0" cy="0" r="51" fill="none" stroke={C.amber} strokeWidth="15"/>
   <rect x="43" y="-11" width="200" height="22" rx="10" fill={C.amber}/><rect x="194" y="0" width="19" height="55" rx="4" fill={C.amber}/><rect x="159" y="0" width="19" height="40" rx="4" fill={C.amber}/>
   {svgText('D',0,18,52,C.amber,700)}
 </g>;
};

const Door:React.FC<{f:number;fps:number;unlock?:boolean}>=({f,fps,unlock=false})=>{
 const po=pop(f,fps,3), op=unlock?clamp(f,[30,68],[0,1]):0;
 return <g transform={`translate(${30*(1-po)} 0)`} opacity={Math.min(1,po)}>
  <rect x="170" y="92" width="575" height="493" rx="34" fill={C.surfaceLight} stroke={C.boneDark} strokeWidth="10"/>
  <rect x="210" y="131" width="495" height="412" rx="18" fill="url(#doorGrad)" stroke={C.line} strokeWidth="7"/>
  {Array.from({length:6}).map((_,i)=><path key={i} d={`M230 ${174+i*60}H685`} stroke={C.boneDark+'28'} strokeWidth="3"/>)}
  {svgText('Ca',452,235,72,C.bone,700)}
  <g transform={`translate(${460} ${368}) rotate(${op*-25})`}>
   <path d="M-43 -11V-61a43 43 0 0 1 86 0V-11" stroke={unlock&&op>.5?C.mint:C.bone} strokeWidth="17" fill="none" strokeLinecap="round"/>
   <rect x="-70" y="-21" width="140" height="119" rx="24" fill={unlock&&op>.6?C.mint:C.amber} stroke="#FFFFFF55" strokeWidth="5"/>
   <circle cy="24" r="13" fill={C.ink}/><path d="M0 33V60" stroke={C.ink} strokeWidth="12" strokeLinecap="round"/>
  </g>
  <path d="M220 578H700" stroke={C.mint} strokeWidth="4" opacity={.5}/>
 </g>;
};

const Hazard:React.FC<{x:number;y:number;f:number;fps:number;delay:number;type:'sugar'|'smoke'|'wave'}>=({x,y,f,fps,delay,type})=>{
 const p=pop(f,fps,delay);
 return <g transform={`translate(${x} ${y-35*(1-p)}) scale(${.88+.12*p})`} opacity={Math.min(1,p)}>
   <rect x="-112" y="-123" width="224" height="250" rx="28" fill="#FBE7E1" stroke={C.coral+'A0'} strokeWidth="4"/>
   {type==='sugar'&&<><rect x="-46" y="-70" width="93" height="92" rx="8" fill={C.bone} transform={`rotate(${Math.sin(f/16)*8})`}/>{svgText('+',0,104,41,C.coral)}</>}
   {type==='smoke'&&<><rect x="-67" y="-12" width="130" height="22" rx="9" fill={C.bone} transform="rotate(-26)"/><path d="M-6 -64q-22-33 2-44t2-33" stroke={C.coral} strokeWidth="7" fill="none" strokeLinecap="round"/></>}
   {type==='wave'&&<><path d="M-76 7Q-48 -70 -20 7T35 7T77 7" fill="none" stroke={C.coral} strokeWidth="10" strokeLinecap="round"/><circle cx="-20" cy="-30" r="13" fill={C.amber}/></>}
 </g>;
};

const Drawing:React.FC<Graphics>=({kind,frame:f,fps,duration})=>{
 const appear=pop(f,fps,3);
 const drift=float(f,30,6);
 const sweep=clamp(f,[0,Math.min(100,duration)],[0,1],'inOut');
 switch(kind){
 case 'hook':return <>
   <g transform={`translate(0 ${drift}) rotate(${(1-appear)*-7} 460 370)`}><Bone f={f} fps={fps} scale={.95}/></g>
   <circle cx="460" cy="378" r={285+Math.sin(f/18)*12} fill="none" stroke={C.mint+'66'} strokeWidth="3" strokeDasharray="13 18" transform={`rotate(${f*.9} 460 378)`}/>
   <circle cx="460" cy="380" r="330" fill="none" stroke={C.cyan+'30'} strokeWidth="3" strokeDasharray="4 20" transform={`rotate(${-f*.33} 460 380)`}/>
   <Arrive f={f} fps={fps} delay={12} dx={35} dy={-60}>{svgText('?',728,197,162,C.amber)}</Arrive>
 </>;
 case 'wrong':return <>
   <Bone f={f} fps={fps} pores scale={.97}/>
   <g transform={`translate(460 320) rotate(${-8+(1-appear)*26}) scale(${.5+.5*appear})`} opacity={Math.min(1,appear)}>
      <rect x="-300" y="-95" width="600" height="188" rx="23" fill="#3B1C2CD9" stroke={C.coral} strokeWidth="15"/>
      {svgText('ভুল!',0,52,143,C.coral)}
   </g>
   <path d="M175 535L740 197" stroke={C.coral} strokeWidth="13" opacity={sweep} strokeDasharray={`${950*sweep} 950`}/>
 </>;
 case 'pills':return <>
  <g transform={`translate(0 ${drift})`}><Bone f={f} fps={fps} scale={.75} y={30}/></g>
  {Array.from({length:7}).map((_,i)=>{
    const p=pop(f,fps,7+i*5);
    const x=205+(i%4)*155,y=98+Math.floor(i/4)*91;
    return <g key={i} transform={`translate(0 ${-220*(1-p)}) rotate(${(1-p)*(i%2?-25:25)} ${x} ${y})`} opacity={Math.min(1,p)}>{pill(x,y,(i-3)*22,i%2?C.bone:C.white)}</g>;
  })}
  <Arrive f={f} fps={fps} delay={24}>{calcium(685,555,.79)}</Arrive>
 </>;
 case 'porous':return <>
  <Bone f={f} fps={fps} pores scale={1.03}/>
  <g transform={`translate(${160+f*5%640} 0)`}><rect x="-8" y="165" width="5" height="395" rx="5" fill={C.mint} opacity=".8"/><rect x="-15" y="165" width="25" height="395" fill={C.mint} opacity=".08"/></g>
  <Arrive f={f} fps={fps} delay={18}>{svgText('ভেতরের ফাঁপা অংশ',457,130,45,C.coral,600)}</Arrive>
 </>;
 case 'why':return <>
   <g transform={`translate(462 315) scale(${.8+.2*appear}) rotate(${3*Math.sin(f/20)})`}>
      {ring(0,0,225,C.mint+'70',5)}
      {svgText('?',0,128,390,C.white,700)}
   </g>
   <g transform={`translate(${200-50*sweep} 520) scale(.64)`}>{calcium(0,0,1)}</g>
   <path d={`M300 530Q450 ${470-75*sweep} 610 527`} fill="none" stroke={C.amber} strokeWidth="8" strokeLinecap="round" strokeDasharray="14 11"/>
   <Arrive f={f} fps={fps} delay={14}>{svgText('আসল উত্তর কোথায়?',640,625,42,C.amber)}</Arrive>
 </>;
 case 'war':return <>
   <g transform={`translate(0 ${drift})`}><Bone f={f} fps={fps} crack heal={false} scale={.86} y={-1}/></g>
   <Arrive f={f} fps={fps} dx={-170} dy={0}><Worker x={220} y={305} f={f} size={1.25} team="break"/></Arrive>
   <Arrive f={f} fps={fps} delay={10} dx={170} dy={0}><Worker x={695} y={305} f={f} size={1.25} team="build"/></Arrive>
   <Arrive f={f} fps={fps} delay={13}>{svgText('ভাঙে',223,592,55,C.coral)}{svgText('গড়ে',688,592,55,C.mint)}</Arrive>
   <path d="M448 160L475 180 445 210 470 243" stroke={C.amber} strokeWidth="10" fill="none" strokeDasharray={`${200*sweep} 200`}/>
 </>;
 case 'construction':return <>
   {Array.from({length:6}).map((_,i)=>{const p=pop(f,fps,2+i*5);return <g key={i} opacity={Math.min(1,p)}>{line(125+i*137,170+(1-p)*115,125+i*137,544,C.boneDark,6)}{line(125,230+i*55,810,230+i*55,C.line,3)}</g>})}
   <Bone f={f} fps={fps} scale={.77} y={50}/>
   <g transform={`translate(703 151)`}>{ring(0,0,76,C.amber,7)}<path d={`M0 0l${Math.sin(f*.05)*41} ${-Math.cos(f*.05)*42}`} stroke={C.amber} strokeWidth="10" strokeLinecap="round"/>{svgText('24/7',0,106,33,C.white)}</g>
   <Worker x={266+Math.sin(f/23)*30} y={445} team="build" f={f} size={.78}/>
 </>;
 case 'demolition':return <>
   <Bone f={f} fps={fps} crack pores={f>25} scale={1}/>
   <Worker x={360} y={215} f={f} team="break" size={1.4}/>
   {Array.from({length:9}).map((_,i)=>{
    const p=clamp(f,[11+i*3,27+i*3],[0,1]);
    return <g key={i} transform={`translate(${400+(i%3-1)*92*p} ${390+(Math.floor(i/3)-1)*62*p+60*p*p}) rotate(${p*i*23})`} opacity={Math.max(0,1-p*.75)}><path d="M-11 -9L14 -4 0 14Z" fill={i%2?C.coral:C.bone}/></g>
   })}
   {svgText('REMOVE',734,171,42,C.coral)}
 </>;
 case 'rebuild':return <>
   <Bone f={f} fps={fps} crack heal scale={1.02}/>
   <Stack f={f} fps={fps} count={5}/>
   <Worker x={716} y={221} f={f} team="build" size={1.2}/>
   <Check x={729} y={542} f={f} fps={fps} delay={38} size={.66}/>
 </>;
 case 'balance':return <>
   <g transform="translate(135 115)">
    {svgText('30',306,110,174,C.white,700)}{svgText('বছর',469,107,51,C.dim)}
    {line(0,455,670,455,C.line,5)}
    {['হাড় তৈরি','হাড় ক্ষয়'].map((t,i)=>{
      const v=i===0?420:260;const pr=clamp(f,[7+i*13,52+i*11],[0,1]);
      return <g key={i}>{svgText(t,5,225+i*120,38,i===0?C.mint:C.coral,600,'start')}
       <rect x="245" y={180+i*120} height="66" width={440} fill={C.line} rx="16"/>
       <rect x="245" y={180+i*120} height="66" width={v*pr} fill={i===0?C.mint:C.coral} rx="16"/></g>
    })}
   </g>
   {ring(752,578,43,C.amber,5)}{svgText('✓',752,596,48,C.amber)}
 </>;
 case 'sleep':return <>
   <g opacity=".46">{Array.from({length:7}).map((_,i)=>line(210+i*90,150,210+i*90,590,C.line,4))}</g>
   <Worker x={460} y={391} f={f} team="build" sleep size={1.75}/>
   {['z','Z','Z'].map((c,i)=><g key={i} transform={`translate(${570+i*50} ${305-i*70-f*.5%65})`} opacity={.35+.45*Math.abs(Math.sin(f/23+i))}>{svgText(c,0,0,57-i*7,C.mint)}</g>)}
   <g transform="translate(192 175)"><rect width="230" height="13" rx="8" fill={C.line}/><rect width={225*(1-.7*sweep)} height="13" rx="8" fill={C.mint}/></g>
 </>;
 case 'use':return <>
   <Arrive f={f} fps={fps} delay={2} dy={0} dx={-150}>
     <rect x="89" y="138" width="733" height="186" rx="34" fill={C.mint+'25'} stroke={C.mint} strokeWidth="5"/>
     {svgText('USE IT',455,256,112,C.mint,700)}
   </Arrive>
   <Arrive f={f} fps={fps} delay={12} dy={0} dx={150}>
     <rect x="89" y="355" width="733" height="186" rx="34" fill={C.coral+'18'} stroke={C.coral} strokeWidth="5"/>
     {svgText('LOSE IT',455,468,111,C.white,700)}
   </Arrive>
   <path d="M450 326v26" stroke={C.amber} strokeWidth="8" strokeLinecap="round" strokeDasharray="10 9"/>
 </>;
 case 'chair':return <>
   <g transform={`translate(${15*Math.sin(f/55)} 0)`}>
    <path d="M278 285h169v145H311" fill="none" stroke={C.boneDark} strokeWidth="23" strokeLinejoin="round" strokeLinecap="round"/>
    <path d="M325 434V595M440 434v161" stroke={C.boneDark} strokeWidth="16" strokeLinecap="round"/>
    <circle cx="409" cy="205" r="52" fill="#D2A98B"/>
    <path d="M405 264v151l135 0" stroke={C.white} strokeWidth="50" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
    <path d="M535 413l104 95M472 330l74 19" stroke="#D2A98B" strokeWidth="22" strokeLinecap="round"/>
   </g>
   <g transform="translate(650 163)">{ring(0,0,91,C.coral,7)}{svgText(`${Math.round(100*(1-sweep))}%`,0,19,60,C.coral)}{svgText('চাপ',0,141,38,C.dim)}</g>
   {Array.from({length:3}).map((_,i)=><circle key={i} cx={465} cy={574} r={50+i*31+15*Math.sin(f/13)} fill="none" stroke={C.coral+'62'} strokeWidth="3"/>)}
 </>;
 case 'leave':return <>
   <Worker x={470} y={355} f={f} team="build" sleep size={1.6}/>
   <g transform={`translate(463 370) rotate(-9) scale(${.6+.4*appear})`} opacity={Math.min(1,appear)}>
     <rect x="-220" y="-86" width="440" height="155" rx="24" stroke={C.coral} strokeWidth="12" fill="#3A2334EB"/>
     {svgText('ছুটি!',0,31,102,C.coral)}
   </g>
   <g transform={`translate(${650+sweep*90} 590) rotate(${sweep*60})`}><path d="M-38 -12Q-20 -52 4 -55Q34 -50 41 -13Z" fill={C.mint}/></g>
 </>;
 case 'risk':return <>
   <Hazard x={206} y={284} f={f} fps={fps} delay={3} type="sugar"/>
   <Hazard x={461} y={284} f={f} fps={fps} delay={12} type="smoke"/>
   <Hazard x={714} y={284} f={f} fps={fps} delay={20} type="wave"/>
   <g transform="translate(0 210)"><Bone f={f} fps={fps} pores crack scale={.68}/></g>
   <path d={`M185 606H${185+520*sweep}`} stroke={C.coral} strokeWidth="11" strokeLinecap="round"/>
 </>;
 case 'pain':return <>
   <g transform="translate(275 125)">
     <path d="M15 40Q75 30 110 170L115 320" stroke={C.bone} strokeWidth="73" fill="none" strokeLinecap="round"/>
     <path d="M115 345Q76 460 70 490" stroke={C.bone} strokeWidth="67" fill="none" strokeLinecap="round"/>
     <circle cx="110" cy="335" r="80" fill={C.surfaceLight} stroke={C.coral} strokeWidth="12"/>
     {Array.from({length:3}).map((_,i)=><path key={i} d={`M${190+i*24} 300q35 35 0 79`} fill="none" stroke={C.coral} strokeWidth="8" strokeLinecap="round" opacity={.65+.3*Math.sin(f/13+i)}/>)}
   </g>
   <Arrive f={f} fps={fps} delay={15} dx={135} dy={0}>
     {pill(674,334,25,C.bone)}{pill(716,413,-19,C.bone)}
     {svgText('Ca',692,510,62,C.amber)}
   </Arrive>
 </>;
 case 'lock':return <Door f={f} fps={fps}/>;
 case 'key':return <>
   <Door f={f} fps={fps} unlock/>
   <g transform={`translate(${160+300*sweep} ${135+90*sweep}) scale(.7) rotate(${sweep*15})`}><Key x={0} y={0} f={f} fps={fps} delay={5}/></g>
   {Array.from({length:8}).map((_,i)=>{
     const pr=pop(f,fps,30+i*3);return <circle key={i} cx={220+i*63} cy={570-70*pr+Math.sin(f/12+i)*9} r={12} fill={C.mint} opacity={Math.min(1,pr)}/>;
   })}
 </>;
 case 'caution':return <>
   <g transform={`translate(456 317) scale(${.74+.26*appear})`}>
    <path d="M0 -205L178 -125v156q-20 136-178 206Q-159 167-177 31v-156Z" fill={C.surfaceLight} stroke={C.amber} strokeWidth="10"/>
    {svgText('!',0,90,209,C.amber)}
   </g>
   <Arrive f={f} fps={fps} delay={17} dy={0} dx={130}>{pill(707,478,-26,C.white)}</Arrive>
   <Arrive f={f} fps={fps} delay={16}>{svgText('সতর্কতা',461,619,58,C.white)}</Arrive>
 </>;
 case 'three':return <>
   {[0,1,2].map((i)=>{
     const p=pop(f,fps,i*12+3);
     return <g key={i} transform={`translate(${215+i*245} ${343-(1-p)*120}) scale(${.72+.28*p})`} opacity={Math.min(1,p)}>
       {ring(0,0,113,i===0?C.mint:i===1?C.amber:C.bone,8)}
       <circle r="85" fill={C.surfaceLight}/>{svgText(`${i+1}`,0,45,121,C.white,700)}
       <circle cx="77" cy="-80" r="12" fill={i===0?C.mint:C.amber}/>
     </g>
   })}
   <path d={`M214 515H${216+480*sweep}`} stroke={C.line} strokeWidth="5" strokeDasharray="10 10"/>
 </>;
 case 'walk':return <>
   <g transform={`translate(${152+sweep*70} 185)`}>
     <circle cx="80" cy="30" r="40" fill={C.bone}/>
     <path d="M80 80l-35 155 95 48" stroke={C.mint} strokeWidth="29" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
     <path d={`M50 235L${5+Math.sin(f/8)*25} 356M120 278L${196-Math.sin(f/8)*31} 356`} stroke={C.bone} strokeWidth="23" strokeLinecap="round"/>
     <path d={`M68 111L${18+Math.sin(f/7)*27} 218M88 126L${159-Math.sin(f/7)*27} 214`} stroke={C.bone} strokeWidth="19" strokeLinecap="round"/>
   </g>
   <g transform="translate(478 196)">
     {[0,1,2,3].map((i)=><g key={i}><path d={`M${i*76} ${346-i*83}h76v83h-76`} fill={i%2?C.surfaceLight:C.surface} stroke={C.mint+'BB'} strokeWidth="5"/></g>)}
     {svgText('20 মিনিট',170,89,72,C.mint)}
   </g>
   <g transform={`translate(${720} ${520+Math.sin(f/9)*16})`}><rect x="-80" y="-14" width="160" height="28" rx="9" fill={C.bone}/><rect x="-101" y="-43" width="36" height="84" rx="9" fill={C.mint}/><rect x="65" y="-43" width="36" height="84" rx="9" fill={C.mint}/></g>
 </>;
 case 'work':return <>
   <Bone f={f} fps={fps} heal scale={.89} y={-4}/>
   {Array.from({length:3}).map((_,i)=><circle key={i} cx="260" cy="380" r={60+i*52+sweep*45} stroke={C.mint} opacity={.4-.1*i} strokeWidth="4" fill="none"/>)}
   <g transform={`translate(530 ${170+30*(1-appear)}) rotate(-4)`} opacity={Math.min(1,appear)}>
    <rect x="0" y="0" width="323" height="168" rx="24" fill={C.surfaceLight} stroke={C.amber} strokeWidth="5"/>
    {svgText('WORK ORDER',160,70,37,C.white)}
    <Check x={161} y={116} f={f} fps={fps} delay={24} size={.52}/>
   </g>
 </>;
 case 'sun':return <>
   <Sun x={300} y={308} f={f} fps={fps} size={1.2}/>
   <g transform={`translate(610 ${280+drift})`}><Key x={0} y={0} f={f} fps={fps} delay={14} angle={-15}/></g>
   <Arrive f={f} fps={fps} delay={28} dy={75}>{calcium(685,515,.7)}</Arrive>
   <Arrive f={f} fps={fps} delay={15}>{svgText('D₃',258,560,87,C.amber)}{svgText('K₂',502,584,72,C.white)}</Arrive>
 </>;
 case 'food':return <>
   <IconCard x={57} y={114} f={f} fps={fps} delay={2} label="ছোট মাছ" width={390} height={236}>
     <g transform={`translate(${188+Math.sin(f/16)*14} 107)`}><path d="M-103 0Q-21 -87 83 0Q-20 93-103 0L-155 -52v104Z" fill={C.mint} stroke={C.bone} strokeWidth="4"/><circle cx="53" cy="-13" r="7" fill={C.ink}/></g>
   </IconCard>
   <IconCard x={477} y={114} f={f} fps={fps} delay={10} label="টক দই" width={390} height={236}>
     <path d="M114 64l35 97h126l31-97Z" fill={C.bone} stroke={C.boneDark} strokeWidth="5"/>
     <ellipse cx="206" cy="63" rx="105" ry="34" fill={C.white}/><path d="M141 65q66-23 120 2" fill="none" stroke={C.mint} strokeWidth="7"/>
   </IconCard>
   <IconCard x={57} y={376} f={f} fps={fps} delay={17} label="তিল" width={390} height={225}>
     {Array.from({length:19}).map((_,i)=><ellipse key={i} cx={95+(i%6)*39+Math.sin(f/20+i)*3} cy={63+Math.floor(i/6)*32} rx={13} ry={20} fill={i%3?C.amber:C.bone} transform={`rotate(${i*23} ${95+(i%6)*39} ${63+Math.floor(i/6)*32})`}/>)}
   </IconCard>
   <IconCard x={477} y={376} f={f} fps={fps} delay={24} label="ডিম" width={390} height={225}>
     <g transform={`translate(195 106) rotate(${Math.sin(f/27)*8})`}><ellipse cx="-49" cy="0" rx="46" ry="65" fill={C.bone}/><ellipse cx="50" cy="0" rx="49" ry="69" fill={C.white}/></g>
   </IconCard>
 </>;
 case 'final':return <>
   <Bone f={f} fps={fps} crack heal scale={1.07}/>
   <g transform={`translate(460 ${180-10*Math.sin(f/19)})`}><Check x={0} y={0} f={f} fps={fps} delay={10} size={1.25}/></g>
   {Array.from({length:10}).map((_,i)=>{
      const a=2*Math.PI*i/10+f/95;const rr=170+Math.sin(f/19)*11;
      return <circle key={i} cx={460+Math.cos(a)*rr} cy={358+Math.sin(a)*rr} r={i%2?5:8} fill={C.mint} opacity=".7"/>;
   })}
   {svgText('STRONG',459,579,89,C.mint)}
 </>;
 case 'cta':return <>
   <g transform={`translate(460 ${308+drift}) scale(${.78+.22*appear})`}>
    {ring(0,0,208,C.mint,8)}
    <circle r="172" fill={C.mint+'22'}/>
    <circle r="106" fill={C.mint}/>
    <path d="M0 -58V58M-58 0H58" stroke={C.ink} strokeWidth="24" strokeLinecap="round"/>
    {Array.from({length:12}).map((_,i)=><circle key={i} cx={Math.cos((i*30+f*.5)*Math.PI/180)*235} cy={Math.sin((i*30+f*.5)*Math.PI/180)*235} r="7" fill={C.mint} opacity={.6}/>)}
   </g>
   <Arrive f={f} fps={fps} delay={18} dy={55}>
      <rect x="260" y="543" width="400" height="92" rx="46" fill={C.mint}/>
      {svgText('FOLLOW  →',460,605,58,C.ink)}
   </Arrive>
 </>;
 default:return <><Bone f={f} fps={fps}/></>;
 }
};

export const SceneGraphic:React.FC<Graphics>=(props)=> <svg
 viewBox="0 0 920 800" width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
 style={{overflow:'visible',position:'absolute',inset:0}} xmlns="http://www.w3.org/2000/svg">
 <defs>
  <linearGradient id="boneGrad" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#E6F3F7"/><stop offset=".4" stopColor={C.bone}/><stop offset="1" stopColor={C.boneDark}/></linearGradient>
  <linearGradient id="doorGrad" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#21485F"/><stop offset="1" stopColor="#102235"/></linearGradient>
  <radialGradient id="sunGrad"><stop offset="0" stopColor="#FFF5CF"/><stop offset="1" stopColor={C.amber}/></radialGradient>
  <clipPath id="boneClip"><path d={BONE}/></clipPath>
 </defs>
 <path d="M60 68h54m-54 0v54M860 68h-54m54 0v54M60 692h54m-54 0v-54M860 692h-54m54 0v-54" stroke={C.boneDark+'70'} strokeWidth="3" fill="none" strokeLinecap="round"/>
 <path d="M124 610H788" stroke={C.line} strokeWidth="2" strokeDasharray="4 18" opacity=".48"/>
 <Drawing {...props}/>
 </svg>;
