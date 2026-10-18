/* FitNudge for the big screen — tvOS-style concept prototype.
   A small focus engine: arrow keys / remote move focus, Enter selects, Esc goes back. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ICON = {
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    dumbbell: '<path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/>',
    run: '<circle cx="14" cy="4.5" r="2"/><path d="M8 21l3-6 3 3v5M6 12l3-4 4 1 3 3 3 1M11 15l-1-5"/>',
    lotus: '<path d="M12 20c-4 0-8-2-9-6 3 0 6 1 9 4 3-3 6-4 9-4-1 4-5 6-9 6zM12 18c-2-3-2-8 0-12 2 4 2 9 0 12z"/>',
    flame: '<path d="M12 22c4 0 7-3 7-7 0-5-4-7-5-11-2 3-3 4-3 7-1-1-2-2-2-4-2 2-4 5-4 8 0 4 3 7 7 7z"/>',
    wave: '<path d="M2 12c3-6 5-6 8 0s5 6 8 0 3-4 4-2"/>',
    moon: '<path d="M20 15A8 8 0 1 1 9 4a6 6 0 0 0 11 11z"/>',
    heart: '<path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 6-8 11-8 11z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    play: '<path d="M7 5l12 7-12 7z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    people: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M15 15c3 0 6 1.5 6 4"/>'
  };
  function svg(name, sw) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.8) + '" stroke-linecap="round" stroke-linejoin="round">' + ICON[name] + '</svg>';
  }

  var FEATURE = { id: 'f', title: 'Full-Body Strength', dur: '30 min', cat: 'Today’s plan', c: 'linear-gradient(135deg,#3B5BDB,#7A5CFF)', tint: '#3B5BDB', icon: 'dumbbell',
    desc: 'Day 9 of your 4-week strength program. Builds on Tuesday’s session with one extra set of squats and a slower tempo on presses.' };
  var ROWS = [
    { name: 'Up Next', items: [
      { title: 'Morning Mobility', dur: '15 min', c: 'linear-gradient(135deg,#C6F432,#46B37A)', tint: '#46B37A', icon: 'run', p: 60, desc: 'Pick up where you left off: hips, thoracic spine and ankles.' },
      { title: 'HIIT Cardio', dur: '20 min', c: 'linear-gradient(135deg,#FF6B35,#E5458C)', tint: '#E5458C', icon: 'flame', p: 20, desc: 'Intervals timed to your heart-rate zones. Low-impact options on every move.' },
      { title: 'Core Burner', dur: '12 min', c: 'linear-gradient(135deg,#F7B32B,#FF6B35)', tint: '#F7B32B', icon: 'bolt', desc: 'Short, focused and floor-based. Fits between meetings.' },
      { title: 'Yoga Flow', dur: '25 min', c: 'linear-gradient(135deg,#7A5CFF,#E5458C)', tint: '#7A5CFF', icon: 'lotus', desc: 'A calm vinyasa to balance this week’s strength days.' }
    ] },
    { name: 'Programs', items: [
      { title: '4-Week Strength', dur: '12 sessions', c: 'linear-gradient(135deg,#1D3557,#3B5BDB)', tint: '#3B5BDB', icon: 'dumbbell', lg: 1, desc: 'Progressive overload, planned for you. Each session adapts to how the last one felt.' },
      { title: 'Couch to 5K', dur: '9 weeks', c: 'linear-gradient(135deg,#0B6E4F,#46B37A)', tint: '#46B37A', icon: 'run', lg: 1, desc: 'Treadmill-friendly run–walk intervals with coaching on the big screen.' },
      { title: 'Mobility Reset', dur: '10 sessions', c: 'linear-gradient(135deg,#5B2A86,#7A5CFF)', tint: '#7A5CFF', icon: 'lotus', lg: 1, desc: 'Ten short sessions for stiff hips and shoulders.' },
      { title: 'Family Challenge', dur: 'With SharePlay', c: 'linear-gradient(135deg,#E5458C,#FF6B35)', tint: '#E5458C', icon: 'people', lg: 1, desc: 'Move together in the living room and compare streaks on everyone’s phone.' }
    ] },
    { name: 'Mindful Minutes', items: [
      { title: 'Breathe', dur: '5 min', c: 'linear-gradient(135deg,#2EC4B6,#3B5BDB)', tint: '#2EC4B6', icon: 'wave', desc: 'Guided breathing with a slow visual pulse.' },
      { title: 'Sleep Wind-Down', dur: '10 min', c: 'linear-gradient(135deg,#14213D,#5B2A86)', tint: '#5B2A86', icon: 'moon', desc: 'Dimmed visuals and a quiet voice for the end of the day.' },
      { title: 'Heart Check-In', dur: '3 min', c: 'linear-gradient(135deg,#E5458C,#B5179E)', tint: '#E5458C', icon: 'heart', desc: 'A short reflection after your workout.' },
      { title: 'Stretch & Reset', dur: '8 min', c: 'linear-gradient(135deg,#46B37A,#2EC4B6)', tint: '#2EC4B6', icon: 'lotus', desc: 'Gentle stretches for the couch, no mat needed.' }
    ] }
  ];
  var MOVES = {
    strength: ['Goblet squats', 'Push-ups', 'Reverse lunges', 'Dumbbell rows', 'Plank'],
    run: ['Warm-up walk', 'Easy run', 'Walk break', 'Easy run', 'Cooldown walk'],
    calm: ['Settle in', 'Cat-cow', 'Child’s pose', 'Low lunge', 'Rest and breathe'],
    hiit: ['Jumping jacks', 'Squat jumps', 'Mountain climbers', 'High knees', 'Burpees']
  };
  var WORKOUT = MOVES.strength;
  function movesFor(it) { return it.icon === 'run' ? MOVES.run : (it.icon === 'flame' || it.icon === 'bolt') ? MOVES.hiit : /lotus|wave|moon|heart/.test(it.icon) ? MOVES.calm : MOVES.strength; }

  function build(root) {
    var demo = root.hasAttribute('data-demo');
    var html =
      '<div class="tv__bezel"><div class="tv__screen" role="application" aria-label="FitNudge TV prototype">' +
        '<div class="tv__bg"></div>' +
        '<div class="tv__app"><i>F</i>FitNudge</div><div class="tv__clock"></div>' +
        '<div class="tv__art">' + svg(FEATURE.icon, 1.2) + '</div>' +
        '<div class="tv__hero"><small>' + FEATURE.cat + '</small><h3>' + FEATURE.title + '</h3><p>' + FEATURE.desc + '</p>' +
          '<div class="tv__btns" data-row="-1"><span class="tv__btn" data-act="play">' + svg('play', 2.2).replace('<svg', '<svg style="width:1.2cqw"') + 'Start · 30 min</span><span class="tv__btn" data-act="more">More info</span></div></div>' +
        '<div class="tv__rows">' + ROWS.map(function (r, ri) {
          return '<div class="tv__row"><h4>' + r.name + '</h4><div class="tv__track" data-row="' + ri + '">' + r.items.map(function (it, ii) {
            return '<div class="tv__card' + (it.lg ? ' lg' : '') + '" data-r="' + ri + '" data-i="' + ii + '" style="--c:' + it.c + '"><div class="art">' + svg(it.icon, 1.6) + '</div>' +
              '<div class="t">' + it.title + '<span class="d">' + it.dur + '</span></div>' + (it.p ? '<div class="p" style="width:' + it.p + '%"></div>' : '') + '</div>';
          }).join('') + '</div></div>';
        }).join('') + '</div>' +
        '<div class="tv__layer" data-layer="detail"></div>' +
        '<div class="tv__layer" data-layer="workout"></div>' +
        '<div class="tv__toast" role="status"></div>' +
        '<div class="tv__safe"><span>Title-safe area · 60 pt top and bottom, 80 pt sides</span></div>' +
        (demo ? '' : '<div class="tv__hint"><span>Click to use your keyboard as the remote</span></div>') +
      '</div></div><div class="tv__stand"></div>';
    root.innerHTML = html;
    var screen = root.querySelector('.tv__screen');
    var rowsEl = screen.querySelector('.tv__rows');
    var tracks = Array.prototype.slice.call(screen.querySelectorAll('.tv__track'));
    var heroBtns = Array.prototype.slice.call(screen.querySelectorAll('.tv__hero .tv__btn'));
    var bg = screen.querySelector('.tv__bg');
    var toastEl = screen.querySelector('.tv__toast');
    var layers = { detail: screen.querySelector('[data-layer="detail"]'), workout: screen.querySelector('[data-layer="workout"]') };
    var state = { r: -1, i: 0, layer: null, li: 0, item: null };
    var offsets = tracks.map(function () { return 0; });

    function clock() { var d = new Date(); screen.querySelector('.tv__clock').textContent = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
    clock(); setInterval(clock, 30000);

    function rowEls(r) { return r < 0 ? heroBtns : Array.prototype.slice.call(tracks[r].children); }
    function itemAt(r, i) { return r < 0 ? FEATURE : ROWS[r].items[i]; }
    function cur() { return rowEls(state.r)[state.i]; }

    function toast(msg) {
      toastEl.textContent = msg; toastEl.classList.add('is-on');
      clearTimeout(toast.t); toast.t = setTimeout(function () { toastEl.classList.remove('is-on'); }, 1800);
    }

    function paint(dir) {
      screen.querySelectorAll('.is-focus').forEach(function (e) { e.classList.remove('is-focus'); e.style.removeProperty('--rx'); e.style.removeProperty('--ry'); });
      var el = cur(); el.classList.add('is-focus');
      if (dir && !reduce && el.classList.contains('tv__card')) {
        el.style.setProperty('--ry', (dir === 'r' ? 5 : dir === 'l' ? -5 : 0) + 'deg');
        el.style.setProperty('--rx', (dir === 'd' ? -5 : dir === 'u' ? 5 : 0) + 'deg');
        setTimeout(function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); }, 220);
      }
      var it = itemAt(state.r, state.i);
      bg.style.setProperty('--tint', it.tint);
      screen.classList.toggle('tv--depth', state.r >= 1);
      // vertical: keep focused row in view
      var y = 0;
      if (state.r >= 1) { var row = tracks[state.r].parentNode; y = row.offsetTop - screen.clientHeight * 0.02 - (rowsEl.offsetTop - screen.clientHeight * 0.18); }
      rowsEl.style.transform = 'translateY(' + (-Math.max(0, y)) + 'px)';
      // horizontal: keep focused card inside the safe area
      if (state.r >= 0) {
        var t = tracks[state.r], W = screen.clientWidth, safe = W * 0.0417, x = offsets[state.r];
        var left = el.offsetLeft, w = el.offsetWidth;
        if (left + w + x > W - safe) x = -(left + w - W + safe);
        if (left + x < safe) x = -(left - safe);
        offsets[state.r] = Math.min(0, x);
        t.style.transform = 'translateX(' + offsets[state.r] + 'px)';
      }
    }

    function bump(el) {
      if (reduce || !el) return;
      el.animate([{ transform: getComputedStyle(el).transform }, { transform: getComputedStyle(el).transform + ' translateX(6px)' }, { transform: getComputedStyle(el).transform }], { duration: 180 });
    }

    function move(dir) {
      if (state.layer) return moveLayer(dir);
      var r = state.r, i = state.i, els = rowEls(r);
      if (dir === 'l' || dir === 'r') {
        var ni = i + (dir === 'r' ? 1 : -1);
        if (ni < 0 || ni >= els.length) return bump(cur());
        state.i = ni;
      } else {
        var nr = r + (dir === 'd' ? 1 : -1);
        if (nr < -1 || nr >= tracks.length) return bump(cur());
        var from = els[i].getBoundingClientRect(), cx = from.left + from.width / 2, best = 0, bd = Infinity;
        rowEls(nr).forEach(function (e, k) { var b = e.getBoundingClientRect(), d = Math.abs(b.left + b.width / 2 - cx); if (d < bd) { bd = d; best = k; } });
        state.r = nr; state.i = best;
      }
      paint(dir);
    }

    function layerBtns() { return Array.prototype.slice.call(layers[state.layer].querySelectorAll('.tv__btn')); }
    function paintLayer() { layerBtns().forEach(function (b, k) { b.classList.toggle('is-focus', k === state.li); }); }
    function moveLayer(dir) {
      var b = layerBtns();
      if (dir === 'l' && state.li > 0) state.li--;
      else if (dir === 'r' && state.li < b.length - 1) state.li++;
      else bump(b[state.li]);
      paintLayer();
    }

    function openDetail(it) {
      state.item = it;
      layers.detail.innerHTML = '<div class="tv__detail"><small>' + (it.cat || 'Workout') + '</small><h3>' + it.title + '</h3>' +
        '<div class="meta-line">' + it.dur + ' · Coach Maya · Dumbbells optional · Closed captions</div><p>' + it.desc + '</p>' +
        '<div class="tv__btns"><span class="tv__btn" data-act="start">' + svg('play', 2.2).replace('<svg', '<svg style="width:1.2cqw"') + 'Start workout</span><span class="tv__btn" data-act="queue">' + svg('plus', 2.2).replace('<svg', '<svg style="width:1.2cqw"') + 'Up Next</span><span class="tv__btn" data-act="share">' + svg('people', 2).replace('<svg', '<svg style="width:1.4cqw"') + 'SharePlay</span></div></div>' +
        '<div class="tv__detail-art" style="--c:' + it.c + '">' + svg(it.icon, 1.4) + '</div>';
      open('detail');
    }
    var stack = [];
    function open(name) {
      if (state.layer) layers[state.layer].classList.remove('is-open');
      if (state.layer && state.layer !== name) stack.push(state.layer);
      state.layer = name; state.li = 0; layers[name].classList.add('is-open'); paintLayer();
    }
    var timer = null;
    function startWorkout(it) {
      WORKOUT = movesFor(it);
      var step = 0, left = 45, total = 45, hr = 124, C = 2 * Math.PI * 54;
      layers.workout.innerHTML = '<div class="tv__workout"><div class="tv__ring"><svg viewBox="0 0 120 120"><circle class="bg" cx="60" cy="60" r="54"/><circle class="fg" cx="60" cy="60" r="54" stroke-dasharray="' + C + '" stroke-dashoffset="0"/></svg><b>0:45</b></div>' +
        '<div><small style="font-size:1.15cqw;color:#C6F432;font-weight:600;letter-spacing:.08em;text-transform:uppercase">' + it.title + ' · Move <span class="sn">1</span> of ' + WORKOUT.length + '</small><h3 class="ex">' + WORKOUT[0] + '</h3>' +
        '<div class="hr"><i>' + svg('heart', 2).replace('<svg', '<svg style="width:1.8cqw;fill:#FF375F;stroke:#FF375F"') + '</i><b class="bpm">124</b> BPM <span style="opacity:.6;font-size:1.1cqw">from Apple Watch, concept</span></div>' +
        '<div class="next">Next: ' + WORKOUT[1] + '</div><div class="tv__btns"><span class="tv__btn" data-act="pause">' + svg('pause', 2.2).replace('<svg', '<svg style="width:1.2cqw"') + 'Pause</span><span class="tv__btn" data-act="skip">Skip move</span><span class="tv__btn" data-act="end">End workout</span></div></div></div>';
      open('workout');
      var ring = layers.workout.querySelector('.fg'), num = layers.workout.querySelector('.tv__ring b'), paused = false;
      function setStep() {
        layers.workout.querySelector('.ex').textContent = WORKOUT[step];
        layers.workout.querySelector('.sn').textContent = step + 1;
        layers.workout.querySelector('.next').textContent = step + 1 < WORKOUT.length ? 'Next: ' + WORKOUT[step + 1] : 'Last move, then cooldown';
        left = total;
      }
      clearInterval(timer);
      timer = setInterval(function () {
        if (paused) return;
        left--; if (left < 0) { step = (step + 1) % WORKOUT.length; setStep(); }
        num.textContent = '0:' + (left < 10 ? '0' : '') + Math.max(left, 0);
        ring.style.strokeDashoffset = C * (1 - left / total);
        hr = Math.max(108, Math.min(156, hr + Math.round(Math.random() * 6 - 2)));
        layers.workout.querySelector('.bpm').textContent = hr;
      }, 1000);
      startWorkout.pause = function () { paused = !paused; toast(paused ? 'Paused' : 'Resumed'); };
      startWorkout.skip = function () { step = (step + 1) % WORKOUT.length; setStep(); };
    }

    function select() {
      var el = state.layer ? layerBtns()[state.li] : cur();
      el.classList.add('is-press'); setTimeout(function () { el.classList.remove('is-press'); }, 120);
      if (!state.layer) {
        var act = el.getAttribute('data-act');
        if (act === 'play') return startWorkout(FEATURE);
        if (act === 'more') return openDetail(FEATURE);
        return openDetail(itemAt(state.r, state.i));
      }
      var a = el.getAttribute('data-act');
      if (a === 'start') startWorkout(state.item);
      else if (a === 'queue') toast('Added to Up Next');
      else if (a === 'share') toast('SharePlay invite sent to the family group');
      else if (a === 'pause') startWorkout.pause();
      else if (a === 'skip') startWorkout.skip();
      else if (a === 'end') { back(); toast('Nice work. 214 kcal · 18 min'); }
    }
    function back() {
      if (!state.layer) return toast('Already on the home screen');
      if (state.layer === 'workout') clearInterval(timer);
      layers[state.layer].classList.remove('is-open');
      state.layer = stack.pop() || null;
      if (state.layer) { layers[state.layer].classList.add('is-open'); state.li = 0; paintLayer(); } else paint();
    }

    // Pointer parallax on the focused card
    screen.addEventListener('mousemove', function (e) {
      if (reduce) return;
      var el = screen.querySelector('.tv__card.is-focus'); if (!el) return;
      var b = el.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      if (x < -0.3 || x > 1.3 || y < -0.5 || y > 1.5) return;
      el.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg');
      el.style.setProperty('--rx', ((0.5 - y) * 10).toFixed(2) + 'deg');
      el.style.setProperty('--mx', (x * 100).toFixed(0) + '%');
      el.style.setProperty('--my', (y * 100).toFixed(0) + '%');
    });
    // Click a card or button to focus/select it directly
    screen.addEventListener('click', function (e) {
      if (demo || !root.classList.contains('is-active')) return;
      var card = e.target.closest('.tv__card');
      if (card && !state.layer) {
        var r = +card.getAttribute('data-r'), i = +card.getAttribute('data-i');
        if (state.r === r && state.i === i) return select();
        state.r = r; state.i = i; return paint();
      }
      var btn = e.target.closest('.tv__btn');
      if (btn) {
        if (state.layer) { state.li = layerBtns().indexOf(btn); paintLayer(); return select(); }
        state.r = -1; state.i = heroBtns.indexOf(btn); paint(); select();
      }
    });

    paint();
    window.addEventListener('resize', function () { paint(); });
    return { move: move, select: select, back: back, toast: toast, playPause: function () { if (state.layer === 'workout') startWorkout.pause(); else select(); } };
  }

  // ----- Interactive prototype -----
  document.querySelectorAll('[data-tv]').forEach(function (root) {
    var api = build(root);
    if (root.hasAttribute('data-demo')) {
      if (reduce) return;
      var path = ['d', 'r', 'r', 'r', 'd', 'r', 'u', 'l', 'l', 'u', 'r', 'l', 'd', 'l'];
      var k = 0, iv = null;
      function startDemo() { if (!iv) iv = setInterval(function () { api.move(path[k++ % path.length]); }, 1500); }
      function stopDemo() { clearInterval(iv); iv = null; }
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { e.isIntersecting ? startDemo() : stopDemo(); }); }).observe(root);
      else startDemo();
      return;
    }
    var remote = document.querySelector('[data-remote-for="' + root.id + '"]');
    function activate() { if (!root.classList.contains('is-active')) { root.classList.add('is-active'); api.toast('Remote connected'); } }
    function deactivate() { root.classList.remove('is-active'); }
    root.tabIndex = 0;
    root.addEventListener('focus', activate);
    root.addEventListener('click', function () { activate(); root.focus({ preventScroll: true }); });
    document.addEventListener('click', function (e) { if (!root.contains(e.target) && !(remote && remote.contains(e.target))) deactivate(); });
    document.addEventListener('keydown', function (e) {
      if (!root.classList.contains('is-active')) return;
      var map = { ArrowUp: 'u', ArrowDown: 'd', ArrowLeft: 'l', ArrowRight: 'r' };
      if (map[e.key]) { e.preventDefault(); api.move(map[e.key]); hit(map[e.key]); }
      else if (e.key === 'Enter') { e.preventDefault(); api.select(); hit('c'); }
      else if (e.key === 'Escape' || e.key === 'Backspace') { e.preventDefault(); api.back(); hit('back'); }
      else if (e.key === ' ') { e.preventDefault(); api.playPause(); hit('pp'); }
    });
    function hit(k) {
      if (!remote) return;
      var b = remote.querySelector('[data-k="' + k + '"]'); if (!b) return;
      b.classList.add('is-hit'); setTimeout(function () { b.classList.remove('is-hit'); }, 160);
    }
    if (remote) remote.querySelectorAll('[data-k]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation(); activate();
        var k = b.getAttribute('data-k');
        if (k === 'c') api.select(); else if (k === 'back') api.back(); else if (k === 'pp') api.playPause(); else if (k === 'home') { api.back(); api.back(); } else api.move(k);
      });
    });
    var safeBtn = document.querySelector('[data-safe-for="' + root.id + '"]');
    if (safeBtn) safeBtn.addEventListener('change', function () { root.classList.toggle('show-safe', safeBtn.checked); });
  });

  // ----- Focus lab -----
  var lab = document.querySelector('[data-lab]');
  if (lab) {
    var card = lab.querySelector('.lab__card'), spec = lab.querySelector('.lab__spec');
    var f = function (n) { return lab.querySelector('[name="' + n + '"]'); };
    var stateBtns = lab.querySelector('[data-tabs]');
    var st = 'focus';
    function upd() {
      var sc = +f('scale').value, lift = +f('lift').value, dur = +f('dur').value, tilt = f('tilt').checked && !f('rm').checked;
      var s = st === 'rest' ? 1 : st === 'press' ? 1 + (sc - 1) * 0.4 : sc;
      var sy = st === 'rest' ? 4 : lift, sb = st === 'rest' ? 10 : lift * 1.8, so = st === 'rest' ? 0.25 : 0.5;
      card.style.setProperty('--s', s);
      card.style.setProperty('--sy', sy + 'px'); card.style.setProperty('--sb', sb + 'px'); card.style.setProperty('--so', so);
      card.style.setProperty('--dur', (f('rm').checked ? 0 : st === 'press' ? 100 : dur) + 'ms');
      card.style.setProperty('--sheen', st === 'focus' && tilt ? 0.6 : 0);
      if (!tilt || st !== 'focus') { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); }
      lab.querySelectorAll('output').forEach(function (o) {
        var n = o.getAttribute('for'); o.textContent = n === 'scale' ? (+f(n).value).toFixed(2) + '×' : n === 'lift' ? f(n).value + ' pt' : f(n).value + ' ms';
      });
      spec.textContent = 'state:      ' + st + '\nscale:      ' + s.toFixed(2) + '\nshadow:     0 ' + sy + ' ' + Math.round(sb) + ' rgba(0,0,0,' + so + ')\nparallax:   ' + (tilt && st === 'focus' ? 'on, ±5° follows touch' : 'off') + '\nduration:   ' + (f('rm').checked ? '0 ms (Reduce Motion)' : (st === 'press' ? 100 : dur) + ' ms, ease-out');
    }
    lab.querySelectorAll('input').forEach(function (i) { i.addEventListener('input', upd); });
    stateBtns.addEventListener('tabchange', function (e) { st = e.detail.key; upd(); });
    lab.querySelector('.lab__stage').addEventListener('mousemove', function (e) {
      if (st !== 'focus' || !f('tilt').checked || f('rm').checked) return;
      var b = card.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      card.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg'); card.style.setProperty('--rx', ((0.5 - y) * 10).toFixed(2) + 'deg');
      card.style.setProperty('--mx', (x * 100).toFixed(0) + '%'); card.style.setProperty('--my', (y * 100).toFixed(0) + '%');
    });
    lab.querySelector('.lab__stage').addEventListener('mouseleave', function () { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    upd();
  }
})();
