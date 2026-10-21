# Alpine Flow — cinematic video prompt

## Generation settings

Target: 16:9, 18 seconds, highest available resolution, natural 24–30 fps motion. Use native environmental audio if the selected model supports it. Check the selected Higgsfield/Wan model's actual duration, audio and multi-shot controls before submitting; this brief does not assume a specific model version supports every feature. If 18 seconds is unavailable, generate linked clips with the final frame of each clip used as the next reference.

## Copy-ready visual prompt

Create an 18-second photorealistic alpine freeriding gameplay trailer. The feeling is adrenaline, freedom and complete control. Use a stable third-person chase camera with cinematic polish, a geographically connected descent, believable gravity, grounded ski contact and consistent character identity. Preserve the same skier, outfit, gear, lighting and mountain throughout. Snow has fine surface detail, wind-shaped ridges, compressed tracks and layered powder spray.

CHARACTER LOCK: one athletic adult male skier wearing a matte-black technical shell, bright red-orange freeride pants, a white helmet, lightly tinted goggles covering his eyes, a vivid cyan backpack with black straps, black gloves and two poles. Two wide freeride skis remain attached to the boots throughout. Natural knee flexion, planted weight shifts, upper-body counter-rotation and restrained pole movement. No outfit changes or duplicate limbs.

WORLD: a compact fictional alpine descent during golden hour. Warm peach and pink sky above jagged peaks; cool blue snow shadows, warm rim light and subtle atmospheric haze. The connected route crosses an open powder face, a short rocky chute, sparse larches and pines, a modest natural jump, then a shallow turquoise lake inlet. Use a physically plausible short course; do not imply thousands of vertical metres covered in seconds.

0–3 SECONDS — DROP IN. From behind and slightly above, follow the skier planting his poles on a pristine ridge and leaning into the descent. Edges engage, knees compress, and fine powder trails behind. Push smoothly from a wide establishing view into medium chase framing.

3–6 SECONDS — OPEN FACE. Two strong, controlled linked turns on a steep open face. The skis displace deep powder into directional rooster tails. Snow crystals catch the warm light. Follow the skier's arc with gentle lateral camera movement; preserve clear ski contact and believable acceleration.

6–8 SECONDS — COULOIR. Enter a short narrow rocky chute. The camera lowers slightly without clipping through terrain. Restrained, precise turns carry the skier between the rock walls. Snow spray falls back under gravity.

8–11 SECONDS — TREE LINE. Exit into a sparse alpine grove, weaving between well-spaced larches and pines. Keep trees stationary and maintain clear travel direction. Snow brushes low branches only where the skier's spray reaches them. The camera follows a safe open path behind him.

11–14 SECONDS — AIR AND LANDING. Launch from a modest natural lip. Perform a short, balanced straight air on a continuous ballistic arc with skis aligned to the slope. A subtle camera orbit reveals the cyan backpack. Maintain real-time motion. Land with both skis, deep knee compression, a dense powder burst and smooth recovery. No hovering or abrupt aerial direction changes.

14–18 SECONDS — LAKE FINISH. Follow the final glide into a shallow turquoise inlet. On water contact, forward speed visibly drops and a broad, realistic splash rises around the skis. Small ice fragments drift at the edge; water droplets pass the lens. Finish with the skier upright and slowed in the shallows as the camera eases to a stop. Leave the last second readable for a completion graphic.

CAMERA AND FINISH: stable professional chase camera, mild energetic micro-movement, natural motion blur, no uncontrolled shake. Keep skier and immediate terrain sharp; use subtle depth separation only for distant peaks. High dynamic range, detailed fabric, wet snow on lower pants after the finish. Natural transitions between connected sections; no teleportation.

AUDIO, IF SUPPORTED: cold wind, ski-edge scrape, layered powder whoosh, brief quiet during the jump, a soft low landing thump, then water splash and falling droplets. No narration or music required.

NEGATIVE CONSTRAINTS: cartoon rendering, floating skier, sliding without ski contact, impossible acceleration, reversed gravity, extra limbs or poles, detached skis, morphing clothes, melting trees, terrain discontinuities, low-detail snow, flat lighting, excessive lens blur, chaotic camera shake, urban elements, illegible baked-in text.

## HUD and finishing pass

For dependable text and exact statistics, generate clean footage first and composite the following HUD afterward. Keep its position, font and scale fixed throughout. If the model must generate the HUD in the same pass, append these instructions, but expect to correct text and numbers in editing.

- Top left: monospaced run timer, increasing consistently from `00:00.00` to `00:18.00`.
- Top centre: altitude starting at `2,844 m`, decreasing modestly with the visible descent; vertical drop derived from that altitude.
- Top right: compact `HIGGSFIELD WAN 3.0` badge, as requested in the concept. Treat this as an editorial label, not a claim of partnership or the renderer used by the browser game.
- Bottom right: semi-transparent circular speedometer. Increase naturally during the descent; show actual deceleration during the water finish. A target peak near `93 km/h` is optional and must fit the depicted motion.
- Right edge: line score and multiplier building from `×2` to `×6`. Time notifications to the corresponding events: `POWDER BLAST +250`, `TREE RUN`, `AIR +400`, `CLEAN LANDING +150`.
- Bottom left: small topographic minimap with a glowing path that progresses continuously.
- Final second: `RUN COMPLETE`, `S RANK`, target score `20,300`, max speed and measured airtime. These are editorial trailer targets; the playable game's statistics come from the actual run.

Use white type, a pale-lime accent and dark translucent backing. Keep all HUD text inside a 5% safe margin. Mix audio gently beneath impact events. Export in 16:9 at the source frame rate.
