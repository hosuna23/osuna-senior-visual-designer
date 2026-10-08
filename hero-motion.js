// Homepage-only kinetic typography; no overlay, loop or scroll hijacking.
(function(){
  const hero=document.querySelector('.home-page .hero');
  const title=hero&&hero.querySelector('h1');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  if(!title||reduced.matches||!Element.prototype.animate)return;
  const active=new Set();
  const easing='cubic-bezier(.22,1,.36,1)';
  function animate(el,frames,options){
    const a=el.animate(frames,{easing,fill:'backwards',...options});active.add(a);
    a.finished.then(()=>active.delete(a)).catch(()=>active.delete(a));return a;
  }
  const originalText=title.textContent;
  title.setAttribute('aria-label',originalText);
  const walker=document.createTreeWalker(title,NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  let count=0;const words=[];
  nodes.forEach(node=>{
    const fragment=document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach(text=>{
      if(!text)return;
      if(/^\s+$/.test(text)){fragment.append(document.createTextNode(text));return;}
      const word=document.createElement('span');word.className='hero-word';word.setAttribute('aria-hidden','true');
      const letters=[];
      Array.from(text).forEach(char=>{
        const letter=document.createElement('span');letter.className='hero-letter';letter.textContent=char;word.append(letter);letters.push(letter);
        animate(letter,[{transform:'translateY(110%) rotate(7deg)',opacity:0},{transform:'translateY(0) rotate(0)',opacity:1}],{duration:650,delay:Math.min(count++*9,420)});
      });
      words.push({word,letters});fragment.append(word);
    });
    node.replaceWith(fragment);
  });
  hero.classList.add('kinetic-hero');
  hero.querySelectorAll('.eyebrow,.lead,.actions,.visual').forEach((el,i)=>animate(el,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,delay:160+i*90}));
  const hover=matchMedia('(hover: hover) and (pointer: fine)');
  let ready=false;
  Promise.allSettled(Array.from(active,a=>a.finished)).then(()=>{ready=true});
  words.forEach(({word,letters})=>{
    let last=0;
    word.addEventListener('pointerenter',()=>{
      const now=performance.now();if(!ready||reduced.matches||!hover.matches||now-last<800)return;last=now;
      letters.forEach((letter,i)=>animate(letter,[{transform:'translateY(0)'},{transform:'translateY(-.075em)',offset:.4},{transform:'translateY(0)'}],{duration:320,delay:i*14}));
    });
  });
  reduced.addEventListener('change',event=>{if(event.matches){active.forEach(a=>a.cancel());active.clear()}});
})();
