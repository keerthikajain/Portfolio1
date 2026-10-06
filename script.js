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
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.filter;let count=0;document.querySelectorAll('[data-filter]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});document.querySelectorAll('.project').forEach(project=>{project.hidden=filter!=='all'&&project.dataset.category!==filter;if(!project.hidden){count++;project.classList.add('visible');}});$('#filter-status').textContent=`Showing ${count} ${count===1?'project':'projects'}.`;}));
$('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('jainkeerthika006@gmail.com');$('#copy-status').textContent='Email address copied.';}catch{$('#copy-status').textContent='Copy this address: jainkeerthika006@gmail.com';}});
$('#contact-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const values=new FormData(form);const subject=`Portfolio enquiry from ${values.get('name')}`;const body=`Hi Keerthika,\n\n${values.get('message')}\n\nFrom: ${values.get('name')}\nReply to: ${values.get('email')}`;window.location.href=`mailto:jainkeerthika006@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;$('#form-status').textContent='Your draft is ready for your email app. If it does not open, use the email link above.';});
// Acoustic cues were extracted from this exact recording using Rhubarb.
// The audio element is the only clock: seeking, pausing and buffering reset the mouth.
const audio=$('#intro-audio'),voice=$('#voice'),mouth=$('#mouth'),head=$('#character-head');
const shapeFor={A:'rest',X:'rest',B:'wide',G:'wide',C:'open',D:'open',H:'open',E:'round',F:'round'};
const mouthAssets={open:'assets/hero-mouth-open.png',round:'assets/hero-mouth-round.png',wide:'assets/hero-mouth-wide.png'};
let cues=[],frame=0,lastShape='rest',ready=false;
function shapeAt(time){const cue=cues.find(cue=>time>=cue.start&&time<cue.end);return cue?shapeFor[cue.value]||'rest':'rest';}
function setMouth(shape){if(shape===lastShape)return;lastShape=shape;if(shape==='rest'){mouth.setAttribute('visibility','hidden');return;}mouth.setAttribute('href',mouthAssets[shape]);mouth.setAttribute('visibility','visible');}
function stopMouth(){cancelAnimationFrame(frame);frame=0;setMouth('rest');}
function animateMouth(){if(audio.paused||audio.ended)return;setMouth(shapeAt(audio.currentTime));frame=requestAnimationFrame(animateMouth);}
function controls(label,icon,playing=false){$('#voice-label').textContent=label;$('#voice-icon').textContent=icon;voice.setAttribute('aria-label',label);voice.classList.toggle('playing',playing);}
const prepared=Promise.all([fetch('assets/hero-intro.cues.json').then(response=>{if(!response.ok)throw Error('Cues unavailable');return response.json();}).then(data=>{cues=data.mouthCues||[];}),...Object.values(mouthAssets).map(src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src=src;}))]).then(()=>{ready=true;}).catch(()=>{$('#audio-status').textContent='The introduction is available, but mouth animation could not load.';});
voice.addEventListener('click',async()=>{if(!audio.paused){audio.pause();return;}voice.disabled=true;try{await prepared;if(audio.ended)audio.currentTime=0;await audio.play();}catch{controls('Try introduction again','▷');$('#audio-status').textContent='Audio could not play. Try again or check your connection.';}finally{voice.disabled=false;}});
audio.addEventListener('playing',()=>{head.classList.add('engaged');controls('Pause introduction','Ⅱ',true);$('#audio-status').textContent='Introduction playing.';stopMouth();if(ready)animateMouth();});
audio.addEventListener('pause',()=>{stopMouth();if(!audio.ended)controls(audio.currentTime>0?'Resume introduction':'Hear my introduction','▷');});
audio.addEventListener('waiting',()=>{stopMouth();controls('Loading introduction…','…');});
audio.addEventListener('seeking',stopMouth);
audio.addEventListener('seeked',()=>{if(!audio.paused&&ready){stopMouth();animateMouth();}});
audio.addEventListener('ended',()=>{stopMouth();controls('Replay introduction','↻');$('#audio-status').textContent='Introduction finished.';});
audio.addEventListener('error',()=>{stopMouth();controls('Try introduction again','▷');$('#audio-status').textContent='Audio could not load. Check your connection and try again.';});


// Spatial presentation uses native scrolling. No wheel/touch events are intercepted.
(()=>{
 const root=document.documentElement,body=document.body;
 const hero=document.querySelector('.scroll-hero'),skills=document.querySelector('#skills');
 const about=document.querySelector('#about'),passport=document.querySelector('.passport');
 const gallery=document.querySelector('#work'),cards=[...document.querySelectorAll('.project')];
 const tabs=[...document.querySelectorAll('[data-slide]')];
 const motionButton=document.querySelector('#motion-toggle');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),small=matchMedia('(max-width: 800px)');
 let enabled=!reduced.matches,scheduled=0,active=-1,metrics={};
 const clamp=(value,min=0,max=1)=>Math.min(max,Math.max(min,value));
 function measure(){const y=scrollY;metrics={heroTop:hero.getBoundingClientRect().top+y,heroRange:Math.max(1,hero.offsetHeight-innerHeight),skillsTop:skills.getBoundingClientRect().top+y,skillsHeight:skills.offsetHeight,aboutTop:about.getBoundingClientRect().top+y,galleryTop:gallery.getBoundingClientRect().top+y,galleryRange:Math.max(1,gallery.offsetHeight-innerHeight),maxScroll:Math.max(1,document.documentElement.scrollHeight-innerHeight)};request();}
 function request(){if(!scheduled)scheduled=requestAnimationFrame(render);}
 function render(){scheduled=0;const y=scrollY;root.style.setProperty('--progress',clamp(y/metrics.maxScroll));const spatial=enabled&&!small.matches;
  root.style.setProperty('--hero-progress',spatial?clamp((y-metrics.heroTop)/metrics.heroRange):0);
  const depth=clamp((y+innerHeight*.75-metrics.skillsTop)/(metrics.skillsHeight*.9));root.style.setProperty('--skill-depth',enabled?depth:0);
  const aboutProgress=clamp((y+innerHeight*.7-metrics.aboutTop)/(innerHeight*.7));passport.style.setProperty('--passport-turn',spatial?`${-18+aboutProgress*18}deg`:'0deg');
  const progress=clamp((y-metrics.galleryTop)/metrics.galleryRange);root.style.setProperty('--gallery-progress',progress);
  const index=spatial?Math.round(progress*2):-1;
  cards.forEach((card,i)=>{if(spatial){const offset=i-progress*2;const distance=Math.abs(offset);card.style.transform=`translate3d(${offset*112}%,${distance*16}px,${-distance*150}px) rotateY(${-offset*15}deg) rotateZ(${offset*1.2}deg)`;card.style.opacity=String(clamp(1-distance*.5,.12,1));card.style.zIndex=String(10-Math.round(distance*3));card.inert=i!==index;card.style.pointerEvents=i===index?'auto':'none';}else{card.style.transform='none';card.style.opacity='1';card.style.zIndex='auto';card.inert=false;card.style.pointerEvents='auto';}});
  if(index!==active){active=index;tabs.forEach((tab,i)=>tab.setAttribute('aria-pressed',String(i===index)));if(index>=0)document.querySelector('#gallery-count').textContent=`0${index+1} / 03`;}
 }
 function motion(){body.classList.toggle('motion-off',!enabled);motionButton.setAttribute('aria-pressed',String(enabled));motionButton.innerHTML=`Motion ${enabled?'on':'off'} <span aria-hidden="true">✳</span>`;measure();body.dispatchEvent(new CustomEvent('portfolio-motion',{detail:enabled}));}
 motionButton.addEventListener('click',()=>{enabled=!enabled;motion();});
 reduced.addEventListener('change',()=>{enabled=!reduced.matches;motion();});small.addEventListener('change',measure);
 tabs.forEach((tab,i)=>tab.addEventListener('click',()=>{const top=metrics.galleryTop+metrics.galleryRange*(i/2);scrollTo({top,behavior:enabled&&!reduced.matches?'smooth':'instant'});}));
 document.querySelectorAll('.skill-key').forEach(tile=>{const describe=()=>{document.querySelector('#skill-detail').textContent=tile.dataset.skill;};tile.addEventListener('pointerenter',describe);tile.addEventListener('focus',describe);tile.addEventListener('click',describe);});
 passport.addEventListener('pointermove',event=>{if(!enabled||event.pointerType==='touch')return;const box=passport.getBoundingClientRect();passport.style.setProperty('--tilt-y',`${((event.clientY-box.top)/box.height-.5)*-8}deg`);});passport.addEventListener('pointerleave',()=>passport.style.setProperty('--tilt-y','0deg'));
 addEventListener('scroll',request,{passive:true});addEventListener('resize',measure);new ResizeObserver(measure).observe(body);document.fonts?.ready.then(measure);
 motion();
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
