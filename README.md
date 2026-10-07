# Keerthika Jain — The build desk

A standalone portfolio built with HTML, CSS and JavaScript. The laptop, phone and notebook are interactive CSS 3D objects linked to the project notes. There is no scroll hijacking, WebGL dependency, paid service or site-builder runtime.

## Run in VS Code

Open the folder in VS Code. Use the Live Server extension to open `index.html`, or run a local server:

```sh
python -m http.server 5500
```

Then open `http://localhost:5500`. Use an HTTP server rather than opening the HTML file directly, because the speech controller fetches its cue file.

## Build and deploy

```sh
npm run build
```

Vercel uses `npm run build` and the `dist` output directory, as configured in `vercel.json`. No runtime npm dependencies are needed. Changes should be reviewed on their branch before merging into the deployment branch.

## Editing

- `index.html`: biography, project stories, links, desktop objects and optional introduction.
- `styles.css`: complete responsive design, dark/light palettes and CSS 3D object geometry.
- `script.js`: project selection, keyboard tabs, sample tasks, theme and motion controls, introduction dialog, email draft and copy action.
- `speech.js`: original female recording and audio-playhead-driven vector lip poses.
- `assets/`: original character/audio, speech alignment and locally captured project screenshots.
- `build.cjs`: copies the site into `dist`.

The theme is retained when local storage is available. Decorative motion follows the operating-system preference and the Motion button. Scrolling remains native. The introduction plays only after a visitor requests it, and closing the dialog pauses audio.

## Project evidence and attribution

Project copy is based on the public repositories linked from the portfolio. No unverified performance metrics are presented.

- **HAR Router:** the screenshot renders the actual `frontend/src/pages/RunPrediction.jsx` component from `keerthikajain/HARtraining` locally, using its own styles. It shows the idle interface, with no backend connected and no fabricated prediction results.
- **LearnTrack Pro:** the purple desk phone and interactive task list are portfolio illustrations inspired by the project's documented course/assignment/study workflow. They are not screenshots or an embedded copy of the application. This is labelled on the page. The actual demo, APK and repository remain linked.
- **Comparely:** the screenshot renders the actual landing component from the `master` branch of `keerthikajain/Comparely_ojt_project`, locally and without a backend. The project is described as collaborative and the linked repository as a fork. The original upstream is `sristyanand00/Comparely_ojt_project`.

The desk screen, phone and notebook are visual navigation objects. The live interaction on this portfolio is project selection and the sample study checklist; no live machine learning inference, product prices or user data are claimed.

## Character and speech limitations

The original `hero-intro.mp3` is unchanged. The character remains an illustrated 2D asset, shown in an optional introduction dialog. It is not a fully rigged 3D avatar. The lip controller uses eight vector poses, with transitions based on `audio.currentTime` and pause/seek/playback events rather than random timers.

`hero-intro.phonemes.json` contains PocketSphinx 5.0.4 transcript-guided estimates for this recording. The name pronunciation supplied to the aligner was `K IH R TH IH K AH`. These are estimates, not studio-authored visemes. A different recording needs new timing data. Natural talking-head motion matching a video reference requires an authored clip or a rigged character; this implementation does not claim that fidelity.

## Contact

The contact form opens a draft in the visitor's email application. It does not send a message or use a backend. GitHub, LinkedIn, demo and APK links open their respective external destinations.
