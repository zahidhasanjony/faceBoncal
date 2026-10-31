import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import analysis from '../planning/srt-analysis.json';

export const Root:React.FC=()=> <Composition
 id="Main" component={Main} width={1080} height={1920} fps={60}
 durationInFrames={analysis.compositionDurationInFrames}
 defaultProps={{voiceover:true,soundEffects:true}} />;
