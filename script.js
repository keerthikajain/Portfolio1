'use strict';
const $ = selector => document.querySelector(selector);
const menu=$('#menu-toggle'), mobile=$('#mobile-nav');
function closeMenu(){mobile.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
menu.addEventListener('click',()=>{const open=mobile.hidden;mobile.hidden=!open;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
if('IntersectionObserver' in window){document.body.classList.add('js-ready');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));}
const projects={
 har:{title:'HAR Router',category:'MACHINE LEARNING',description:'A human activity recognition project using smartphone accelerometer and gyroscope data. I explored how sensor measurements can become features for a Random Forest classifier, connecting data preparation with model training.',tags:['Python','scikit-learn','Random Forest','Sensor data'],links:[['Source code','https://github.com/keerthikajain/HARtraining'],['Video demo','https://drive.google.com/file/d/1j3ttJqrnkTJgJgoIt3qk88KkVWb9EbmW/view?usp=sharing'],['Design','https://www.figma.com/design/VhponbrtEOi9B0U9P0kytA/HAR-design?node-id=0-1']]},
 learntrack:{title:'LearnTrack Pro',category:'MOBILE',description:'A mobile app for organizing courses, assignments, and study activity. Built with React Native, SQLite, and React Native Paper, it brings everyday learning tasks into one place. This project helped me explore mobile interfaces and local data storage.',tags:['React Native','SQLite','React Native Paper'],links:[['Source code','https://github.com/keerthikajain/LearnTrack-Pro'],['Video demo','https://drive.google.com/file/d/17wntnSdiUVT2z1AWoxUigzRHxwsyX5W2/view?usp=sharing'],['Android APK','https://drive.google.com/file/d/1qRWQTKdGMRtQRPbzD8SWbqWS1UPsAJl4/view?usp=sharing']]},
 comparely:{title:'Comparely',category:'WEB',description:'A grocery price comparison web project that helps people explore their options. Working with React, a MERN stack, and APIs, I explored how to connect product information to an interface that makes comparisons easier.',tags:['React','MERN','API'],links:[['Source code','https://github.com/keerthikajain/Comparely_ojt_project']]}
};
const dialog=$('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{const project=projects[button.dataset.project];$('#dialog-title').textContent=project.title;$('#dialog-category').textContent=project.category;$('#dialog-description').textContent=project.description;$('#dialog-tags').replaceChildren(...project.tags.map(tag=>{const element=document.createElement('span');element.textContent=tag;return element;}));$('#dialog-links').replaceChildren(...project.links.map(([label,url])=>{const a=document.createElement('a');a.textContent=label+' ↗';a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}));dialog.showModal();}));
$('#dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
$('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('jainkeerthika006@gmail.com');$('#copy-status').textContent='Email address copied.';}catch{$('#copy-status').textContent='Copy this address: jainkeerthika006@gmail.com';}});
$('#contact-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const values=new FormData(form);const subject=`Portfolio enquiry from ${values.get('name')}`;const body=`Hi Keerthika,\n\n${values.get('message')}\n\nFrom: ${values.get('name')}\nReply to: ${values.get('email')}`;window.location.href=`mailto:jainkeerthika006@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;$('#form-status').textContent='Your draft is ready for your email app. If it does not open, use the email link above.';});
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
// Theme is applied before first paint and retained when storage is available.
(()=>{const root=document.documentElement,button=$('#theme-toggle');function apply(){const dark=root.dataset.theme==='dark';button.textContent=dark?'Light ◐':'Dark ◑';button.setAttribute('aria-label',`Switch to ${dark?'light':'dark'} theme`);document.querySelector('meta[name="theme-color"]').content=dark?'#141917':'#f4f0e7';document.body.dispatchEvent(new Event('portfolio-theme'));}button.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('portfolio-theme',root.dataset.theme);}catch{}apply();});apply();})();

// Native document flow: no pinned scenes, artificial scroll distances, or wheel interception.
(()=>{
 const root=document.documentElement,body=document.body;
 const toggle=document.querySelector('#motion-toggle');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const coarse=matchMedia('(pointer: coarse)');
 const tabs=[...document.querySelectorAll('[data-capability]')];
 const panels=[...document.querySelectorAll('.capability-panel')];
 const stage=document.querySelector('.capability-stack');
 let enabled=!reduced.matches,frame=0,maxScroll=1;
 function progress(){frame=0;root.style.setProperty('--progress',Math.min(1,scrollY/maxScroll));}
 function schedule(){if(!frame)frame=requestAnimationFrame(progress);}
 function measure(){maxScroll=Math.max(1,document.documentElement.scrollHeight-innerHeight);schedule();}
 function motion(){body.classList.toggle('motion-off',!enabled);toggle.setAttribute('aria-pressed',String(enabled));toggle.title=enabled?'Turn decorative motion off':'Turn decorative motion on';toggle.innerHTML=`Motion ${enabled?'on':'off'} <span aria-hidden="true">✳</span>`;body.dispatchEvent(new CustomEvent('portfolio-motion',{detail:enabled}));document.querySelectorAll('[data-depth]').forEach(el=>{el.style.setProperty('--lean-x','0deg');el.style.setProperty('--lean-y','0deg');});}
 toggle.addEventListener('click',()=>{enabled=!enabled;motion();});reduced.addEventListener('change',()=>{enabled=!reduced.matches;motion();});
 function select(index,focus=false){tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;if(focus&&i===index)tab.focus();});panels.forEach((panel,i)=>{const active=i===index;const depth=(i-index+panels.length)%panels.length;panel.classList.toggle('is-active',active);panel.setAttribute('aria-hidden',String(!active));panel.inert=!active;panel.tabIndex=active?0:-1;panel.style.setProperty('--layer',depth);panel.style.zIndex=String(3-depth);});}
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(i));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(i+1)%tabs.length;if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();select(next,true);}});});
 // Pointer depth is bounded; it never changes text position or the document's scroll distance.
 [document.querySelector('.character-space'),document.querySelector('.passport'),stage].filter(Boolean).forEach(el=>{el.dataset.depth='';el.addEventListener('pointermove',event=>{if(!enabled||coarse.matches||event.pointerType==='touch')return;const box=el.getBoundingClientRect();el.style.setProperty('--lean-x',`${((event.clientY-box.top)/box.height-.5)*-5}deg`);el.style.setProperty('--lean-y',`${((event.clientX-box.left)/box.width-.5)*6}deg`);});el.addEventListener('pointerleave',()=>{el.style.setProperty('--lean-x','0deg');el.style.setProperty('--lean-y','0deg');});});
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);new ResizeObserver(measure).observe(body);document.fonts?.ready.then(measure);select(0);motion();measure();
})();

