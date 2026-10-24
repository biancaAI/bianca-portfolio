(() => {
 'use strict';
 const life=document.querySelector('.cafe-life');if(!life)return;
 const experience=document.getElementById('cafeExperience');
 const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 // About keeps the room as its backdrop, so the room stays alive there too.
 const home=()=>['home','about'].includes(experience.dataset.view)&&!document.hidden;
 const W=1344,H=752,pct=(v,of)=>(v/of*100).toFixed(3)+'%';

 // Paper Bianca pops up all over the cafe, one pose every 2 seconds, at whatever size the spot needs.
 // box: crop in the 896×1200 source photo. x/floor: where the photo's centre line and floor line land
 // in the room (1344×752); k: room px per photo px. The *-front layers in the HTML hide what is behind;
 // over:true poses stand in front of everything and are drawn above those layers.
 const poses=[
  {n:1,box:[269,53,352,1123],x:872,floor:420,k:.21},  // barista behind the bar counter
  {n:2,box:[120,107,619,1048],x:575,floor:545,k:.33}, // behind the centre chair
  {n:5,box:[292,34,349,1142],x:360,floor:470,k:.3},   // behind the yellow sofa
  {n:4,box:[125,81,640,1097],x:880,floor:585,k:.15,over:true}, // on the table beside the menu, in front of everything
  {n:3,box:[120,54,645,1060],x:640,floor:515,k:.27},  // hopping a little further back, behind the chair
  {n:7,box:[38,117,819,1045],x:615,floor:284,k:.1,over:true}, // kicking up her heel on the counter
  {n:6,box:[101,91,621,1109],x:373,floor:369,k:.223}  // cut at the thigh, so only shown behind the sofa
 ];
 // Paper outline of each cutout file 1–7 (% of its own box), so only the figure itself is clickable.
 const outlines=[
  '51.4% 0.0%,40.4% 1.3%,32.3% 4.1%,29.4% 7.4%,30.9% 15.0%,14.9% 20.0%,12.8% 22.3%,5.0% 24.8%,0.4% 27.9%,0.0% 31.9%,4.3% 34.1%,13.1% 34.9%,20.6% 38.2%,13.5% 44.6%,5.7% 62.0%,7.1% 64.8%,14.5% 66.4%,19.5% 89.1%,24.5% 91.7%,17.4% 93.3%,15.6% 96.4%,24.8% 98.4%,57.4% 99.9%,72.7% 96.6%,73.8% 92.7%,80.5% 90.8%,81.6% 73.8%,87.2% 62.0%,86.2% 52.7%,79.1% 39.8%,91.8% 36.2%,99.6% 32.0%,98.6% 19.1%,93.6% 17.1%,86.2% 16.1%,78.0% 7.4%,80.9% 4.9%,77.3% 2.3%,72.0% 1.1%',
  '57.9% 0.0%,50.2% 1.1%,45.3% 4.3%,41.9% 10.3%,41.9% 13.8%,38.9% 17.9%,35.9% 19.3%,35.0% 23.0%,27.3% 18.8%,20.7% 19.8%,18.4% 18.4%,9.6% 18.0%,5.8% 19.0%,5.5% 22.7%,1.9% 23.4%,0.0% 25.0%,1.1% 27.1%,4.3% 28.6%,21.8% 30.7%,30.5% 37.7%,37.4% 40.9%,35.5% 47.2%,34.6% 63.9%,37.2% 66.1%,41.0% 90.3%,44.5% 92.7%,41.9% 93.9%,41.0% 97.3%,43.0% 99.1%,46.6% 99.9%,54.7% 99.4%,64.5% 96.3%,62.0% 78.4%,77.6% 83.1%,84.2% 82.3%,86.8% 86.0%,91.0% 87.3%,97.0% 85.6%,99.8% 81.2%,98.1% 71.9%,95.1% 68.8%,91.0% 68.0%,83.8% 68.6%,72.9% 66.1%,74.2% 64.8%,73.9% 50.6%,68.8% 39.2%,76.5% 40.1%,83.1% 37.2%,85.5% 25.1%,93.8% 20.1%,93.0% 16.2%,90.2% 13.8%,83.5% 12.8%,79.1% 15.1%,75.2% 15.1%,73.5% 17.8%,72.2% 17.8%,69.4% 10.4%,71.8% 8.7%,71.2% 4.9%,63.3% 0.9%',
  '95.3% 0.0%,91.1% 0.3%,87.6% 2.1%,82.1% 8.6%,69.5% 16.9%,68.6% 13.9%,63.3% 10.0%,54.7% 9.1%,47.8% 10.8%,41.4% 14.7%,40.7% 18.4%,33.9% 23.1%,28.8% 22.6%,28.5% 14.3%,34.3% 13.3%,38.7% 11.3%,39.4% 9.7%,37.0% 7.1%,29.4% 5.1%,13.0% 4.1%,5.1% 4.7%,0.0% 7.4%,0.5% 9.7%,4.2% 11.8%,15.5% 13.8%,17.9% 15.2%,17.0% 27.7%,18.1% 29.1%,28.6% 32.7%,30.1% 34.0%,35.6% 34.8%,35.8% 41.0%,34.3% 42.7%,30.5% 62.8%,30.5% 72.8%,45.1% 87.8%,50.2% 90.9%,47.4% 96.9%,51.3% 99.9%,56.9% 99.2%,61.1% 96.9%,70.6% 85.4%,72.6% 87.2%,73.2% 91.3%,77.0% 93.4%,82.5% 92.7%,87.0% 87.7%,87.0% 77.0%,83.6% 75.6%,77.0% 75.2%,63.1% 69.7%,63.7% 68.4%,67.3% 67.6%,67.9% 64.2%,67.3% 53.7%,61.9% 42.2%,66.1% 39.2%,70.4% 38.1%,71.0% 35.8%,75.2% 33.1%,73.9% 29.6%,81.2% 23.1%,83.2% 19.1%,93.4% 10.1%,98.9% 7.8%,99.8% 4.3%',
  '60.6% 0.0%,53.3% 0.8%,47.2% 3.6%,43.2% 11.7%,44.0% 14.3%,40.0% 17.4%,35.6% 17.0%,33.7% 14.7%,27.2% 13.0%,21.5% 15.2%,18.3% 13.9%,7.8% 13.9%,3.0% 15.7%,0.0% 19.0%,1.5% 21.4%,5.5% 23.0%,22.5% 25.0%,26.5% 33.8%,30.1% 37.8%,33.5% 39.6%,37.3% 39.6%,33.5% 47.9%,27.8% 73.9%,22.3% 87.1%,19.6% 88.6%,11.6% 88.6%,8.6% 90.8%,8.6% 92.6%,18.9% 96.4%,29.7% 97.9%,35.2% 97.6%,37.3% 92.9%,42.3% 92.7%,44.4% 91.4%,50.7% 76.2%,51.0% 82.7%,49.1% 89.9%,44.0% 94.9%,43.2% 97.3%,45.5% 99.1%,50.7% 99.9%,57.9% 99.7%,63.8% 97.3%,65.7% 93.3%,70.7% 90.8%,71.6% 72.7%,72.8% 68.8%,76.0% 67.1%,75.0% 52.7%,69.7% 39.2%,77.1% 33.4%,93.7% 32.6%,98.7% 30.3%,99.8% 28.7%,96.8% 24.0%,85.3% 17.6%,79.8% 12.2%,73.3% 9.8%,74.3% 6.6%,73.0% 3.7%',
  '54.9% 0.0%,39.3% 1.0%,29.1% 4.2%,26.2% 7.0%,26.2% 14.9%,23.3% 16.2%,8.0% 13.8%,1.1% 15.3%,3.3% 17.7%,0.0% 30.4%,1.8% 35.4%,7.3% 38.0%,17.8% 39.0%,9.5% 48.2%,5.1% 65.3%,9.5% 73.3%,31.6% 86.2%,30.9% 91.1%,20.0% 94.2%,17.1% 97.3%,22.9% 99.2%,34.9% 99.9%,45.5% 99.7%,59.3% 97.8%,65.5% 99.3%,75.6% 98.8%,87.6% 94.6%,97.5% 85.9%,93.5% 82.4%,79.6% 80.7%,82.9% 67.8%,89.8% 65.6%,88.4% 57.3%,99.6% 51.0%,98.9% 45.6%,92.7% 41.1%,98.9% 33.1%,98.5% 27.6%,94.2% 21.2%,81.5% 17.2%,76.0% 8.3%,78.9% 6.6%,77.1% 3.7%,71.3% 1.8%',
  '24.4% 0.2%,16.5% 2.0%,8.9% 5.6%,4.4% 9.4%,0.0% 15.9%,1.0% 24.7%,4.4% 27.8%,9.5% 29.2%,9.3% 38.0%,12.7% 45.2%,17.1% 47.7%,10.1% 56.2%,4.4% 75.2%,4.4% 81.4%,9.7% 84.0%,10.9% 99.9%,65.1% 99.9%,62.5% 92.1%,65.3% 73.2%,63.7% 56.8%,73.8% 54.2%,80.0% 49.6%,84.9% 51.7%,88.9% 51.9%,94.6% 49.8%,94.4% 46.3%,96.0% 44.4%,94.6% 39.2%,97.6% 30.8%,94.2% 22.2%,94.2% 16.7%,98.6% 15.1%,99.8% 9.8%,88.5% 2.2%,81.7% 0.4%,71.2% 0.6%,66.7% 1.7%,57.3% 7.6%,45.8% 1.7%,37.1% 0.0%',
  '31.1% 0.0%,26.4% 2.6%,24.1% 6.2%,26.2% 20.8%,27.8% 23.5%,30.2% 24.5%,35.0% 29.6%,35.5% 32.7%,46.9% 39.2%,47.2% 44.6%,30.0% 55.9%,17.0% 62.8%,11.7% 62.1%,5.9% 57.3%,1.9% 57.6%,0.0% 59.6%,0.6% 64.4%,7.3% 75.6%,11.1% 77.4%,21.7% 72.3%,26.1% 75.9%,28.6% 76.1%,46.4% 66.0%,50.0% 89.0%,53.9% 91.3%,47.8% 93.6%,47.2% 97.7%,50.5% 99.6%,53.0% 99.9%,68.3% 98.2%,70.3% 96.6%,70.5% 93.3%,64.4% 69.0%,66.4% 54.7%,70.9% 51.9%,74.1% 47.0%,74.7% 40.9%,73.4% 37.2%,82.2% 37.6%,90.2% 34.9%,97.0% 29.7%,99.8% 23.1%,97.7% 21.3%,97.3% 18.1%,94.4% 13.0%,90.5% 9.5%,85.3% 7.2%,80.9% 6.4%,73.0% 7.0%,67.3% 9.4%,63.6% 12.7%,56.1% 9.2%,48.6% 9.9%,44.2% 5.6%,44.2% 3.4%,41.4% 0.7%'
 ];
 const [stage,over]=life.querySelectorAll('.bianca-stage'),hit=document.querySelector('.bianca-hit-area');
 const boxes=poses.map(({box:[x,y,w,h],...p})=>({left:pct(p.x+(x-448)*p.k,W),top:pct(p.floor-(1180-y)*p.k,H),width:pct(w*p.k,W),height:pct(h*p.k,H)}));
 const imgs=boxes.map((box,i)=>{
  const img=new Image();img.className='bianca-pose';img.alt='';img.decoding='async';img.src=`assets/bianca/bianca-${poses[i].n}.webp`;
  Object.assign(img.style,box);(poses[i].over?over:stage).append(img);return img;
 });
 let current=0;
 function show(i){imgs[current].classList.remove('is-on');current=i;void imgs[i].offsetWidth;imgs[i].classList.add('is-on');Object.assign(hit.style,boxes[i]);hit.style.clipPath=`polygon(${outlines[poses[i].n-1]})`;}
 show(0);
 setInterval(()=>{if(home()&&!life.classList.contains('is-hover'))show((current+1)%imgs.length);},2000);
 for(const [on,off] of [['pointerenter','pointerleave'],['focus','blur']]){hit.addEventListener(on,()=>life.classList.add('is-hover'));hit.addEventListener(off,()=>life.classList.remove('is-hover'));}

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
