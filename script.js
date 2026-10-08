const menu=document.querySelector('.menu'), links=document.querySelector('.navlinks'); if(menu&&links){menu.setAttribute('aria-expanded','false');links.id='primary-navigation';menu.setAttribute('aria-controls',links.id);menu.addEventListener('click',()=>{const open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});links.addEventListener('click',e=>{if(e.target.closest('a')){links.classList.remove('open');menu.setAttribute('aria-expanded','false')}});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&links.classList.contains('open')){links.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus()}});} 

const year=document.querySelector('[data-year]');if(year)year.textContent=new Date().getFullYear();


document.querySelectorAll('.deck-viewer').forEach(viewer=>{
  const manifestEl=viewer.querySelector('.deck-manifest');
  let slides=[];
  try{slides=JSON.parse(manifestEl.textContent)}catch(e){return}
  if(!slides.length)return;
  const dir=viewer.dataset.deckDir||'';
  const wrap=viewer.querySelector('.deck-slide-wrap');
  const caption=viewer.querySelector('.deck-caption');
  const strip=viewer.querySelector('.deck-strip');
  const curEl=viewer.querySelector('.deck-cur');
  const totalEl=viewer.querySelector('.deck-total');
  const prevBtn=viewer.querySelector('.deck-btn.prev');
  const nextBtn=viewer.querySelector('.deck-btn.next');
  let i=0;

  slides.forEach(([file,alt],idx)=>{
    const img=document.createElement('img');
    img.src=dir+file; img.alt=alt; img.loading=idx===0?'eager':'lazy';
    wrap.appendChild(img);
    const dot=document.createElement('button');
    dot.className='deck-dot'; dot.type='button'; dot.setAttribute('role','tab');
    dot.setAttribute('aria-label','Go to slide '+(idx+1));
    const dImg=document.createElement('img'); dImg.src=dir+file; dImg.alt='';
    dot.appendChild(dImg);
    dot.addEventListener('click',()=>go(idx));
    strip.appendChild(dot);
  });
  if(totalEl)totalEl.textContent=slides.length;

  function go(n){
    i=Math.max(0,Math.min(slides.length-1,n));
    wrap.querySelectorAll('img').forEach((im,idx)=>im.classList.toggle('on',idx===i));
    strip.querySelectorAll('.deck-dot').forEach((d,idx)=>d.classList.toggle('on',idx===i));
    if(curEl)curEl.textContent=i+1;
    caption.textContent=slides[i][1];
    if(prevBtn)prevBtn.disabled=i===0;
    if(nextBtn)nextBtn.disabled=i===slides.length-1;
    const activeDot=strip.querySelectorAll('.deck-dot')[i];
    if(activeDot&&activeDot.scrollIntoView)activeDot.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});
  }
  if(prevBtn)prevBtn.addEventListener('click',()=>go(i-1));
  if(nextBtn)nextBtn.addEventListener('click',()=>go(i+1));
  viewer.tabIndex=0;
  viewer.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft')go(i-1);
    if(e.key==='ArrowRight')go(i+1);
  });
  go(0);
});


// Short, progressive motion: visible content is always the default.
(function(){
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(preference.matches||!Element.prototype.animate)return;
  const easing='cubic-bezier(.22,1,.36,1)';
  const running=new Set();
  function play(el,frames,options){
    const animation=el.animate(frames,{easing,fill:'backwards',...options});
    running.add(animation);
    animation.finished.then(()=>running.delete(animation)).catch(()=>running.delete(animation));
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      observer.unobserve(entry.target);
      if(preference.matches)return;
      const el=entry.target;
      play(el,[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:480});
    });
  },{threshold:0.08});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  preference.addEventListener('change',event=>{if(event.matches){observer.disconnect();running.forEach(animation=>animation.cancel());running.clear();}});
})();
