'use strict';
let musicTimer=null,musicStarting=false,musicBeat=0,musicNext=0;
const musicVoices=new Set();
const retroMelody=[64,67,71,67,62,67,71,74,60,64,67,64,62,66,69,66,64,67,72,71,69,67,64,62,60,64,67,69,62,66,67,null];
function musicNote(note,time,duration,type,volume){
 if(note===null)return;
 const voice=audioContext.createOscillator(),gain=audioContext.createGain();
 voice.type=type;voice.frequency.value=440*2**((note-69)/12);
 gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(volume,time+.025);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 voice.connect(gain);gain.connect(audioContext.destination);musicVoices.add(voice);
 voice.onended=()=>{musicVoices.delete(voice);voice.disconnect();gain.disconnect()};
 voice.start(time);voice.stop(time+duration+.03);
}
async function startRetroMusic(){
 if(musicTimer!==null||musicStarting||document.hidden)return;
 musicStarting=true;
 try{audioContext??=new AudioContext();await audioContext.resume();
 if(!sounds||document.hidden)return;
 musicNext=audioContext.currentTime+.08;
 const schedule=()=>{if(!sounds||document.hidden){stopRetroMusic();return}if(musicNext<audioContext.currentTime)musicNext=audioContext.currentTime+.04;
 while(musicNext<audioContext.currentTime+.25){
 const index=musicBeat%32;
 musicNote(retroMelody[index],musicNext,.23,'triangle',.045);
 if(musicBeat%2===0)musicNote([40,43,36,38][Math.floor(index/8)],musicNext,.46,'triangle',.035);
 if(musicBeat%4===0)musicNote(76,musicNext,.04,'sine',.012);
 musicBeat++;musicNext+=.3;
 }};
 schedule();musicTimer=setInterval(schedule,100);
 }catch{console.warn('La musique attend une interaction pour être activée.')}finally{musicStarting=false}
}
function stopRetroMusic(){clearInterval(musicTimer);musicTimer=null;for(const voice of musicVoices){try{voice.stop()}catch{}}musicVoices.clear()}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopRetroMusic();else if(sounds)startRetroMusic()});
// Original synthesized effects and looping retro music.
window.retroSound=async function(type='click'){
 if(!sounds)return;try{audioContext??=new AudioContext();await audioContext.resume();const notes={click:[[900,0,.025]],card:[[420,0,.04],[650,.035,.04]],startup:[[262,0,.16],[330,.12,.18],[392,.24,.2],[523,.4,.3]],error:[[180,0,.12],[130,.13,.16]],win:[[523,0,.1],[659,.1,.1],[784,.2,.1],[1047,.3,.25]],point:[[700,0,.04],[1050,.045,.06]],shoot:[[520,0,.045]],jump:[[330,0,.06],[550,.05,.06]]}[type]||[[750,0,.03]];for(const [frequency,delay,duration] of notes){const oscillator=audioContext.createOscillator(),gain=audioContext.createGain(),start=audioContext.currentTime+delay;oscillator.type=type==='startup'?'triangle':'square';oscillator.frequency.setValueAtTime(frequency,start);gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.07,start+.008);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start(start);oscillator.stop(start+duration+.02)}}catch{}
};
let soundPreference;try{soundPreference=localStorage.getItem('portfolio-sound')}catch{}
let soundUnlocked=false;
function unlockPortfolioAudio(e){if(soundUnlocked)return;if(e.type==='keydown'&&(e.repeat||e.ctrlKey||e.altKey||e.metaKey))return;soundUnlocked=true;document.removeEventListener('pointerdown',unlockPortfolioAudio);document.removeEventListener('keydown',unlockPortfolioAudio);if(!e.target.closest('#audio')){sounds=true;syncSound();window.retroSound('startup')}}
document.addEventListener('pointerdown',unlockPortfolioAudio);document.addEventListener('keydown',unlockPortfolioAudio);
function syncSound(){if(sounds)startRetroMusic();else stopRetroMusic();const b=$('#audio');b.setAttribute('aria-pressed',sounds);b.setAttribute('aria-label',sounds?'Désactiver les sons':'Activer les sons');b.textContent=sounds?'♫':'♪'}
$('#audio').onclick=()=>{sounds=!sounds;syncSound();try{localStorage.setItem('portfolio-sound',sounds?'on':'off')}catch{}if(sounds)window.retroSound('startup')};
document.addEventListener('click',e=>{if(e.target.closest('button')&&!e.target.closest('#audio'))window.retroSound(e.target.closest('.sol-card')?'card':'click')});
document.addEventListener('keydown',e=>{if(e.repeat||!e.target.closest('canvas'))return;if(e.code==='Space')window.retroSound(e.target.classList.contains('platform-board')?'jump':'shoot');else if(e.key.startsWith('Arrow'))window.retroSound('click')});

const audioSettingsRender=renderApp;renderApp=function(id,content,state){audioSettingsRender(id,content,state);if(id==='settings'){const b=document.createElement('button');b.textContent='Tester le son rétro';b.onclick=()=>{sounds=true;syncSound();window.retroSound('startup')};content.querySelector('.settings-page').append(b)}};


