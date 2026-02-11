(function () {
  'use strict';

  const SAKURA_COUNT = 18;
  const BUTTERFLY_COUNT = 5;
  const HEART_COUNT = 12;
  const HEARTS = ['♥', '💕', '💗', '💖', '💘', '💝'];
  const CAT_COOKIE_NAME = 'haileyCatGameV1';
  const TWO_DAYS_MS = 1000 * 60 * 60 * 24 * 2;
  // 今日（2026-02-11）を基点に二日に一回メッセージを進める
  const LETTER_BASE_TIME = new Date('2026-02-11T00:00:00+09:00').getTime();

  // 2日に1回切り替える一言メッセージ（自由に編集OK）
  const LETTER_ROTATE_MESSAGES = [
    'wow u open this again, im grad',
    'wth im so grad u open this again ',
    'i know u feel lonly or sad sametimes , jut call me',
    "おはよう　miss u ",
    "this site going to close sometime so u can screenshot love ya",
    "my wallpaper is haileys tits pic now, i mean my room wallpaper",
    "im not good at telling love so if u feel im dont love u , u r wrong",
    "okey this comment is a final, thank u for enjoy this gift , i love u",
    "i told u the comment was final",
    "probably u dont know that i sometime feel lonly and im thinking whether or not i call u ",

  ];

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

  // 手紙の中の「一言」メッセージを2日に1回切り替え
  function applyLetterRotateMessage() {
    const target = document.getElementById('letterRotate');
    if (!target) return;
    if (!Array.isArray(LETTER_ROTATE_MESSAGES) || LETTER_ROTATE_MESSAGES.length === 0) return;

    const now = Date.now();
    let steps = 0;
    const diff = now - LETTER_BASE_TIME;
    if (diff > 0) {
      steps = Math.floor(diff / TWO_DAYS_MS);
    }
    const index = steps % LETTER_ROTATE_MESSAGES.length;
    target.innerHTML = LETTER_ROTATE_MESSAGES[index];
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

  // --- Cookie helpers for cat game ---
  function loadCatState() {
    try {
      const all = document.cookie.split(';').map(function (c) { return c.trim(); });
      const found = all.find(function (c) { return c.indexOf(CAT_COOKIE_NAME + '=') === 0; });
      if (!found) return null;
      const value = decodeURIComponent(found.split('=')[1] || '');
      const data = JSON.parse(value);
      return data && typeof data === 'object' ? data : null;
    } catch (_) {
      return null;
    }
  }

  function saveCatState(state) {
    try {
      const json = encodeURIComponent(JSON.stringify(state));
      const oneYear = 60 * 60 * 24 * 365;
      document.cookie = CAT_COOKIE_NAME + '=' + json + '; max-age=' + oneYear + '; path=/';
    } catch (_) {}
  }

  function formatNumber(n) {
    try {
      return n.toLocaleString('en-US');
    } catch (_) {
      return String(n);
    }
  }

  function initCat() {
    const firstWrap = document.querySelector('.float-cat-wrap');
    const firstCat = document.getElementById('floatCat');
    const firstSpeech = document.getElementById('catSpeech');
    if (!firstWrap || !firstCat || !firstSpeech) return;

    // --- Game state (永続化される部分) ---
    var state = {
      points: 0,
      cats: 1,
      level: 0,
      maxComboEver: 0,
    };

    var saved = loadCatState();
    if (saved) {
      if (typeof saved.points === 'number') state.points = saved.points;
      if (typeof saved.cats === 'number' && saved.cats >= 1) state.cats = saved.cats;
      if (typeof saved.level === 'number') state.level = saved.level;
      if (typeof saved.maxComboEver === 'number') state.maxComboEver = saved.maxComboEver;
    }

    // --- Combo management (メモリのみ) ---
    var currentCombo = 0;
    var lastTapTime = 0;

    // --- UI elements ---
    var pointsEl = document.getElementById('catPoints');
    var catsEl = document.getElementById('catCats');
    var levelEl = document.getElementById('catLevel');
    var comboEl = document.getElementById('catCombo');
    var maxComboEl = document.getElementById('catMaxCombo');
    var perTapEl = document.getElementById('catPerTap');
    var buyCatBtn = document.getElementById('btnBuyCat');
    var levelUpBtn = document.getElementById('btnLevelUp');

    var catSound = new Audio('haileyIMGs/cat32.mp3');

    function playCatSound() {
      try {
        catSound.currentTime = 0;
        catSound.play().catch(function () {});
      } catch (_) {}
    }

    function showSpeech(el) {
      if (!el) return;
      el.classList.add('visible');
      setTimeout(function () {
        el.classList.remove('visible');
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
      // stinky クリッカーUIと重ならないよう、上側だけを使う
      top = randomPercent(4, 30);
      return { left: left, top: top };
    }

    function comboBonusFromMax() {
      return Math.floor(state.maxComboEver / 10);
    }

    function pointsPerTap() {
      // 1 + レベル + コンボボーナス + （ネコの数 - 1）
      return 1 + state.level + comboBonusFromMax() + (state.cats - 1);
    }

    function catCost() {
      // ネコ追加のコスト（だんだん高くなる）
      return Math.round(50 * Math.pow(1.6, state.cats - 1));
    }

    function levelCost() {
      // レベルアップのコスト
      return Math.round(120 * Math.pow(1.8, state.level));
    }

    function updateHud() {
      if (pointsEl) pointsEl.textContent = formatNumber(state.points);
      if (catsEl) catsEl.textContent = formatNumber(state.cats);
      if (levelEl) levelEl.textContent = formatNumber(state.level);
      if (comboEl) comboEl.textContent = formatNumber(currentCombo);
      if (maxComboEl) maxComboEl.textContent = formatNumber(state.maxComboEver);
      if (perTapEl) perTapEl.textContent = formatNumber(pointsPerTap());

      if (buyCatBtn) {
        var cCost = catCost();
        buyCatBtn.textContent = '+1 ねこ（' + formatNumber(cCost) + ' pt）';
        buyCatBtn.disabled = state.points < cCost;
      }

      if (levelUpBtn) {
        var lCost = levelCost();
        levelUpBtn.textContent = 'Level Up（' + formatNumber(lCost) + ' pt）';
        levelUpBtn.disabled = state.points < lCost;
      }
    }

    function handleCatTap(e, wrapEl, speechEl) {
      e.preventDefault();
      e.stopPropagation();

      var now = Date.now();
      if (now - lastTapTime <= 1000) {
        currentCombo += 1;
      } else {
        currentCombo = 1;
      }
      lastTapTime = now;

      if (currentCombo > state.maxComboEver) {
        state.maxComboEver = currentCombo;
      }

      var gain = pointsPerTap();
      state.points += gain;

      // ネコの頭上に「+ポイント / コンボ数」を表示
      if (currentCombo > 1) {
        speechEl.textContent = '+' + gain + ' pt / combo ' + currentCombo;
      } else {
        speechEl.textContent = '+' + gain + ' pt';
      }

      playCatSound();
      showSpeech(speechEl);

      if (wrapEl) {
        wrapEl.classList.add('cat-running');
        var pos = randomPositionOutsideLetter();
        wrapEl.style.left = pos.left + '%';
        wrapEl.style.top = pos.top + '%';
        setTimeout(function () {
          wrapEl.classList.remove('cat-running');
        }, 450);
      }

      saveCatState(state);
      updateHud();
    }

    function attachCat(wrapEl, imgEl, speechEl) {
      if (!wrapEl || !imgEl || !speechEl) return;
      imgEl.addEventListener('click', function (e) {
        handleCatTap(e, wrapEl, speechEl);
      });
    }

    function spawnCatInstance() {
      var container = document.querySelector('.floating-photos');
      if (!container) return;

      var wrap = document.createElement('div');
      wrap.className = 'float-cat-wrap';

      var img = document.createElement('img');
      img.src = 'haileyIMGs/neko.png';
      img.alt = 'にゃあ';
      img.className = 'float-cat';
      img.title = 'タップしてみて';
      img.loading = 'lazy';

      var speechEl = document.createElement('span');
      speechEl.className = 'cat-speech';
      speechEl.setAttribute('aria-live', 'polite');

      wrap.appendChild(img);
      wrap.appendChild(speechEl);

      var pos = randomPositionOutsideLetter();
      wrap.style.left = pos.left + '%';
      wrap.style.top = pos.top + '%';

      container.appendChild(wrap);

      attachCat(wrap, img, speechEl);
    }

    // 初期HUD
    updateHud();

    // 既存のネコにロジックを付与
    attachCat(firstWrap, firstCat, firstSpeech);

    // 保存されている cats の数ぶん、見た目のネコも復元（1匹目は既に画面にいるので -1）
    if (state.cats > 1) {
      for (var i = 0; i < state.cats - 1; i++) {
        spawnCatInstance();
      }
    }

    // ネコ追加購入（ゲーム内の数値だけ増える。見た目は1匹のまま）
    if (buyCatBtn) {
      buyCatBtn.addEventListener('click', function () {
        var cost = catCost();
        if (state.points < cost) return;
        state.points -= cost;
        state.cats += 1;
        saveCatState(state);
        updateHud();
        // 黒ネコの見た目も増やす
        spawnCatInstance();
      });
    }

    // レベルアップ
    if (levelUpBtn) {
      levelUpBtn.addEventListener('click', function () {
        var cost = levelCost();
        if (state.points < cost) return;
        state.points -= cost;
        state.level += 1;
        saveCatState(state);
        updateHud();
        // レベルアップ時にもクリックできるネコを増やす
        spawnCatInstance();
      });
    }
  }

  createSakura();
  createButterflies();
  createFloatingHearts();
  applyLetterRotateMessage();
  initLetter();
  initCat();
})();
