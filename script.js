'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
// One project index drives both the desk objects and the accessible project notes.
const keys=['har','learntrack','comparely'];
function selectProject(key,{focus=false,scroll=false}={}){
 if(!keys.includes(key))return;
 keys.forEach(k=>{const tab=$('#tab-'+k),panel=$('#panel-'+k),active=k===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;panel.hidden=!active;});
 if(scroll)$('#work').scrollIntoView({behavior:document.body.classList.contains('motion-off')?'instant':'smooth',block:'start'});
 if(focus)$('#tab-'+key).focus({preventScroll:scroll});
}
$$('[data-tab]').forEach((button,index)=>{button.addEventListener('click',()=>selectProject(button.dataset.tab));button.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%keys.length;if(event.key==='ArrowLeft')next=(index+keys.length-1)%keys.length;if(event.key==='Home')next=0;if(event.key==='End')next=keys.length-1;if(next!==undefined){event.preventDefault();selectProject(keys[next],{focus:true});}});});
$$('[data-project]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();selectProject(button.dataset.project,{focus:true,scroll:true});}));
// Preview tasks are explicitly sample data and live only in the current page.
function updateTasks(){const done=$$('.demo-tasks input:checked').length;$('#task-progress').style.width=`${done/3*100}%`;$('#task-status').textContent=`${done} of 3 steps complete${done===3?' — a little progress, made.':''}`;}
$$('.demo-tasks input').forEach(box=>box.addEventListener('change',updateTasks));updateTasks();
const intro=$('#intro-dialog');
$$('[data-open-intro]').forEach(button=>button.addEventListener('click',()=>intro.showModal()));$('.dialog-close').addEventListener('click',()=>intro.close());intro.addEventListener('click',e=>{if(e.target!==intro)return;const r=intro.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)intro.close();});
const theme=$('#theme-toggle');function applyTheme(){const dark=document.documentElement.dataset.theme==='dark';theme.textContent=dark?'◐':'◑';theme.setAttribute('aria-label',`Switch to ${dark?'light':'dark'} theme`);theme.title=theme.getAttribute('aria-label');$('meta[name="theme-color"]').content=dark?'#13161c':'#f2f0ea';}
theme.addEventListener('click',()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('desk-theme',document.documentElement.dataset.theme);}catch{}applyTheme();});applyTheme();
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),motion=$('#motion-toggle'),desk=$('#desk-stage');let enabled=!reduced.matches,frame=0,target=[0,0];
function updateMotion(){document.body.classList.toggle('motion-off',!enabled);document.documentElement.style.scrollBehavior=enabled?'smooth':'auto';motion.setAttribute('aria-pressed',String(enabled));motion.setAttribute('aria-label',`Turn decorative motion ${enabled?'off':'on'}`);motion.title=motion.getAttribute('aria-label');motion.querySelector('span').textContent=enabled?'on':'off';desk.style.setProperty('--tilt-x','0deg');desk.style.setProperty('--tilt-y','0deg');}
motion.addEventListener('click',()=>{enabled=!enabled;updateMotion();});reduced.addEventListener('change',()=>{enabled=!reduced.matches;updateMotion();});updateMotion();
// Gentle depth on the desktop only. No continuous animation loop or wheel handlers.
desk.addEventListener('pointermove',e=>{if(!enabled||e.pointerType==='touch'||innerWidth<1200)return;const r=desk.getBoundingClientRect();target=[((e.clientY-r.top)/r.height-.5)*-3,((e.clientX-r.left)/r.width-.5)*4];if(!frame)frame=requestAnimationFrame(()=>{frame=0;desk.style.setProperty('--tilt-x',target[0]+'deg');desk.style.setProperty('--tilt-y',target[1]+'deg');});});desk.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);frame=0;desk.style.setProperty('--tilt-x','0deg');desk.style.setProperty('--tilt-y','0deg');});
$('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('jainkeerthika006@gmail.com');$('#copy-status').textContent='Email address copied.';}catch{$('#copy-status').textContent='Copy this address: jainkeerthika006@gmail.com';}});
$('#contact-form').addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;const values=new FormData(form),subject=`Portfolio enquiry from ${values.get('name')}`,body=`Hi Keerthika,\n\n${values.get('message')}\n\nFrom: ${values.get('name')}\nReply to: ${values.get('email')}`;location.href=`mailto:jainkeerthika006@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;$('#form-status').textContent='Your draft is ready for your email app.';});
