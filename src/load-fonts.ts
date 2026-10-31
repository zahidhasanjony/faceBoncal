import {staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// Must be called during module initialization, before Remotion captures any frame.
// Run `npm run fonts` first. GitHub Actions does this before rendering.
const weights = [
  ['400', 'Regular'],
  ['500', 'Medium'],
  ['600', 'SemiBold'],
  ['700', 'Bold'],
] as const;
for (const [weight, suffix] of weights) {
  loadFont({
    family: 'Hind Siliguri',
    url: staticFile(`fonts/HindSiliguri-${suffix}.ttf`),
    weight,
  });
}
