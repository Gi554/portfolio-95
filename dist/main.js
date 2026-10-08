import * as THREE from './vendor/three.module.js';

const canvas=document.querySelector('#scene'), dialog=document.querySelector('#details');
document.querySelector('#portfolio').onclick=()=>dialog.showModal();
document.querySelector('#fallback').onclick=()=>dialog.showModal();
document.querySelector('#close').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog&&e.clientX<dialog.getBoundingClientRect().left)dialog.close()});
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.setAttribute('aria-selected',x===b));document.querySelector('#projects').hidden=b.dataset.tab!=='projects';document.querySelector('#about').hidden=b.dataset.tab!=='about'});
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'})}catch(e){document.querySelector('#loading').hidden=true;document.querySelector('#error').hidden=false;throw e}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
const scene=new THREE.Scene();scene.background=new THREE.Color('#b9d6eb');scene.fog=new THREE.Fog('#cfdeea',40,130);
const camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.05,180);camera.position.set(0,1.65,8.4);
const materials={};
function grain(color,scale=3){const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,256,256);let seed=93;for(let i=0;i<23000;i++){seed=(seed*16807)%2147483647;const x=seed%256;seed=(seed*16807)%2147483647;const y=seed%256;ctx.fillStyle=i%2?'rgba(255,255,255,.05)':'rgba(0,0,0,.08)';ctx.fillRect(x,y,1,1)}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(scale,scale);t.colorSpace=THREE.SRGBColorSpace;return t}
materials.fabric=new THREE.MeshStandardMaterial({map:grain('#293a4b',2),roughness:.94});materials.carpet=new THREE.MeshStandardMaterial({map:grain('#454952',6),roughness:1});materials.wall=new THREE.MeshStandardMaterial({color:'#e2e0d8',roughness:.57});materials.shell=new THREE.MeshStandardMaterial({color:'#aaaeb0',roughness:.62});materials.dark=new THREE.MeshStandardMaterial({color:'#26333e',roughness:.7});materials.metal=new THREE.MeshStandardMaterial({color:'#aab2b8',metalness:.78,roughness:.31});materials.trim=new THREE.MeshStandardMaterial({color:'#f4f0e6',roughness:.36});materials.belt=new THREE.MeshStandardMaterial({color:'#24282d',roughness:1});
function box(w,h,d,mat,x,y,z,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function round(w,h,d,r,mat,x,y,z,parent=scene){const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.025,bevelThickness:.025,curveSegments:8});g.translate(0,0,-d/2);const m=new THREE.Mesh(g,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function line(points,mat,r=.008,parent=scene){const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),20,r,5,false),mat);parent.add(m);return m}
function label(text,w,h,size=40,bg='#23323f',color='#f0f0e9'){const c=document.createElement('canvas');c.width=1024;c.height=Math.round(1024*h/w);const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=color;ctx.font=`500 ${size}px Arial`;ctx.textAlign='center';ctx.textBaseline='middle';text.split('\n').forEach((t,i,a)=>ctx.fillText(t,512,c.height/2+(i-(a.length-1)/2)*size*1.5));const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshBasicMaterial({map:tex})}
scene.add(new THREE.HemisphereLight('#e6f3ff','#74736e',2.4));const sun=new THREE.DirectionalLight('#ffedcf',3.5);sun.position.set(-12,9,2);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-15,right:15,top:13,bottom:-13,near:1,far:55});sun.shadow.bias=-.0004;scene.add(sun);scene.add(sun.target);
box(6,.14,25,materials.carpet,0,-.08,0);box(.9,.005,24,new THREE.MeshStandardMaterial({map:grain('#6b6c6b',8),roughness:1}),0,.004,0);
// Curved fuselage roof. The sidewall remains open at each recessed window.
const radius=3.07,centerY=.38;
for(let i=0;i<32;i++){const a=.26+i*(Math.PI-.52)/32,b=.26+(i+1)*(Math.PI-.52)/32;const verts=[];for(const z of [-12.5,12.5])for(const t of [a,b])verts.push(Math.cos(t)*radius,centerY+Math.sin(t)*radius,z);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex([0,2,1,1,2,3]);g.computeVertexNormals();const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:'#ebe9e2',roughness:.68,side:THREE.DoubleSide}));m.receiveShadow=true;scene.add(m)}
const windowFrame=new THREE.MeshStandardMaterial({color:'#c7c9c7',roughness:.42});
for(const side of [-1,1]){
 box(.12,1.1,25,materials.wall,side*2.96,.55,0);box(.12,.55,25,materials.wall,side*2.96,2.32,0);
 for(let i=0;i<12;i++){const z=-10.6+i*1.9;box(.12,1.1,1.1,materials.wall,side*2.96,1.6,z+.95);
 const group=new THREE.Group();group.position.set(side*2.99,1.66,z);group.rotation.y=side===-1?Math.PI/2:-Math.PI/2;scene.add(group);
 // Oval aperture ring with a real hole, allowing the sky to be seen through it.
 const s=new THREE.Shape();s.absellipse(0,0,.40,.56,0,Math.PI*2,false,0);const hole=new THREE.Path();hole.absellipse(0,0,.285,.41,0,Math.PI*2,true,0);s.holes.push(hole);const rim=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.15,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:3,steps:1,curveSegments:32}),windowFrame);rim.position.z=-.05;group.add(rim);
 const surround=new THREE.Shape();surround.moveTo(-.42,-.56);surround.lineTo(.42,-.56);surround.lineTo(.42,.56);surround.lineTo(-.42,.56);surround.closePath();const aperture=new THREE.Path();aperture.absellipse(0,0,.40,.56,0,Math.PI*2,true,0);surround.holes.push(aperture);group.add(new THREE.Mesh(new THREE.ShapeGeometry(surround),materials.wall));
 const glass=new THREE.Mesh(new THREE.CircleGeometry(1,32),new THREE.MeshPhysicalMaterial({color:'#b4d5e4',transparent:true,opacity:.09,roughness:.04,metalness:.05}));glass.scale.set(.29,.42,1);glass.position.z=-.10;group.add(glass);
 }
 // Overhead bins and continuous warm ceiling lamps.
 round(.92,.48,24,.13,materials.wall,side*2.1,2.65,0).rotation.y=0;
 box(.88,.035,24,materials.trim,side*2.1,2.37,0);
 for(let i=0;i<12;i++){const z=-11+i*1.95;box(.9,.012,.018,materials.shell,side*2.1,2.38,z);box(.16,.015,.065,materials.shell,side*2.1,2.35,z+.7);for(const dx of [-.15,.15]){const nozzle=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,.018,16),materials.metal);nozzle.position.set(side*1.6+dx,2.45,z);scene.add(nozzle)}}
 const lampMat=new THREE.MeshStandardMaterial({color:'#fff8df',emissive:'#fff0c2',emissiveIntensity:2});box(.045,.045,24,lampMat,side*1.48,2.9,0);
 for(const z of [-8,-2,4,10]){const light=new THREE.PointLight('#fff6e2',7,7,2);light.position.set(side*1.3,2.7,z);scene.add(light)}
}
// Seat construction: upholstered cushions, shell, tray table, pocket, belts and stitching.
function seat(x,z){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);const back=round(.76,1.20,.14,.13,materials.shell,0,1.11,0,g);back.rotation.x=-.12;
 const cushion=round(.69,1.09,.17,.12,materials.fabric,0,1.15,-.10,g);cushion.rotation.x=-.12;
 round(.50,.27,.12,.07,materials.fabric,0,1.58,-.20,g);
 const bottom=round(.70,.68,.16,.10,materials.fabric,0,.48,-.39,g);bottom.rotation.x=-Math.PI/2;
 box(.63,.10,.58,materials.dark,0,.36,-.34,g);
 for(const side of [-1,1]){box(.055,.37,.05,materials.metal,side*.26,.19,-.10,g);box(.05,.30,.055,materials.shell,side*.41,.64,-.15,g);round(.085,.10,.66,.03,materials.dark,side*.41,.82,-.29,g);line([[side*.30,.65,-.205],[side*.32,1.1,-.22],[side*.29,1.52,-.265]],materials.shell,.004,g)}
 // Back-facing tray and pocket visible from the aisle.
 const tray=round(.56,.37,.035,.045,materials.trim,0,1.08,.105,g);tray.rotation.x=-.12;
 box(.075,.045,.025,materials.shell,0,1.30,.145,g);round(.53,.20,.05,.03,materials.dark,0,.70,.13,g);
 const card=box(.32,.15,.012,new THREE.MeshStandardMaterial({color:'#d9d2bc'}),.02,.79,.16,g);card.rotation.z=.04;
 const belt1=box(.32,.02,.043,materials.belt,-.17,.584,-.45,g);belt1.rotation.y=-.25;const belt2=box(.27,.02,.043,materials.belt,.17,.584,-.39,g);belt2.rotation.y=.25;box(.065,.024,.07,materials.metal,-.01,.60,-.405,g);
 return g;
}
for(let row=0;row<9;row++){const z=-7.6+row*1.85;for(const x of [-2.16,-1.30,1.30,2.16])seat(x,z);for(const side of [-1,1]){const number=box(.21,.09,.015,label(`${row+1}`, .21,.09,160,'#e2e0d8','#4b5359'),side*1.59,2.17,z);number.rotation.y=side===-1?Math.PI/2:-Math.PI/2}}
// Front bulkhead and cockpit access.
box(6,3.5,.13,materials.wall,0,1.75,-10.5);round(.98,2.16,.09,.15,materials.shell,0,1.15,-10.38);round(.83,1.98,.05,.11,materials.dark,0,1.18,-10.30);box(.035,.19,.045,materials.metal,.31,1.0,-10.25);box(.48,.15,.01,label('COCKPIT',.48,.15,95,'#26333e'),0,1.99,-10.25);box(.55,.17,.03,label('EXIT',.55,.17,150,'#e5e5dd','#365c47'),0,2.61,-10.35);
box(6,3.5,.14,materials.wall,0,1.75,11.7);
const interactive=[];
const screenFrame=round(1.03,.66,.07,.05,materials.dark,-1.55,1.64,-10.32);const screen=box(.93,.55,.016,label('PORTFOLIO\nPROJETS & PARCOURS',.93,.55,55,'#152936'),-1.55,1.64,-10.265);interactive.push(screen);
box(.75,.35,.02,label('BIENVENUE À BORD',.75,.35,58,'#e2e0d8','#59616a'),1.60,1.78,-10.31);
// Wing outside the left windows, in the same world as the cabin.
const wingShape=new THREE.Shape();wingShape.moveTo(-3.1,1.2);wingShape.lineTo(-20,-3.8);wingShape.lineTo(-22,-5.2);wingShape.lineTo(-8,-3.0);wingShape.lineTo(-3.1,-2);wingShape.closePath();const wing=new THREE.Mesh(new THREE.ExtrudeGeometry(wingShape,{depth:.12,bevelEnabled:false}),new THREE.MeshStandardMaterial({color:'#d8dfe3',metalness:.45,roughness:.4}));wing.rotation.x=-Math.PI/2;wing.position.set(0,-.40,3);scene.add(wing);
line([[-5,-.26,2],[-12,-.26,5],[-19,-.26,7]],materials.shell,.012);
// Distant cloud banks, below the aircraft, with varied silhouette and soft lighting.
const clouds=new THREE.Group();scene.add(clouds);const cloudMat=new THREE.MeshStandardMaterial({color:'#fff',roughness:1});let seed=42;function random(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646}const cloudGeo=new THREE.SphereGeometry(1,12,8);
for(let i=0;i<70;i++){const x=(random()-.5)*160,z=(random()-.5)*180,y=-9-random()*14;for(let j=0;j<4;j++){const cloud=new THREE.Mesh(cloudGeo,cloudMat);cloud.position.set(x+j*3,y+random()*2,z+random()*4);cloud.scale.set(4+random()*5,1.4+random()*2,3+random()*4);clouds.add(cloud)}}
// A gentle horizon gradient seen through the cabin windows.
const skyCanvas=document.createElement('canvas');skyCanvas.width=16;skyCanvas.height=512;const skyCtx=skyCanvas.getContext('2d');const gradient=skyCtx.createLinearGradient(0,0,0,512);gradient.addColorStop(0,'#4a85b5');gradient.addColorStop(.5,'#b9d9ed');gradient.addColorStop(.72,'#e5edf0');gradient.addColorStop(1,'#a9c1d1');skyCtx.fillStyle=gradient;skyCtx.fillRect(0,0,16,512);const skyTex=new THREE.CanvasTexture(skyCanvas);skyTex.colorSpace=THREE.SRGBColorSpace;const sky=new THREE.Mesh(new THREE.SphereGeometry(140,24,16),new THREE.MeshBasicMaterial({map:skyTex,side:THREE.BackSide}));scene.add(sky);
let yaw=0,pitch=-.025,targetYaw=yaw,targetPitch=pitch;const destination=new THREE.Vector3(0,1.65,8.4);let touring=false,dragging=false,dragDistance=0,lastX=0,lastY=0;const keys=new Set(),clock=new THREE.Clock(),ray=new THREE.Raycaster();
canvas.addEventListener('pointerdown',e=>{dragging=true;dragDistance=0;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;dragDistance+=Math.abs(dx)+Math.abs(dy);targetYaw-=dx*.003;targetPitch=Math.max(-.75,Math.min(.75,targetPitch-dy*.0025));lastX=e.clientX;lastY=e.clientY;document.querySelector('.flight').style.opacity='0'});
canvas.addEventListener('pointerup',e=>{dragging=false;if(dragDistance<8){ray.setFromCamera(new THREE.Vector2(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1),camera);if(ray.intersectObjects(interactive).length)dialog.showModal()}});
canvas.addEventListener('pointercancel',()=>dragging=false);
addEventListener('keydown',e=>{if(dialog.open)return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key.toLowerCase())});addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>{keys.clear();dragging=false});
const views={cabin:{pos:[0,1.65,8.4],yaw:0,pitch:-.025,label:'01 / LA CABINE'},window:{pos:[-2.52,1.63,6.5],yaw:Math.PI/2,pitch:-.08,label:'02 / LE HUBLOT'},front:{pos:[0,1.65,-8.8],yaw:0,pitch:0,label:'03 / À L’AVANT'}};
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{const v=views[b.dataset.view];destination.set(...v.pos);targetYaw=v.yaw;targetPitch=v.pitch;touring=true;document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===b));document.querySelector('#place').textContent=v.label;document.querySelector('.flight').style.opacity=b.dataset.view==='cabin'?'1':'0'});
document.querySelector('.brand').onclick=e=>{e.preventDefault();document.querySelector('[data-view=cabin]').click()};
let touchMove=null;document.querySelectorAll('[data-move]').forEach(b=>{b.addEventListener('pointerdown',e=>{touchMove=b.dataset.move;b.setPointerCapture(e.pointerId)});b.addEventListener('pointerup',()=>touchMove=null);b.addEventListener('pointercancel',()=>touchMove=null)});
// Audio is created only after a visitor explicitly enables it.
let audioContext,audioGain;const soundButton=document.querySelector('#sound');soundButton.onclick=async()=>{if(!audioContext){audioContext=new AudioContext();const buffer=audioContext.createBuffer(1,audioContext.sampleRate*3,audioContext.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;const source=audioContext.createBufferSource();source.buffer=buffer;source.loop=true;const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=240;audioGain=audioContext.createGain();audioGain.gain.value=0;source.connect(filter).connect(audioGain).connect(audioContext.destination);source.start()}await audioContext.resume();const on=soundButton.getAttribute('aria-pressed')!=='true';audioGain.gain.setTargetAtTime(on?.11:0,audioContext.currentTime,.3);soundButton.setAttribute('aria-pressed',on);soundButton.textContent=on?'Son activé':'Son désactivé'};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let elapsed=0;
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);elapsed+=dt;if(!dialog.open){yaw+=(targetYaw-yaw)*(reduced?1:Math.min(1,dt*10));pitch+=(targetPitch-pitch)*(reduced?1:Math.min(1,dt*10));camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);
let forward=0;if(keys.has('w')||keys.has('z')||keys.has('arrowup')||touchMove==='forward')forward=1;if(keys.has('s')||keys.has('arrowdown')||touchMove==='back')forward=-1;
if(keys.has('arrowleft')||touchMove==='left')targetYaw+=dt;if(keys.has('arrowright')||touchMove==='right')targetYaw-=dt;
if(forward){touring=false;camera.position.x-=Math.sin(yaw)*dt*1.8*forward;camera.position.z-=Math.cos(yaw)*dt*1.8*forward;document.querySelector('.flight').style.opacity='0'}
let strafe=0;if(keys.has('a')||keys.has('q'))strafe=-1;if(keys.has('d'))strafe=1;if(strafe){touring=false;camera.position.x+=Math.cos(yaw)*dt*1.4*strafe;camera.position.z-=Math.sin(yaw)*dt*1.4*strafe}
if(touring){camera.position.lerp(destination,reduced?1:Math.min(1,dt*2));if(camera.position.distanceTo(destination)<.01)touring=false}else{camera.position.z=THREE.MathUtils.clamp(camera.position.z,-9.2,10.4);if(forward||strafe)camera.position.x=THREE.MathUtils.clamp(camera.position.x,-.46,.46)}
}clouds.position.z=reduced?0:Math.sin(elapsed*.015)*5;renderer.render(scene,camera)}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
animate();document.querySelector('#loading').style.opacity='0';setTimeout(()=>document.querySelector('#loading').hidden=true,850);

