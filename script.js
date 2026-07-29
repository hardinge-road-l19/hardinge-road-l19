
const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];

const navToggle = $('.mobile-toggle');
const navLinks = $('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// Lightbox
const galleryItems = $$('.gallery-item');
const lightbox = $('.lightbox');
const lightboxImg = $('.lightbox img');
const lightboxCaption = $('.lightbox-caption');
let currentIndex = 0;
function openLightbox(index){
  if(!lightbox) return;
  currentIndex = index;
  const btn = galleryItems[currentIndex];
  lightboxImg.src = btn.dataset.full;
  lightboxImg.alt = btn.dataset.alt;
  lightboxCaption.textContent = btn.dataset.alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  $('.lightbox-close').focus();
}
function closeLightbox(){
  if(!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function moveLightbox(delta){
  currentIndex = (currentIndex + delta + galleryItems.length) % galleryItems.length;
  openLightbox(currentIndex);
}
galleryItems.forEach((btn,i)=>btn.addEventListener('click',()=>openLightbox(i)));
$('.lightbox-close')?.addEventListener('click',closeLightbox);
$('.lightbox-prev')?.addEventListener('click',()=>moveLightbox(-1));
$('.lightbox-next')?.addEventListener('click',()=>moveLightbox(1));
lightbox?.addEventListener('click',e=>{if(e.target===lightbox) closeLightbox();});
document.addEventListener('keydown',e=>{
  if(!lightbox?.classList.contains('open')) return;
  if(e.key==='Escape') closeLightbox();
  if(e.key==='ArrowLeft') moveLightbox(-1);
  if(e.key==='ArrowRight') moveLightbox(1);
});

// Lazy map
const mapButton = $('#load-map');
if(mapButton){
  mapButton.addEventListener('click',()=>{
    const shell = $('.map-shell');
    const iframe = document.createElement('iframe');
    iframe.title = 'Map showing Hardinge Road, Liverpool L19 and the surrounding area';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.src = shell.dataset.map;
    shell.innerHTML = '';
    shell.appendChild(iframe);
  });
}

// Share
const shareButton = $('#share-property');
shareButton?.addEventListener('click', async ()=>{
  const data = {
    title:'3 Bedroom Semi-Detached House for Sale in Liverpool L19',
    text:'View this three-bedroom freehold family home on Hardinge Road, Liverpool L19 — offers over £265,000.',
    url:location.href
  };
  try{
    if(navigator.share) await navigator.share(data);
    else {
      await navigator.clipboard.writeText(location.href);
      shareButton.textContent='Link copied';
      setTimeout(()=>shareButton.textContent='Share this home',1800);
    }
  }catch(e){}
});

// Copy link
$('#copy-link')?.addEventListener('click', async (e)=>{
  try{
    await navigator.clipboard.writeText(location.href);
    e.currentTarget.textContent='Copied';
    setTimeout(()=>e.currentTarget.textContent='Copy link',1800);
  }catch(e){}
});

// Basic analytics events. GA4 loads only after the placeholder is replaced.
$$('[data-event]').forEach(el=>el.addEventListener('click',()=>{
  if(typeof window.gtag==='function'){
    window.gtag('event',el.dataset.event,{
      event_category:'property_conversion',
      event_label:el.dataset.label || el.textContent.trim()
    });
  }
}));


// Video analytics: send only the first play event per video.
$$('video[data-event]').forEach(video => {
  let sent = false;
  video.addEventListener('play', () => {
    if (sent) return;
    sent = true;
    if (typeof window.gtag === 'function') {
      window.gtag('event', video.dataset.event, {event_category:'property_conversion', event_label:'Hardinge Road road view'});
    }
  });
});
