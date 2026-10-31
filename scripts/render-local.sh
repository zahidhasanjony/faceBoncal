#!/bin/sh
set -eu
npm install --no-audit --no-fund
npm run fonts
npm run timeline
npm run typecheck
npm run render
printf '\nDone: dist/EduTalk_BoneHealth_1080x1920.mp4\n'
