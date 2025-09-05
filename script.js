// script.js - behavior for form and small interactions (kept)
document.addEventListener('DOMContentLoaded', function () {
  // Simple form demo behavior (no redirect)
  const form = document.getElementById('contributeForm');
  const msg = document.getElementById('formMsg');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name') || 'Anon';
    msg.textContent = 'Terima kasih, ' + name + '! Kiriman Anda telah dicatat (demo).';
    form.reset();
    setTimeout(()=> msg.textContent = '', 6000);
  });

  // Intersection animations for simple fade-ups
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
      }
    });
  }, {threshold: 0.12});
  document.querySelectorAll('.section, .card, .grid-photos figure, .event, .element').forEach(el => observer.observe(el));
});



// Contribution: Add images to gallery locally and save to localStorage
(function(){
  const fileInput = document.getElementById('fileInput');
  const chooseFileBtn = document.getElementById('chooseFileBtn');
  const addUrlBtn = document.getElementById('addUrlBtn');
  const urlInput = document.getElementById('urlInput');
  const captionInput = document.getElementById('captionInput');
  const grid = document.querySelector('.grid-photos');
  const clearBtn = document.getElementById('clearGalleryBtn');
  const shareTwitter = document.getElementById('shareTwitter');
  const shareWhatsApp = document.getElementById('shareWhatsApp');

  function loadSaved() {
    try {
      const raw = localStorage.getItem('remo_gallery');
      if(!raw) return;
      const items = JSON.parse(raw);
      items.forEach(it => appendToGallery(it.src, it.caption, false));
    } catch(e){ console.warn('Could not load saved gallery', e); }
  }
  function saveItem(src, caption){
    try{
      const raw = localStorage.getItem('remo_gallery');
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift({src, caption, created: Date.now()});
      localStorage.setItem('remo_gallery', JSON.stringify(arr.slice(0,30))); // keep last 30
    }catch(e){ console.warn('save error', e); }
  }
  function appendToGallery(src, caption, save=true){
    const fig = document.createElement('figure');
    const img = document.createElement('img');
    img.src = src;
    img.alt = caption || 'Kontribusi pengguna';
    const cap = document.createElement('figcaption');
    cap.textContent = caption || 'Kontribusi pengguna';
    fig.appendChild(img);
    fig.appendChild(cap);
    grid.insertBefore(fig, grid.firstChild);
    if(save) saveItem(src, caption);
  }

  chooseFileBtn && chooseFileBtn.addEventListener('click', ()=> fileInput.click());
  fileInput && fileInput.addEventListener('change', function(e){
    const f = e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      appendToGallery(ev.target.result, f.name);
    };
    reader.readAsDataURL(f);
  });

  addUrlBtn && addUrlBtn.addEventListener('click', function(e){
    const url = urlInput.value.trim();
    const cap = captionInput.value.trim();
    if(!url) return alert('Masukkan URL gambar atau pilih file.');
    // Basic validation of URL extension
    if(!url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)){
      if(!confirm('URL tidak tampak seperti gambar (jpg/png/gif). Tetap tambahkan?')){ return; }
    }
    appendToGallery(url, cap);
    urlInput.value=''; captionInput.value='';
  });

  clearBtn && clearBtn.addEventListener('click', function(){ if(confirm('Hapus semua item yang tersimpan di browser?')){ localStorage.removeItem('remo_gallery'); location.reload(); } });

  // Sharing
  shareTwitter && shareTwitter.addEventListener('click', function(){ 
    const text = encodeURIComponent('Saya ikut #RemoRecreate — lihat koleksi Tari Remo lokal!');
    const url = encodeURIComponent(location.href);
    window.open('https://twitter.com/intent/tweet?text='+text+'&url='+url, '_blank');
  });
  shareWhatsApp && shareWhatsApp.addEventListener('click', function(){
    const text = encodeURIComponent('Saya ikut #RemoRecreate — lihat koleksi Tari Remo lokal: '+location.href);
    window.open('https://wa.me/?text='+text, '_blank');
  });

  // On load, populate saved items
  document.addEventListener('DOMContentLoaded', loadSaved);
})();
