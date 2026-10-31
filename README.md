**Font note:** Hind Siliguri files are fetched by `npm run fonts` from Google Fonts during GitHub Actions. This archive cannot include their binaries because font downloading was unavailable in this environment. No fallback font is labeled as Hind Siliguri.

# EduTalk Calcium & Bone Health — Warm Cream 60 FPS (Revision)

**Confirmed:** 1080×1920 portrait, 60fps, Story-First Warm Cream (#EBE6DC), EduTalk only at top, Bengali SRT subtitles retained, no footer below captions. The original voiceover, 47 cues and 26 scenes are preserved.

# EduTalk · হাড় ক্ষয় কেন হয়? — Remotion motion graphics

A full editable vertical Bangla health explainer based on the supplied MP3 and the **original 47-cue SRT**. There are **26 storyboarded scenes**, detailed SVG illustration rigs, kinetic titles, and cue-synced subtitle cards. No image API or live web service is used during rendering.

## Export specification

| Setting | Value |
|---|---|
| Composition | `Main` |
| Size | **1080 × 1920 (9:16)** |
| Frame rate | **60fps** |
| Exact audio | **129.306 seconds** |
| Video timeline | **3880 frames (129.333 seconds)** |
| Narration | Supplied `voiceover.mp3` (on for rendered MP4) |
| Captions | Supplied `script.srt`, all text/timecodes preserved |
| Bengali font | Hind Siliguri, 400/500/600/700, obtained locally before render |
| Audio effects | 4 original generated WAVs, individually mixed under speech |
| Background music | None |
| Color palette | Medical Dark, cyan/mint/amber with coral for warnings |
| MP4 filename | `dist/EduTalk_BoneHealth_1080x1920.mp4` |

## Easiest way — render on GitHub, no local computer needed

1. Create a new **GitHub repository**. Do not upload to the older Diabetes project unless you want to replace its content.
2. Upload the **contents of this ZIP** to the repository root, keeping `.github/workflows/render.yml` and all folders. GitHub's web uploader may hide dotfolders on some file dialogs; ensure the `.github` workflow actually appears in the repository.
3. Open **Actions → Render EduTalk Bone Health (Bangla) → Run workflow**. A push to `main` also starts it automatically.
4. When the job finishes, open its **Artifacts** section and download `EduTalk_BoneHealth_1080x1920_Bangla`. It contains the MP4 and four QA stills.

The workflow installs Remotion, fetches the **official Hind Siliguri** font weights from Google Fonts into `public/fonts/` **on the GitHub runner before rendering**, checks the scene timings, type-checks, captures stills, renders with narration and checks the encoded streams. There are **no live font downloads during frame rendering**. Keep GitHub Actions enabled.

**Important:** font binaries are not included in this ZIP. The font-install script is included and automatically installs the font on GitHub. You do not have to install Bangla fonts yourself on GitHub.

## Render on your own PC

Prerequisites: Node.js 20+ or 22, Python 3, network access the first time, Chrome/Chromium installed or Remotion's bundled Chrome downloader.

```bash
npm install --no-audit --no-fund
npm run fonts
npm run timeline
npm run typecheck
npm run studio
```

For the final MP4:

```bash
npm run render
```

You may also run `sh scripts/render-local.sh`. The generated npm lockfile can be committed after your first `npm install` to make later CI installs fully reproducible. The Remotion dependency versions are already pinned to the same specific release.

## Where to customize

- `src/data/scenes.json`: scene boundaries, headings, labels and motion brief. Editing the SRT and rerunning `npm run timeline` will rebuild scene timings but may need new semantic scene groupings in `scripts/build_timeline.py`.
- `src/graphics/SceneGraphic.tsx`: animated bone, demolition, building, lock/key, sunlight, motion and food visuals. Each icon has its own timed spring, swing, ripple, draw-on or orbit behavior.
- `src/components/Scene.tsx`: layout, titles, text chips and stage reveals.
- `src/components/Captions.tsx`: caption card position and font sizes.
- `src/theme.ts`: all semantic colors, timing curves, Bengali font and spring settings.
- `src/components/AudioTracks.tsx`: independent narration/SFX control and volumes.
- `public/voiceover.mp3` and `public/script.srt`: source materials.
- `planning/MOTION_PLAN.md`: every scene, motion beats, start and end.

The default Remotion composition renders **with narration**. In Studio you can adjust props `voiceover` and `soundEffects` independently.

## Verification and limitations

The source was parsed offline and rendered through a **local browser-based approximate frame timing harness** to inspect all 26 layouts, the bounds of all 47 subtitle cues and Bengali shaping. This is not the same as a completed native Remotion export. The final GitHub workflow uses the real Remotion runtime and the actual Hind Siliguri font; check the four uploaded CI stills before publishing. This workspace cannot reach npm and therefore could not run Remotion's native build, Studio or final MP4 encoder here.

`out/storyboard-contact-sheet.jpg` is a compact overview of the inspected browser stills. Individual stills are included for spot checks. A complete 720 × 1280 browser-rendered narrated preview is included in `preview/` and also supplied as a separate download. The local inspection used Noto Sans Bengali as fallback because Hind Siliguri was not present here; the GitHub workflow installs Hind Siliguri before the final render.

## Script accuracy review

See `EDITORIAL_MEDICAL_REVIEW.md` for specific places in the original voiceover that should be medically reviewed before public release. The source audio/SRT have **not** been edited to avoid changing the user's script without permission.

## Font and audio credits

- Hind Siliguri: copyright © 2015 Indian Type Foundry, SIL Open Font License 1.1. Official font files and OFL license fetched by `scripts/fetch_fonts.mjs`.
- Four sound effects: synthesized from noise/sine envelopes using `scripts/generate_sfx.py`; original and royalty-free, no source download.
- Illustrations, SVGs and motion timing: project-original. No stock-photo or third-party video files.
