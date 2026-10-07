(()=>{const $=s=>document.querySelector(s);
// Transcript-guided phoneme estimates for this exact MP3. Playback is the only clock.
const audio=$('#intro-audio'),voice=$('#voice'),mouth=$('#mouth'),head=$('#character-head');
const poses={rest:[35,1,0],closed:[31,.3,0],open:[29,11,1],wide:[35,6,1],round:[16,11,0],pucker:[13,6,0],dental:[29,3,1],tongue:[28,7,1]};
const phoneShape={SIL:'rest',M:'closed',B:'closed',P:'closed',F:'dental',V:'dental',TH:'tongue',DH:'tongue',L:'tongue',W:'pucker',R:'pucker',OW:'round',AO:'round',UW:'pucker',IY:'wide',IH:'wide',EH:'wide',T:'dental',D:'dental',S:'dental',Z:'dental'};
let cues=[],frame=0,ready=false;
function poseAt(t){const i=cues.findIndex(c=>t>=c.start&&t<c.end);if(i<0)return poses.rest;const c=cues[i],name=phoneShape[c.phone]||'open';let current=poses[name];
 // Diphthong AY travels from an open vowel toward a narrower vowel, on the audio clock.
 if(c.phone==='AY'){const k=Math.min(1,(t-c.start)/(c.end-c.start));current=poses.open.map((v,j)=>v+(poses.wide[j]-v)*k);}
 const previous=i?poses[phoneShape[cues[i-1].phone]||'open']:poses.rest;
 const blend=Math.min(1,(t-c.start)/Math.min(.035,(c.end-c.start)/3));return current.map((v,j)=>previous[j]+(v-previous[j])*blend);
}
function drawMouth(t){const [w,h,teeth]=poseAt(t),x=474,y=461;mouth.dataset.viseme=cues.find(c=>t>=c.start&&t<c.end)?.phone||'SIL';
 const cavity=`M${x-w} ${y}Q${x} ${y-h} ${x+w} ${y}Q${x} ${y+h*2} ${x-w} ${y}Z`;
 $('#lip-cavity').setAttribute('d',cavity);$('#lip-clip').setAttribute('d',cavity);
 $('#lip-outline').setAttribute('d',`M${x-w-2} ${y}Q${x} ${y-h-5} ${x+w+2} ${y}Q${x} ${y+h*2+8} ${x-w-2} ${y}Z`);
 $('#lip-teeth').setAttribute('d',`M${x-w} ${y-h}H${x+w}V${y+2}Q${x} ${y+5} ${x-w} ${y+2}Z`);$('#lip-teeth').setAttribute('opacity',teeth);
 $('#lip-tongue').setAttribute('cy',y+h+3);$('#lip-highlight').setAttribute('d',`M${x-w*.4} ${y+h+4}Q${x} ${y+h+6} ${x+w*.4} ${y+h+3}`);mouth.setAttribute('visibility','visible');
}
function stopMouth(){cancelAnimationFrame(frame);frame=0;mouth.setAttribute('visibility','hidden');}
function animateMouth(){if(audio.paused||audio.ended||document.hidden)return;drawMouth(audio.currentTime);frame=requestAnimationFrame(animateMouth);}
function controls(label,icon,playing=false){$('#voice-label').textContent=label;$('#voice-icon').textContent=icon;voice.setAttribute('aria-label',label);voice.classList.toggle('playing',playing);}
const prepared=fetch('assets/hero-intro.phonemes.json').then(r=>{if(!r.ok)throw Error('Cues unavailable');return r.json();}).then(data=>{cues=data.phonemes;ready=true;}).catch(()=>{$('#audio-status').textContent='The introduction is available, but mouth animation could not load.';});
voice.addEventListener('click',async()=>{if(!audio.paused){audio.pause();return;}voice.disabled=true;try{await prepared;if(audio.ended)audio.currentTime=0;await audio.play();}catch{controls('Try introduction again','▷');$('#audio-status').textContent='Audio could not play. Try again.';}finally{voice.disabled=false;}});
audio.addEventListener('playing',()=>{head.classList.add('engaged');controls('Pause introduction','Ⅱ',true);$('#audio-status').textContent='Introduction playing.';stopMouth();if(ready)animateMouth();});
audio.addEventListener('pause',()=>{stopMouth();if(!audio.ended)controls(audio.currentTime>0?'Resume introduction':'Hear my introduction','▷');});
audio.addEventListener('waiting',()=>{stopMouth();controls('Loading introduction…','…');});
audio.addEventListener('seeking',stopMouth);
audio.addEventListener('seeked',()=>{if(!audio.paused&&ready){stopMouth();animateMouth();}});
audio.addEventListener('ended',()=>{stopMouth();controls('Replay introduction','↻');$('#audio-status').textContent='Introduction finished.';});
audio.addEventListener('error',()=>{stopMouth();controls('Try introduction again','▷');$('#audio-status').textContent='Audio could not load.';});
document.addEventListener('visibilitychange',()=>{stopMouth();if(!document.hidden&&!audio.paused&&ready)animateMouth();});

const modal=$('#intro-dialog');modal.addEventListener('close',()=>audio.pause());})();
