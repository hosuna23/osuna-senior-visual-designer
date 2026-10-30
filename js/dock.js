/* Floating bottom menu (shared across pages). Hides while scrolling down, returns when scrolling up. */
(function () {
  'use strict';
  if (document.querySelector('.dock')) return;
  var items = [
    ['Home', 'index.html', 'home'],
    ['Journey', 'index.html#journey', 'journey'],
    ['Work', 'index.html#work', 'work'],
    ['About', 'about.html', 'about'],
    ['Résumé', 'resume.html', 'resume'],
    ['Contact', 'mailto:hosuna23@gmail.com', 'contact']
  ];
  var page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  var current = page === 'index' ? (location.hash === '#work' ? 'work' : 'home') : page;
  var caseStudies = ['adi-resideo', 'working-solutions', 'careerstaff', 'caliber', 'ui-ux-fitnudge', 'music-streaming-app', 'tvos', 'apple-tv', 'video-editing'];
  if (caseStudies.indexOf(page) > -1) current = 'work';
  var nav = document.createElement('nav');
  nav.className = 'dock'; nav.setAttribute('aria-label', 'Quick menu');
  nav.innerHTML = items.map(function (it) {
    return '<a href="' + it[1] + '" data-k="' + it[2] + '"' + (it[2] === current ? ' aria-current="page"' : '') + '>' + it[0] + '</a>';
  }).join('');
  document.body.appendChild(nav);
  document.body.classList.add('has-dock');
  if (page === 'index') {
    var work = document.getElementById('work'), jn = document.getElementById('journey');
    function inside(sec) { if (!sec) return false; var r = sec.getBoundingClientRect(); return r.top < innerHeight * 0.5 && r.bottom > innerHeight * 0.3; }
    function mark() {
      var k = inside(work) ? 'work' : inside(jn) ? 'journey' : 'home';
      [].forEach.call(nav.children, function (a) {
        var on = a.getAttribute('data-k') === k;
        if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
    }
    addEventListener('scroll', mark, { passive: true }); mark();
  }
  {
    var lastY = scrollY;
    addEventListener('scroll', function () {
      var y = scrollY;
      nav.classList.toggle('is-hidden', y > lastY + 4 && y > 200);
      if (y < lastY - 4 || y < 200) nav.classList.remove('is-hidden');
      lastY = y;
    }, { passive: true });
  }
})();
