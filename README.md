# Alpine Flow

A playable, stylized Three.js alpine freeriding prototype based on the supplied six-shot cinematic brief. Black shell, orange pants, white helmet and cyan backpack remain consistent across the run. Includes a continuous mountain, couloir rocks, forest obstacles, jumping, powder particles, a lake finish, live HUD, minimap, score, pause/resume, touch controls and optional synthesized sound.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. `npm run build` produces `dist/`; `npm run preview` serves that production build. `npm test` checks the core movement and scoring behavior.

## Controls

- A/D or left/right arrows: steer.
- W/up: tuck for speed. S/down: brake.
- Space: jump. The natural lip also triggers an automatic jump.
- Escape or Pause: pause; use Keep Riding to resume.
- Sound button: enable optional synthesized wind and impact sounds.
- Touch devices: on-screen steering, brake and jump buttons.

Drop In starts a freely steerable run. Watch the Run starts an accelerated cinematic autopilot tour. Collision penalties apply to manual play; the demo illustrates the route without obstacle penalties. The lake ends the run and shows earned rank, score, maximum speed, airtime and elapsed time. Replay resets the run.

The demo's runtime depends on simulated movement (approximately 18 seconds), and a normal run takes longer. This is a browser prototype with procedural stylized geometry and simplified physics, not photorealistic video or a full ski simulator. Google Fonts is optional; system fonts provide a fallback. No accounts, tracking, API keys or backend are required.

## Video deliverable

See [the polished video prompt](docs/video-prompt.md) for an 18-second shot list, character lock, audio direction, negative constraints, and a separate accurate HUD compositing specification. This is a production prompt, not a generated video file.
