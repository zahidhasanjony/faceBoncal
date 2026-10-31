import {Easing} from 'remotion';

/** Centralized Story-First Warm Cream palette; Bangla headlines & captions use Hind Siliguri. */
export const theme = {
  colors: {
    bg: '#EBE6DC', deep: '#E5DED3', surface: '#F8F5EF', surfaceLight: '#FFFFFF',
    cyan: '#C84B31', mint: '#1E5641', amber: '#D99B32', coral: '#C84B31',
    white: '#222222', dim: '#49524B', muted: '#5C665F', line: '#CEC6BB',
    bone: '#E6D8C4', boneDark: '#A48D70', ink: '#222222',
  },
  font: '"Hind Siliguri", "Noto Sans Bengali", sans-serif',
  easing: {
    out: Easing.bezier(0.16,1,0.3,1),
    inOut: Easing.bezier(0.65,0,0.28,1),
    exit: Easing.bezier(0.6,0,0.84,0),
  },
  spring: {
    pop: {damping: 15, stiffness: 165, mass: 0.7},
    smooth: {damping: 22, stiffness: 105, mass: 1},
    firm: {damping: 18, stiffness: 210, mass: 0.75},
  },
};
