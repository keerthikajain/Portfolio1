# Keerthika Jain — a curious mind, in motion

An independently deployable portfolio inspired by the supplied scrolling reference: warm cream and navy colors, oversized typography, a layered character, elevated skill tiles, and a scroll-driven project gallery. Built with HTML, CSS, and JavaScript. No Lovable service, badge, subscription, API key, or runtime package is required.

## Deploy to GitHub and Vercel

1. Extract the ZIP and upload its contents to a new GitHub repository. Upload the files, not just the ZIP. Keep `index.html`, `package.json`, `build.cjs`, `vercel.json`, and `assets/` at the repository root.
2. In Vercel, choose Add New → Project and import that repository.
3. Choose Other as the framework preset and keep the Root Directory at the repository root.
4. Deploy. `vercel.json` supplies `npm run build` as the build command and `dist` as the output directory. No environment variables are needed.

Configuration reference: https://vercel.com/docs/project-configuration/vercel-json

## Preview and build locally

Serve this folder using VS Code Live Server or, if Python is installed:

```sh
python -m http.server 8000
```

Open http://localhost:8000. Using a server allows the speech cue JSON to load correctly.

With Node.js 18 or newer, create deployment output using:

```sh
npm run build
```

There are no npm dependencies to install. The build copies the website into `dist/`.

## The scrolling experience

- On desktop, the opening scene stays in view briefly while its layers move in depth with scrolling.
- The about card rotates into view. Skill tiles lift toward the pointer or keyboard focus; selecting one explains the tool. A CSS 3D ring sculpture turns as the skills section passes through the viewport.
- The project gallery uses native vertical scrolling to bring three project panels forward through a horizontal 3D scene. The numbered controls can jump directly to a project. Only the current card receives focus while this gallery is active.
- Small screens show the project panels in a readable vertical layout. No wheel events or touch gestures are intercepted.
- The Motion on/off control and operating system reduced-motion preference switch to a static layout. Native scrolling, navigation, dialogs, and audio still work.

The spatial effects use CSS perspective and 3D transforms. The supplied character is a 2D illustration placed within these layers, not a fully modeled or rigged 3D person.

## Character and voice

The character, mouth assets, and original recorded female voice are reused from the supplied portfolio. The complete available artwork is preserved. The head gently settles toward the visitor and gives a restrained greeting nod during playback. Mouth shapes follow the recording's actual playback position, with resting, open, rounded, and wide shapes.

`assets/hero-intro.cues.json` contains acoustic cue estimates generated from this exact MP3 using Rhubarb Lip Sync's phonetic recognizer. They are estimates, not studio-grade phoneme alignment. Pausing, buffering, seeking, and completion reset or resynchronize the animation. If you change the MP3, regenerate the cue file for the new recording.

The Web Audio analyser drives subtle lighting and voice bars from the recording's waveform. No microphone is requested. Audio begins only when the visitor presses the introduction button. The original MP3 is unchanged; this package does not assert whether its source was human or synthesized speech.

## Edit the content

- `index.html`: visible text, project cards, skills, social links, and contact email.
- `styles.css`: colors, typography, responsive layouts, and 3D presentation.
- `script.js`: project detail text/links, scroll presentation, interactions, contact draft, and audio synchronization.
- `assets/`: character images, mouth shapes, voice recording, cue data, and favicon.

Update both `index.html` and `script.js` when changing the contact email. Google Fonts are optional; system fonts are used if the font service is unavailable. The project visuals are interface concepts or illustrations, not project screenshots or measured results.

## Contact behavior

The form opens a filled-in email draft in the visitor's email application. It does not send or store messages on a server. The visitor sends the draft themselves. Direct email and copy-email options are also available.

## Validation and assets

The source builds without third-party npm dependencies. Browser checks cover the three scroll chapters, project dialogs, audio playback/pause, reduced motion, the motion toggle, and mobile navigation and overflow. Deployment configuration is included; this package has not been deployed to your Vercel account.

Character and voice assets come from the portfolio you supplied. The website implementation and CSS project illustrations were created for this standalone version.
