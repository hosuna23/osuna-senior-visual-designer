(function(){
 const dialog=document.querySelector('.ux-lightbox');
 let trigger=null;
 function expand(button){const source=button.querySelector('img');if(!dialog||!source)return;trigger=button;dialog.querySelector('img').src=source.src;dialog.querySelector('img').alt=source.alt;dialog.querySelector('.ux-lightbox-bar span').textContent=source.alt||'Project image';dialog.showModal();}
 document.querySelectorAll('.ux-image-expand').forEach(button=>button.addEventListener('click',()=>expand(button)));
 if(dialog){dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>{if(trigger)trigger.focus()})}
 document.querySelectorAll('[data-gallery]').forEach(gallery=>{
  const items=JSON.parse(gallery.querySelector('.ux-gallery-data').textContent);let index=0;const image=gallery.querySelector('img');
  function show(n){index=(n+items.length)%items.length;image.src=items[index].src;image.alt=items[index].alt;gallery.querySelector('[data-count]').textContent=(index+1)+' / '+items.length;}
  gallery.querySelector('[data-prev]').addEventListener('click',()=>show(index-1));gallery.querySelector('[data-next]').addEventListener('click',()=>show(index+1));gallery.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(index+(event.key==='ArrowRight'?1:-1))}});show(0);
 });
 const tabs=[...document.querySelectorAll('.ux-prototype-tabs [role="tab"]')];
 function select(tab){tabs.forEach(item=>{const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!active})}
 tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>select(tab));tab.addEventListener('keydown',event=>{let i;if(event.key==='ArrowRight')i=(index+1)%tabs.length;else if(event.key==='ArrowLeft')i=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')i=0;else if(event.key==='End')i=tabs.length-1;else return;event.preventDefault();select(tabs[i]);tabs[i].focus()})});
 const links=[...document.querySelectorAll('.ux-jump a')];if(links.length){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')})}})},{rootMargin:'-180px 0px -50% 0px'});document.querySelectorAll('.ux-row').forEach(row=>observer.observe(row))}
})();
