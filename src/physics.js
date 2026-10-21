export const LENGTH = 900;
export const SECTIONS = ['THE RIDGE', 'OPEN FACE', 'THE COULOIR', 'TREE RUN', 'AIR TIME', 'THE BLUE FINISH'];
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export function ground(d, x = 0) {
  const base = 170 - Math.min(d, 820) * .19;
  return base + Math.sin(d * .022) * 2.2 + Math.cos(x * .08 + d * .014) * 1.5 + Math.pow(Math.min(Math.abs(x), 65) / 27, 2) * 4;
}
export function freshState() { return { distance: 0, x: 0, speed: 4, vx: 0, lift: 0, vy: 0, time: 0, score: 0, air: 0, maxSpeed: 0, combo: 1, crashed: 0, finished: false, jumpedLip: false }; }
export function step(s, input, dt, demo = false) {
  if (s.finished) return [];
  dt = clamp(dt, 0, .05);
  const events = [];
  s.time += dt;
  s.crashed = Math.max(0, s.crashed - dt);
  const steer = demo ? Math.sin(s.distance * .024) * .6 : input.steer;
  const target = input.brake ? 5 : input.tuck || demo ? 25.8 : 20;
  s.speed += (target - s.speed) * dt * .55;
  s.vx += (steer * s.speed * .42 - s.vx) * dt * 5;
  s.x = clamp(s.x + s.vx * dt, -23, 23);
  s.distance += s.speed * dt * (demo ? 2.1 : 1);
  s.maxSpeed = Math.max(s.maxSpeed, s.speed * 3.6);
  if ((input.jump || (s.distance > 670 && !s.jumpedLip)) && s.lift === 0) {
    s.vy = 6.4;
    s.lift = .01;
    events.push('takeoff');
    if (s.distance > 670) s.jumpedLip = true;
  }
  if (s.lift > 0) {
    s.vy -= 9.81 * dt; s.lift += s.vy * dt; s.air += dt;
    if (s.lift <= 0) { s.lift = 0; s.vy = 0; s.score += 550 * s.combo; events.push('landing'); }
  }
  s.combo = Math.min(6, 1 + Math.floor(s.distance / 150));
  s.score += dt * s.speed * (Math.abs(steer) > .2 ? 12 : 7) * s.combo;
  if (s.distance >= LENGTH) { s.distance = LENGTH; s.finished = true; events.push('finish'); }
  return events;
}
export function collide(s) { if (s.crashed > 0 || s.lift > 1.4) return false; s.speed *= .35; s.score = Math.max(0, s.score - 350); s.crashed = 1.5; return true; }
export function formatTime(t) { const centis = Math.floor(t * 100); return `${String(Math.floor(centis / 6000)).padStart(2,'0')}:${String(Math.floor(centis / 100) % 60).padStart(2,'0')}.${String(centis % 100).padStart(2,'0')}`; }
