(function(){
  var b=document.querySelector('.burger'),panel=document.getElementById('panel');
  function zamknij(){b.setAttribute('aria-expanded','false');panel.classList.remove('otw');document.body.style.overflow=''}
  b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true';if(o){zamknij()}else{b.setAttribute('aria-expanded','true');panel.classList.add('otw');document.body.style.overflow='hidden'}});
  panel.querySelectorAll('a').forEach(function(a){a.addEventListener('click',zamknij)});

  // pasek dolny po przewinieciu za przycisk w hero
  var mob=document.getElementById('mob'),cta=document.getElementById('cta-hero');
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(e){mob.classList.toggle('widac',!e[0].isIntersecting&&e[0].boundingClientRect.top<0)}).observe(cta);
  }

  // aktywna pozycja menu
  var linki=document.querySelectorAll('.menu a'),sek=['o-domu','mieszkania','opieka','codziennosc','cennik','kontakt'].map(function(i){return document.getElementById(i)});
  function akt(){var y=window.scrollY+window.innerHeight*.35,id='';sek.forEach(function(s){if(s.offsetTop<=y)id=s.id});linki.forEach(function(a){a.classList.toggle('on',id?a.getAttribute('href')==='#'+id:a.getAttribute('href')==='#')})}
  window.addEventListener('scroll',akt,{passive:true});akt();

  // pasy zdjec: przeciaganie mysza + strzalki
  document.querySelectorAll('.pas').forEach(function(p){
    var start=0,sl=0,ciag=false,ruch=0;
    p.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;ciag=true;ruch=0;start=e.clientX;sl=p.scrollLeft;p.classList.add('ciag')});
    window.addEventListener('pointermove',function(e){if(!ciag)return;var d=e.clientX-start;ruch=Math.max(ruch,Math.abs(d));p.scrollLeft=sl-d});
    window.addEventListener('pointerup',function(){if(!ciag)return;ciag=false;p.classList.remove('ciag');var f=p.querySelector('figure');if(f){var w=f.offsetWidth+parseFloat(getComputedStyle(p).columnGap||22);p.scrollTo({left:Math.round(p.scrollLeft/w)*w,behavior:'smooth'})}});
    p.addEventListener('click',function(e){if(ruch>6){e.stopPropagation();e.preventDefault();ruch=0}},true);
    p.addEventListener('dragstart',function(e){e.preventDefault()});
  });
  document.querySelectorAll('.strz').forEach(function(s){s.addEventListener('click',function(){var p=document.getElementById(s.dataset.pas),f=p.querySelector('figure');p.scrollBy({left:(f.offsetWidth+22)*(+s.dataset.k),behavior:'smooth'})})});

  // lightbox
  var lb=document.getElementById('lb'),lbi=lb.querySelector('img'),lbp=lb.querySelector('p'),lista=[],nr=0,ostatni=null;
  function pokaz(){var im=lista[nr];lbi.src=im.dataset.full;lbi.alt=im.alt;lbp.textContent=im.alt+'  ('+(nr+1)+' / '+lista.length+')'}
  document.querySelectorAll('img[data-full]').forEach(function(im){im.addEventListener('click',function(){lista=[].slice.call(document.querySelectorAll('img[data-g="'+im.dataset.g+'"]'));nr=lista.indexOf(im);ostatni=im;pokaz();lb.classList.add('otw');document.body.style.overflow='hidden';lb.querySelector('.zamk').focus()})});
  function zamk(){lb.classList.remove('otw');document.body.style.overflow='';lbi.removeAttribute('src');if(ostatni)ostatni.focus&&ostatni.focus()}
  function kr(k){nr=(nr+k+lista.length)%lista.length;pokaz()}
  lb.querySelector('.zamk').addEventListener('click',zamk);
  lb.querySelector('.pop').addEventListener('click',function(){kr(-1)});
  lb.querySelector('.nast').addEventListener('click',function(){kr(1)});
  lb.addEventListener('click',function(e){if(e.target===lb)zamk()});
  document.addEventListener('keydown',function(e){if(!lb.classList.contains('otw'))return;if(e.key==='Escape')zamk();if(e.key==='ArrowLeft')kr(-1);if(e.key==='ArrowRight')kr(1)});
  var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)kr(d<0?1:-1)});

  // formularz pokazowy
  document.getElementById('form').addEventListener('submit',function(e){e.preventDefault();document.getElementById('info-form').style.display='block'});

  // mapa po przewinieciu
  var m=document.getElementById('mapa');
  function wstaw(){if(m.dataset.ok)return;m.dataset.ok=1;var f=document.createElement('iframe');f.src=m.dataset.src;f.title='Mapa dojazdu do domu Dla Seniorów';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';m.appendChild(f)}
  if('IntersectionObserver' in window){new IntersectionObserver(function(e,o){if(e[0].isIntersecting){wstaw();o.disconnect()}},{rootMargin:'300px'}).observe(m)}else wstaw();
})();
