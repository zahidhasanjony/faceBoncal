#!/usr/bin/env python3
"""Generate four original light-weight mono SFX, deliberately low in mix under VO."""
from pathlib import Path
import numpy as np, wave
out=Path(__file__).resolve().parent.parent/'public/sfx';out.mkdir(exist_ok=True)
sr=44100
rng=np.random.default_rng(41231)
def save(name,y):
 y=np.asarray(y,dtype=np.float64)
 y=y/max(1,max(abs(y))/.80)
 with wave.open(str(out/f'{name}.wav'),'wb') as wf:
  wf.setnchannels(1);wf.setsampwidth(2);wf.setframerate(sr);wf.writeframes((y*32767).astype('<i2').tobytes())
 print(name,round(len(y)/sr,2),'s')
# thud: low impact, smooth decay with no click on hard cut
T=.47;t=np.arange(int(sr*T))/sr
y=np.sin(2*np.pi*(70*t+50*t*np.exp(-25*t))) * np.exp(-12*t)
y+=rng.normal(0,.12,len(t))*np.exp(-40*t)
save('hit',y*.6)
# whoosh: filtered noise burst, reverse ramp + short tail
T=.53;t=np.arange(int(sr*T))/sr
n=rng.normal(0,1,len(t));kernel=np.ones(35)/35
high=n-np.convolve(n,kernel,'same');env=np.sin(np.pi*np.clip(t/T,0,1))**1.8
save('whoosh',high*env*.36)
# soft glassy shimmer with warm fundamental, no shrill oscillator
T=.78;t=np.arange(int(sr*T))/sr
y=np.sin(2*np.pi*(660*t-70*t*t))*np.exp(-6.5*t)+.37*np.sin(2*np.pi*990*t)*np.exp(-9*t)
save('spark',y*.26)
T=.22;t=np.arange(int(sr*T))/sr
n=rng.normal(0,1,len(t));y=(np.sin(2*np.pi*250*t)+.2*n)*np.exp(-24*t)
save('tap',y*.19)
