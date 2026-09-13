# HelpNest Companion MVP

Standalone prototype for the HelpNest 3D companion concept.

## Features

- React + Vite + TypeScript
- Procedural 3D robot built with React Three Fiber / Three.js
- Default and Saudi outfit options
- Idle, loading, success, error, offline and mini-game states
- Simulated fast/slow/failure/offline requests
- Click interaction
- "Play while waiting" mini-game
- No assyst dependency and no HelpNest code dependency

## Run on Windows

1. Install Node.js LTS.
2. Open PowerShell in this folder.
3. Run:

```powershell
npm install
npm run dev
```

Then open the local URL shown by Vite, usually `http://localhost:5173`.

## Production build test

```powershell
npm run build
npm run preview
```

## Notes

This MVP intentionally uses geometry for the robot instead of a final `.glb` asset. That lets us prove the interaction/state architecture before spending time on production character modeling and animation.
