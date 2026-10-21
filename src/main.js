import * as THREE from 'three';
import './style.css';
import { LENGTH, SECTIONS, ground, freshState, step, collide, formatTime, clamp } from './physics.js';

const $ = id => document.getElementById(id);
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas: $('world'), antialias: true, powerPreference: 'high-performance' }); }
catch { $('error').hidden = false; $('error').textContent = 'This mountain needs WebGL. Please enable hardware acceleration in your browser and reload.'; throw new Error('WebGL unavailable'); }
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#d2c4b7');
scene.fog = new THREE.FogExp2('#b9c8d2', .00165);
const camera = new THREE.PerspectiveCamera(57, innerWidth / innerHeight, .5, 2300);
scene.add(new THREE.HemisphereLight('#e4efff', '#5b6f86', 2.1));
const sun = new THREE.DirectionalLight('#ffe0b0', 3.5);
sun.position.set(-130, 250, -250);
sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -70, right: 70, top: 70, bottom: -70, near: 1, far: 650 });
sun.shadow.bias = -.0003;
scene.add(sun, sun.target);

let seed = 481;
function random() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
const snow = new THREE.MeshStandardMaterial({ color: '#e8f0f5', roughness: .94, flatShading: false });
const rock = new THREE.MeshStandardMaterial({ color: '#667482', roughness: 1, flatShading: true });
const pine = new THREE.MeshStandardMaterial({ color: '#315451', roughness: 1, flatShading: true });
const larch = new THREE.MeshStandardMaterial({ color: '#a89051', roughness: 1, flatShading: true });
const trunkMat = new THREE.MeshStandardMaterial({ color: '#665b50', roughness: 1 });
function mesh(geometry, material, x, y, z, parent = scene) { const m = new THREE.Mesh(geometry, material); m.position.set(x,y,z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; }

// One continuous, deterministic heightfield; all course props share this surface.
const terrainGeometry = new THREE.PlaneGeometry(640, 1400, 180, 300);
terrainGeometry.rotateX(-Math.PI / 2);
const positions = terrainGeometry.attributes.position;
for (let i=0;i<positions.count;i++) {
  const x=positions.getX(i), z=positions.getZ(i)-500;
  let y=ground(-z,x);
  if (Math.abs(x)>30) y += Math.sin(x*.037 + z*.008)*Math.min(70, Math.abs(x)*.35) + Math.cos(z*.025)*Math.min(20,Math.abs(x)*.1);
  positions.setXYZ(i,x,y,z);
}
terrainGeometry.computeVertexNormals();
const terrain=mesh(terrainGeometry,snow,0,0,0); terrain.castShadow=false;
// Distant jagged silhouettes and snow caps.
for(let i=0;i<38;i++) {
  const side=i%2?1:-1, x=side*(180+random()*450), d=-180+random()*1650, height=110+random()*230;
  const mountain=mesh(new THREE.ConeGeometry(90+random()*100,height,5+Math.floor(random()*3)),rock,x,ground(d,0)+height*.27,-d);
  mountain.rotation.y=random()*Math.PI;
  const cap=mesh(new THREE.ConeGeometry(70+random()*30,height*.63,6),snow,x,mountain.position.y+height*.21,-d);
  cap.rotation.y=mountain.rotation.y;
}
const obstacles=[];
const trunkGeo=new THREE.CylinderGeometry(.23,.45,3,5);
const treeGeo=new THREE.ConeGeometry(2.6,6,7);
const snowTreeGeo=new THREE.ConeGeometry(2.25,4.7,7);
for(let i=0;i<285;i++) {
  const d=40+random()*780;
  const forest=d>400&&d<660;
  const x=(random()>.5?1:-1)*(forest?7+random()*80:27+random()*150);
  const y=ground(d,x), scale=.65+random()*1.3;
  const group=new THREE.Group(); group.position.set(x,y,-d); group.scale.setScalar(scale); scene.add(group);
  mesh(trunkGeo,trunkMat,0,1.5,0,group);
  for(let tier=0;tier<3;tier++) {
    const m=mesh(treeGeo,i%4===0?larch:pine,0,4+tier*1.9,0,group);m.scale.setScalar(1-tier*.22);
    const cap=mesh(snowTreeGeo,snow,0,4.9+tier*1.9,0,group);cap.scale.setScalar(1-tier*.22);
  }
  if(Math.abs(x)<25) obstacles.push({x,d,r:1.2*scale});
}
// Batch repeated trees into four instanced draws instead of thousands of meshes.
scene.updateMatrixWorld(true);
for (const [geometry, material] of [[trunkGeo,trunkMat],[treeGeo,pine],[treeGeo,larch],[snowTreeGeo,snow]]) {
  const originals=[];
  scene.traverse(object=>{if(object.isMesh&&object.geometry===geometry&&object.material===material)originals.push(object);});
  const batch=new THREE.InstancedMesh(geometry,material,originals.length);
  originals.forEach((object,i)=>{batch.setMatrixAt(i,object.matrixWorld);object.removeFromParent();});
  batch.castShadow=true;batch.receiveShadow=true;scene.add(batch);
}
for(let i=0;i<65;i++) {
  const d=240+random()*190, x=(i%2?1:-1)*(15+random()*22), size=2+random()*8;
  const r=mesh(new THREE.DodecahedronGeometry(size,0),rock,x,ground(d,x)+size*.2,-d);r.scale.set(1,1.7,.8);r.rotation.set(random(),random(),random());
  if(Math.abs(x)<23) obstacles.push({x,d,r:size*.7});
}
// A shallow turquoise inlet, with a snow-covered opposite shore.
const water=mesh(new THREE.CircleGeometry(78,80),new THREE.MeshStandardMaterial({color:'#278e9e',metalness:.35,roughness:.22,transparent:true,opacity:.92}),0,ground(900,0)+.9,-947);
water.rotation.x=-Math.PI/2;water.scale.set(1,1.35,1);water.castShadow=false;
for(let i=0;i<22;i++) { const a=random()*Math.PI*2;const ice=mesh(new THREE.DodecahedronGeometry(1+random()*2),snow,Math.cos(a)*65,water.position.y+.2,-947+Math.sin(a)*90);ice.scale.y=.3; }

// Consistent skier silhouette: black shell, vermilion pants, white helmet, cyan pack.
const skier=new THREE.Group();scene.add(skier);
const body=new THREE.Group();skier.add(body);
const black=new THREE.MeshStandardMaterial({color:'#192329',roughness:.85});
const red=new THREE.MeshStandardMaterial({color:'#ef512d',roughness:.85});
const white=new THREE.MeshStandardMaterial({color:'#eff5ef',roughness:.35});
const cyan=new THREE.MeshStandardMaterial({color:'#26c9cf',roughness:.7});
const goggles=new THREE.MeshStandardMaterial({color:'#e3a66b',metalness:.6,roughness:.18});
mesh(new THREE.CapsuleGeometry(.39,.55,5,10),black,0,1.65,0,body);
mesh(new THREE.SphereGeometry(.32,16,12),white,0,2.35,-.15,body);
const lens=mesh(new THREE.BoxGeometry(.49,.17,.17),goggles,0,2.36,-.42,body);lens.rotation.x=.12;
const pack=mesh(new THREE.BoxGeometry(.62,.83,.3),cyan,0,1.72,.4,body);pack.rotation.x=-.1;
for(const side of [-1,1]) {
  const leg=mesh(new THREE.CapsuleGeometry(.17,.6,4,8),red,side*.25,.77,.05,body);leg.rotation.x=-.3;
  mesh(new THREE.BoxGeometry(.28,.24,.52),black,side*.27,.2,-.05,body);
  const arm=mesh(new THREE.CapsuleGeometry(.12,.6,4,8),black,side*.54,1.57,-.15,body);arm.rotation.z=side*.32;arm.rotation.x=-.4;
  mesh(new THREE.SphereGeometry(.14,8,6),black,side*.7,1.23,-.28,body);
  const pole=mesh(new THREE.CylinderGeometry(.025,.025,1.8,5),black,side*.74,.8,.3,body);pole.rotation.x=-.65;
  const ski=mesh(new THREE.BoxGeometry(.22,.075,2.85),black,side*.28,.055,-.3,skier);
  mesh(new THREE.BoxGeometry(.225,.08,.5),cyan,side*.28,.06,-1.25,skier);
  const tip=mesh(new THREE.BoxGeometry(.22,.07,.35),red,side*.28,.13,-1.85,skier);tip.rotation.x=-.3;
}

// Fixed particle pool avoids allocations while carving.
const count=1100, particlePositions=new Float32Array(count*3), lives=new Float32Array(count), velocities=new Float32Array(count*3);
particlePositions.fill(-9999);
const particleGeometry=new THREE.BufferGeometry();particleGeometry.setAttribute('position',new THREE.BufferAttribute(particlePositions,3));
const powder=new THREE.Points(particleGeometry,new THREE.PointsMaterial({color:'#edf8ff',size:.22,transparent:true,opacity:.7,depthWrite:false}));scene.add(powder);
let cursor=0;
function spray(amount,splash=false){for(let j=0;j<amount;j++){const i=cursor++%count,k=i*3;lives[i]=.5+random()*.8;particlePositions[k]=skier.position.x+(random()-.5);particlePositions[k+1]=skier.position.y+.15;particlePositions[k+2]=skier.position.z+.7;velocities[k]=(random()-.5)*(splash?20:6)-state.vx*.4;velocities[k+1]=random()*(splash?13:4);velocities[k+2]=2+random()*5;}}
function updateParticles(dt){for(let i=0;i<count;i++){const k=i*3;if(lives[i]>0){lives[i]-=dt;velocities[k+1]-=dt*6;for(let j=0;j<3;j++)particlePositions[k+j]+=velocities[k+j]*dt;}else particlePositions[k+1]=-9999;}particleGeometry.attributes.position.needsUpdate=true;}

let state=freshState(), mode='intro', demo=false, keys=new Set(), jumpQueued=false, notifyTime=0, powderTime=0, finishDelay=0;
let audioContext, windGain, soundEnabled=false;
function initAudio(){if(audioContext)return;audioContext=new AudioContext();const buffer=audioContext.createBuffer(1,audioContext.sampleRate*2,audioContext.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;const noise=audioContext.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=650;windGain=audioContext.createGain();windGain.gain.value=0;noise.connect(filter).connect(windGain).connect(audioContext.destination);noise.start();}
function thump(splash=false){if(!soundEnabled||!audioContext)return;const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.frequency.setValueAtTime(splash?160:90,audioContext.currentTime);osc.frequency.exponentialRampToValueAtTime(30,audioContext.currentTime+.25);gain.gain.setValueAtTime(.18,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.3);osc.connect(gain).connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+.3);}
function notify(text){$('notification').textContent=text;notifyTime=2;}
function start(isDemo=false){state=freshState();demo=isDemo;mode='run';keys.clear();jumpQueued=false;finishDelay=0;powderTime=0;notifyTime=0;$('notification').textContent='';lives.fill(0);$('intro').hidden=true;$('location').hidden=true;$('hud').hidden=false;$('pause').hidden=false;document.body.classList.add('playing');$('mode-label').textContent=demo?'CINEMATIC DEMO':'FREE RIDE';$('touch-controls').hidden=demo||!matchMedia('(pointer: coarse)').matches;$('footer-label').textContent=demo?'CINEMATIC AUTOPILOT':'TRUST YOUR EDGES.';for(const id of ['results','paused'])$(id).close();camera.position.set(0,ground(0)+7,14);if(soundEnabled){initAudio();audioContext.resume();}}
function pause(){if(mode!=='run')return;mode='paused';keys.clear();jumpQueued=false;$('paused').showModal();}
function resume(){if(mode!=='paused')return;mode='run';$('paused').close();}
function showResults(){mode='results';$('pause').hidden=true;$('touch-controls').hidden=true;$('rank').textContent=state.score>18000?'S':state.score>10000?'A':'B';$('final-score').textContent=Math.floor(state.score).toLocaleString();$('final-speed').textContent=`${Math.round(state.maxSpeed)} km/h`;$('final-air').textContent=`${state.air.toFixed(1)} s`;$('final-time').textContent=formatTime(state.time);$('results').showModal();}
$('start').onclick=()=>start();$('demo').onclick=()=>start(true);$('again').onclick=()=>start(demo);$('restart').onclick=()=>start(demo);$('pause').onclick=pause;$('resume').onclick=resume;
$('home').onclick=()=>{mode='intro';$('results').close();$('intro').hidden=false;$('location').hidden=false;$('hud').hidden=true;$('pause').hidden=true;$('touch-controls').hidden=true;document.body.classList.remove('playing');state=freshState();};
$('sound').onclick=()=>{soundEnabled=!soundEnabled;if(soundEnabled){initAudio();audioContext.resume();}$('sound').textContent=soundEnabled?'SOUND ON':'SOUND OFF';$('sound').setAttribute('aria-pressed',String(soundEnabled));$('sound').setAttribute('aria-label',soundEnabled?'Mute sound':'Enable sound');};
$('paused').addEventListener('cancel',e=>{e.preventDefault();resume();});$('results').addEventListener('cancel',e=>e.preventDefault());
addEventListener('keydown',e=>{const key=e.key.toLowerCase();if([' ','arrowleft','arrowright','arrowup','arrowdown'].includes(key)&&mode==='run')e.preventDefault();if(key==='escape'){if(mode==='run'){e.preventDefault();pause();}return;}if(key===' '&&!e.repeat)jumpQueued=true;keys.add(key);});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>{keys.clear();if(mode==='run')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='run')pause();});
for(const button of document.querySelectorAll('[data-key]')){button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture(e.pointerId);keys.add(button.dataset.key);if(button.dataset.key===' ')jumpQueued=true;};const release=()=>keys.delete(button.dataset.key);button.onpointerup=release;button.onpointercancel=release;button.onlostpointercapture=release;}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});

