/* Hector Osuna — "The Journey"
   An isometric, Apple Maps–inspired diorama. A Memoji-style character walks a
   route between career stops while the camera follows. No dependencies. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ content */
  var STOPS = [
    { key: 'lab', short: 'UT Dallas', chapter: 'Foundation', color: '#30b0c7',
      title: 'University of Texas at Dallas', role: 'Chemistry coursework', when: '2006 – 2009', where: 'Richardson, TX',
      text: 'Before design, there was the lab. Chemistry taught me to form a hypothesis, test it and let the results decide. It is the same loop I still use to improve a page, a flow or a campaign.',
      chips: ['Scientific method', 'Analytical thinking'] },
    { key: 'school', short: 'Art Institute', chapter: 'The switch', color: '#ff9f0a',
      title: 'The Art Institute of Dallas', role: 'Graphic and Web Design', when: '2013 – 2016', where: 'Dallas, TX',
      text: 'I traded beakers for typography. Layout, color, hierarchy and the web became the new lab, and curiosity about why things work turned into a craft.',
      chips: ['Typography', 'Layout', 'Web design'] },
    { key: 'office', short: 'Working Solutions', chapter: 'Brand', color: '#0071e3',
      title: 'Working Solutions', role: 'Senior Graphic & Web Designer', when: '2015 – 2021', where: 'In-house',
      text: 'Led the visual and digital design of a company rebrand: identity, B2B website and a presentation system. Analytics and heatmaps then guided how the new site was organized.',
      chips: ['REBRAND® 100 Merit', '+338% organic traffic', '+87% searchability'], link: 'working-solutions.html' },
    { key: 'clinic', short: 'CareerStaff', chapter: 'Structure', color: '#34c759',
      title: 'CareerStaff Unlimited', role: 'Senior Graphic Web Designer', when: '2021', where: 'Healthcare staffing',
      text: 'Planned a website redesign around three audiences, with information architecture, wireframes and clickable prototypes. Ten top-level menus became three clear paths.',
      chips: ['10 menus → 3 paths', '80% faster pages', '2 client wins'], link: 'careerstaff.html' },
    { key: 'warehouse', short: 'ADI', chapter: 'Scale', color: '#5856d6',
      title: 'ADI Global Distribution', role: 'Senior Graphic Web Designer', when: '2021 – 2023', where: 'B2B e-commerce',
      text: 'Designed responsive landing pages and interactive elements for a global distributor, and kept components and visual standards consistent across every marketing touchpoint.',
      chips: ['−55% bounce rate', '+25% engagement', '+15% satisfaction'], link: 'adi-resideo.html' },
    { key: 'garage', short: 'Caliber', chapter: 'Direction', color: '#ff375f',
      title: 'Caliber', role: 'Senior Graphic & UI Designer (contract)', when: '2024', where: 'Auto Care · Collision · Glass',
      text: 'Led creative direction and review workflows across three lines of business, and built color and brand guidelines that kept every campaign speaking with one voice.',
      chips: ['+45% engagement', '+20% interaction', '3 lines of business'], link: 'caliber.html' },
    { key: 'tower', short: 'NTT DATA · ADI', chapter: 'Systems', color: '#af52de',
      title: 'NTT DATA, for ADI / Resideo', role: 'Senior Digital & UI Designer (contract)', when: '2024 – Present', where: 'Enterprise e-commerce',
      text: 'Designing responsive vendor brand pages and a reusable Figma component library with desktop, tablet and mobile variants. Along the way, earned a UI/UX certification from UT Austin.',
      chips: ['Figma component system', '3 breakpoints', 'UT Austin UI/UX, 2025'], link: 'adi-resideo.html' },
    { key: 'pavilion', short: "What's next", chapter: 'Next', color: '#0071e3',
      title: 'Designing for every screen', role: 'tvOS concepts and the next chapter', when: 'Now', where: 'Your team',
      text: 'From phone to living room: self-initiated tvOS concepts and an Apple TV app redesign. The next stop is a team that sweats the details people never consciously notice.',
      chips: ['Apple TV app concept', 'FitNudge for TV'], link: 'apple-tv.html', final: true }
  ];

  /* ------------------------------------------------------------------ iso helpers */
  var T = 64, A = T * 0.866, B = T * 0.5;
  function P(x, y, z) { return [(x - y) * A, (x + y) * B - (z || 0)]; }
  function pts(list) { return list.map(function (p) { var q = P(p[0], p[1], p[2]); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' '); }
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function poly(parent, list, fill, extra) {
    var a = { points: pts(list), fill: fill };
    for (var k in extra) a[k] = extra[k];
    return el('polygon', a, parent);
  }
  function shade(hex, f) { // f < 0 darkens, > 0 lightens
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function c(v) { return Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f); }
    return '#' + ((1 << 24) + (c(r) << 16) + (c(g) << 8) + c(b)).toString(16).slice(1);
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function quadPoint(q, u, v) { // q: [a(bl), b(br), c(tr), d(tl)] in world coords; bilinear
    var x = lerp(lerp(q[0][0], q[1][0], u), lerp(q[3][0], q[2][0], u), v);
    var y = lerp(lerp(q[0][1], q[1][1], u), lerp(q[3][1], q[2][1], u), v);
    var z = lerp(lerp(q[0][2], q[1][2], u), lerp(q[3][2], q[2][2], u), v);
    return [x, y, z];
  }
  function windows(g, q, cols, rows, fill, opt) {
    opt = opt || {};
    var mx = opt.mx || 0.14, my = opt.my || 0.16, gx = opt.gx || 0.35, gy = opt.gy || 0.4;
    var cw = (1 - 2 * mx) / (cols - gx * (cols - 1) / (1)) ; // not used directly
    var w = (1 - 2 * mx) / (cols + (cols - 1) * gx), h = (1 - 2 * my) / (rows + (rows - 1) * gy);
    for (var c = 0; c < cols; c++) for (var r = 0; r < rows; r++) {
      var u0 = mx + c * w * (1 + gx), v0 = my + r * h * (1 + gy);
      poly(g, [quadPoint(q, u0, v0), quadPoint(q, u0 + w, v0), quadPoint(q, u0 + w, v0 + h), quadPoint(q, u0, v0 + h)], fill, opt.attrs || {});
    }
    void cw;
  }
  // Extruded box. Faces visible to the camera: top, "left" (y = y0+d) and "right" (x = x0+w).
  function box(g, x0, y0, w, d, z0, h, col) {
    var x1 = x0 + w, y1 = y0 + d, z1 = z0 + h;
    var left = [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]];
    var right = [[x1, y1, z0], [x1, y0, z0], [x1, y0, z1], [x1, y1, z1]];
    var top = [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
    poly(g, left, col.left || shade(col.base, -0.16));
    poly(g, right, col.right || shade(col.base, -0.07));
    poly(g, top, col.top || col.base);
    return { left: left, right: right, top: top };
  }
  function shadowFoot(g, x0, y0, w, d, len) {
    len = len || 1.2;
    poly(g, [[x0 + w, y0, 0], [x0 + w + len, y0 + len * 0.5, 0], [x0 + w + len, y0 + d + len * 0.5, 0], [x0 + len * 0.3, y0 + d + len * 0.5, 0], [x0, y0 + d, 0]], 'rgba(30,40,60,.10)');
  }
  function gable(g, x0, y0, w, d, z0, r, roof) { // pitched roof, ridge along x
    var x1 = x0 + w, y1 = y0 + d, m = y0 + d / 2, z1 = z0 + r;
    poly(g, [[x0, y0, z0], [x1, y0, z0], [x1, m, z1], [x0, m, z1]], shade(roof, -0.25));
    poly(g, [[x1, y0, z0], [x1, y1, z0], [x1, m, z1]], '#f4f4f6');
    poly(g, [[x0, y1, z0], [x1, y1, z0], [x1, m, z1], [x0, m, z1]], roof);
  }
  function tree(g, x, y, s, tone) {
    s = s || 1;
    var base = P(x, y, 0);
    el('ellipse', { cx: base[0] + 6 * s, cy: base[1] + 2, rx: 16 * s, ry: 7 * s, fill: 'rgba(30,50,40,.12)' }, g);
    el('rect', { x: base[0] - 2.5 * s, y: base[1] - 16 * s, width: 5 * s, height: 16 * s, rx: 2, fill: '#b79b7c' }, g);
    var cy = base[1] - 30 * s, c = tone || '#7cc47f';
    el('circle', { cx: base[0], cy: cy, r: 17 * s, fill: shade(c, -0.12) }, g);
    el('circle', { cx: base[0] - 3 * s, cy: cy - 3 * s, r: 14 * s, fill: c }, g);
    el('circle', { cx: base[0] - 7 * s, cy: cy - 8 * s, r: 5 * s, fill: 'rgba(255,255,255,.35)' }, g);
  }
  function lamp(g, x, y) {
    var b = P(x, y, 0);
    el('rect', { x: b[0] - 1.2, y: b[1] - 34, width: 2.4, height: 34, rx: 1.2, fill: '#8e8e93' }, g);
    el('circle', { cx: b[0], cy: b[1] - 36, r: 4, fill: '#fff', stroke: '#c7c7cc', 'stroke-width': 1 }, g);
  }
  function person(g, x, y, shirt) {
    var b = P(x, y, 0);
    el('ellipse', { cx: b[0], cy: b[1], rx: 6, ry: 2.5, fill: 'rgba(0,0,0,.12)' }, g);
    el('rect', { x: b[0] - 3.5, y: b[1] - 14, width: 7, height: 12, rx: 3, fill: shirt }, g);
    el('circle', { cx: b[0], cy: b[1] - 18, r: 4, fill: '#e9b896' }, g);
  }

  /* ------------------------------------------------------------------ world layout */
  // Route corners on a staircase. Each stop sits inside the block next to its corner.
  var C = [[0, 0], [0, 6], [6, 6], [6, 12], [12, 12], [12, 18], [18, 18], [18, 24], [24, 24]];
  var START = [-1.5, -2.4];
  var ROUTE = [START, [0, -2.4]].concat(C); // walk in from the start gate

  function stopSpot(i) {
    // inner side of the turn at corner i (for i = 0 use a block left of the road)
    if (i === 0) return { bx: -4.4, by: 0.6 };
    var p = C[i], q = C[i - 1], n = C[i + 1] || [p[0] + (p[0] - q[0]), p[1] + (p[1] - q[1])];
    var d1 = [Math.sign(p[0] - q[0]), Math.sign(p[1] - q[1])], d2 = [Math.sign(n[0] - p[0]), Math.sign(n[1] - p[1])];
    var cx = p[0] - d1[0] * 2.65 + d2[0] * 2.65, cy = p[1] - d1[1] * 2.65 + d2[1] * 2.65;
    return { bx: cx - 1.5, by: cy - 1.5 };
  }

  function drawBuilding(g, s, i) {
    var o = stopSpot(i), x = o.bx, y = o.by, c = s.color;
    var white = { base: '#ffffff', left: '#dfe3ea', right: '#eef0f4', top: '#ffffff' };
    var glass = shade(c, 0.55), glassL = shade(c, 0.3);
    shadowFoot(g, x, y, 3, 3, 1.4);
    var f, top = 0;
    switch (s.key) {
      case 'lab':
        f = box(g, x, y, 3, 3, 0, 52, white);
        windows(g, f.left, 4, 2, glassL); windows(g, f.right, 4, 2, glass);
        box(g, x + 0.9, y + 0.9, 1.4, 1.4, 52, 18, white);
        var dc = P(x + 1.6, y + 1.6, 78);
        el('ellipse', { cx: dc[0], cy: dc[1] + 6, rx: 30, ry: 15, fill: shade(c, 0.15) }, g);
        el('path', { d: 'M' + (dc[0] - 30) + ' ' + (dc[1] + 6) + ' a30 30 0 0 1 60 0 z', fill: c }, g);
        el('path', { d: 'M' + (dc[0] - 18) + ' ' + (dc[1] - 6) + ' a18 18 0 0 1 14 -14', stroke: 'rgba(255,255,255,.6)', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, g);
        top = 110; break;
      case 'school':
        f = box(g, x, y, 3.2, 2.6, 0, 46, white);
        windows(g, f.right, 3, 2, glass); windows(g, f.left, 5, 2, glassL);
        gable(g, x, y, 3.2, 2.6, 46, 34, c);
        for (var k = 0; k < 4; k++) box(g, x + 0.35 + k * 0.78, y + 2.75, 0.18, 0.18, 0, 40, { base: '#ffffff' });
        box(g, x + 0.1, y + 2.6, 3.0, 0.45, 40, 7, { base: '#ffffff' });
        top = 98; break;
      case 'office':
        f = box(g, x, y, 3, 3, 0, 70, white);
        windows(g, f.left, 3, 4, glassL, { gy: 0.6 }); windows(g, f.right, 3, 4, glass, { gy: 0.6 });
        box(g, x + 0.5, y + 0.5, 2, 2, 70, 26, white);
        var bub = P(x + 1.5, y + 1.5, 122);
        el('rect', { x: bub[0] - 24, y: bub[1] - 15, width: 48, height: 30, rx: 15, fill: c }, g);
        el('path', { d: 'M' + (bub[0] - 6) + ' ' + (bub[1] + 13) + ' l-6 10 l14 -9 z', fill: c }, g);
        [-10, 0, 10].forEach(function (dx) { el('circle', { cx: bub[0] + dx, cy: bub[1], r: 3.2, fill: '#fff' }, g); });
        top = 150; break;
      case 'clinic':
        f = box(g, x, y, 3.2, 3, 0, 40, white);
        windows(g, f.left, 5, 2, glassL); windows(g, f.right, 4, 2, glass);
        box(g, x + 0.2, y + 2.9, 2.2, 0.8, 0, 26, { base: shade(c, 0.6) });
        var pl = P(x + 1.6, y + 1.5, 40);
        el('circle', { cx: pl[0], cy: pl[1], r: 20, fill: c }, g);
        el('path', { d: 'M' + (pl[0] - 3.5) + ' ' + (pl[1] - 11) + 'h7v7.5h7.5v7h-7.5v7.5h-7v-7.5h-7.5v-7h7.5z', fill: '#fff' }, g);
        top = 76; break;
      case 'warehouse':
        f = box(g, x - 0.3, y, 3.6, 3.1, 0, 38, { base: '#f6f6f8', left: '#d9dde5', right: '#e9ecf1' });
        for (var dkk = 0; dkk < 3; dkk++) {
          var u0 = 0.1 + dkk * 0.3;
          poly(g, [quadPoint(f.left, u0, 0), quadPoint(f.left, u0 + 0.22, 0), quadPoint(f.left, u0 + 0.22, 0.62), quadPoint(f.left, u0, 0.62)], shade(c, 0.35));
        }
        windows(g, f.right, 4, 1, glass, { my: 0.62 });
        poly(g, [quadPoint(f.top, 0.05, 0.3), quadPoint(f.top, 0.95, 0.3), quadPoint(f.top, 0.95, 0.55), quadPoint(f.top, 0.05, 0.55)], shade(c, 0.5));
        box(g, x + 3.5, y + 2.0, 0.6, 0.6, 0, 14, { base: '#e3c9a0' });
        box(g, x + 3.6, y + 2.1, 0.45, 0.45, 14, 11, { base: '#ecd5ae' });
        box(g, x + 3.5, y + 1.2, 0.6, 0.6, 0, 14, { base: '#e3c9a0' });
        top = 70; break;
      case 'garage':
        f = box(g, x, y, 3.2, 3, 0, 36, white);
        for (var gk = 0; gk < 3; gk++) {
          var gu = 0.08 + gk * 0.31;
          poly(g, [quadPoint(f.left, gu, 0), quadPoint(f.left, gu + 0.25, 0), quadPoint(f.left, gu + 0.25, 0.7), quadPoint(f.left, gu, 0.7)], '#c9ced8');
          for (var sl = 1; sl < 5; sl++) poly(g, [quadPoint(f.left, gu, sl * 0.14), quadPoint(f.left, gu + 0.25, sl * 0.14), quadPoint(f.left, gu + 0.25, sl * 0.14 + 0.02), quadPoint(f.left, gu, sl * 0.14 + 0.02)], '#b4bac6');
        }
        poly(g, [quadPoint(f.left, 0, 0.78), quadPoint(f.left, 1, 0.78), quadPoint(f.left, 1, 1), quadPoint(f.left, 0, 1)], c);
        poly(g, [quadPoint(f.right, 0, 0.78), quadPoint(f.right, 1, 0.78), quadPoint(f.right, 1, 1), quadPoint(f.right, 0, 1)], shade(c, 0.1));
        windows(g, f.right, 2, 1, glass, { my: 0.2 });
        top = 66; break;
      case 'tower':
        var tg = { base: shade(c, 0.78), left: shade(c, 0.45), right: shade(c, 0.62), top: '#ffffff' };
        f = box(g, x + 0.3, y + 0.3, 2.4, 2.4, 0, 150, tg);
        windows(g, f.left, 4, 9, 'rgba(255,255,255,.45)', { mx: 0.08, my: 0.05, gx: 0.25, gy: 0.5 });
        windows(g, f.right, 4, 9, 'rgba(255,255,255,.55)', { mx: 0.08, my: 0.05, gx: 0.25, gy: 0.5 });
        box(g, x + 0.9, y + 0.9, 1.2, 1.2, 150, 12, white);
        var ant = P(x + 1.5, y + 1.5, 162);
        el('rect', { x: ant[0] - 1, y: ant[1] - 26, width: 2, height: 26, fill: '#8e8e93' }, g);
        el('circle', { cx: ant[0], cy: ant[1] - 27, r: 3.5, fill: c }, g);
        top = 196; break;
      case 'pavilion':
        poly(g, [[x - 0.4, y - 0.4, 0], [x + 3.4, y - 0.4, 0], [x + 3.4, y + 3.4, 0], [x - 0.4, y + 3.4, 0]], '#ffffff', { stroke: '#e5e5ea', 'stroke-width': 1 });
        var gl = { base: 'rgba(230,242,255,.75)', left: 'rgba(196,222,250,.78)', right: 'rgba(214,232,252,.78)', top: 'rgba(240,247,255,.85)' };
        f = box(g, x, y, 3, 3, 0, 54, gl);
        var scr = [quadPoint(f.left, 0.18, 0.25), quadPoint(f.left, 0.82, 0.25), quadPoint(f.left, 0.82, 0.8), quadPoint(f.left, 0.18, 0.8)];
        poly(g, scr, '#1d1d1f');
        poly(g, [quadPoint(scr, 0.06, 0.1), quadPoint(scr, 0.94, 0.1), quadPoint(scr, 0.94, 0.9), quadPoint(scr, 0.06, 0.9)], c, { opacity: 0.9 });
        box(g, x - 0.15, y - 0.15, 3.3, 3.3, 54, 5, { base: '#ffffff', left: '#e8eaee', right: '#f2f3f6' });
        top = 82; break;
    }
    return { top: top, cx: x + 1.5, cy: y + 1.5 };
  }

  /* ------------------------------------------------------------------ character
     Hector's own 3D avatar in four layers (head, torso, left leg, right leg). The walk follows a
     natural gait: weight shifts over the planted foot, the swing foot peels off and sets down softly,
     the body rises at mid-step, the torso tilts over the stance leg while the head counter-balances
     and stays level, and he leans into the walk. He eases in and out of every walk and turns smoothly. */
  function character(parent) {
    var k = 150 / 1483, ox = 532, oy = 1483;
    function img(parentEl, href, x, y, w, h) {
      var im = el('image', { x: ((x - ox) * k).toFixed(2), y: ((y - oy) * k).toFixed(2), width: (w * k).toFixed(2), height: (h * k).toFixed(2), preserveAspectRatio: 'none' }, parentEl);
      im.setAttributeNS('http://www.w3.org/1999/xlink', 'href', href); im.setAttribute('href', href);
      return im;
    }
    var g = el('g', { class: 'jn-hero' }, parent);
    var shadow = el('ellipse', { cx: 0, cy: -1, rx: 22, ry: 6.5, fill: 'rgba(20,30,50,.22)' }, g);
    var flip = el('g', {}, g);
    var lean = el('g', {}, flip);
    var legL = el('g', {}, lean), legR = el('g', {}, lean), body = el('g', {}, lean), head = el('g', {}, body);
    img(legL, 'assets/hector-leg-l.webp', 290, 860, 230, 630);
    img(legR, 'assets/hector-leg-r.webp', 485, 860, 295, 630);
    var torso = el('g', {}, body);
    body.insertBefore(torso, head);
    img(torso, 'assets/hector-torso.webp', 290, 335, 490, 570);
    img(head, 'assets/hector-head.webp', 290, 0, 490, 362);
    var HIP = (860 - oy) * k, NECK = (350 - oy) * k, WAIST = (880 - oy) * k;
    function f(n) { return n.toFixed(2); }
    function ease(x) { return x * x * (3 - 2 * x); }
    function legT(gEl, lift, cx, slide) {
      var sy = 1 - lift * 0.014; // knee bend shortens the swinging leg
      gEl.setAttribute('transform', 'translate(' + f(slide) + ',' + f(-lift) + ') translate(' + f(cx) + ',' + f(HIP) + ') scale(1,' + f(sy) + ') translate(' + f(-cx) + ',' + f(-HIP) + ')');
    }
    var api = { g: g, flip: flip };
    api.update = function (phase, w, t) {
      var s = Math.sin(phase), c = Math.cos(phase);
      // swing foot: quick, rounded lift; stance foot planted
      var uL = Math.max(0, s), uR = Math.max(0, -s);
      var liftL = 8 * ease(uL) * w, liftR = 8 * ease(uR) * w;
      // feet travel a little forward/back in the swing so the step reads as a step, not a hop
      var slideL = (s > 0 ? c * 1.2 : 0) * w, slideR = (s < 0 ? -c * 1.2 : 0) * w;
      legT(legL, liftL, -14, slideL); legT(legR, liftR, 8, slideR);
      // body: up at mid-step, down at foot strike; weight over the planted foot
      var bob = -(Math.abs(s) * 2.4 - 0.6) * w;
      var shift = s * 1.8 * w;
      var tilt = s * 1.6 * w;
      var breathe = Math.sin(t * 1.6) * (1 - w);
      body.setAttribute('transform', 'translate(' + f(shift) + ',' + f(bob) + ') rotate(' + f(tilt) + ' 0 ' + f(WAIST) + ')');
      torso.setAttribute('transform', 'translate(0,' + f(WAIST) + ') scale(1,' + f(1 + breathe * 0.006) + ') translate(0,' + f(-WAIST) + ')');
      // head counter-balances (stays nearly level) with a soft lag; idle: slow look around
      var look = Math.sin(t * 0.45) * 2.2 * (1 - w) + Math.sin(t * 0.21 + 1) * 1.2 * (1 - w);
      head.setAttribute('transform', 'translate(0,' + f(-breathe * 0.25 + Math.abs(c) * 0.5 * w) + ') rotate(' + f(-tilt * 0.75 + Math.sin(phase - 0.5) * 0.8 * w + look) + ' 0 ' + f(NECK) + ')');
      lean.setAttribute('transform', 'rotate(' + f(2.6 * w) + ' 0 0)');
      shadow.setAttribute('rx', f(21 + 2.5 * w - Math.abs(s) * 1.5 * w)); shadow.setAttribute('cx', f(shift * 0.6));
    };
    api.update(0, 0, 0);
    return api;
  }

  /* ------------------------------------------------------------------ build scene */
  function build(svg) {
    var world = el('g', { class: 'jn-world' }, svg);
    var ground = el('g', {}, world), roads = el('g', {}, world), deco = el('g', {}, world);
    var route = el('g', {}, world), objs = el('g', {}, world), pins = el('g', {}, world), actor = el('g', {}, world);

    // tabletop plate
    var X0 = -10, Y0 = -7, X1 = 30, Y1 = 31, depth = 26;
    poly(ground, [[X0, Y1, 0], [X1, Y1, 0], [X1, Y1, -depth], [X0, Y1, -depth]], '#e1e3e8');
    poly(ground, [[X1, Y0, 0], [X1, Y1, 0], [X1, Y1, -depth], [X1, Y0, -depth]], '#eceef2');
    poly(ground, [[X0, Y0, 0], [X1, Y0, 0], [X1, Y1, 0], [X0, Y1, 0]], '#f4f2ec');
    // subtle grid
    for (var gx = X0; gx <= X1; gx += 2) el('polyline', { points: pts([[gx, Y0, 0], [gx, Y1, 0]]), stroke: 'rgba(0,0,0,.035)', 'stroke-width': 1, fill: 'none' }, ground);
    for (var gy = Y0; gy <= Y1; gy += 2) el('polyline', { points: pts([[X0, gy, 0], [X1, gy, 0]]), stroke: 'rgba(0,0,0,.035)', 'stroke-width': 1, fill: 'none' }, ground);
    // parks and water (Apple Maps palette)
    function patch(x0, y0, x1, y1, fill, r) {
      poly(ground, [[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]], fill, r ? { rx: r } : {});
    }
    patch(-9, 8, -2, 16, '#d6ecc9'); patch(1, 13.5, 4.8, 17.5, '#d6ecc9'); patch(13.5, 1.5, 17.5, 7, '#d6ecc9');
    patch(7.5, 19.5, 11, 24, '#d6ecc9'); patch(20, 9, 28, 15, '#d6ecc9'); patch(25.5, 26, 29, 30, '#d6ecc9');
    patch(-8.5, 9, -3, 14.5, '#b9dcf5'); patch(21, 10, 26.5, 14, '#b9dcf5');
    patch(-9, -6, -3, -1, '#d6ecc9');

    // roads (iso quads): outline then fill
    var W = 0.85;
    function seg(a, b) {
      var x0 = Math.min(a[0], b[0]) - W, x1 = Math.max(a[0], b[0]) + W, y0 = Math.min(a[1], b[1]) - W, y1 = Math.max(a[1], b[1]) + W;
      return [[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]];
    }
    var segs = [];
    for (var i = 1; i < ROUTE.length; i++) segs.push(seg(ROUTE[i - 1], ROUTE[i]));
    segs.push(seg([24, 24], [24, 30]));
    segs.push(seg([-9, 3], [0, 3])); segs.push(seg([6, 0], [6, -6])); segs.push(seg([12, 6], [28, 6])); segs.push(seg([18, 18], [28, 18])); segs.push(seg([6, 18], [6, 30])); segs.push(seg([12, 24], [12, 30]));
    segs.forEach(function (s) { poly(roads, s, '#d8d9de'); });
    segs.forEach(function (s) {
      var q = s.map(function (p) { return p.slice(); });
      q[0][0] += 0.08; q[0][1] += 0.08; q[1][0] -= 0.08; q[1][1] += 0.08; q[2][0] -= 0.08; q[2][1] -= 0.08; q[3][0] += 0.08; q[3][1] -= 0.08;
      poly(roads, q, '#ffffff');
    });
    // dashed center line on the route
    el('polyline', { points: pts(ROUTE.map(function (p) { return [p[0], p[1], 0]; })), fill: 'none', stroke: '#e3e4e8', 'stroke-width': 2.4, 'stroke-dasharray': '10 10' }, roads);

    // start gate
    var g0 = P(START[0], START[1], 0);
    box(deco, START[0] - 1.1, START[1] - 0.1, 0.25, 0.25, 0, 46, { base: '#ffffff' });
    box(deco, START[0] + 1.0, START[1] - 0.1, 0.25, 0.25, 0, 46, { base: '#ffffff' });
    poly(deco, [[START[0] - 1.2, START[1] + 0.12, 46], [START[0] + 1.3, START[1] + 0.12, 46], [START[0] + 1.3, START[1] + 0.12, 62], [START[0] - 1.2, START[1] + 0.12, 62]], '#1d1d1f');
    el('rect', { x: g0[0] - 30, y: g0[1] - 92, width: 60, height: 22, rx: 11, fill: '#1d1d1f' }, deco);
    var gt = el('text', { x: g0[0], y: g0[1] - 77, 'font-size': 11, 'font-weight': 700, fill: '#fff', 'text-anchor': 'middle', 'letter-spacing': '.14em' }, deco);
    gt.textContent = 'START';

    // scenery
    var trees = [[-3, -4], [-5, -3], [-7, -1], [2.5, -4], [4, -1.5], [-6, 5.5], [-8, 6], [-4, 17.5], [-7, 19], [2, 9], [3.6, 8.2], [9, 3], [10.5, 1], [15, 3], [16.5, 5.5], [14.8, 9.2],
      [8.5, 15], [9.6, 16.5], [2.5, 22], [4, 25], [8.5, 21], [10, 23], [14, 22], [15.5, 26.5], [20, 21], [22, 16.5], [27, 8], [27.5, 16], [20.5, 4], [25, 2], [21, 28.5], [26.5, 27], [28, 29], [0, 28], [-6, 25], [-3, 23]];
    var dec = [];
    trees.forEach(function (t, k) { dec.push({ d: t[0] + t[1], f: function (gg) { tree(gg, t[0], t[1], 0.85 + (k % 3) * 0.12, ['#7cc47f', '#8fcf7a', '#6fbf8a'][k % 3]); } }); });
    [[1, 1.2], [-1, 7], [7, 7.2], [5, 13], [13, 13.2], [11, 19], [19, 19.2], [17, 25]].forEach(function (l) { dec.push({ d: l[0] + l[1], f: function (gg) { lamp(gg, l[0], l[1]); } }); });
    [[2.6, 10.6, '#ff9f0a'], [10.8, 4.6, '#0071e3'], [14.6, 16, '#34c759'], [21.5, 23.5, '#af52de'], [-2.6, 2, '#ff375f']].forEach(function (p) { dec.push({ d: p[0] + p[1], f: function (gg) { person(gg, p[0], p[1], p[2]); } }); });
    // filler houses
    [[-8, -5.5, 1.6, 1.6, 26], [8.5, -5, 2, 1.6, 30], [16, -3, 2.4, 2, 38], [-8.2, 21.5, 2, 2, 30], [26, 0, 2, 2.2, 44], [3, 27.5, 2.2, 1.8, 26], [26.5, 20.5, 2, 2, 34]].forEach(function (h) {
      dec.push({ d: h[0] + h[1] + 2, f: function (gg) { shadowFoot(gg, h[0], h[1], h[2], h[3], 0.8); var fb = box(gg, h[0], h[1], h[2], h[3], 0, h[4], { base: '#ffffff', left: '#e3e6ec', right: '#f0f2f5' }); windows(gg, fb.left, 2, 1, '#dbe8f6'); windows(gg, fb.right, 2, 1, '#e6eff9'); } });
    });

    // stops
    var spots = [];
    STOPS.forEach(function (s, i) {
      var o = stopSpot(i);
      dec.push({ d: o.bx + o.by + 3, f: function (gg) { spots[i] = drawBuilding(gg, s, i); } });
    });
    dec.sort(function (a, b) { return a.d - b.d; }).forEach(function (o) { var gg = el('g', {}, objs); o.f(gg); });

    // route progress (Apple Maps–style directions line)
    var rp = pts(ROUTE.map(function (p) { return [p[0], p[1], 0]; }));
    el('polyline', { points: rp, fill: 'none', stroke: '#ffffff', 'stroke-width': 13, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'jn-route-halo' }, route);
    var line = el('polyline', { points: rp, fill: 'none', stroke: '#0a84ff', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'jn-route' }, route);

    // pins
    var pinEls = STOPS.map(function (s, i) {
      var sp = spots[i], p = P(sp.cx, sp.cy, sp.top + 26);
      var pg = el('g', { class: 'jn-pin', transform: 'translate(' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ')', 'data-i': i, role: 'button', tabindex: '-1', 'aria-label': 'Go to stop ' + (i + 1) + ': ' + s.short }, pins);
      var inner = el('g', { class: 'jn-pin__in' }, pg);
      el('ellipse', { cx: 0, cy: 26, rx: 8, ry: 3, fill: 'rgba(0,0,0,.15)' }, inner);
      el('path', { d: 'M0 22 L-6 10 L6 10 Z', fill: s.color }, inner);
      el('circle', { class: 'jn-pin__pulse', cx: 0, cy: 0, r: 17, fill: s.color }, inner);
      el('circle', { cx: 0, cy: 0, r: 17, fill: s.color, stroke: '#fff', 'stroke-width': 3 }, inner);
      var t = el('text', { x: 0, y: 5.5, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: '#fff' }, inner);
      t.textContent = String(i + 1);
      var lb = el('g', { class: 'jn-pin__label' }, inner);
      var tw = s.short.length * 6.6 + 22;
      el('rect', { x: -tw / 2, y: -46, width: tw, height: 22, rx: 11, fill: 'rgba(255,255,255,.92)', stroke: 'rgba(0,0,0,.06)' }, lb);
      var lt = el('text', { x: 0, y: -31, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 600, fill: '#1d1d1f' }, lb);
      lt.textContent = s.short;
      return pg;
    });

    var hero = character(actor);
    return { world: world, line: line, pins: pinEls, hero: hero };
  }

  /* ------------------------------------------------------------------ path math */
  var SP = ROUTE.map(function (p) { return P(p[0], p[1], 0); });
  var CUM = [0];
  for (var i = 1; i < SP.length; i++) CUM.push(CUM[i - 1] + Math.hypot(SP[i][0] - SP[i - 1][0], SP[i][1] - SP[i - 1][1]));
  var TOTAL = CUM[CUM.length - 1];
  function stopDist(i) { return CUM[i + 2]; } // stop i sits at route corner C[i] (ROUTE index i + 2)
  function at(d) {
    d = Math.max(0, Math.min(TOTAL, d));
    for (var k = 1; k < CUM.length; k++) if (d <= CUM[k]) {
      var t = (d - CUM[k - 1]) / (CUM[k] - CUM[k - 1] || 1);
      return { x: lerp(SP[k - 1][0], SP[k][0], t), y: lerp(SP[k - 1][1], SP[k][1], t), dx: SP[k][0] - SP[k - 1][0] };
    }
    return { x: SP[SP.length - 1][0], y: SP[SP.length - 1][1], dx: 1 };
  }

  /* ------------------------------------------------------------------ app */
  var root = document.querySelector('[data-journey]');
  if (!root) return;
  var svg = root.querySelector('.jn-svg');
  var scene = build(svg);
  scene.line.setAttribute('stroke-dasharray', TOTAL.toFixed(1) + ' ' + (TOTAL + 10).toFixed(1));

  var card = root.querySelector('.jn-card'), chipsEl = root.querySelector('.jn-chips');
  STOPS.forEach(function (s, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'jn-chip'; b.setAttribute('data-i', i);
    b.innerHTML = '<span class="jn-chip__n" style="--c:' + s.color + '">' + (i + 1) + '</span><span>' + s.short + '</span>';
    b.addEventListener('click', function () { go(i); });
    chipsEl.appendChild(b);
  });
  scene.pins.forEach(function (p) { p.addEventListener('click', function () { go(+p.getAttribute('data-i')); }); });

  var state = { i: -1, dist: 0, target: 0, cam: null, started: false, face: 1 };
  function renderCard(i) {
    var s = STOPS[i];
    var html = '<p class="jn-card__eyebrow"><span>Stop ' + (i + 1) + ' of ' + STOPS.length + '</span><span aria-hidden="true">·</span><span>' + s.chapter + '</span></p>' +
      '<h2 class="jn-card__title">' + s.title + '</h2><p class="jn-card__role" style="color:' + shade(s.color, -0.12) + '">' + s.role + '</p>' +
      '<dl class="jn-card__meta"><div><dt>When</dt><dd>' + s.when + '</dd></div><div><dt>Where</dt><dd>' + s.where + '</dd></div></dl>' +
      '<p class="jn-card__text">' + s.text + '</p>' +
      '<ul class="jn-card__chips">' + s.chips.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>' +
      (s.link ? '<a class="jn-card__link" href="' + s.link + '">' + (s.final ? 'See the Apple TV concept' : 'View the case study') + ' <span aria-hidden="true">›</span></a>' : '') +
      '<div class="jn-card__nav"><button type="button" class="jn-btn" data-prev ' + (i === 0 ? 'disabled' : '') + '>← Prev</button>' +
      (s.final ? '<a class="jn-btn jn-btn--solid" href="index.html#work">See all work →</a>' : '<button type="button" class="jn-btn jn-btn--solid" data-next>Next →</button>') + '</div>';
    card.classList.remove('is-in'); void card.offsetWidth;
    card.innerHTML = html; card.classList.add('is-in');
    card.style.setProperty('--accent', s.color);
    var pv = card.querySelector('[data-prev]'), nx = card.querySelector('[data-next]');
    if (pv) pv.addEventListener('click', function () { go(i - 1); });
    if (nx) nx.addEventListener('click', function () { go(i + 1); });
    [].forEach.call(chipsEl.children, function (c, k) { c.classList.toggle('is-on', k === i); c.classList.toggle('is-done', k < i); if (k === i) c.setAttribute('aria-current', 'step'); else c.removeAttribute('aria-current'); });
    scene.pins.forEach(function (p, k) { p.classList.toggle('is-on', k === i); p.classList.toggle('is-done', k < i); });
    var on = chipsEl.children[i]; if (on && on.scrollIntoView) { var r = on.getBoundingClientRect(), pr = chipsEl.getBoundingClientRect(); if (r.left < pr.left || r.right > pr.right) chipsEl.scrollTo({ left: on.offsetLeft - 12, behavior: 'smooth' }); }
    root.querySelector('.jn-progress b').style.width = ((i + 1) / STOPS.length * 100) + '%';
    root.querySelector('.jn-progress span').textContent = (i + 1) + ' / ' + STOPS.length;
    var live = root.querySelector('.jn-live'); if (live) live.textContent = 'Stop ' + (i + 1) + ': ' + s.title + ', ' + s.role;
  }
  function go(i) {
    if (i < 0 || i >= STOPS.length) return;
    if (!state.started) start();
    state.i = i; state.target = stopDist(i);
    if (reduce) state.dist = state.target;
    renderCard(i);
  }
  function start() {
    state.started = true; root.classList.add('is-started');
    var intro = root.querySelector('.jn-intro'); if (intro) intro.setAttribute('hidden', '');
  }

  function anchor() {
    var w = root.clientWidth, h = root.clientHeight, mobile = w < 760;
    var s = mobile ? Math.max(0.55, Math.min(0.8, w / 560)) : Math.max(0.55, Math.min(1, Math.min(w / 1500, h / 820) * 0.8));
    return { x: mobile ? w * 0.5 : w * 0.38, y: mobile ? h * 0.27 : h * 0.56, s: s };
  }
  var last = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    // eased walk between stops: accelerate, cruise, slow down to a stop
    if (state.legTo !== state.target) {
      state.legFrom = state.dist; state.legTo = state.target; state.legT0 = now;
      state.legDur = Math.max(1.1, Math.min(3.6, Math.abs(state.legTo - state.legFrom) / 260)) * 1000;
    }
    var prev = state.dist, u = Math.min(1, (now - state.legT0) / state.legDur);
    var e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    state.dist = reduce ? state.legTo : state.legFrom + (state.legTo - state.legFrom) * e;
    var moved = state.dist - prev, v = Math.abs(moved) / (dt || 0.016), walking = u < 1 && !reduce;
    var p = at(state.dist);
    var dir = Math.sign(moved) * (p.dx >= 0 ? 1 : -1);
    if (walking && dir && v > 20) state.face = dir;
    // smooth turn instead of an instant flip
    state.faceS = lerp(state.faceS == null ? 1 : state.faceS, state.face, 1 - Math.pow(0.0001, dt));
    var fs = Math.abs(state.faceS) < 0.25 ? 0.25 * Math.sign(state.faceS || 1) : state.faceS;
    // gait: cadence follows speed (longer strides when fast), capped at a natural ~2.2 steps per second
    var stepLen = Math.max(17, v / 2.2);
    state.phase = (state.phase || 0) + Math.PI * Math.abs(moved) / stepLen;
    state.w = lerp(state.w || 0, Math.min(1, v / 90), 1 - Math.pow(0.002, dt));
    if (!walking && state.w < 0.03) {
      // settle the phase so he comes to rest with both feet down
      var rest = Math.round(state.phase / Math.PI) * Math.PI; state.phase = lerp(state.phase, rest, 0.2);
    }
    scene.hero.g.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ')');
    scene.hero.flip.setAttribute('transform', 'scale(' + (fs * 1.05).toFixed(3) + ',1.05)');
    scene.hero.update(state.phase, reduce ? 0 : state.w, now / 1000);
    scene.line.setAttribute('stroke-dashoffset', (TOTAL - state.dist).toFixed(1));
    // camera follows the character
    var a = anchor(), tx = a.x - p.x * a.s, ty = a.y - (p.y - 40) * a.s;
    if (!state.cam || reduce) state.cam = { x: tx, y: ty, s: a.s };
    var k = 1 - Math.pow(0.0025, dt);
    state.cam.x = lerp(state.cam.x, tx, k); state.cam.y = lerp(state.cam.y, ty, k); state.cam.s = lerp(state.cam.s, a.s, k);
    scene.world.setAttribute('transform', 'translate(' + state.cam.x.toFixed(1) + ',' + state.cam.y.toFixed(1) + ') scale(' + state.cam.s.toFixed(3) + ')');
    if (visible) requestAnimationFrame(frame); else running = false;
  }
  var visible = true, running = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) {
    visible = en[0].isIntersecting;
    if (visible && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  }).observe(root);
  requestAnimationFrame(frame);

  // controls
  root.querySelector('[data-start]').addEventListener('click', function () { go(0); });
  // arrow keys only while the journey is on screen; never hijack page scrolling
  function inView() { var r = root.getBoundingClientRect(); return r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4; }
  document.addEventListener('keydown', function (e) {
    if (!inView() || (e.target.closest && e.target.closest('input, textarea, select'))) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(Math.min(STOPS.length - 1, state.i + 1)); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); if (state.i > 0) go(state.i - 1); }
  });
  var tx0 = null, ty0 = 0;
  root.addEventListener('touchstart', function (e) { if (e.target.closest('.jn-card, .jn-chips, .dock')) return; tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY; }, { passive: true });
  root.addEventListener('touchend', function (e) {
    if (tx0 === null) return; var dx = e.changedTouches[0].clientX - tx0, dy = e.changedTouches[0].clientY - ty0; tx0 = null; if (Math.abs(dy) > Math.abs(dx)) return;
    if (Math.abs(dx) > 50) { if (dx < 0) go(Math.min(STOPS.length - 1, state.i + 1)); else if (state.i > 0) go(state.i - 1); }
  });
  // deep link (#stop-3) or ?still for screenshots
  var m = location.hash.match(/stop-(\d+)/);
  if (m) { state.dist = stopDist(Math.min(STOPS.length, +m[1]) - 1); go(Math.min(STOPS.length, +m[1]) - 1); }
  window.Journey = { go: go, stops: STOPS };
})();
