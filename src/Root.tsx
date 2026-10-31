import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import scenes from './data/scenes.json';
import cues from './data/cues.json';

// The scene timeline is already expressed in 60-fps frames.
// Do not use the older 30-fps analysis report to size this composition.
const sceneEnd = Math.max(...scenes.map((scene) => scene.endFrame));
const cueEnd = Math.ceil(Math.max(...cues.map((cue) => cue.endMs ?? 0)) * 60 / 1000);
const durationInFrames = Math.max(sceneEnd, cueEnd);

export const Root: React.FC = () => (
  <Composition
    id="Main"
    component={Main}
    width={1080}
    height={1920}
    fps={60}
    durationInFrames={durationInFrames}
    defaultProps={{voiceover: true, soundEffects: true}}
  />
);