const desiredCamera=new THREE.Vector3(),lookTarget=new THREE.Vector3();let previous=performance.now();
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-previous)/1000,.05);previous=now;
  if(mode==='run'){
    const steer=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0);
    const events=step(state,{steer,tuck:keys.has('w')||keys.has('arrowup'),brake:keys.has('s')||keys.has('arrowdown'),jump:jumpQueued},dt,demo);jumpQueued=false;
    if(!demo)for(const obstacle of obstacles)if(Math.abs(state.distance-obstacle.d)<obstacle.r+1&&Math.abs(state.x-obstacle.x)<obstacle.r+.4&&collide(state)){notify('EDGE CAUGHT −350');thump();}
    for(const event of events){if(event==='takeoff')notify('AIR +400');if(event==='landing'){notify(`CLEAN LANDING +${550*state.combo}`);spray(75);thump();}if(event==='finish'){spray(750,true);thump(true);notify('LAKE FINISH');finishDelay=1.25;}}
    if(state.lift===0&&!state.finished)spray(Math.round(dt*(Math.abs(state.vx)>1?230:80)));
    powderTime+=dt;if(powderTime>3.5&&!state.finished){powderTime=0;notify(state.distance>450&&state.distance<650?'TREE RUN · FLOW BONUS':'POWDER BLAST · FLOW BONUS');}
    if(notifyTime>0){notifyTime-=dt;if(notifyTime<=0)$('notification').textContent='';}
    if(state.finished){finishDelay-=dt;if(finishDelay<=0)showResults();}
  }
  const d=mode==='intro'?35:state.distance,x=mode==='intro'?0:state.x,y=ground(d,x);
  skier.position.set(x,y+state.lift,-d);skier.rotation.y=-state.vx*.035;body.rotation.z=-state.vx*.04;body.rotation.x=-.15-state.speed*.006;body.position.y=state.crashed>0?-.35:0;
  if(mode==='intro'){
    desiredCamera.set(19,ground(35)+12,-15);lookTarget.set(-5,ground(80)+3,-95);
    camera.position.lerp(desiredCamera,.04);camera.lookAt(lookTarget);
  }else{
    const orbit=state.lift>0?Math.sin(state.lift)*2:0;
    desiredCamera.set(x*.8+orbit,y+6+state.lift*.55,-d+12+state.speed*.14);
    if(mode==='run'){camera.position.lerp(desiredCamera,1-Math.exp(-dt*5));lookTarget.set(x,y+1.3+state.lift*.5,-d-11);camera.lookAt(lookTarget);}
  }
  sun.position.set(x-90,y+160,-d-70);sun.target.position.set(x,y,-d-20);
  if(mode==='run'||mode==='results')updateParticles(dt);
  water.material.opacity=.87+Math.sin(now*.001)*.035;
  if(windGain)windGain.gain.setTargetAtTime(soundEnabled&&mode==='run'?.015+state.speed*.003:0,audioContext.currentTime,.15);
  if(mode!=='intro'){
    $('timer').textContent=formatTime(state.time);$('altitude').textContent=Math.round(2844-(ground(0)-y)).toLocaleString();$('vertical').textContent=Math.max(0,Math.round(ground(0)-y));$('score').textContent=Math.floor(state.score).toLocaleString();$('multiplier').textContent=`×${state.combo} FLOW`;$('speed').textContent=state.finished?'0':Math.round(state.speed*3.6);$('speed-ring').style.strokeDashoffset=446*(1-clamp(state.speed*3.6/100,0,1));const section=Math.min(5,Math.floor(d/150));$('section-name').textContent=`0${section+1} / ${SECTIONS[section]}`;$('progress').style.width=`${d/LENGTH*100}%`;$('map-dot').setAttribute('cy',12+d/LENGTH*133);$('map-dot').setAttribute('cx',65+Math.sin(d*.024)*15);
  }
  renderer.render(scene,camera);
}
camera.position.set(19,ground(35)+12,-15);requestAnimationFrame(frame);
