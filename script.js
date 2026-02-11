(function () {
  'use strict';

  const SAKURA_COUNT = 18;
  const BUTTERFLY_COUNT = 5;
  const HEART_COUNT = 12;
  const HEARTS = ['♥', '💕', '💗', '💖', '💘', '💝'];

  function createSakura() {
    const container = document.querySelector('.sakura-container');
    if (!container) return;

    for (let i = 0; i < SAKURA_COUNT; i++) {
      const petal = document.createElement('div');
      petal.className = 'sakura-petal';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.animationDuration = (8 + Math.random() * 6) + 's';
      petal.style.animationDelay = Math.random() * 5 + 's';
      container.appendChild(petal);
    }
  }

  function createButterflies() {
    const container = document.querySelector('.butterflies');
    if (!container) return;

    for (let i = 0; i < BUTTERFLY_COUNT; i++) {
      const b = document.createElement('div');
      b.className = 'butterfly';
      b.style.left = Math.random() * 100 + '%';
      b.style.top = Math.random() * 100 + '%';
      b.style.animationDuration = (12 + Math.random() * 8) + 's';
      b.style.animationDelay = Math.random() * 4 + 's';
      container.appendChild(b);
    }
  }

  function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    if (!container) return;

    for (let i = 0; i < HEART_COUNT; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.top = Math.random() * 100 + '%';
      heart.style.animationDuration = (6 + Math.random() * 4) + 's';
      heart.style.animationDelay = Math.random() * 3 + 's';
      container.appendChild(heart);
    }
  }

  function createConfetti() {
    const colors = ['#ec4899', '#f472b6', '#f9a8d4', '#fce7f3', '#e8b86d'];
    for (let i = 0; i < 30; i++) {
      const tx = (Math.random() - 0.5) * 200;
      const ty = (Math.random() - 0.5) * 200;
      const piece = document.createElement('div');
      piece.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        left: 50%;
        top: 50%;
        pointer-events: none;
        z-index: 100;
        animation: confetti-pop 1.2s ease-out forwards;
        --tx: ${tx}px;
        --ty: ${ty}px;
      `;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 1200);
    }
  }

  function initLetter() {
    const closed = document.getElementById('letterClosed');
    const opened = document.getElementById('letterOpened');
    const video = document.getElementById('letterVideo');
    const closeBtn = document.getElementById('closeLetterBtn');

    if (!closed || !opened || !video) return;

    closed.addEventListener('click', function openLetter() {
      closed.classList.add('letter-closed-opening');
      closed.style.animation = 'letter-fold 0.5s ease-in forwards';
      closed.style.pointerEvents = 'none';

      setTimeout(() => {
        closed.style.display = 'none';
        opened.classList.remove('hidden');
        createConfetti();
        video.play().catch(() => {});
      }, 450);
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        opened.classList.add('hidden');
        closed.style.display = '';
        closed.style.animation = '';
        closed.classList.remove('letter-closed-opening');
        closed.style.pointerEvents = '';
        video.pause();
        video.currentTime = 0;
      });
    }
  }

  function initCat() {
    const wrap = document.querySelector('.float-cat-wrap');
    const cat = document.getElementById('floatCat');
    const speech = document.getElementById('catSpeech');
    if (!wrap || !cat || !speech) return;

    var catSound = new Audio('haileyIMGs/cat32.mp3');

    function playCatSound() {
      try {
        catSound.currentTime = 0;
        catSound.play().catch(function () {});
      } catch (_) {}
    }

    function showSpeech() {
      speech.classList.add('visible');
      setTimeout(function () {
        speech.classList.remove('visible');
      }, 600);
    }

    function randomPercent(min, max) {
      return min + Math.random() * (max - min);
    }

    /* 手紙（中央）と被らない位置だけに逃げる */
    function randomPositionOutsideLetter() {
      var left;
      var top;
      if (Math.random() < 0.5) {
        left = randomPercent(3, 28);
      } else {
        left = randomPercent(72, 95);
      }
      if (Math.random() < 0.5) {
        top = randomPercent(4, 24);
      } else {
        top = randomPercent(76, 92);
      }
      return { left: left, top: top };
    }

    function onCatTap(e) {
      e.preventDefault();
      e.stopPropagation();
      playCatSound();
      showSpeech();
      wrap.classList.add('cat-running');
      var pos = randomPositionOutsideLetter();
      wrap.style.left = pos.left + '%';
      wrap.style.top = pos.top + '%';
      setTimeout(function () {
        wrap.classList.remove('cat-running');
      }, 450);
    }

    cat.addEventListener('click', onCatTap);
  }

  createSakura();
  createButterflies();
  createFloatingHearts();
  initLetter();
  initCat();
})();
