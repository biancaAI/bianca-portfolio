(() => {
 'use strict';
 const $=s=>document.querySelector(s),experience=$('#cafeExperience'),world=$('#cafeWorld'),detail=$('#cafeDetail'),sheet=$('#cafeSheet');
 const scenes={
  works:{image:'002テレビ.png',title:'My Works',kicker:'THE LITTLE SCREEN, ENDLESS WORLDS.',description:'映像も、音楽も、イラストも。気になる世界をひとつ、どうぞ。',sections:[],point:[.082,.305],scale:5.2},
  contact:{image:'004電話.png',title:'Contact',kicker:'GOOD THINGS START WITH A HELLO.',description:'こんな世界をつくりたい。そんなお話を、聞かせてください。',sections:['contact'],point:[.055,.12],scale:6.2},
  about:{image:'001全体図.png',stay:true,title:'About me',kicker:'MEET YOUR CAFÉ HOST.',description:'可愛くて、楽しくて、元気が出る。Biancaのものづくりをご紹介。',sections:['about'],point:[.603,.435],scale:5.7},
  awards:{image:'005トロフィー.png',title:'Awards',kicker:'LITTLE MILESTONES, BIG GRATITUDE.',description:'ひとつひとつの挑戦と、いただいた大切な賞をこちらに。',sections:['awards'],point:[.122,.475],scale:5.4},
  menu:{image:'006メニュー.png',title:'Creative Menu',kicker:'WHAT SHALL WE CREATE TODAY?',description:'映像制作からビジュアルまで。ご注文は、どんな世界？',sections:['guide'],point:[.505,.83],scale:2.6}
 };
 let view='home',busy=false,geometry={},lastSpot=null,sequence=0;
 const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 function fit(){const w=document.documentElement.clientWidth,h=innerHeight,mobile=w<760;const areaH=mobile?h*.39:h;const areaY=mobile?Math.max(85,h*.17):0;const scale=Math.min(w/1344,areaH/752);const iw=1344*scale,ih=752*scale;geometry={x:(w-iw)/2,y:areaY+(areaH-ih)/2,w:iw,h:ih};for(const el of [$('.cafe-background'),$('.cafe-life'),$('.cafe-hotspots'),$('.bianca-hit')])Object.assign(el.style,{left:geometry.x+'px',top:geometry.y+'px',width:iw+'px',height:ih+'px'});if(view!=='home')world.style.transform=zoom(scenes[view]);}
 function zoom(scene){if(scene.stay)return 'none';const x=geometry.x+geometry.w*scene.point[0],y=geometry.y+geometry.h*scene.point[1],s=scene.scale;return `translate(${innerWidth/2-x*s}px,${innerHeight/2-y*s}px) scale(${s})`;}
 const frames=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 const wait=ms=>new Promise(r=>setTimeout(r,reduce()?0:ms));
 async function enter(key,historyAction=true){if(busy||key===view)return;const scene=scenes[key];if(!scene)return;busy=true;const token=++sequence;experience.setAttribute('aria-busy','true');$('#cafeStatus').textContent='移動先の背景を読み込んでいます';
  try{const img=new Image();img.src='画像/'+scene.image;await img.decode();}catch{busy=false;experience.removeAttribute('aria-busy');$('#cafeStatus').textContent='背景を読み込めませんでした。もう一度クリックしてください。';return;}
  if(token!==sequence)return;
  closeSheet();window.CafeTV?.hide();experience.dataset.travel='true';
  if(view!=='home')await overview();
  view=key;experience.dataset.view=key;if(key==='works')window.CafeTV?.fit();$('#cafeBack').hidden=false;world.style.transform=zoom(scene);detail.classList.remove('visible');detail.style.backgroundImage=`url("画像/${scene.image}")`;await wait(430);if(!scene.stay)detail.classList.add('visible');await wait(720);
  $('#cafeStatus').textContent=scene.title+'のお部屋です';setCurrent(key);if(historyAction)history.pushState(null,'','#'+key);busy=false;experience.removeAttribute('aria-busy');delete experience.dataset.travel;openSheet();
 }
 async function overview(){detail.classList.remove('visible');world.style.transform='none';await wait(650);view='home';experience.dataset.view='home';$('#cafeBack').hidden=true;setCurrent('home');await wait(550);}
 async function home(historyAction=true){if(busy)return;if(view==='home'){closeSheet();return;}busy=true;experience.setAttribute('aria-busy','true');experience.dataset.travel='true';closeSheet();window.CafeTV?.hide();await overview();if(historyAction)history.pushState(null,'','#home');busy=false;experience.removeAttribute('aria-busy');delete experience.dataset.travel;$('#cafeStatus').textContent='カフェの全体図に戻りました';(lastSpot||$('.cafe-hotspot')).focus({preventScroll:true});}
 function setCurrent(key){document.querySelectorAll('[data-go]').forEach(b=>{if(b.dataset.go===key)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});}
 const homes=new Map();document.querySelectorAll('body>main>.room').forEach(section=>homes.set(section.id,{parent:section.parentNode,next:section.nextSibling}));
 function closeSheet(){if(sheet.hidden)return;sheet.hidden=true;for(const section of [...$('#sheetBody').children]){const loc=homes.get(section.id);if(loc.next?.parentNode===loc.parent)loc.parent.insertBefore(section,loc.next);else loc.parent.append(section);}}
 function openSheet(){const scene=scenes[view];if(!scene||busy)return;sheet.dataset.scene=view;if(view==='works'){window.CafeTV?.show();return;}$('#sheetTitle').textContent=scene.title;for(const id of scene.sections)$('#sheetBody').append(document.getElementById(id));sheet.hidden=false;sheet.scrollTop=0;$('#sheetTitle').focus({preventScroll:true});dispatchEvent(new Event('resize'));}
 document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>{lastSpot=b;enter(b.dataset.scene);}));
 document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>b.dataset.go==='home'?home():enter(b.dataset.go)));
 $('#cafeBack').addEventListener('click',()=>home());$('.cafe-wordmark').addEventListener('click',e=>{e.preventDefault();home();});
 sheet.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.hash.slice(1),key=Object.keys(scenes).find(k=>scenes[k].sections.includes(id));if(key){e.preventDefault();if(key===view)document.getElementById(id).scrollIntoView({behavior:reduce()?'instant':'smooth'});else{closeSheet(false);enter(key);}}});
 document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]'))return;if(e.key==='Escape'){e.preventDefault();home();}});
 addEventListener('popstate',()=>{const key=location.hash.slice(1);if(busy){history.replaceState(null,'','#'+view);return;}key==='home'||!scenes[key]?home(false):enter(key,false);});addEventListener('resize',fit);fit();
 const awards=[...document.querySelectorAll('#awards .award-item')].slice(0,3);const news=$('#cafeNewsItems');awards.forEach(item=>{const a=document.createElement('a');a.className='news-item';a.href='#awards';const time=document.createElement('time');time.textContent=item.querySelector('.award-date')?.textContent||'AWARDS';const title=document.createElement('h2');title.textContent=item.querySelector('h3')?.textContent||'Awards';const p=document.createElement('p');p.textContent=item.querySelector('p')?.textContent||'';a.append(time,title,p);a.addEventListener('click',e=>{e.preventDefault();enter('awards');});news.append(a);});
 const key=location.hash.slice(1);if(scenes[key])enter(key,false);
 // Decode destination backgrounds only after the room is first painted.
 setTimeout(()=>{Object.values(scenes).forEach(s=>{const img=new Image();img.src='画像/'+s.image;});},1600);
})();
