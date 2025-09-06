
// script.js - updated to share via WhatsApp with exact template
document.addEventListener('DOMContentLoaded', function () {
  // Simple form demo behavior (no redirect)
  const form = document.getElementById('contributeForm');
  const msg = document.getElementById('formMsg');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name') || 'Anon';
      msg.textContent = 'Terima kasih, ' + name + '! Kiriman Anda telah dicatat (demo).';
      form.reset();
      setTimeout(()=> msg.textContent = '', 6000);
    });
  }

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

// Typing Race IIFE
(function(){
  const sampleEl = document.getElementById('sampleText');
  const inputEl = document.getElementById('trInput');
  const newBtn = document.getElementById('trNewBtn');
  const startBtn = document.getElementById('trStartBtn');
  const resetBtn = document.getElementById('trResetBtn');
  const timeEl = document.getElementById('trTime');
  const wpmEl = document.getElementById('trWpm');
  const accEl = document.getElementById('trAcc');
  const progressEl = document.getElementById('trProgress');
  const shareBtn = document.getElementById('trShareBtn');
  const historyEl = document.getElementById('trHistory');

  const modal = document.getElementById('trRewardModal');
  const modalClose = document.getElementById('trModalCloseBtn');
  const modalShare = document.getElementById('trModalShareBtn');
  const modalTitle = document.getElementById('trRewardTitle');
  const modalMsg = document.getElementById('trRewardMsg');
  const coinsEl = document.getElementById('trCoins');
  const badgeEl = document.getElementById('trBadge');
  const confettiCanvas = document.getElementById('trConfetti');
  const confettiCtx = confettiCanvas && confettiCanvas.getContext ? confettiCanvas.getContext('2d') : null;

  let current = "";
  let charSpans = [];
  let started = false;
  let startTs = 0;
  let timerId = null;
  let lastReward = null;

  const sentences = [
    "Tari Remo menghidupkan cerita dan langkah tradisi yang berakar di kampung halaman.",
    "Gerakan ringan namun berenergi, Tari Remo mengundang siapa saja untuk menari bersama.",
    "Pelestarian budaya dimulai dari langkah kecil: belajar, merekam, dan membagikannya.",
    "Ayo jelajahi ritme, gerak, dan makna. Beri semangat untuk #RisingRemo!",
    "Langkah kecil hari ini akan jadi jejak besar di masa depan budaya kita.",
    "Jangan takut salah; tiap langkah adalah bagian dari proses pembelajaran budaya.",
    "Kita rayakan tradisi lewat kreativitas digital, gabungkan gerak dan cerita.",
    "Ajak temanmu ikut tantangan, dan mari buat #RisingRemo jadi kebanggaan!",
    "Tari Remo berasal dari Jawa Timur dan penuh semangat.",
    "Langkah Remo cepat, ritmis, dan membutuhkan keberanian.",
    "Pelajari motif gerakan sebelum mencoba menari bersama.",
    "Setiap lengkung tangan menyimpan cerita leluhur kita.",
    "Tarian ini biasa ditampilkan pada upacara tradisional.",
    "Ajak temanmu ikut tantangan #RisingRemo hari ini!",
    "Rekam gerakanmu lalu bagikan untuk melestarikan budaya.",
    "Musik kendang mengatur langkah dan ritme Tari Remo.",
    "Gerak kaki yang ringan membuat penonton terpikat.",
    "Jaga warisan budaya dengan belajar dari penari tua.",
    "Kostum dan busana tradisional menambah keindahan tari.",
    "Senyum penari membuat suasana panggung hidup.",
    "Tari Remo mengajarkan solidaritas dan kebersamaan.",
    "Latihan rutin adalah kunci mahir dalam menari.",
    "Ajak kelasmu membuat proyek dokumentasi tari lokal.",
    "Tantangan menari selama 30 detik, siapkah kamu?",
    "Setiap gerakan ada filosofi yang perlu dipahami.",
    "Gunakan kamera untuk merekam sudut terbaik tarianmu.",
    "Kolaborasi antar generasi menjaga tradisi tetap hidup.",
    "Pelestarian budaya dimulai dari rasa ingin tahu.",
    "Bagikan foto latihan dengan tagar #RisingRemo.",
    "Belajar dari guru tari lokal itu penting dan berharga.",
    "Perhatikan ekspresi wajah sebagai bagian dari cerita.",
    "Tari tradisi bisa berevolusi tanpa kehilangan makna.",
    "Kembangkan kreativitas dengan menggabungkan musik baru.",
    "Ajak komunitas membuat festival kecil di kampung.",
    "Tanda hormat sebelum dan sesudah menari adalah adat.",
    "Eksplorasi gerak baru, tapi tetap hormati akar budaya.",
    "Setiap penari membawa pula kenangan dan cerita keluarga.",
    "Mari rayakan keragaman melalui gerak dan musik tradisi."
  ];

  function fmtTime(ms){
    const s = Math.floor(ms/1000);
    const mm = String(Math.floor(s/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    const cs = String(Math.floor((ms%1000)/10)).padStart(2,'0');
    return `${mm}:${ss}.${cs}`;
  }

  function setNewSentence(text){
    current = text || sentences[Math.floor(Math.random()*sentences.length)];
    sampleEl.innerHTML = '';
    charSpans = [];
    for(let i=0;i<current.length;i++){
      const ch = current[i] === ' ' ? '\u00A0' : current[i];
      const span = document.createElement('span');
      span.className = 'sample-char';
      span.textContent = ch;
      sampleEl.appendChild(span);
      charSpans.push(span);
    }
    resetRun();
  }

  function resetRun(){
    stopTimer();
    started = false;
    startTs = 0;
    if(inputEl) inputEl.value = '';
    if(timeEl) timeEl.textContent = '00:00.00';
    if(wpmEl) wpmEl.textContent = '0';
    if(accEl) accEl.textContent = '100%';
    if(progressEl) progressEl.style.width = '0%';
    charSpans.forEach(s => { s.classList.remove('correct','incorrect','cursor'); });
    if(charSpans[0]) charSpans[0].classList.add('cursor');
    // if(inputEl) inputEl.focus();  
  }

  function startTimer(){
    if(started) return;
    started = true;
    startTs = performance.now();
    timerId = requestAnimationFrame(tick);
  }

  function stopTimer(){
    if(timerId){ cancelAnimationFrame(timerId); timerId = null; }
  }

  function tick(){
    const elapsed = performance.now() - startTs;
    if(timeEl) timeEl.textContent = fmtTime(elapsed);
    const typed = inputEl ? inputEl.value.length : 0;
    const correctChars = countCorrectChars();
    const minutes = Math.max(0.001, elapsed / 60000);
    const wpm = Math.round((correctChars / 5) / minutes);
    if(wpmEl) wpmEl.textContent = String(wpm);
    const acc = typed === 0 ? 100 : Math.max(0, Math.round((correctChars / typed) * 100));
    if(accEl) accEl.textContent = acc + '%';
    const prog = Math.min(100, Math.round((correctChars / current.length) * 100));
    if(progressEl) progressEl.style.width = prog + '%';
    timerId = requestAnimationFrame(tick);
  }

  function countCorrectChars(){
    const v = inputEl ? inputEl.value : '';
    let correct = 0;
    for(let i=0;i<v.length;i++){
      if(i >= current.length) break;
      if(v[i] === current[i]) correct++;
    }
    return correct;
  }

  function renderHighlight(){
    const v = inputEl ? inputEl.value : '';
    for(let i=0;i<charSpans.length;i++){
      const span = charSpans[i];
      span.classList.remove('correct','incorrect','cursor');
      if(i < v.length){
        if(v[i] === current[i]) span.classList.add('correct');
        else span.classList.add('incorrect');
      }
    }
    const idx = Math.min(v.length, charSpans.length-1);
    if(charSpans[idx]) charSpans[idx].classList.add('cursor');
  }

  function checkCompletion(){
    if(!inputEl) return;
    if(inputEl.value === current){
      stopTimer();
      started = false;
      const elapsed = performance.now() - startTs;
      const correctChars = countCorrectChars();
      const minutes = Math.max(0.001, elapsed / 60000);
      const wpm = Math.round((correctChars / 5) / minutes);
      const accuracy = 100;
      giveReward({elapsed, wpm, accuracy});
    }
  }

  function giveReward({elapsed, wpm, accuracy}){
    const coins = Math.max(1, Math.floor(wpm / 2) + Math.floor(accuracy / 25));
    let badge = 'Remo Novice';
    if(wpm >= 80) badge = 'Remo Maestro';
    else if(wpm >= 55) badge = 'Remo Pro';
    else if(wpm >= 35) badge = 'Remo Brave';

    const prev = JSON.parse(localStorage.getItem('tr_rewards') || '[]');
    prev.unshift({ts: Date.now(), elapsed, wpm, accuracy, coins, badge});
    localStorage.setItem('tr_rewards', JSON.stringify(prev.slice(0,50)));
    lastReward = {ts: Date.now(), elapsed, wpm, accuracy, coins, badge};

    renderHistory();

    if(modalTitle) modalTitle.textContent = 'Gemilang! 🎉';
    if(modalMsg) modalMsg.textContent = `Selesaikan tepat! Skormu: ${wpm} WPM • Akurasi ${accuracy}%. Kamu mendapatkan ${coins} koin dan badge \"${badge}\".`;
    if(coinsEl) coinsEl.textContent = coins;
    if(badgeEl) badgeEl.textContent = badge;
    if(modal) modal.setAttribute('aria-hidden','false');
    runConfetti(1400);
  }

  function renderHistory(){
    const arr = JSON.parse(localStorage.getItem('tr_rewards') || '[]');
    if(!historyEl) return;
    historyEl.innerHTML = '';
    if(arr.length === 0){ historyEl.innerHTML = '<li class="muted">Belum ada reward</li>'; return; }
    for(const it of arr.slice(0,8)){
      const li = document.createElement('li');
      const d = new Date(it.ts);
      li.textContent = `${d.toLocaleDateString()} ${d.toLocaleTimeString()} — ${it.wpm} WPM • ${it.accuracy}% • ${it.badge}`;
      historyEl.appendChild(li);
    }
  }

  function runConfetti(duration=1200){
    if(!confettiCtx) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiCanvas.classList.add('active');
    confettiCanvas.style.display = 'block';
    const particles = [];
    const colors = ['#FFC107','#FF5722','#8BC34A','#3F51B5','#E91E63','#00BCD4'];
    for(let i=0;i<120;i++){
      particles.push({
        x: Math.random()*confettiCanvas.width,
        y: Math.random()*confettiCanvas.height - confettiCanvas.height,
        vx: (Math.random()-0.5)*4,
        vy: 2 + Math.random()*4,
        size: 6 + Math.random()*8,
        color: colors[Math.floor(Math.random()*colors.length)],
        rot: Math.random()*360,
        rSpeed: (Math.random()-0.5)*8
      });
    }
    let start = performance.now();
    function step(now){
      const t = now - start;
      confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
      for(const p of particles){
        p.x += p.vx; p.y += p.vy; p.rot += p.rSpeed;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.rot * Math.PI / 180);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
        confettiCtx.restore();
      }
      if(t < duration) requestAnimationFrame(step);
      else {
        confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
        confettiCanvas.classList.remove('active');
        confettiCanvas.style.display = 'none';
      }
    }
    requestAnimationFrame(step);
  }

  // Share template + WhatsApp share function
  function formatShareTime(ms){
    return fmtTime(ms);
  }

  function shareTemplate(elapsedMs, wpm){
    const waktu = formatShareTime(elapsedMs || 0);
    const WPM = Math.round(wpm || 0);
    const url = 'https://p5-eksistensi-tari-remo.vercel.app';
    return `Aku menang di mini-game Typing Race dalam waktu ${waktu}, dengan kecepatan ${WPM}WPM — Berani kalahin skorku? #RisingRemo [${url}]`;
  }

  function doShareToWhatsApp(text){
    // Use universal wa link
    const encoded = encodeURIComponent(text);
    const waUrl = 'https://wa.me/?text=' + encoded;
    window.open(waUrl, '_blank');
  }

  // wiring events
  if(newBtn) newBtn.addEventListener('click', ()=> setNewSentence());
  if(startBtn) startBtn.addEventListener('click', ()=> { resetRun(); startTimer(); });
  if(resetBtn) resetBtn.addEventListener('click', ()=> resetRun());
  if(modalClose) modalClose.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));

  if(modalShare) modalShare.addEventListener('click', ()=> {
    let rec = lastReward;
    if(!rec){
      const arr = JSON.parse(localStorage.getItem('tr_rewards') || '[]');
      rec = arr[0];
    }
    if(!rec){ alert('Belum ada hasil untuk dibagikan.'); return; }
    const text = shareTemplate(rec.elapsed, rec.wpm);
    doShareToWhatsApp(text);
  });

  if(shareBtn) shareBtn.addEventListener('click', ()=> {
    let rec = lastReward;
    if(!rec){
      const arr = JSON.parse(localStorage.getItem('tr_rewards') || '[]');
      rec = arr[0];
    }
    if(!rec){ alert('Belum ada hasil untuk dibagikan. Selesaikan satu putaran dulu!'); return; }
    const text = shareTemplate(rec.elapsed, rec.wpm);
    doShareToWhatsApp(text);
  });

  if(inputEl){
    inputEl.addEventListener('input', (e)=>{
      const val = inputEl.value;
      if(!started && val.length>0) startTimer();
      renderHighlight();
      checkCompletion();
    });
  }

  // initial
  setNewSentence();
  renderHistory();
  if(charSpans[0]) charSpans[0].classList.add('cursor');
  window.__TypingRace = { setNewSentence, resetRun, giveReward };
})();
