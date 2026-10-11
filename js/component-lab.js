(() => {
const preview=document.getElementById('lab-preview');
const controls=['accent','radius','space','viewport','state'].map(id=>document.getElementById(id));
const action=document.getElementById('lab-action'), status=document.getElementById('lab-status');
function update(){
 const [accent,radius,space,viewport,state]=controls.map(c=>c.value);
 preview.style.setProperty('--accent',accent);preview.style.setProperty('--radius',radius);preview.style.setProperty('--space',space);preview.style.maxWidth=viewport;
 action.disabled=state!=='default';action.setAttribute('aria-busy',String(state==='loading'));action.textContent=state==='loading'?'Loading…':state==='disabled'?'Continue unavailable':'Continue →';status.textContent='';
 document.getElementById('tokens').textContent=`:root {\n  --accent: ${accent};\n  --radius: ${radius};\n  --space: ${space};\n}`;
}
controls.forEach(c=>c.addEventListener('change',update));
document.getElementById('reset').addEventListener('click',()=>{controls.forEach(c=>c.selectedIndex=0);update();});
action.addEventListener('click',()=>{const email=document.getElementById('lab-email');if(!email.value||!email.checkValidity()){status.textContent='Enter a valid email address to try this demo.';email.focus();return;}status.textContent='Demo complete. No information was submitted or saved.';});
document.getElementById('copy').addEventListener('click',async()=>{const label=document.getElementById('copy-status');try{await navigator.clipboard.writeText(document.getElementById('tokens').textContent);label.textContent='CSS tokens copied.';}catch{label.textContent='Select the token text above to copy it manually.';document.getElementById('tokens').focus();}});
update();
})();
