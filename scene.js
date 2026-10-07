/* A small, dependency-free WebGL sculpture. Native scrolling is never intercepted. */
(()=>{
 'use strict';
 const host=document.querySelector('#sculpture'),canvas=document.querySelector('#depth-canvas');
 if(!host||!canvas)return;
 const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});
 if(!gl)return; // The CSS sculpture remains visible without WebGL.
 const vertex=`attribute vec3 position;attribute vec3 normal;uniform float angle;uniform vec2 lean;uniform float aspect;varying vec3 N;varying vec3 P;
 void main(){float a=angle+lean.x,b=.4+lean.y;mat3 ry=mat3(cos(a),0.,-sin(a),0.,1.,0.,sin(a),0.,cos(a));mat3 rx=mat3(1.,0.,0.,0.,cos(b),sin(b),0.,-sin(b),cos(b));P=rx*ry*position;N=rx*ry*normal;float z=5.7-P.z;gl_Position=vec4(P.x*2.8/aspect,P.y*2.8,(z-1.)*.8,z);}`;
 const fragment=`precision mediump float;varying vec3 N;varying vec3 P;uniform float dark;
 void main(){vec3 n=normalize(N);vec3 view=normalize(vec3(0.,0.,6.)-P);vec3 key=normalize(vec3(-3.,4.,5.));vec3 fill=normalize(vec3(4.,-1.,2.));float diffuse=max(dot(n,key),0.);float rim=pow(1.-max(dot(n,view),0.),3.);float shine=pow(max(dot(n,normalize(key+view)),0.),55.);float edge=pow(max(dot(n,normalize(fill+view)),0.),24.);vec3 bronze=mix(vec3(.35,.28,.15),vec3(.42,.5,.36),dark);vec3 color=bronze*(.24+diffuse*.95)+vec3(.95,.81,.53)*shine*.9+vec3(.55,.75,.65)*edge*.4+vec3(.35,.43,.3)*rim*.65;gl_FragColor=vec4(pow(color,vec3(.8)),1.);}`;
 function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
 let program;
 try{program=gl.createProgram();const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Shader link');}catch{return;}
 gl.useProgram(program);gl.enable(gl.DEPTH_TEST);
 // Tubular trefoil: a continuous connection with actual occlusion and surface normals.
 const vertices=[],normals=[],indices=[],rings=220,sides=20;
 function center(t){return [(1.35+.43*Math.cos(3*t))*Math.cos(2*t),(1.35+.43*Math.cos(3*t))*Math.sin(2*t),.65*Math.sin(3*t)];}
 const normalize=v=>{const l=Math.hypot(...v);return v.map(x=>x/l);};
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 for(let i=0;i<=rings;i++){const t=i/rings*Math.PI*2,c=center(t),next=center(t+.001),tangent=normalize(next.map((x,k)=>x-c[k])),side=normalize(cross(tangent,[0,0,1])),up=cross(side,tangent);for(let j=0;j<=sides;j++){const a=j/sides*Math.PI*2,n=side.map((x,k)=>x*Math.cos(a)+up[k]*Math.sin(a));vertices.push(...c.map((x,k)=>x+n[k]*.23));normals.push(...n);if(i<rings&&j<sides){const p=i*(sides+1)+j;indices.push(p,p+sides+1,p+1,p+1,p+sides+1,p+sides+2);}}}
 function attribute(name,values){const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(values),gl.STATIC_DRAW);const id=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(id);gl.vertexAttribPointer(id,3,gl.FLOAT,false,0,0);}
 attribute('position',vertices);attribute('normal',normals);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
 const uniforms=Object.fromEntries(['angle','lean','aspect','dark'].map(n=>[n,gl.getUniformLocation(program,n)]));
 let raf=0,visible=false,angle=.28,last=0,target=[0,0],lean=[0,0],lost=false;
 function enabled(){return !document.body.classList.contains('motion-off');}
 function render(now=0){raf=0;if(lost)return;const elapsed=last?Math.min((now-last)/1000,.05):0;last=now;if(enabled()){angle+=elapsed*.11;lean=lean.map((v,i)=>v+(target[i]-v)*.07);}else{lean=[0,0];}
 gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform1f(uniforms.angle,angle);gl.uniform2fv(uniforms.lean,lean);gl.uniform1f(uniforms.aspect,canvas.width/canvas.height);gl.uniform1f(uniforms.dark,document.documentElement.dataset.theme==='dark'?1:0);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);
 if(visible&&enabled()&&!document.hidden)raf=requestAnimationFrame(render);
 }
 function update(){cancelAnimationFrame(raf);raf=0;last=0;if(!document.hidden)render();}
 new ResizeObserver(()=>{const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.max(1,Math.round(host.clientWidth*dpr));canvas.height=Math.max(1,Math.round(host.clientHeight*dpr));update();}).observe(host);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();},{rootMargin:'80px'}).observe(host);
 host.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||!enabled())return;const r=host.getBoundingClientRect();target=[(e.clientX-r.left)/r.width*.6-.3,(e.clientY-r.top)/r.height*.4-.2];});host.addEventListener('pointerleave',()=>{target=[0,0];});
 document.body.addEventListener('portfolio-motion',update);document.body.addEventListener('portfolio-theme',update);document.addEventListener('visibilitychange',update);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;cancelAnimationFrame(raf);host.classList.remove('webgl-ready');});
 // A reload can restore the context; the fallback stays useful until then.
 host.classList.add('webgl-ready');update();
})();
