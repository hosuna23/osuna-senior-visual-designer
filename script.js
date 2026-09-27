const menu=document.querySelector('.menu'), links=document.querySelector('.navlinks'); if(menu) menu.addEventListener('click',()=>links.classList.toggle('open'));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
document.querySelectorAll('[data-tilt]').forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*4}deg) rotateY(${x*4}deg) translateY(-5px)`});card.addEventListener('mouseleave',()=>card.style.transform='')});
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
