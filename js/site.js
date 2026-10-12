/* Hector Osuna — portfolio interactions. No dependencies. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var ARROW_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
  window.OSUNA = { arrow: ARROW, arrowL: ARROW_L };

  /* ---------- Nav ---------- */
  var nav = $('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    var toggle = $('.nav__toggle', nav);
    if (toggle) toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('.nav__links a', nav).forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('is-open'); }); });
  }
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Toast ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toast.t); toast.t = setTimeout(function () { toastEl.classList.remove('is-on'); }, 1800);
  }
  function copy(text, msg) {
    var done = function () { toast(msg || 'Copied ' + text); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, done);
    else { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} t.remove(); done(); }
  }
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () { copy(b.getAttribute('data-copy'), b.getAttribute('data-copy-msg')); });
  });

  /* ---------- Reveal (home only, sparingly) ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      if (el.hasAttribute('data-reveal')) el.classList.add('is-in');
      if (el.hasAttribute('data-count')) countUp(el);
      if (el.matches('.flow, .bars')) el.classList.add('is-drawn');
      io.unobserve(el);
    });
  }, { threshold: 0.2 }) : null;
  function observe(el) { if (io) io.observe(el); else { el.classList.add('is-in', 'is-drawn'); } }
  $$('[data-reveal], [data-count], .flow, .bars').forEach(observe);

  /* ---------- Count-up ---------- */
  function countUp(el) {
    if (el.dataset.counted) return; el.dataset.counted = '1';
    var target = parseFloat(el.dataset.count), pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    var dec = (el.dataset.count.split('.')[1] || '').length;
    var sign = pre ? '<span class="sign">' + pre + '</span>' : '';
    if (reduce) { el.innerHTML = sign + target.toFixed(dec) + suf; return; }
    var start = null, dur = 1300;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.innerHTML = sign + (target * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Segmented pill ---------- */
  function placePill(group) {
    var pill = $('.seg__pill', group), on = $('[aria-selected="true"]', group);
    if (!pill || !on || !on.offsetWidth) return;
    pill.style.width = on.offsetWidth + 'px';
    pill.style.height = on.offsetHeight + 'px';
    pill.style.transform = 'translate(' + on.offsetLeft + 'px,' + on.offsetTop + 'px)';
  }

  /* ---------- Tabs ---------- */
  function initTabs(group) {
    var name = group.getAttribute('data-tabs');
    var btns = $$('[data-tab]', group);
    group.setAttribute('role', 'tablist');
    if (group.classList.contains('seg') && !$('.seg__pill', group)) {
      var p = document.createElement('span'); p.className = 'seg__pill'; p.setAttribute('aria-hidden', 'true'); group.prepend(p);
    }
    function select(btn, focus) {
      var key = btn.getAttribute('data-tab');
      btns.forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
      });
      $$('[data-tabpanel^="' + name + ':"]').forEach(function (panel) {
        var show = panel.getAttribute('data-tabpanel') === name + ':' + key;
        if (show && panel.hidden) { panel.hidden = false; panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering'); refresh(panel); }
        else if (!show) panel.hidden = true;
      });
      placePill(group);
      if (focus) btn.focus();
      group.dispatchEvent(new CustomEvent('tabchange', { detail: { key: key, btn: btn }, bubbles: true }));
    }
    btns.forEach(function (b, i) {
      b.setAttribute('role', 'tab'); b.type = 'button';
      b.addEventListener('click', function () { select(b); });
      b.addEventListener('keydown', function (e) {
        var d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!d) return; e.preventDefault();
        select(btns[(i + d + btns.length) % btns.length], true);
      });
    });
    var first = btns.filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0] || btns[0];
    if (first) select(first);
    group._select = select;
  }
  $$('[data-tabs]').forEach(initTabs);
  window.addEventListener('resize', function () { $$('.seg').forEach(placePill); });

  /* ---------- Scrollshot ---------- */
  function sizeShot(s) {
    var img = $('img', s); if (!img) return;
    var fit = function () {
      var shift = img.offsetHeight - s.clientHeight;
      if (shift <= 0) return;
      s.style.setProperty('--shift', shift + 'px');
      s.style.setProperty('--t', Math.min(Math.max(shift / 260, 2.5), 12) + 's');
    };
    if (img.complete) fit(); else img.addEventListener('load', fit, { once: true });
  }
  $$('.scrollshot').forEach(sizeShot);

  /* Things that need measuring after a hidden panel becomes visible */
  function refresh(root) {
    $$('.scrollshot', root).forEach(sizeShot);
    $$('.seg', root).forEach(placePill);
    $$('[data-count]', root).forEach(function (el) { if (io) { io.unobserve(el); io.observe(el); } });
  }

  /* ---------- Compare slider ---------- */
  $$('.compare').forEach(function (c) {
    var input = $('input', c);
    var set = function () { c.style.setProperty('--pos', input.value + '%'); };
    input.addEventListener('input', set); set();
  });

  /* ---------- Hotspots ---------- */
  $$('.hot').forEach(function (h, i) {
    h.style.setProperty('--i', i);
    var pin = $('.hot__pin', h);
    pin.setAttribute('aria-expanded', 'false');
    pin.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !h.classList.contains('is-open');
      $$('.hot.is-open').forEach(function (o) { o.classList.remove('is-open'); $('.hot__pin', o).setAttribute('aria-expanded', 'false'); });
      h.classList.toggle('is-open', open); pin.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function () { $$('.hot.is-open').forEach(function (o) { o.classList.remove('is-open'); }); });

  /* ---------- Lightbox ---------- */
  var lb = null, lbItems = [], lbI = 0, lbReturnFocus = null;
  function closeLb() { if (lb && lb.open) lb.close(); }
  function buildLb() {
    lb = document.createElement('dialog'); lb.className = 'lightbox';
    lb.setAttribute('aria-label', 'Expanded project image');
    lb.style.cssText = 'position:fixed;inset:0;width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:#111;color:white;z-index:2147483647;';
    lb.innerHTML = '<div class="lightbox__bar" style="display:flex;justify-content:space-between;align-items:center;padding:16px"><span class="lightbox__title"></span><button type="button" class="lightbox__close" aria-label="Close expanded image" style="color:white;background:#333;border:1px solid #777;padding:10px 16px">Close ×</button></div><div class="lightbox__body" style="overflow:auto;display:flex;align-items:flex-start;justify-content:center;padding:16px;height:calc(100dvh - 80px)"><img alt="" style="display:block;width:100%;max-width:1600px;height:auto;max-height:none;object-fit:contain;background:white"></div>';
    document.body.appendChild(lb);
    lb.querySelector('.lightbox__close').addEventListener('click', closeLb);
    lb.addEventListener('click', function(e) { if(e.target === lb || e.target === lb.querySelector('.lightbox__body')) closeLb(); });
    lb.addEventListener('close', function() { lb.style.display = 'none'; document.body.classList.remove('no-scroll'); if(lbReturnFocus) lbReturnFocus.focus(); });
  }
  function openLb(el) {
    var source = el.tagName === 'IMG' ? el : el.querySelector('img');
    var src = el.getAttribute('data-zoom') || (source && (source.currentSrc || source.src));
    if (!src) return;
    if (!lb) buildLb();
    lbReturnFocus = el;
    var img = lb.querySelector('.lightbox__body img');
    img.src = src; img.alt = el.getAttribute('data-title') || (source && source.alt) || 'Expanded project image';
    lb.querySelector('.lightbox__title').textContent = img.alt;
    lb.querySelector('.lightbox__body').scrollTop = 0;
    document.body.classList.add('no-scroll');
    if (!lb.open) lb.showModal();
    lb.style.display = 'grid'; lb.style.gridTemplateRows = 'auto 1fr';
  }
  document.addEventListener('click', function(e) {
    var target = e.target.nodeType === 1 ? e.target : e.target.parentElement;
    var el = target && target.closest('[data-zoom]');
    if (!el || target.closest('.hot, .deck__arrow')) return;
    e.preventDefault(); e.stopImmediatePropagation(); openLb(el);
  }, true);
  $$('[data-zoom]').forEach(function(el) {
    if (!/^(BUTTON|A)$/.test(el.tagName)) { el.tabIndex=0; el.setAttribute('role','button'); }
    el.addEventListener('keydown', function(e) { if(e.key==='Enter'||e.key===' ') { e.preventDefault(); e.stopPropagation(); openLb(el); } });
  });

  /* ---------- Deck ---------- */
  $$('[data-deck]').forEach(function (deck) {
    var data = JSON.parse($('script[type="application/json"]', deck).textContent);
    var base = deck.getAttribute('data-deck') || '';
    deck.tabIndex = 0;
    deck.setAttribute('aria-roledescription', 'carousel');
    deck.insertAdjacentHTML('beforeend',
      '<div class="deck__stage"><img alt=""><button class="deck__arrow prev" aria-label="Previous slide">' + ARROW_L + '</button><button class="deck__arrow next" aria-label="Next slide">' + ARROW + '</button></div>' +
      '<div class="deck__note"><div class="deck__count"><span class="c"></span><button class="deck__full" type="button">Full screen</button></div><div class="deck__bar"><i></i></div><h3></h3><p></p><div class="chips"></div></div>' +
      '<div class="deck__thumbs"></div>');
    var img = $('.deck__stage img', deck), thumbs = $('.deck__thumbs', deck), i = 0;
    data.forEach(function (s, k) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Slide ' + (k + 1) + ': ' + s.t);
      b.innerHTML = '<img loading="lazy" alt="" src="' + base + s.src + '">';
      b.addEventListener('click', function () { go(k); }); thumbs.appendChild(b);
    });
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function go(k) {
      i = (k + data.length) % data.length; var s = data[i];
      img.classList.add('is-out');
      setTimeout(function () {
        img.src = base + s.src; img.alt = s.t;
        img.onload = function () { img.classList.remove('is-out'); };
        if (img.complete) img.classList.remove('is-out');
      }, reduce ? 0 : 160);
      $('.deck__count .c', deck).textContent = pad(i + 1) + ' / ' + pad(data.length);
      $('.deck__bar i', deck).style.width = ((i + 1) / data.length * 100) + '%';
      $('.deck__note h3', deck).textContent = s.t;
      $('.deck__note p', deck).textContent = s.p || '';
      $('.deck__note .chips', deck).innerHTML = (s.g || []).map(function (x) { return '<span class="chip">' + x + '</span>'; }).join('');
      $$('button', thumbs).forEach(function (t, n) { t.setAttribute('aria-current', String(n === i)); });
      var on = thumbs.children[i];
      thumbs.scrollTo({ left: on.offsetLeft - thumbs.clientWidth / 2 + on.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
      var pre = new Image(); pre.src = base + data[(i + 1) % data.length].src;
    }
    $('.prev', deck).addEventListener('click', function () { go(i - 1); });
    $('.next', deck).addEventListener('click', function () { go(i + 1); });
    var fb = $('.deck__full', deck);
    function full(on) { deck.classList.toggle('is-full', on); document.body.classList.toggle('no-scroll', on); fb.textContent = on ? 'Close ✕' : 'Full screen'; if (on) deck.focus(); }
    fb.addEventListener('click', function () { full(!deck.classList.contains('is-full')); });
    $('.deck__stage', deck).addEventListener('dblclick', function () { full(!deck.classList.contains('is-full')); });
    deck.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); go(i + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); go(i - 1); }
      if (e.key === 'Escape' && deck.classList.contains('is-full')) full(false);
    });
    var tx = null, st = $('.deck__stage', deck);
    st.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    st.addEventListener('touchend', function (e) { if (tx === null) return; var d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 40) go(i + (d < 0 ? 1 : -1)); tx = null; });
    go(0);
  });

  /* ---------- Chapters (case studies) ---------- */
  var chWrap = $('[data-chapters]');
  if (chWrap) {
    var panels = $$('.chapter', chWrap);
    var bar = document.createElement('nav'); bar.className = 'chapters'; bar.setAttribute('aria-label', 'Case study chapters');
    bar.innerHTML = '<div class="wrap chapters__in"><span class="chapters__label">Chapter<b class="chapters__pos"></b></span><div class="chapters__list" role="tablist"></div><div class="chapters__step"><button type="button" class="p" aria-label="Previous chapter">' + ARROW_L + '</button><button type="button" class="n" aria-label="Next chapter">' + ARROW + '</button></div></div>';
    chWrap.parentNode.insertBefore(bar, chWrap);
    var list = $('.chapters__list', bar), ink = document.createElement('span');
    ink.className = 'chapters__ink'; list.appendChild(ink);
    var tabs = panels.map(function (p, k) {
      var id = p.id || ('ch-' + (k + 1)); p.id = id;
      p.setAttribute('role', 'tabpanel'); p.setAttribute('tabindex', '-1');
      var t = document.createElement('button'); t.type = 'button'; t.className = 'chapters__tab'; t.setAttribute('role', 'tab');
      t.setAttribute('aria-controls', id); t.id = 'tab-' + id;
      p.setAttribute('aria-labelledby', t.id);
      t.innerHTML = '<span class="n">' + (k + 1 < 10 ? '0' : '') + (k + 1) + '</span>' + p.getAttribute('data-title');
      t.addEventListener('click', function () { show(k, true); });
      list.insertBefore(t, ink);
      // auto stagger
      var n = 0;
      $$('[data-anim]', p).forEach(function (el) { el.style.setProperty('--d', n++); });
      // footer
      var next = panels[k + 1];
      var foot = document.createElement('div'); foot.className = 'chapter__foot';
      foot.innerHTML = '<span class="chapter__count">Chapter ' + (k + 1) + ' of ' + panels.length + '</span>' +
        (next ? '<button type="button" class="chapter__next"><span><small>Next chapter</small><b>' + next.getAttribute('data-title') + '</b></span><i>' + ARROW + '</i></button>'
              : '<a class="chapter__next" href="#top" data-top><span><small>End of case study</small><b>Back to the top</b></span><i style="transform:rotate(-90deg)">' + ARROW + '</i></a>');
      ($('.wrap', p) || p).appendChild(foot);
      var nb = $('button.chapter__next', foot);
      if (nb) nb.addEventListener('click', function () { show(k + 1, true); });
      var tb = $('[data-top]', foot);
      if (tb) tb.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
      return t;
    });
    var cur = -1;
    function moveInk() {
      var t = tabs[cur]; if (!t) return;
      ink.style.width = t.offsetWidth + 'px'; ink.style.transform = 'translateX(' + t.offsetLeft + 'px)';
      list.scrollTo({ left: t.offsetLeft - list.clientWidth / 2 + t.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
    }
    function show(k, user) {
      k = Math.max(0, Math.min(panels.length - 1, k));
      if (k === cur) return;
      panels.forEach(function (p, n) {
        var on = n === k; p.hidden = !on; p.classList.toggle('is-entering', false);
        tabs[n].setAttribute('aria-selected', String(on)); tabs[n].tabIndex = on ? 0 : -1; tabs[n].classList.toggle('is-done', n < k);
      });
      var p = panels[k]; void p.offsetWidth; p.classList.add('is-entering');
      cur = k; moveInk(); refresh(p); $('.chapters__pos', bar).textContent = (k + 1) + ' of ' + panels.length;
      $('.p', bar).disabled = k === 0; $('.n', bar).disabled = k === panels.length - 1;
      if (user) {
        history.replaceState(null, '', '#' + p.id);
        var top = chWrap.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - bar.offsetHeight;
        if (Math.abs(window.scrollY - top) > 2) window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
      }
    }
    $('.p', bar).addEventListener('click', function () { show(cur - 1, true); });
    $('.n', bar).addEventListener('click', function () { show(cur + 1, true); });
    list.addEventListener('keydown', function (e) {
      var d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return;
      e.preventDefault(); show(cur + d, true); tabs[cur].focus();
    });
    document.addEventListener('keydown', function (e) {
      if (e.target.closest('input, textarea, [data-deck], [role="tablist"]:not(.chapters__list)') || (lb && lb.open)) return;
      if (e.key === ']' ) show(cur + 1, true);
      if (e.key === '[') show(cur - 1, true);
    });
    var start = 0, h = location.hash.slice(1);
    panels.forEach(function (p, n) { if (p.id === h) start = n; });
    show(start, false);
    window.addEventListener('resize', moveInk);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveInk);
    // Links inside the page that point at a chapter
    $$('a[href^="#ch-"], a[data-chapter]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('data-chapter') || a.getAttribute('href').slice(1);
        panels.forEach(function (p, n) { if (p.id === id) { e.preventDefault(); show(n, true); } });
      });
    });
  }

  /* ---------- Home: card deal ---------- */
  var deal = $('.deal');
  if (deal) {
    var cards = $$('.deal__card', deal), dots = $('.deal__nav', deal), order = cards.map(function (_, k) { return k; }), timer;
    cards.forEach(function (c, k) {
      c.style.setProperty('--i', k);
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Show ' + c.getAttribute('data-name'));
      b.addEventListener('click', function () { bring(k); restart(); }); dots.appendChild(b);
    });
    function paint() {
      order.forEach(function (ci, pos) { cards[ci].setAttribute('data-pos', pos); cards[ci].classList.toggle('is-top', pos === 0); cards[ci].tabIndex = pos === 0 ? 0 : -1; });
      $$('button', dots).forEach(function (b, k) { b.classList.remove('is-on'); void b.offsetWidth; b.classList.toggle('is-on', k === order[0]); });
    }
    function bring(k) { order = [k].concat(order.filter(function (x) { return x !== k; })); paint(); }
    function rotate() { bring(order[1]); }
    function restart() { clearInterval(timer); if (!reduce) timer = setInterval(rotate, 5000); }
    deal.addEventListener('mouseenter', function () { deal.classList.add('is-paused'); clearInterval(timer); });
    deal.addEventListener('mouseleave', function () { deal.classList.remove('is-paused'); bring(order[0]); restart(); });
    paint(); restart();
  }

  /* ---------- Home: work index preview ---------- */
  var index = $('.index');
  if (index) {
    var rows = $$('.index__row', index), pv = $('.preview', index), pvMedia = $('.preview__media', pv), active = null;
    var imgs = {};
    rows.forEach(function (r) {
      var d = r.dataset, im = document.createElement('img');
      im.src = d.img; im.alt = ''; im.loading = 'lazy'; im.decoding = 'async';
      pvMedia.appendChild(im); imgs[d.key] = im;
    });
    function activate(r) {
      if (r === active) return; active = r;
      var d = r.dataset;
      rows.forEach(function (x) { x.classList.toggle('is-active', x === r); });
      Object.keys(imgs).forEach(function (k) { imgs[k].classList.toggle('is-on', k === d.key); });
      pv.classList.add('is-swapping');
      clearTimeout(activate.t);
      activate.t = setTimeout(function () {
        $('.preview__tag', pv).textContent = d.tag;
        $('.preview__title', pv).textContent = d.title;
        $('.preview__text', pv).textContent = d.text;
        var f = $$('.preview__facts dd', pv); f[0].textContent = d.role; f[1].textContent = d.when; f[2].textContent = d.scope;
        $('.preview__foot .chips', pv).innerHTML = d.tags.split('|').map(function (t) { return '<span class="chip">' + t + '</span>'; }).join('');
        var go = $('.preview__foot a', pv); go.href = $('a', r).getAttribute('href'); go.querySelector('span').textContent = 'Open ' + d.short;
        pv.classList.remove('is-swapping');
      }, 180);
    }
    rows.forEach(function (r) {
      r.addEventListener('mouseenter', function () { activate(r); });
      $('a', r).addEventListener('focus', function () { activate(r); });
    });
    activate(rows[0]);
  }

  /* ---------- Home: principles accordion ---------- */
  $$('.principle').forEach(function (p) {
    var b = $('button', p);
    b.addEventListener('click', function () {
      var open = !p.classList.contains('is-open');
      $$('.principle').forEach(function (o) { o.classList.remove('is-open'); $('button', o).setAttribute('aria-expanded', 'false'); });
      p.classList.toggle('is-open', open); b.setAttribute('aria-expanded', String(open));
    });
  });
  $$('.job').forEach(function (p) {
    var b = $('.job__btn', p);
    b.addEventListener('click', function () { var open = p.classList.toggle('is-open'); b.setAttribute('aria-expanded', String(open)); });
  });

  /* ---------- Home: testimonials ---------- */
  var voices = $('.voices');
  if (voices) {
    var people = $$('.person', voices), q = $('.quote', voices), vi = 0, vt;
    function say(k) {
      vi = (k + people.length) % people.length;
      people.forEach(function (p, n) { p.setAttribute('aria-selected', String(n === vi)); p.tabIndex = n === vi ? 0 : -1; });
      q.classList.add('is-swapping');
      setTimeout(function () {
        var p = people[vi];
        $('blockquote', q).textContent = p.dataset.quote;
        $('figcaption', q).innerHTML = '<b>' + p.dataset.name + '</b>, ' + p.dataset.role;
        var bar = $('.quote__bar', q); bar.innerHTML = '<i></i>';
        q.classList.remove('is-swapping');
      }, reduce ? 0 : 220);
    }
    function vrestart() { clearInterval(vt); if (!reduce) vt = setInterval(function () { say(vi + 1); }, 9000); }
    people.forEach(function (p, k) {
      p.addEventListener('click', function () { say(k); vrestart(); });
      p.addEventListener('keydown', function (e) {
        var d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!d) return;
        e.preventDefault(); say(vi + d); people[vi].focus(); vrestart();
      });
    });
    voices.addEventListener('mouseenter', function () { voices.classList.add('is-paused'); clearInterval(vt); });
    voices.addEventListener('mouseleave', function () { voices.classList.remove('is-paused'); vrestart(); });
    say(0); vrestart();
  }
})();