// Sound-reactive light and a restrained greeting nod use the real playback clock.
(()=>{
 const stage=document.querySelector('.character-stage'),recording=document.querySelector('#intro-audio'),nod=document.querySelector('#character-nod');
 let ac,analyser,samples,energy=0,raf=0,playing=false;
 function motionAllowed(){return !document.body.classList.contains('motion-off');}
 document.querySelector('#voice').addEventListener('click',()=>{try{if(!ac){const AudioEngine=window.AudioContext||window.webkitAudioContext;if(!AudioEngine)return;ac=new AudioEngine();analyser=ac.createAnalyser();analyser.fftSize=256;samples=new Uint8Array(analyser.fftSize);const source=ac.createMediaElementSource(recording);source.connect(analyser);analyser.connect(ac.destination);}if(ac.state==='suspended')ac.resume().catch(()=>{});}catch{}});
 function stop(){cancelAnimationFrame(raf);raf=0;energy=0;nod.removeAttribute('transform');stage.style.setProperty('--voice-energy','0');}
 function draw(){raf=0;if(!playing||recording.paused||recording.ended||!motionAllowed()||document.hidden)return;let power=0;if(analyser){analyser.getByteTimeDomainData(samples);for(const sample of samples){const x=(sample-128)/128;power+=x*x;}power=Math.min(1,Math.sqrt(power/samples.length)*5);}energy+=(power-energy)*.2;stage.style.setProperty('--voice-energy',energy.toFixed(3));const t=recording.currentTime,dip=t<.85?Math.sin(Math.PI*t/.85):0;nod.setAttribute('transform',`translate(0 ${dip*2.5}) rotate(${dip*.65} 475 510)`);raf=requestAnimationFrame(draw);}
 function start(){if(!raf&&playing&&motionAllowed()&&!document.hidden)raf=requestAnimationFrame(draw);}
 recording.addEventListener('playing',()=>{playing=true;start();});['pause','waiting','seeking','ended','error'].forEach(event=>recording.addEventListener(event,()=>{playing=false;stop();}));recording.addEventListener('seeked',()=>{if(!recording.paused&&!recording.ended){playing=true;start();}});document.body.addEventListener('portfolio-motion',event=>event.detail?start():stop());document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
})();
