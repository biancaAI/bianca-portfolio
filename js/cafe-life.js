(() => {
 'use strict';
 const life=document.querySelector('.cafe-life');if(!life)return;
 const experience=document.getElementById('cafeExperience');
 const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const home=()=>experience.dataset.view==='home'&&!document.hidden;
 const W=1344,H=752,pct=(v,of)=>(v/of*100).toFixed(3)+'%';

 // Paper Bianca. Crop boxes are in the 896×1200 source photos; all full-body shots share one scale,
 // standing just behind the centre chair, which hides her from the hips down.
 const stand={x:575,floor:545,k:.33,cx:448,feet:1180};
 const poses=[
  {box:[269,53,352,1123]},{box:[120,107,619,1048]},{box:[120,54,645,1060]},{box:[125,81,640,1097]},
  {box:[292,34,349,1142]},
  // This photo is cut at the thigh, so she leans in a little closer.
  {box:[101,91,621,1109],place:{left:505,top:150,k:.275}},
  {box:[38,117,819,1045]}
 ];
 const stage=life.querySelector('.bianca-stage');
 const imgs=poses.map((p,i)=>{
  const [x,y,w,h]=p.box,img=new Image(),k=p.place?.k??stand.k;
  const left=p.place?p.place.left:stand.x+(x-stand.cx)*k,top=p.place?p.place.top:stand.floor-(stand.feet-y)*k;
  img.className='bianca-pose';img.alt='';img.decoding='async';img.src=`assets/bianca/bianca-${i+1}.webp`;
  Object.assign(img.style,{left:pct(left,W),top:pct(top,H),width:pct(w*k,W),height:pct(h*k,H)});
  stage.append(img);return img;
 });
 let current=0;imgs[0].classList.add('is-on');
 setInterval(()=>{if(!home())return;imgs[current].classList.remove('is-on');current=(current+1)%imgs.length;void imgs[current].offsetWidth;imgs[current].classList.add('is-on');},2000);

 // Dust drifting through the sunbeams.
 const canvas=life.querySelector('.life-dust'),ctx=canvas.getContext('2d');
 const motes=Array.from({length:46},()=>({x:Math.random(),y:Math.random(),r:.5+Math.random()*1.6,v:.15+Math.random()*.5,p:Math.random()*6.28}));
 const inBeam=(x,y)=>{const t=y*.95+.12;return x>.55-t*.38&&x<.98-t*.32;};
 function size(){const r=life.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);}
 new ResizeObserver(size).observe(life);size();
 let last=0;
 function draw(t){
  requestAnimationFrame(draw);
  if(!home()||reduce()||t-last<33)return;
  const dt=Math.min(t-last,100)/1000;last=t;
  const w=canvas.width,h=canvas.height,s=w/1000;ctx.clearRect(0,0,w,h);
  for(const m of motes){
   m.p+=dt*.6;m.y-=dt*m.v*.03;m.x+=dt*(Math.sin(m.p)*.006-.004);
   if(m.y<-.02||m.x<.2){m.y=1.02;m.x=.45+Math.random()*.55;}
   if(!inBeam(m.x,m.y))continue;
   const a=.25+.35*Math.sin(m.p*1.7)**2;
   ctx.beginPath();ctx.fillStyle=`rgba(255,244,214,${a})`;ctx.arc(m.x*w,m.y*h,m.r*s,0,6.283);ctx.fill();
  }
 }
 requestAnimationFrame(draw);
})();
