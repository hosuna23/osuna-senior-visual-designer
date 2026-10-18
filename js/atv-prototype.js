/* Apple TV app redesign — interactive concept prototype (Hector Osuna).
   A small focus engine for a 10-foot UI: sidebar rail, sticky filter bar, International hub,
   always-on Continue Watching, conversational Siri search, show pages, player with
   audio & subtitle control, quick actions, and a clickable Siri Remote.
   Concept only. Titles are referenced for realism; all artwork is original abstract art. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ data */
  var REG = { US: 'United States', KR: 'Korea', JP: 'Japan', FR: 'France', IL: 'Israel', MX: 'Mexico', UK: 'United Kingdom', IE: 'Ireland' };
  function S(id, t, type, g, reg, lang, y, extra) {
    var o = { id: id, t: t, type: type, g: g, reg: reg, lang: lang, y: y, orig: true };
    for (var k in extra) o[k] = extra[k];
    return o;
  }
  var T = [
    S('sev', 'Severance', 'series', ['Thriller', 'Sci-Fi', 'Drama'], 'US', 'English', 2022, { s: 2, pop: 99, pal: ['#0d1b2a', '#3d6e8f', '#b7d3e3'], f: 'wide', deco: 'corridor', d: 'Office workers agree to split their memories between work and home, until the line between the two starts to fail.' }),
    S('ted', 'Ted Lasso', 'series', ['Comedy', 'Drama', 'Sports'], 'US', 'English', 2020, { s: 3, pop: 96, pal: ['#0e2a5c', '#f2c94c', '#ffffff'], f: 'heavy', deco: 'sun', d: 'An American football coach takes over an English football club and wins people over with relentless optimism.' }),
    S('tms', 'The Morning Show', 'series', ['Drama'], 'US', 'English', 2019, { s: 4, pop: 90, pal: ['#2b1b10', '#e08a3c', '#ffd39a'], f: 'cond', deco: 'figures', d: 'Power, ambition and ethics collide behind the scenes of a national morning news program.' }),
    S('fam', 'For All Mankind', 'series', ['Sci-Fi', 'Drama'], 'US', 'English', 2019, { s: 4, pop: 92, pal: ['#140c08', '#b86b2c', '#f7c58b'], f: 'heavy', deco: 'planet', d: 'What if the space race never ended? An alternate history that keeps reaching further.' }),
    S('fnd', 'Foundation', 'series', ['Sci-Fi'], 'US', 'English', 2021, { s: 3, pop: 88, pal: ['#07141f', '#2f6f8a', '#c8a45a'], f: 'wide', deco: 'planet', d: 'A mathematician predicts the fall of a galactic empire and sets out to shorten the dark age that follows.' }),
    S('silo', 'Silo', 'series', ['Sci-Fi', 'Thriller'], 'US', 'English', 2023, { s: 2, pop: 91, pal: ['#0f1410', '#6f7d4f', '#d9c79a'], f: 'cond', deco: 'corridor', d: 'Thousands live underground with no memory of why. One engineer starts asking the questions no one should.' }),
    S('shr', 'Shrinking', 'series', ['Comedy', 'Drama'], 'US', 'English', 2023, { s: 2, pop: 86, pal: ['#1d3b2f', '#f28f6b', '#ffe3c2'], f: 'round', deco: 'bokeh', d: 'A grieving therapist starts telling his clients exactly what he thinks, with messy and hopeful results.' }),
    S('con', 'Constellation', 'series', ['Sci-Fi', 'Thriller'], 'US', 'English', 2024, { s: 1, pop: 78, pal: ['#050a18', '#4a5bd8', '#d6e0ff'], f: 'wide', deco: 'planet', d: 'An astronaut returns from space to find that pieces of her life no longer fit.' }),
    S('slow', 'Slow Horses', 'series', ['Thriller', 'Drama'], 'UK', 'English', 2022, { s: 4, pop: 89, pal: ['#121212', '#5c5446', '#cfc2a3'], f: 'serif', deco: 'figure', d: 'A team of disgraced British intelligence agents keeps stumbling into the cases that matter most.' }),
    S('hij', 'Hijack', 'series', ['Thriller'], 'UK', 'English', 2023, { s: 1, pop: 80, pal: ['#0a1520', '#2a6f9e', '#e5eef5'], f: 'heavy', deco: 'stripes', d: 'A seven-hour flight told in real time, and one negotiator who refuses to sit still.' }),
    S('try', 'Trying', 'series', ['Comedy'], 'UK', 'English', 2020, { s: 4, pop: 70, pal: ['#2c1e3b', '#e6a6c4', '#fff1f6'], f: 'round', deco: 'bokeh', d: 'A London couple navigates the ups and downs of becoming parents through adoption.' }),
    S('bad', 'Bad Sisters', 'series', ['Comedy', 'Thriller'], 'IE', 'English', 2022, { s: 2, pop: 84, pal: ['#14231f', '#2f8f7a', '#e8d9b0'], f: 'serif', deco: 'wave', d: 'Five sisters on the Irish coast, one terrible brother-in-law, and an insurance investigation closing in.' }),
    S('pach', 'Pachinko', 'series', ['Drama'], 'KR', 'Korean, Japanese, English', 2022, { s: 2, pop: 93, pal: ['#1a0f14', '#c2575d', '#f5c7a9'], f: 'serif', deco: 'sun', audio: ['Korean (Original)', 'English'], d: 'A Korean family’s hopes and sacrifices across four generations, from Busan to Osaka to New York.' }),
    S('drops', 'Drops of God', 'series', ['Drama', 'Thriller'], 'FR', 'French, Japanese, English', 2023, { s: 1, pop: 82, pal: ['#2a0a14', '#8e1c3c', '#f0c3a0'], f: 'serif', deco: 'wave', audio: ['French (Original)', 'English'], d: 'Two heirs compete in a series of tests to inherit a legendary wine collection.' }),
    S('teh', 'Tehran', 'series', ['Thriller'], 'IL', 'Hebrew, Persian, English', 2020, { s: 3, pop: 79, pal: ['#0b0f1a', '#c79a3b', '#f4e3b5'], f: 'cond', deco: 'figure', audio: ['Hebrew (Original)', 'English'], d: 'An undercover agent on her first field mission finds that every plan comes with a price.' }),
    S('drb', 'Dr. Brain', 'series', ['Sci-Fi', 'Thriller'], 'KR', 'Korean', 2021, { s: 1, pop: 81, pal: ['#0a0d1c', '#5a3fd1', '#cfc6ff'], f: 'heavy', deco: 'corridor', audio: ['Korean (Original)', 'English'], d: 'A brain scientist accesses the memories of the dead to learn what happened to his family.' }),
    S('lali', 'Losing Alice', 'series', ['Thriller', 'Drama'], 'IL', 'Hebrew', 2021, { s: 1, pop: 73, pal: ['#1a0b10', '#b03a5b', '#f6c8d4'], f: 'wide', deco: 'figure', audio: ['Hebrew (Original)', 'English'], d: 'A film director becomes obsessed with a young screenwriter whose script blurs fiction and reality.' }),
    S('mais', 'La Maison', 'series', ['Drama'], 'FR', 'French', 2024, { s: 1, pop: 76, pal: ['#14100d', '#b08a5a', '#f3e2c4'], f: 'wide', deco: 'figures', audio: ['French (Original)', 'English'], d: 'A scandal shakes a legendary Paris fashion house and sets off a fight for its future.' }),
    S('liai', 'Liaison', 'series', ['Thriller'], 'FR', 'French, English', 2023, { s: 1, pop: 72, pal: ['#081018', '#2c5d7c', '#d0e4f1'], f: 'cond', deco: 'stripes', audio: ['French (Original)', 'English'], d: 'A cyberattack threatens the UK and old flames reconnect across the Channel.' }),
    S('sunny', 'Sunny', 'series', ['Comedy', 'Sci-Fi'], 'JP', 'English, Japanese', 2024, { s: 1, pop: 74, pal: ['#2a1630', '#ff8fb1', '#fff0c9'], f: 'round', deco: 'bokeh', audio: ['English (Original)', 'Japanese'], d: 'In Kyoto, a woman whose family vanished is left with a domestic robot built by her husband’s company.' }),
    S('disc', 'Disclaimer', 'series', ['Thriller', 'Drama'], 'UK', 'English', 2024, { s: 1, pop: 78, pal: ['#0d0d0f', '#6b6b78', '#e4e4ea'], f: 'wide', deco: 'figure', d: 'A journalist discovers that a new novel tells a story about her she has kept secret for years.' }),
    S('aca', 'Acapulco', 'series', ['Comedy'], 'MX', 'Spanish, English', 2021, { s: 3, pop: 77, pal: ['#0b3b4a', '#ff8a5b', '#ffe6b0'], f: 'round', deco: 'sun', audio: ['Spanish (Original)', 'English'], d: 'A young man lands his dream job at a glamorous 1980s resort and learns what it costs.' }),
    S('coda', 'CODA', 'movie', ['Drama'], 'US', 'English', 2021, { mins: 111, pop: 87, pal: ['#14303f', '#f2b134', '#ffeccc'], f: 'heavy', deco: 'figures', d: 'The only hearing member of a Deaf family discovers a passion for singing.' }),
    S('kotfm', 'Killers of the Flower Moon', 'movie', ['Drama', 'Thriller'], 'US', 'English', 2023, { mins: 206, pop: 85, pal: ['#1a0d08', '#9c4a24', '#e9b783'], f: 'serif', deco: 'figure', d: 'A series of murders shakes the Osage Nation in 1920s Oklahoma.' }),
    S('nap', 'Napoleon', 'movie', ['Drama'], 'US', 'English', 2023, { mins: 158, pop: 76, pal: ['#0d0f14', '#3a4a6b', '#d4b483'], f: 'wide', deco: 'figure', d: 'An epic portrait of ambition, battle and a turbulent marriage.' }),
    S('wolfs', 'Wolfs', 'movie', ['Comedy', 'Thriller'], 'US', 'English', 2024, { mins: 108, pop: 81, pal: ['#0b0b10', '#4b4f73', '#d9dcef'], f: 'heavy', deco: 'figures', d: 'Two lone fixers are hired for the same job on the same night.' }),
    S('gorge', 'The Gorge', 'movie', ['Sci-Fi', 'Thriller'], 'US', 'English', 2025, { mins: 127, pop: 83, pal: ['#081210', '#2e7d5b', '#c9f2d9'], f: 'cond', deco: 'corridor', d: 'Two guards posted on opposite sides of a mysterious gorge are told never to look down.' }),
    S('grey', 'Greyhound', 'movie', ['Drama', 'Thriller'], 'US', 'English', 2020, { mins: 91, pop: 80, pal: ['#0d1418', '#566b78', '#dde5ea'], f: 'wide', deco: 'wave', d: 'A first-time captain leads a convoy across the Atlantic under constant threat.' }),
    S('finch', 'Finch', 'movie', ['Sci-Fi', 'Drama'], 'US', 'English', 2021, { mins: 115, pop: 74, pal: ['#1d1408', '#c9822e', '#fde3b4'], f: 'round', deco: 'sun', d: 'An engineer, a robot and a dog cross a scorched country together.' }),
    S('tetris', 'Tetris', 'movie', ['Thriller', 'Drama'], 'US', 'English', 2023, { mins: 118, pop: 75, pal: ['#140a2a', '#e04a8a', '#ffd166'], f: 'heavy', deco: 'blocks', d: 'A salesman bets everything on a game from behind the Iron Curtain.' }),
    S('f1', 'F1', 'movie', ['Sports', 'Drama'], 'US', 'English', 2025, { mins: 155, pop: 94, pal: ['#120606', '#d62828', '#ffd6a5'], f: 'heavy', deco: 'stripes', d: 'A veteran driver returns to Formula 1 to mentor a rising star and race one more season.' }),
    S('eleq', 'The Elephant Queen', 'movie', ['Documentary', 'Kids & Family'], 'US', 'English', 2019, { mins: 96, pop: 72, pal: ['#2a1a0a', '#d49a4a', '#fff0d1'], f: 'serif', deco: 'sun', d: 'A matriarch leads her herd across the savanna in search of water.' }),
    S('yec', 'The Year Earth Changed', 'movie', ['Documentary'], 'US', 'English', 2021, { mins: 48, pop: 70, pal: ['#06221c', '#2bb07f', '#d6ffe9'], f: 'wide', deco: 'wave', d: 'What nature did when the world went quiet.' }),
    S('pp', 'Prehistoric Planet', 'series', ['Documentary', 'Kids & Family'], 'US', 'English', 2022, { s: 2, pop: 84, pal: ['#0f1a0c', '#6a9a3a', '#f0e6b2'], f: 'cond', deco: 'sun', d: 'Dinosaurs as you have never seen them, in the habitats they ruled.' }),
    S('earth', 'Earthsounds', 'series', ['Documentary'], 'US', 'English', 2024, { s: 1, pop: 68, pal: ['#071622', '#2a7fa8', '#d3f1ff'], f: 'wide', deco: 'wave', d: 'The planet, heard in a way you never have before.' }),
    S('snoopy', 'The Snoopy Show', 'series', ['Kids & Family', 'Comedy'], 'US', 'English', 2021, { s: 3, pop: 76, pal: ['#0d4a8c', '#ffd23f', '#ffffff'], f: 'round', deco: 'bokeh', d: 'Everyday adventures with a famous beagle and his best friend.' }),
    S('frag', 'Fraggle Rock: Back to the Rock', 'series', ['Kids & Family'], 'US', 'English', 2022, { s: 2, pop: 71, pal: ['#3a0f4f', '#2ec4b6', '#ffe66d'], f: 'round', deco: 'bokeh', d: 'Music, friendship and silly adventures deep inside the Rock.' }),
    S('wolfw', 'Wolfwalkers', 'movie', ['Kids & Family'], 'IE', 'English', 2020, { mins: 103, pop: 79, pal: ['#1d2b12', '#d9822b', '#f4e1b5'], f: 'serif', deco: 'sun', d: 'A young apprentice hunter in 1650s Ireland befriends a girl from a mysterious tribe.' }),
    S('mls', 'MLS Live', 'sports', ['Sports'], 'US', 'English', 2026, { live: 1, pop: 82, pal: ['#081a2e', '#1b6dd1', '#d9ecff'], f: 'heavy', deco: 'stripes', d: 'Every match, live, with no blackouts.', orig: false }),
    S('fnb', 'Friday Night Baseball', 'sports', ['Sports'], 'US', 'English', 2026, { live: 1, pop: 74, pal: ['#1a0d0d', '#c0392b', '#ffe0d6'], f: 'cond', deco: 'stripes', d: 'A weekly doubleheader, live.' })
  ];
  var BY = {}; T.forEach(function (x, i) { x.i = i; BY[x.id] = x; });

  var FILTERS = [
    { k: 'all', l: 'All' },
    { k: 'movies', l: 'Movies', fn: function (x) { return x.type === 'movie'; } },
    { k: 'shows', l: 'TV Shows', fn: function (x) { return x.type === 'series'; } },
    { k: 'orig', l: 'Apple Originals', fn: function (x) { return x.orig; } },
    { k: 'intl', l: 'International', fn: function (x) { return x.reg !== 'US'; } },
    { k: 'docs', l: 'Documentaries', fn: function (x) { return g(x, 'Documentary'); } },
    { k: 'kids', l: 'Kids & Family', fn: function (x) { return g(x, 'Kids & Family'); } },
    { k: 'comedy', l: 'Comedy', fn: function (x) { return g(x, 'Comedy'); } },
    { k: 'scifi', l: 'Sci-Fi', fn: function (x) { return g(x, 'Sci-Fi'); } },
    { k: 'thriller', l: 'Thrillers', fn: function (x) { return g(x, 'Thriller'); } },
    { k: 'sports', l: 'Live Sports', fn: function (x) { return x.type === 'sports'; } }
  ];
  var FBY = {}; FILTERS.forEach(function (f) { FBY[f.k] = f; });
  var REGIONS = [{ k: 'all', l: 'All regions' }, { k: 'KR', l: 'Korea' }, { k: 'FR', l: 'France' }, { k: 'IL', l: 'Israel' }, { k: 'MX', l: 'Mexico' }, { k: 'JP', l: 'Japan' }, { k: 'UKI', l: 'UK & Ireland' }];
  var SORTS = [{ k: 'pop', l: 'Most popular' }, { k: 'new', l: 'Newest' }, { k: 'az', l: 'A to Z' }, { k: 'short', l: 'Shortest first' }];
  var RAIL = [
    { k: 'search', l: 'Search', ic: 'search' }, { k: 'home', l: 'Home', ic: 'home' }, { k: 'orig', l: 'Apple Originals', ic: 'star' },
    { k: 'movies', l: 'Movies', ic: 'film' }, { k: 'shows', l: 'TV Shows', ic: 'tv' }, { k: 'sports', l: 'Sports', ic: 'ball' }, { k: 'library', l: 'Library', ic: 'stack' },
    { k: 'ch1', l: 'Cinema Club', ic: 'dot', ch: '#e85d75' }, { k: 'ch2', l: 'Docuverse', ic: 'dot', ch: '#3aa0ff' }
  ];
  var SIRI = {
    kr: { q: 'Korean dramas with English subtitles', fn: function (x) { return x.reg === 'KR'; }, a: 'Korean dramas with English subtitles', more: ['intlthr', 'drama', 'short'] },
    short: { q: 'Movies under two hours', fn: function (x) { return x.type === 'movie' && x.mins < 120; }, a: 'movies under two hours', more: ['comedy', 'nature', 'kr'] },
    comedy: { q: 'Apple Original comedies', fn: function (x) { return x.orig && g(x, 'Comedy'); }, a: 'Apple Original comedies', more: ['family', 'short', 'kr'] },
    nature: { q: 'Nature documentaries', fn: function (x) { return g(x, 'Documentary'); }, a: 'nature documentaries', more: ['family', 'short', 'comedy'] },
    intlthr: { q: 'Thrillers from outside the U.S.', fn: function (x) { return x.reg !== 'US' && g(x, 'Thriller'); }, a: 'thrillers from outside the U.S.', more: ['kr', 'drama', 'short'] },
    drama: { q: 'Award-winning dramas', fn: function (x) { return g(x, 'Drama') && x.pop > 84; }, a: 'acclaimed dramas', more: ['kr', 'intlthr', 'short'] },
    family: { q: 'Something the whole family can watch', fn: function (x) { return g(x, 'Kids & Family'); }, a: 'picks for the whole family', more: ['nature', 'comedy', 'short'] },
    resume: { q: 'Continue what I was watching', resume: true }
  };
  var SIRI_START = ['kr', 'short', 'comedy', 'nature', 'resume'];
  var SUBS = {
    'English': ['We don’t have much time.', 'Then tell me what you saw.', 'It was there. I’m sure of it.', 'Everything changes after tonight.'],
    'English SDH': ['[door creaks] We don’t have much time.', '[whispering] Then tell me what you saw.', 'It was there. I’m sure of it.', '[thunder rumbles] Everything changes after tonight.'],
    'Spanish': ['No tenemos mucho tiempo.', 'Entonces dime qué viste.', 'Estaba ahí. Estoy seguro.', 'Todo cambia después de esta noche.'],
    'French': ['Nous n’avons pas beaucoup de temps.', 'Alors dis-moi ce que tu as vu.', 'C’était là. J’en suis sûr.', 'Tout change après ce soir.']
  };
  function g(x, name) { return x.g.indexOf(name) > -1; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function dur(m) { var h = Math.floor(m / 60), r = m % 60; return (h ? h + ' hr ' : '') + (r ? r + ' min' : ''); }
  function clock(sec) { sec = Math.max(0, Math.round(sec)); var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (s < 10 ? '0' : '') + s; }

  /* ------------------------------------------------------------------ icons & art */
  var IC = {
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    home: '<rect x="3.5" y="5" width="17" height="13" rx="3"/><path d="m10 9 5 2.5-5 2.5z" fill="currentColor"/>',
    star: '<path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z"/>',
    film: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4"/>',
    tv: '<rect x="3.5" y="5" width="17" height="11.5" rx="2.5"/><path d="M8.5 20h7"/>',
    ball: '<circle cx="12" cy="12" r="8"/><path d="m12 7.5 3.6 2.6-1.4 4.3H9.8L8.4 10.1z"/>',
    stack: '<rect x="4" y="9" width="16" height="11" rx="2.5"/><path d="M6.5 6h11M9 3.5h6"/>',
    play: '<path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.4"/>',
    more: '<circle cx="6" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="18" cy="12" r="1.3" fill="currentColor"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.5 3.8 5.4 3.8 8.5s-1.2 6-3.8 8.5c-2.6-2.5-3.8-5.4-3.8-8.5S9.4 6 12 3.5z"/>',
    speaker: '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',
    mute: '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
    cc: '<rect x="3.5" y="6" width="17" height="12" rx="2.5"/><path d="M10.5 10.2a2.3 2.3 0 1 0 0 3.6M17 10.2a2.3 2.3 0 1 0 0 3.6"/>',
    dot: '<circle cx="12" cy="12" r="5" fill="currentColor" stroke="none"/>'
  };
  function icon(n, cls) { return '<svg class="' + (cls || 'ic') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[n] + '</svg>'; }

  var DECO = {
    planet: '<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice"><circle cx="118" cy="38" r="26" fill="url(#gp)"/><ellipse cx="118" cy="40" rx="44" ry="8" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.2" transform="rotate(-14 118 40)"/><g fill="#fff" opacity=".7"><circle cx="20" cy="14" r=".7"/><circle cx="44" cy="30" r=".5"/><circle cx="70" cy="10" r=".6"/><circle cx="88" cy="70" r=".5"/><circle cx="150" cy="80" r=".6"/></g></svg>',
    sun: '<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice"><circle cx="110" cy="50" r="30" fill="url(#gs)"/><path d="M0 72 C40 60 80 66 160 58 L160 90 L0 90Z" fill="rgba(0,0,0,.45)"/></svg>',
    figure: '<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice"><path d="M104 90c0-17 7-27 16-31-6-3-9-9-9-16 0-10 7-17 15-17s15 7 15 17c0 7-3 13-9 16 9 4 16 14 16 31z" fill="rgba(0,0,0,.72)"/><path d="M127 26c8 0 15 7 15 17" stroke="url(#gr)" stroke-width="1.6" fill="none"/></svg>',
    figures: '<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice"><g fill="rgba(0,0,0,.66)"><path d="M70 90c0-14 6-22 13-25-5-3-7-8-7-13 0-8 5-13 12-13s12 5 12 13c0 5-2 10-7 13 7 3 13 11 13 25z"/><path d="M102 90c0-17 7-27 16-31-6-3-9-9-9-16 0-10 7-17 15-17s15 7 15 17c0 7-3 13-9 16 9 4 16 14 16 31z"/></g></svg>',
    corridor: '<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice"><g stroke="rgba(255,255,255,.28)" stroke-width=".8" fill="none"><path d="M0 0 62 34M160 0 98 34M0 90 62 56M160 90 98 56"/><rect x="62" y="34" width="36" height="22"/></g><rect x="74" y="40" width="12" height="16" fill="rgba(255,255,255,.55)"/></svg>',
    wave: '<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1"><path d="M0 60c20-8 40-8 60 0s40 8 60 0 30-6 40-3"/><path d="M0 68c20-8 40-8 60 0s40 8 60 0 30-6 40-3"/><path d="M0 76c20-8 40-8 60 0s40 8 60 0 30-6 40-3"/></g></svg>',
    stripes: '<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice"><g fill="rgba(255,255,255,.18)"><path d="M60 90 120 0h10L70 90z"/><path d="M80 90 140 0h5L85 90z"/><path d="M96 90 156 0h3L99 90z"/></g></svg>',
    bokeh: '<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice"><g fill="rgba(255,255,255,.22)"><circle cx="112" cy="26" r="14"/><circle cx="138" cy="52" r="9"/><circle cx="92" cy="58" r="6"/><circle cx="150" cy="18" r="5"/></g></svg>',
    blocks: '<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice"><g fill="rgba(255,255,255,.3)"><rect x="104" y="20" width="12" height="12"/><rect x="116" y="20" width="12" height="12"/><rect x="116" y="32" width="12" height="12"/><rect x="128" y="44" width="12" height="12"/><rect x="128" y="56" width="12" height="12"/><rect x="140" y="56" width="12" height="12"/></g></svg>'
  };
  function artStyle(x) {
    var p = x.pal;
    return 'background:radial-gradient(90% 120% at 78% 30%,' + p[1] + ' 0%,transparent 62%),radial-gradient(70% 80% at 10% 110%,' + p[2] + '33 0%,transparent 60%),linear-gradient(160deg,' + p[0] + ' 0%,#05060a 100%);--gl:' + p[2];
  }
  function art(x, opts) {
    opts = opts || {};
    return '<div class="atv-art" style="' + artStyle(x) + '">' + (DECO[x.deco] || '') +
      (opts.noword ? '' : '<span class="atv-word f-' + x.f + '">' + esc(x.t) + '</span>') + '</div>';
  }
  var DEFS = '<svg width="0" height="0" style="position:absolute"><defs>' +
    '<radialGradient id="gp" cx="35%" cy="35%"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".6" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity=".05"/></radialGradient>' +
    '<radialGradient id="gs"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".45" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="gr"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".9"/></linearGradient></defs></svg>';

  function meta(x) {
    if (x.live) return 'Live · ' + x.g[0];
    var bits = [];
    if (x.reg !== 'US') bits.push(REG[x.reg]);
    bits.push(x.g[0]);
    bits.push(x.type === 'movie' ? dur(x.mins) : (x.s + (x.s > 1 ? ' seasons' : ' season')));
    bits.push(String(x.y));
    return bits.join(' · ');
  }

  /* ------------------------------------------------------------------ instance */
  function create(root) {
    var st = {
      view: 'home', filter: 'all', region: 'all', sort: 'pop', query: '',
      prefs: { previews: true, hideWatched: false, original: true },
      cw: [{ id: 'sev', season: 2, ep: 4, pos: 1860, dur: 3240 }, { id: 'pach', season: 2, ep: 3, pos: 900, dur: 3300 }, { id: 'coda', pos: 3100, dur: 6660 }, { id: 'snoopy', season: 1, ep: 6, pos: 420, dur: 780 }],
      upnext: ['silo', 'drops'], watched: {}, hidden: {},
      area: 'content', zi: 0, ci: 0, ri: 1, memo: {}, hero: 0, vol: 6, muted: false,
      layers: []
    };
    var tasksDone = {};
    function task(k) { if (tasksDone[k]) return; tasksDone[k] = 1; root.dispatchEvent(new CustomEvent('atv:task', { detail: k, bubbles: true })); }

    root.innerHTML = DEFS + '<div class="atv-frame"><div class="atv-screen" tabindex="-1">' +
      '<div class="atv-bg"></div><div class="atv-bg2"></div><div class="atv-scrim"></div>' +
      '<div class="atv-content"><div class="atv-scroll"></div></div>' +
      '<div class="atv-topbar"><div class="atv-filters"><div class="atv-ftrack"></div></div><div class="atv-tr"><span class="atv-chip atv-opt" data-z="filters-opt">' + icon('sliders') + 'View options</span><div class="atv-dock"></div></div></div>' +
      '<div class="atv-regions"></div>' +
      '<nav class="atv-rail"></nav>' +
      '<div class="atv-layers"></div>' +
      '<div class="atv-vol"></div><div class="atv-toast" role="status"></div>' +
      '<div class="atv-hint"><span>Click to use your keyboard or the remote</span></div>' +
      '</div></div>';
    var screen = root.querySelector('.atv-screen');
    var $ = function (s, c) { return (c || screen).querySelector(s); };
    var $$ = function (s, c) { return Array.prototype.slice.call((c || screen).querySelectorAll(s)); };
    var scrollEl = $('.atv-scroll'), layersEl = $('.atv-layers');

    function tick() { var c = $('.atv-clock2'); if (c) c.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
    setInterval(tick, 30000);
    function toast(m) { var t = $('.atv-toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('on'); }, 2000); }

    /* ---------- lists */
    function visible(list) { return list.filter(function (x) { return !st.hidden[x.id] && !(st.prefs.hideWatched && st.watched[x.id]); }); }
    function sorted(list) {
      var l = list.slice();
      var f = { pop: function (a, b) { return b.pop - a.pop; }, 'new': function (a, b) { return b.y - a.y || b.pop - a.pop; }, az: function (a, b) { return a.t.localeCompare(b.t); }, short: function (a, b) { return (a.mins || a.s * 50 || 999) - (b.mins || b.s * 50 || 999); } }[st.sort];
      return l.sort(f);
    }
    function regionOk(x) { var r = st.region; if (r === 'all') return true; if (r === 'UKI') return x.reg === 'UK' || x.reg === 'IE'; return x.reg === r; }
    function inFilter(x) { var f = FBY[st.filter]; return (!f.fn || f.fn(x)) && (st.filter !== 'intl' || regionOk(x)); }
    function rows() {
      var R = [];
      if (st.view === 'library') {
        R.push({ k: 'cw', t: 'Continue Watching', items: st.cw.map(function (c) { return BY[c.id]; }) });
        R.push({ k: 'up', t: 'Up Next', items: st.upnext.map(function (i) { return BY[i]; }) });
        var w = Object.keys(st.watched).map(function (i) { return BY[i]; });
        if (w.length) R.push({ k: 'watched', t: 'Watched', items: w });
        R.push({ k: 'lib-movies', t: 'Movies in Your Library', items: sorted(visible(T.filter(function (x) { return x.type === 'movie'; }))).slice(0, 5) });
        return R.filter(function (r) { return r.items.length; });
      }
      if (st.filter === 'all') {
        R.push({ k: 'cw', t: 'Continue Watching', items: st.cw.map(function (c) { return BY[c.id]; }) });
        R.push({ k: 'top', t: 'Top Apple Originals', items: sorted(visible(T.filter(function (x) { return x.orig && x.type !== 'sports'; }))).slice(0, 10) });
        R.push({ k: 'intl', t: 'International Spotlight', why: 'Stories from outside the U.S., in their original language', items: sorted(visible(T.filter(function (x) { return x.reg !== 'US'; }))) });
        R.push({ k: 'short', t: 'Movies Under 2 Hours', items: sorted(visible(T.filter(function (x) { return x.type === 'movie' && x.mins < 120; }))) });
        R.push({ k: 'byw', t: 'Because You Watched Severance', why: 'Workplace mysteries and mind-bending sci-fi', items: sorted(visible(T.filter(function (x) { return x.id !== 'sev' && (g(x, 'Sci-Fi') || g(x, 'Thriller')) && x.type === 'series'; }))) });
        R.push({ k: 'docs', t: 'Documentaries & Nature', items: sorted(visible(T.filter(function (x) { return g(x, 'Documentary'); }))) });
        R.push({ k: 'kids', t: 'Kids & Family', items: sorted(visible(T.filter(function (x) { return g(x, 'Kids & Family'); }))) });
        R.push({ k: 'live', t: 'Live Sports', items: visible(T.filter(function (x) { return x.live; })) });
        return R.filter(function (r) { return r.items.length; });
      }
      var f = FBY[st.filter], list = sorted(visible(T.filter(inFilter)));
      if (!list.length) return [];
      var regL = st.filter === 'intl' && st.region !== 'all' ? REGIONS.filter(function (r) { return r.k === st.region; })[0].l : '';
      R.push({ k: 'top', t: regL ? 'From ' + (st.region === 'UKI' ? 'the ' : '') + regL : (st.sort === 'pop' ? 'Top ' : SORTS.filter(function (s) { return s.k === st.sort; })[0].l + ': ') + f.l, why: regL ? (st.prefs.original ? 'Original audio with English subtitles' : 'Dubbed in English when available') : '', items: list });
      if (st.filter === 'intl' && st.region === 'all') {
        ['KR', 'FR', 'IL', 'MX', 'JP'].forEach(function (r) { var l = list.filter(function (x) { return x.reg === r; }); if (l.length) R.push({ k: 'r' + r, t: 'From ' + REG[r], items: l }); });
        var uki = list.filter(function (x) { return x.reg === 'UK' || x.reg === 'IE'; }); if (uki.length) R.push({ k: 'rUKI', t: 'From the UK & Ireland', items: uki });
      } else {
        var gs = {};
        list.forEach(function (x) { x.g.forEach(function (n) { if (n === f.l || (st.filter === 'scifi' && n === 'Sci-Fi') || (st.filter === 'thriller' && n === 'Thriller') || (st.filter === 'docs' && n === 'Documentary')) return; (gs[n] = gs[n] || []).push(x); }); });
        Object.keys(gs).sort(function (a, b) { return gs[b].length - gs[a].length; }).slice(0, 3).forEach(function (n) { if (gs[n].length > 1) R.push({ k: 'g' + n, t: n, items: gs[n] }); });
        if (st.filter === 'movies') R.push({ k: 'quick', t: 'Under 2 Hours', items: list.filter(function (x) { return x.mins < 120; }) });
      }
      return R.filter(function (r) { return r.items.length; });
    }
    function heroList() {
      if (st.filter === 'all') return ['sev', 'pach', 'f1', 'fam'].map(function (i) { return BY[i]; });
      var l = sorted(visible(T.filter(inFilter))); return l.slice(0, 4);
    }
    function cwFor(id) { for (var i = 0; i < st.cw.length; i++) if (st.cw[i].id === id) return st.cw[i]; return null; }

    /* ---------- render pieces */
    function chip(label, zone, i, on, extra) { return '<span class="atv-chip' + (on ? ' sel' : '') + '" data-z="' + zone + '" data-i="' + i + '">' + (extra || '') + esc(label) + '</span>'; }
    function renderTop() {
      $('.atv-ftrack').innerHTML = FILTERS.map(function (f, i) { return chip(f.l, 'filters', i, st.view !== 'search' && st.view !== 'library' && st.filter === f.k, f.k === 'intl' ? icon('globe') : ''); }).join('');
      var reg = $('.atv-regions');
      if (st.filter === 'intl' && st.view === 'home') {
        reg.innerHTML = '<span class="atv-rlabel">' + icon('globe') + 'Browse by region</span>' + REGIONS.map(function (r, i) { return chip(r.l, 'regions', i, st.region === r.k); }).join('') +
          '<span class="atv-rlabel sub">Audio: ' + (st.prefs.original ? 'Original language + subtitles' : 'Dubbed when available') + '</span>';
        reg.classList.add('on');
      } else { reg.innerHTML = ''; reg.classList.remove('on'); }
      screen.classList.toggle('has-regions', st.filter === 'intl' && st.view === 'home');
    }
    function renderRail() {
      var cur = st.view === 'search' ? 'search' : st.view === 'library' ? 'library' : ({ all: 'home', orig: 'orig', movies: 'movies', shows: 'shows', sports: 'sports' }[st.filter] || 'home');
      $('.atv-rail').innerHTML = '<div class="atv-me"><span class="atv-av">H</span><span class="atv-rl"><b>Hector</b><small class="atv-clock2"></small></span></div>' +
        RAIL.map(function (r, i) {
          return (r.k === 'ch1' ? '<div class="atv-rhead">Channels &amp; Apps</div>' : '') +
            '<span class="atv-ritem' + (r.k === cur ? ' cur' : '') + '" data-z="rail" data-i="' + i + '"><i style="' + (r.ch ? 'color:' + r.ch : '') + '">' + icon(r.ic) + '</i><span class="atv-rl">' + esc(r.l) + '</span></span>';
        }).join('');
      var d = new Date(); $('.atv-clock2').textContent = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    function cardSub(x, rowKey) {
      var c = cwFor(x.id);
      if (rowKey === 'cw' && c) return c.season ? 'S' + c.season + ', E' + c.ep + ' · ' + Math.round((c.dur - c.pos) / 60) + ' min left' : Math.round((c.dur - c.pos) / 60) + ' min left';
      if (x.live) return 'Live now';
      if (st.watched[x.id]) return 'Watched';
      if (x.reg !== 'US') { var l0 = x.lang.split(',')[0]; return REG[x.reg] + (l0 !== 'English' ? ' · ' + l0 : '') + ' · ' + (x.type === 'movie' ? dur(x.mins) : x.s + (x.s > 1 ? ' seasons' : ' season')); }
      return x.type === 'movie' ? 'Movie · ' + dur(x.mins) : x.g[0] + ' · ' + x.s + (x.s > 1 ? ' seasons' : ' season');
    }
    function card(x, zone, i, rowKey) {
      var c = cwFor(x.id), prog = rowKey === 'cw' && c ? '<i class="atv-prog"><b style="width:' + Math.round(c.pos / c.dur * 100) + '%"></b></i>' : '';
      var tags = (x.reg !== 'US' ? '<em class="atv-tag">' + x.reg + '</em>' : '') + (x.live ? '<em class="atv-tag live">LIVE</em>' : '') + (st.upnext.indexOf(x.id) > -1 && rowKey !== 'up' ? '<em class="atv-tag r">' + icon('check') + '</em>' : '');
      return '<div class="atv-card" data-z="' + zone + '" data-i="' + i + '" data-id="' + x.id + '"><div class="atv-cardart">' + art(x) + tags + prog + '<span class="atv-pv">' + icon('mute') + 'Preview</span></div>' +
        '<div class="atv-cap"><b>' + esc(x.t) + '</b><span>' + esc(cardSub(x, rowKey)) + '</span></div></div>';
    }
    var R = [], hero = [];
    function renderMain() {
      renderTop(); renderRail();
      var html = '';
      screen.classList.remove('v-home', 'v-search', 'v-library'); screen.classList.add('v-' + st.view);
      if (st.view === 'home') {
        hero = heroList(); if (st.hero >= hero.length) st.hero = 0;
        var h = hero[st.hero];
        if (h) {
          var c = cwFor(h.id);
          html += '<section class="atv-hero"><div class="atv-eyebrow">' + (h.orig ? 'Apple Original' : 'Featured') + ' · ' + esc(h.g.join(', ')) + '</div>' +
            '<div class="atv-htitle f-' + h.f + '">' + esc(h.t) + '</div><div class="atv-hmeta">' + esc(meta(h)) + '<span class="atv-badges"><em>4K</em><em>HDR</em><em>CC</em><em>AD</em></span></div>' +
            '<p class="atv-hdesc">' + esc(h.d) + '</p><div class="atv-hbtns">' +
            '<span class="atv-btn wide" data-z="hero" data-i="0" data-act="play">' + icon('play') + (c ? (c.season ? 'Resume S' + c.season + ', E' + c.ep : 'Resume') : (h.type === 'series' ? 'Play S1, E1' : h.live ? 'Watch Live' : 'Play Movie')) + '</span>' +
            '<span class="atv-btn round" data-z="hero" data-i="1" data-act="up" aria-label="Up Next">' + icon(st.upnext.indexOf(h.id) > -1 ? 'check' : 'plus') + '</span>' +
            '<span class="atv-btn round" data-z="hero" data-i="2" data-act="info" aria-label="Details">' + icon('info') + '</span></div>' +
            '<div class="atv-dots">' + hero.map(function (_, i) { return '<i class="' + (i === st.hero ? 'on' : '') + '"></i>'; }).join('') + '</div></section>';
          setBg(h);
        }
        R = rows();
        if (!R.length) html += '<div class="atv-empty"><b>Nothing here yet</b><span>Try another filter or region, or turn off Hide watched in View options.</span></div>';
      } else if (st.view === 'search') {
        setBg(null);
        var q = st.query.toLowerCase();
        var res = q ? sorted(T.filter(function (x) { return (x.t + ' ' + x.g.join(' ') + ' ' + (REG[x.reg] || '') + ' ' + x.lang).toLowerCase().indexOf(q) > -1; })) : [];
        var keys = 'abcdefghijklmnopqrstuvwxyz'.split('').concat(['space', 'del']);
        html += '<section class="atv-search"><div class="atv-sfield">' + icon('search') + '<span>' + (st.query ? esc(st.query) + '<i class="caret"></i>' : '<em>Shows, movies, cast, countries and languages</em>') + '</span><span class="atv-shint">' + icon('mic') + 'Hold Siri to ask</span></div>' +
          '<div class="atv-keys">' + keys.map(function (k, i) { return '<span class="atv-key' + (k.length > 1 ? ' w' : '') + '" data-z="keys" data-i="' + i + '" data-k="' + k + '">' + (k === 'space' ? 'Space' : k === 'del' ? '⌫' : k) + '</span>'; }).join('') + '</div></section>';
        R = [];
        if (q) R.push({ k: 'res', t: res.length ? 'Top Results' : 'No results for “' + st.query + '”', items: res });
        R.push({ k: 'cats', t: 'Browse Categories', cats: FILTERS.slice(1) });
      } else {
        setBg(null);
        html += '<section class="atv-libhead"><div class="atv-htitle f-heavy" style="font-size:3.2cqw">Library</div><div class="atv-hmeta">Your Up Next, history and purchases in one place</div></section>';
        R = rows();
      }
      html += R.map(function (r, ri) {
        var z = 'row' + ri;
        if (r.cats) return '<section class="atv-row cats" data-row="' + ri + '"><h4>' + esc(r.t) + '</h4><div class="atv-track">' + r.cats.map(function (f, i) {
          var x = T.filter(f.fn)[0];
          return '<div class="atv-cat" data-z="' + z + '" data-i="' + i + '" data-f="' + f.k + '" style="' + artStyle(x) + '"><span>' + esc(f.l) + '</span></div>';
        }).join('') + '</div></section>';
        if (!r.items.length) return '<section class="atv-row" data-row="' + ri + '"><h4>' + esc(r.t) + '</h4><div class="atv-track"></div></section>';
        return '<section class="atv-row" data-row="' + ri + '" data-key="' + r.k + '"><h4>' + esc(r.t) + (r.why ? '<small>' + esc(r.why) + '</small>' : '') + '</h4><div class="atv-track">' + r.items.map(function (x, i) { return card(x, z, i, r.k); }).join('') + '</div></section>';
      }).join('');
      scrollEl.innerHTML = html;
      // remove empty search results row from focus
      renderDock();
      buildZones();
    }
    function setBg(h) {
      var a = $('.atv-bg'), b = $('.atv-bg2');
      if (!h) { a.style.opacity = 0; b.style.opacity = 0; screen.style.setProperty('--tint', '#1c1c1e'); return; }
      if (a.getAttribute('data-id') === h.id) return;
      b.setAttribute('style', a.getAttribute('style') || ''); b.style.opacity = 1;
      a.setAttribute('data-id', h.id);
      a.setAttribute('style', artStyle(h)); a.innerHTML = DECO[h.deco] || ''; a.style.opacity = 0;
      requestAnimationFrame(function () { a.style.opacity = 1; b.style.opacity = 0; });
    }
    function renderDock() {
      var c = st.cw[0], d = $('.atv-dock');
      if (!c) { d.innerHTML = ''; return; }
      var x = BY[c.id];
      d.innerHTML = '<div class="atv-dockin" data-z="dock" data-i="0" title="Continue Watching"><span class="atv-dthumb">' + art(x, { noword: 1 }) + '<i>' + icon('play') + '</i></span><span class="atv-dtxt"><small>Continue Watching</small><b>' + esc(x.t) + '<span> · ' +
        (c.season ? 'S' + c.season + ', E' + c.ep + ' · ' : '') + Math.round((c.dur - c.pos) / 60) + ' min left</span></b><i class="atv-prog"><b style="width:' + Math.round(c.pos / c.dur * 100) + '%"></b></i></span></div>';
    }

    /* ---------- focus engine (main) */
    var Z = [];
    function buildZones() {
      Z = [];
      Z.push({ k: 'filters', els: $$('.atv-ftrack .atv-chip').concat([$('.atv-opt')]).concat($('.atv-dockin') ? [$('.atv-dockin')] : []) });
      if (screen.classList.contains('has-regions')) Z.push({ k: 'regions', els: $$('.atv-regions .atv-chip') });
      if (st.view === 'home' && $('.atv-hero')) Z.push({ k: 'hero', els: $$('.atv-hero .atv-btn') });
      if (st.view === 'search') Z.push({ k: 'keys', els: $$('.atv-key') });
      $$('.atv-row').forEach(function (r) { var els = $$('.atv-card, .atv-cat', r); if (els.length) Z.push({ k: 'row', row: r, els: els }); });
      if (st.zi >= Z.length) st.zi = Z.length - 1;
      if (st.zi < 0) st.zi = 0;
    }
    function zoneIndex(k) { for (var i = 0; i < Z.length; i++) if (Z[i].k === k) return i; return -1; }
    var previewT = null;
    function paint(dir) {
      $$('.is-focus').forEach(function (e) { e.classList.remove('is-focus', 'is-preview'); });
      clearTimeout(previewT);
      if (st.layers.length) return paintLayer();
      screen.classList.toggle('rail-open', st.area === 'rail');
      var el;
      if (st.area === 'rail') {
        el = $$('.atv-ritem')[st.ri];
      } else {
        var z = Z[st.zi]; if (!z) return;
        st.ci = Math.max(0, Math.min(st.ci, z.els.length - 1));
        el = z.els[st.ci];
        // vertical scrolling
        var y = 0, cq = screen.clientWidth / 100, topY = (screen.classList.contains('has-regions') ? 11.5 : 7.4) * cq;
        if (z.k === 'row') {
          var row = z.row;
          if (row) {
            var first = Z.filter(function (q) { return q.k === 'row'; })[0];
            var isFirst = first && first.row === row;
            if (!(isFirst && st.view === 'home' && $('.atv-hero'))) y = row.offsetTop - topY;
            if (st.view === 'search' && isFirst) y = Math.max(0, row.offsetTop - 22 * cq);
          }
        } else if (z.k === 'keys') y = 0;
        y = Math.max(0, y);
        scrollEl.style.transform = 'translateY(' + (-y) + 'px)';
        screen.classList.toggle('scrolled', y > 1);
        // horizontal
        if (z.k === 'row') {
          var tr = el.parentNode, W = screen.clientWidth, x = +(tr.getAttribute('data-x') || 0);
          var left = el.offsetLeft, w = el.offsetWidth, padR = 5 * cq, padL = 1.5 * cq;
          if (left + w + x > tr.parentNode.clientWidth - padR) x = -(left + w - tr.parentNode.clientWidth + padR);
          if (left + x < padL) x = -(left - padL);
          x = Math.min(0, x); tr.setAttribute('data-x', x); tr.style.transform = 'translateX(' + x + 'px)';
        }
        if (z.k === 'filters') {
          var ft = $('.atv-ftrack'), fx = +(ft.getAttribute('data-x') || 0), FW = $('.atv-filters').clientWidth;
          if (el.parentNode === ft) {
            if (el.offsetLeft + el.offsetWidth + fx > FW - 1.5 * cq) fx = -(el.offsetLeft + el.offsetWidth - FW + 1.5 * cq);
            if (el.offsetLeft + fx < 0) fx = -el.offsetLeft;
            fx = Math.min(0, fx); ft.setAttribute('data-x', fx); ft.style.transform = 'translateX(' + fx + 'px)';
          }
        }
        if (el.classList.contains('atv-card') && st.prefs.previews && !reduce) {
          previewT = setTimeout(function () { if (el.classList.contains('is-focus')) el.classList.add('is-preview'); }, 1400);
        }
      }
      if (el) {
        el.classList.add('is-focus');
        if (dir && el.classList.contains('atv-card') && !reduce) {
          var a = el.querySelector('.atv-cardart');
          a.style.setProperty('--ry', (dir === 'r' ? 4 : dir === 'l' ? -4 : 0) + 'deg'); a.style.setProperty('--rx', (dir === 'd' ? -4 : dir === 'u' ? 4 : 0) + 'deg');
          setTimeout(function () { a.style.setProperty('--rx', '0deg'); a.style.setProperty('--ry', '0deg'); }, 200);
        }
      }
    }
    function bump() {
      if (reduce) return; var el = $('.is-focus'); if (!el) return;
      el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
    }
    function nearest(els, from) {
      if (!from) return 0;
      var b = from.getBoundingClientRect(), cx = b.left + b.width / 2, best = 0, bd = Infinity;
      els.forEach(function (e, k) { var r = e.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - cx); if (d < bd) { bd = d; best = k; } });
      return best;
    }
    function moveMain(dir) {
      if (st.area === 'rail') {
        var n = RAIL.length;
        if (dir === 'u') st.ri > 0 ? st.ri-- : bump();
        else if (dir === 'd') st.ri < n - 1 ? st.ri++ : bump();
        else if (dir === 'r') st.area = 'content';
        else bump();
        return paint(dir);
      }
      var z = Z[st.zi], cur = z.els[st.ci];
      if (dir === 'l') {
        if (st.ci > 0) st.ci--;
        else { st.area = 'rail'; st.ri = railIndexForState(); }
      } else if (dir === 'r') {
        if (st.ci < z.els.length - 1) st.ci++;
        else if (z.k === 'hero') { st.hero = (st.hero + 1) % hero.length; renderMain(); st.zi = zoneIndex('hero'); st.ci = 2; }
        else return bump();
      } else {
        var nz = st.zi + (dir === 'd' ? 1 : -1);
        if (nz < 0 || nz >= Z.length) return bump();
        st.zi = nz;
        var t = Z[nz];
        if (t.k === 'filters') { st.ci = selIndex(t.els); scrollEl.style.transform = 'translateY(0)'; }
        else if (t.k === 'regions') st.ci = selIndex(t.els);
        else st.ci = nearest(t.els, cur);
      }
      paint(dir);
    }
    function selIndex(els) { for (var i = 0; i < els.length; i++) if (els[i].classList.contains('sel')) return i; return 0; }
    function railIndexForState() {
      var k = st.view === 'search' ? 'search' : st.view === 'library' ? 'library' : ({ all: 'home', orig: 'orig', movies: 'movies', shows: 'shows', sports: 'sports' }[st.filter] || 'home');
      for (var i = 0; i < RAIL.length; i++) if (RAIL[i].k === k) return i; return 1;
    }
    function focusZone(k, i) { var zi = zoneIndex(k); if (zi > -1) { st.zi = zi; st.ci = i || 0; } st.area = 'content'; }

    function setFilter(k, keepFocus) {
      st.filter = k; st.view = 'home'; st.hero = 0; if (k !== 'intl') st.region = 'all';
      $$('.atv-track').forEach(function (t) { t.removeAttribute('data-x'); });
      renderMain();
      if (keepFocus) focusZone('filters', FILTERS.map(function (f) { return f.k; }).indexOf(k));
      if (k === 'orig') task('filter');
      if (k === 'intl') task('intl');
    }
    function selectMain(long) {
      if (st.area === 'rail') {
        var r = RAIL[st.ri];
        if (r.k === 'search') { st.view = 'search'; renderMain(); focusZone('keys', 0); }
        else if (r.k === 'library') { st.view = 'library'; renderMain(); focusZone('row', 0); st.zi = zoneIndex('filters') + 1; }
        else if (r.ch) { toast(r.l + ' is a connected channel. Out of scope for this concept.'); return; }
        else { setFilter(r.k === 'home' ? 'all' : r.k); focusZone('hero', 0); if (zoneIndex('hero') < 0) st.zi = 1; }
        st.area = 'content';
        return paint();
      }
      var z = Z[st.zi], el = z.els[st.ci];
      press(el);
      if (z.k === 'filters') {
        if (el.classList.contains('atv-opt')) return openOptions();
        if (el.classList.contains('atv-dockin')) return resume();
        setFilter(FILTERS[st.ci].k, true); return paint();
      }
      if (z.k === 'regions') { st.region = REGIONS[st.ci].k; renderMain(); focusZone('regions', st.ci); task('region'); return paint(); }
      if (z.k === 'hero') {
        var h = hero[st.hero], act = el.getAttribute('data-act');
        if (act === 'play') return openPlayer(h);
        if (act === 'up') { toggleUp(h); renderMain(); focusZone('hero', 1); return paint(); }
        return openDetail(h);
      }
      if (z.k === 'keys') {
        var k = el.getAttribute('data-k');
        st.query = k === 'del' ? st.query.slice(0, -1) : st.query + (k === 'space' ? ' ' : k);
        var ci = st.ci; renderMain(); focusZone('keys', ci); return paint();
      }
      if (z.k === 'dock') return resume();
      if (el.classList.contains('atv-cat')) { setFilter(el.getAttribute('data-f')); focusZone('hero', 0); return paint(); }
      var x = BY[el.getAttribute('data-id')];
      if (long) return openMenu(x, el);
      var rowKey = el.closest('.atv-row').getAttribute('data-key');
      if (rowKey === 'cw' || x.live) return openPlayer(x);
      openDetail(x);
    }
    function press(el) { if (!el) return; el.classList.add('is-press'); setTimeout(function () { el.classList.remove('is-press'); }, 130); }
    function toggleUp(x) {
      var i = st.upnext.indexOf(x.id);
      if (i > -1) { st.upnext.splice(i, 1); toast('Removed from Up Next'); } else { st.upnext.unshift(x.id); toast('Added to Up Next'); task('upnext'); }
    }

    /* ---------- layers */
    function pushLayer(L) {
      st.layers.push(L);
      var el = document.createElement('div'); el.className = 'atv-layer ' + L.cls; el.innerHTML = L.html; layersEl.appendChild(el); L.el = el;
      requestAnimationFrame(function () { el.classList.add('on'); });
      screen.classList.add('has-layer');
      L.z = L.z || 0; L.c = L.c || 0;
      if (L.init) L.init(L);
      paint();
    }
    function popLayer() {
      var L = st.layers.pop(); if (!L) return;
      if (L.close) L.close(L);
      L.el.classList.remove('on'); setTimeout(function () { L.el.remove(); }, 350);
      screen.classList.toggle('has-layer', st.layers.length > 0);
      if (!st.layers.length) { renderMain(); }
      paint();
    }
    function top() { return st.layers[st.layers.length - 1]; }
    function zonesOf(L) { return L.zones().filter(function (z) { return z.length; }); }
    function paintLayer() {
      var L = top(), Zs = zonesOf(L);
      if (L.z >= Zs.length) L.z = Zs.length - 1;
      var els = Zs[L.z]; if (!els) return;
      L.c = Math.max(0, Math.min(L.c, els.length - 1));
      els[L.c].classList.add('is-focus');
      if (L.paint) L.paint(L, Zs, els[L.c]);
    }
    function moveLayer(dir) {
      var L = top();
      if (L.onMove && L.onMove(L, dir) !== false) return;
      var Zs = zonesOf(L), els = Zs[L.z], cur = els[L.c], horiz = !L.vertical;
      if ((horiz && (dir === 'l' || dir === 'r')) || (!horiz && (dir === 'u' || dir === 'd'))) {
        var n = L.c + (dir === 'r' || dir === 'd' ? 1 : -1);
        if (n < 0 || n >= els.length) return bump();
        L.c = n;
      } else {
        var nz = L.z + (dir === 'd' || dir === 'r' ? 1 : -1);
        if (nz < 0 || nz >= Zs.length) return bump();
        L.z = nz; L.c = horiz ? nearest(Zs[nz], cur) : 0;
      }
      paint(dir);
    }

    // Show / movie page
    function openDetail(x) {
      var c = cwFor(x.id), seasons = x.type === 'series' ? x.s : 0, season = c && c.season ? c.season : 1;
      function eps(sn) {
        var n = 6, out = '';
        for (var e = 1; e <= n; e++) {
          var done = c && c.season && (sn < c.season || (sn === c.season && e < c.ep)), now = c && c.season === sn && c.ep === e;
          out += '<div class="atv-ep" data-ep="' + e + '"><div class="atv-cardart">' + art(x, { noword: 1 }) + (done ? '<em class="atv-tag r">' + icon('check') + '</em>' : '') + (now ? '<i class="atv-prog"><b style="width:' + Math.round(c.pos / c.dur * 100) + '%"></b></i>' : '') + '</div>' +
            '<small>EPISODE ' + e + '</small><b>Episode ' + e + '</b><p>' + esc(['The first step changes everything.', 'An unexpected ally shows up.', 'Old secrets surface at the worst time.', 'A choice that cannot be undone.', 'The plan starts to unravel.', 'Nothing will be the same.'][e - 1]) + '</p>' +
            '<span class="atv-epmeta">' + (48 + e * 2) + ' min <em>CC</em><em>SDH</em><em>AD</em></span></div>';
        }
        return out;
      }
      var more = sorted(T.filter(function (y) { return y.id !== x.id && y.g[0] === x.g[0]; })).slice(0, 6);
      var html = '<div class="atv-dbg" style="' + artStyle(x) + '">' + (DECO[x.deco] || '') + '</div><div class="atv-dscrim"></div>' +
        '<div class="atv-dhead"><div class="atv-eyebrow">' + (x.orig ? 'Apple Original · ' : '') + esc(x.g.join(', ')) + '</div><div class="atv-dtitle f-' + x.f + '">' + esc(x.t) + '</div>' +
        '<div class="atv-hmeta">' + esc(meta(x)) + '<span class="atv-badges"><em>4K</em><em>HDR</em><em>CC</em><em>SDH</em><em>AD</em></span></div>' +
        (x.reg !== 'US' ? '<div class="atv-langs">' + icon('globe') + 'Original audio: ' + esc(x.lang.split(',')[0]) + ' · Subtitles: English, Spanish, French</div>' : '') +
        '<p class="atv-hdesc">' + esc(x.d) + '</p>' +
        '<div class="atv-hbtns d-btns"><span class="atv-btn wide" data-act="play">' + icon('play') + (c ? (c.season ? 'Resume S' + c.season + ', E' + c.ep : 'Resume') : seasons ? 'Play S1, E1' : 'Play') + '</span>' +
        '<span class="atv-btn" data-act="up">' + icon(st.upnext.indexOf(x.id) > -1 ? 'check' : 'plus') + 'Up Next</span>' +
        '<span class="atv-btn" data-act="lang">' + icon('cc') + 'Audio &amp; Subtitles</span>' +
        '<span class="atv-btn round" data-act="more" aria-label="More">' + icon('more') + '</span></div></div>' +
        '<div class="atv-dlower">' + (seasons ? '<div class="atv-seasons">' + Array.apply(null, Array(seasons)).map(function (_, i) { return '<span class="atv-season' + (i + 1 === season ? ' sel' : '') + '" data-s="' + (i + 1) + '">Season ' + (i + 1) + '</span>'; }).join('') + '</div><div class="atv-eps"><div class="atv-track">' + eps(season) + '</div></div>' :
          '<h4 class="atv-dh4">More Like This</h4><div class="atv-eps"><div class="atv-track">' + more.map(function (y, i) { return card(y, 'more', i, 'more'); }).join('') + '</div></div>') + '</div>';
      pushLayer({
        cls: 'atv-detail', html: html,
        zones: function () { var L = this; return [$$('.d-btns .atv-btn', L.el), $$('.atv-season', L.el), $$('.atv-ep, .atv-eps .atv-card', L.el)]; },
        init: function (L) { L.season = season; },
        paint: function (L, Zs, el) {
          var lower = L.el.querySelector('.atv-dlower');
          L.el.classList.toggle('down', L.z > 0);
          if (el.closest('.atv-eps')) {
            var tr = el.parentNode, x0 = +(tr.getAttribute('data-x') || 0), W = tr.parentNode.clientWidth, cq = screen.clientWidth / 100;
            if (el.offsetLeft + el.offsetWidth + x0 > W - 4 * cq) x0 = -(el.offsetLeft + el.offsetWidth - W + 4 * cq);
            if (el.offsetLeft + x0 < 0) x0 = -el.offsetLeft;
            tr.setAttribute('data-x', Math.min(0, x0)); tr.style.transform = 'translateX(' + Math.min(0, x0) + 'px)';
          }
          if (el.classList.contains('atv-season') && +el.getAttribute('data-s') !== L.season) {
            L.season = +el.getAttribute('data-s');
            $$('.atv-season', L.el).forEach(function (s) { s.classList.toggle('sel', s === el); });
            L.el.querySelector('.atv-eps .atv-track').innerHTML = eps(L.season); L.el.querySelector('.atv-eps .atv-track').style.transform = '';
          }
          void lower;
        },
        select: function (L, el) {
          var a = el.getAttribute('data-act');
          if (a === 'play') return openPlayer(x);
          if (a === 'up') { toggleUp(x); el.innerHTML = icon(st.upnext.indexOf(x.id) > -1 ? 'check' : 'plus') + 'Up Next'; return; }
          if (a === 'lang') return openLang(x);
          if (a === 'more') return openMenu(x, el);
          if (el.classList.contains('atv-ep')) return openPlayer(x, { season: L.season, ep: +el.getAttribute('data-ep') });
          if (el.classList.contains('atv-card')) { popLayer(); return openDetail(BY[el.getAttribute('data-id')]); }
        }
      });
    }

    // Quick actions menu (long press)
    function openMenu(x, anchor) {
      task('longpress');
      var inUp = st.upnext.indexOf(x.id) > -1, c = cwFor(x.id);
      var items = [
        ['play', c ? 'Resume' : 'Play', 'play'], ['up', inUp ? 'Remove from Up Next' : 'Add to Up Next', inUp ? 'check' : 'plus'],
        ['watched', st.watched[x.id] ? 'Mark as Unwatched' : 'Mark as Watched', 'check'], ['lang', 'Audio & Subtitles', 'cc'],
        ['less', 'Show Less Like This', 'more'], ['info', 'Go to ' + (x.type === 'movie' ? 'Movie' : 'Show'), 'info']
      ];
      pushLayer({
        cls: 'atv-menu', vertical: true,
        html: '<div class="atv-menubox"><div class="atv-mhead">' + art(x, { noword: 1 }) + '<span><b>' + esc(x.t) + '</b><small>' + esc(meta(x)) + '</small></span></div>' + items.map(function (it) { return '<span class="atv-mi" data-act="' + it[0] + '">' + icon(it[2]) + esc(it[1]) + '</span>'; }).join('') + '</div>',
        zones: function () { return [$$('.atv-mi', this.el)]; },
        select: function (L, el) {
          var a = el.getAttribute('data-act');
          if (a === 'play') { popLayer(); return openPlayer(x); }
          if (a === 'up') { toggleUp(x); popLayer(); return; }
          if (a === 'watched') { if (st.watched[x.id]) delete st.watched[x.id]; else st.watched[x.id] = 1; toast(st.watched[x.id] ? 'Marked as watched' : 'Marked as unwatched'); popLayer(); return; }
          if (a === 'lang') { popLayer(); return openLang(x); }
          if (a === 'less') { st.hidden[x.id] = 1; popLayer(); toast('Got it. You’ll see fewer titles like ' + x.t + '.'); return; }
          if (a === 'info') { popLayer(); return openDetail(x); }
        }
      });
    }

    // View options (sort + preferences)
    function openOptions() {
      task('options');
      function html() {
        return '<div class="atv-menubox right"><div class="atv-mtitle">Sort by</div>' + SORTS.map(function (s) { return '<span class="atv-mi" data-sort="' + s.k + '">' + (st.sort === s.k ? icon('check') : '<i class="sp"></i>') + esc(s.l) + '</span>'; }).join('') +
          '<div class="atv-mtitle">Preferences</div>' +
          '<span class="atv-mi tg" data-pref="previews">Focus previews<em class="' + (st.prefs.previews ? 'on' : '') + '"></em></span>' +
          '<span class="atv-mi tg" data-pref="hideWatched">Hide watched titles<em class="' + (st.prefs.hideWatched ? 'on' : '') + '"></em></span>' +
          '<span class="atv-mi tg" data-pref="original">Original language + subtitles<em class="' + (st.prefs.original ? 'on' : '') + '"></em></span></div>';
      }
      pushLayer({
        cls: 'atv-menu', vertical: true, html: html(),
        zones: function () { return [$$('.atv-mi', this.el)]; },
        select: function (L, el) {
          var s = el.getAttribute('data-sort'), p = el.getAttribute('data-pref'), c = L.c;
          if (s) { st.sort = s; toast('Sorted by ' + SORTS.filter(function (q) { return q.k === s; })[0].l.toLowerCase()); }
          if (p) { st.prefs[p] = !st.prefs[p]; toast((el.textContent.trim()) + (st.prefs[p] ? ' on' : ' off')); }
          L.el.innerHTML = html(); L.c = c; renderMain(); paint();
        }
      });
    }

    // Audio & subtitles
    var AUD = {}, SUB = {};
    function audioOpts(x) { return x.audio || ['English (Original)', 'Spanish', 'French']; }
    var SUBOPTS = ['Off', 'English', 'English SDH', 'Spanish', 'French'];
    function curAudio(x) { return AUD[x.id] != null ? AUD[x.id] : (x.audio && !st.prefs.original ? 1 : 0); }
    function curSub(x) { return SUB[x.id] != null ? SUB[x.id] : (x.reg !== 'US' && st.prefs.original && x.audio ? 1 : 0); }
    function openLang(x, inPlayer) {
      function html() {
        return '<div class="atv-langbox"><div class="atv-mtitle">Audio</div><div class="atv-lrow">' + audioOpts(x).map(function (a, i) { return '<span class="atv-lopt' + (curAudio(x) === i ? ' sel' : '') + '" data-a="' + i + '">' + esc(a) + '</span>'; }).join('') + '</div>' +
          '<div class="atv-mtitle">Subtitles</div><div class="atv-lrow">' + SUBOPTS.map(function (s, i) { return '<span class="atv-lopt' + (curSub(x) === i ? ' sel' : '') + '" data-s="' + i + '">' + esc(s) + '</span>'; }).join('') + '</div>' +
          '<p class="atv-lnote">Your choice is remembered for ' + esc(x.t) + (x.reg !== 'US' ? ' and other ' + esc(x.lang.split(',')[0]) + ' titles' : '') + '.</p></div>';
      }
      pushLayer({
        cls: 'atv-lang' + (inPlayer ? ' inplayer' : ''), html: html(),
        zones: function () { return [$$('[data-a]', this.el), $$('[data-s]', this.el)]; },
        select: function (L, el) {
          var a = el.getAttribute('data-a'), s = el.getAttribute('data-s'), z = L.z, c = L.c;
          if (a != null) { AUD[x.id] = +a; toast('Audio: ' + audioOpts(x)[+a]); }
          if (s != null) { SUB[x.id] = +s; toast('Subtitles: ' + SUBOPTS[+s]); task('subs'); }
          L.el.innerHTML = html(); L.z = z; L.c = c; paint();
        }
      });
    }

    // Player
    var timer = null;
    function openPlayer(x, ep) {
      if (x.type === 'sports' || x.live) { /* live */ }
      var c = cwFor(x.id), dsec = x.mins ? x.mins * 60 : 3240;
      var P = { x: x, pos: ep ? 0 : (c ? c.pos : 0), dur: c && !ep ? c.dur : dsec, season: ep ? ep.season : c && c.season || (x.type === 'series' ? 1 : 0), ep: ep ? ep.ep : c && c.ep || (x.type === 'series' ? 1 : 0), playing: true, shown: 4, line: 0 };
      if (c && !ep) task('resume');
      var html = '<div class="atv-video" style="' + artStyle(x) + '">' + (DECO[x.deco] || '') + '</div><div class="atv-vscrim"></div>' +
        '<div class="atv-ptop"><small>' + (x.live ? 'LIVE' : P.season ? 'S' + P.season + ', E' + P.ep : 'Movie') + '</small><b>' + esc(x.t) + '</b></div>' +
        '<div class="atv-sub"></div>' +
        '<span class="atv-skip atv-btn" data-act="skip">Skip Intro</span>' +
        '<div class="atv-pbar"><div class="atv-pctl"><span class="atv-btn round" data-act="pp">' + icon('pause') + '</span><span class="atv-btn" data-act="lang">' + icon('cc') + 'Audio &amp; Subtitles</span>' + (P.season ? '<span class="atv-btn" data-act="next">Next Episode</span>' : '') + '</div>' +
        '<div class="atv-track2"><i style="width:0"></i><b></b></div><div class="atv-ptime"><span class="e"></span><span class="r"></span></div></div>';
      pushLayer({
        cls: 'atv-player', html: html, P: P,
        zones: function () { var z = [$$('.atv-pctl .atv-btn', this.el)]; if (P.pos < 90 && P.season && !P.skipped) z.unshift([this.el.querySelector('.atv-skip')]); return z; },
        init: function (L) { L.z = 0; L.c = 0; upd(L); clearInterval(timer); timer = setInterval(function () { if (P.playing) { P.pos = Math.min(P.dur, P.pos + 1); } if (P.shown > 0) P.shown--; upd(L); }, 1000); },
        close: function () { clearInterval(timer); saveProgress(P); },
        onMove: function (L, dir) {
          if (dir === 'l' || dir === 'r') {
            var onBtns = L.el.querySelector('.atv-pctl .is-focus');
            if (onBtns && L.el.classList.contains('show')) return false;
            P.pos = Math.max(0, Math.min(P.dur, P.pos + (dir === 'r' ? 10 : -10))); P.shown = 4; upd(L); toast((dir === 'r' ? '+10' : '−10') + ' seconds'); return true;
          }
          P.shown = 4; upd(L); return false;
        },
        select: function (L, el) {
          var a = el.getAttribute('data-act');
          if (a === 'skip') { P.pos = 90; P.skipped = true; L.z = 0; L.c = 0; upd(L); paint(); return toast('Intro skipped'); }
          if (a === 'pp') { P.playing = !P.playing; P.shown = 4; upd(L); return; }
          if (a === 'lang') return openLang(x, true);
          if (a === 'next') { P.ep++; P.pos = 0; P.skipped = false; L.el.querySelector('.atv-ptop small').textContent = 'S' + P.season + ', E' + P.ep; upd(L); paint(); return toast('Playing episode ' + P.ep); }
        }
      });
      function upd(L) {
        var el = L.el;
        el.querySelector('.atv-track2 i').style.width = (P.pos / P.dur * 100) + '%';
        el.querySelector('.atv-track2 b').style.left = (P.pos / P.dur * 100) + '%';
        el.querySelector('.atv-ptime .e').textContent = clock(P.pos);
        el.querySelector('.atv-ptime .r').textContent = '−' + clock(P.dur - P.pos);
        el.querySelector('[data-act="pp"]').innerHTML = icon(P.playing ? 'pause' : 'play');
        el.classList.toggle('show', P.shown > 0 || !P.playing);
        el.classList.toggle('paused', !P.playing);
        var skip = el.querySelector('.atv-skip'); skip.classList.toggle('on', P.pos < 90 && !!P.season && !P.skipped);
        var s = SUBOPTS[curSub(x)], lines = SUBS[s] || null;
        var sub = el.querySelector('.atv-sub');
        if (lines) { sub.textContent = lines[Math.floor(P.pos / 4) % lines.length]; sub.style.opacity = 1; } else sub.style.opacity = 0;
      }
      openPlayer.toggle = function () { var L = top(); if (L && L.P) { P.playing = !P.playing; P.shown = 4; upd(L); toast(P.playing ? 'Play' : 'Paused'); } };
    }
    function saveProgress(P) {
      if (P.x.live) return;
      var c = cwFor(P.x.id);
      if (c) st.cw.splice(st.cw.indexOf(c), 1);
      if (P.pos < P.dur - 30) st.cw.unshift({ id: P.x.id, season: P.season || undefined, ep: P.ep || undefined, pos: Math.max(P.pos, 30), dur: P.dur });
      else st.watched[P.x.id] = 1;
      renderDock();
    }
    function resume() { var c = st.cw[0]; if (!c) return toast('Nothing to resume'); task('resume'); while (st.layers.length) popLayer(); openPlayer(BY[c.id]); }

    // Siri
    function openSiri() {
      task('siri');
      var L = {
        cls: 'atv-siri', html: '<div class="atv-siribar"><span class="atv-orb"></span><div><small>Siri</small><b class="atv-sq">What would you like to watch?</b></div></div><div class="atv-siriin"></div>',
        zones: function () { return [$$('.atv-sc', this.el), $$('.atv-poster', this.el)]; },
        init: function (L) { suggest(L); },
        select: function (L, el) {
          var k = el.getAttribute('data-q');
          if (k) return answer(L, k);
          if (el.classList.contains('atv-poster')) { var id = el.getAttribute('data-id'); popLayer(); return openDetail(BY[id]); }
        }
      };
      function suggest(L) {
        L.el.classList.remove('results');
        L.el.querySelector('.atv-siriin').innerHTML = '<div class="atv-sugg"><small>Try asking</small><div class="atv-chips">' + SIRI_START.map(function (k) { return '<span class="atv-sc" data-q="' + k + '">“' + esc(SIRI[k].q) + '”</span>'; }).join('') + '</div></div>';
      }
      function answer(L, k) {
        var q = SIRI[k];
        if (q.resume) { popLayer(); return resume(); }
        L.el.querySelector('.atv-sq').textContent = '“' + q.q + '”';
        var list = sorted(T.filter(q.fn));
        var names = list.slice(0, 3).map(function (x) { return x.t; });
        var sentence = 'Here are ' + q.a + ' you can watch' + (names.length ? ', including ' + (names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0]) : '') + '.';
        L.el.classList.add('results');
        L.el.querySelector('.atv-siriin').innerHTML = '<p class="atv-sans">' + esc(sentence) + '</p><div class="atv-chips">' + q.more.map(function (m) { return '<span class="atv-sc ref" data-q="' + m + '">→ ' + esc(SIRI[m].q) + '</span>'; }).join('') + '</div>' +
          '<div class="atv-posters"><div class="atv-track">' + list.map(function (x) { return '<div class="atv-poster" data-id="' + x.id + '"><div class="atv-cardart">' + art(x) + '</div></div>'; }).join('') + '</div></div>' +
          '<div class="atv-morelike">More like ' + esc(list[0] ? list[0].t : '') + ' ⌄</div>';
        L.z = 1; L.c = 0; paint();
      }
      pushLayer(L);
      L.paint = function (L2, Zs, el) {
        if (el.classList.contains('atv-poster')) {
          var tr = el.parentNode, x0 = +(tr.getAttribute('data-x') || 0), W = tr.parentNode.clientWidth, cq = screen.clientWidth / 100;
          if (el.offsetLeft + el.offsetWidth + x0 > W - 3 * cq) x0 = -(el.offsetLeft + el.offsetWidth - W + 3 * cq);
          if (el.offsetLeft + x0 < 0) x0 = -el.offsetLeft;
          tr.setAttribute('data-x', Math.min(0, x0)); tr.style.transform = 'translateX(' + Math.min(0, x0) + 'px)';
        }
      };
      openSiri.ask = function (k) { answer(L, k); };
    }

    // Volume
    function volume(d) {
      if (d === 'mute') st.muted = !st.muted; else { st.muted = false; st.vol = Math.max(0, Math.min(16, st.vol + d)); }
      var v = $('.atv-vol');
      v.innerHTML = icon(st.muted || !st.vol ? 'mute' : 'speaker') + '<i><b style="width:' + (st.muted ? 0 : st.vol / 16 * 100) + '%"></b></i>';
      v.classList.add('on'); clearTimeout(volume.t); volume.t = setTimeout(function () { v.classList.remove('on'); }, 1500);
    }

    /* ---------- commands */
    function cmd(k, long) {
      if (k === 'u' || k === 'd' || k === 'l' || k === 'r') return st.layers.length ? moveLayer(k) : moveMain(k);
      if (k === 'select') {
        if (st.layers.length) { var L = top(), el = $('.is-focus', L.el); if (!el) return; press(el); if (long && el.getAttribute('data-id') && L.cls === 'atv-detail') return openMenu(BY[el.getAttribute('data-id')], el); return L.select(L, el); }
        return selectMain(long);
      }
      if (k === 'back') {
        if (st.layers.length) return popLayer();
        if (st.area === 'rail') return toast('You’re on the main menu');
        if (Z[st.zi] && Z[st.zi].k !== 'filters') { st.zi = 0; st.ci = selIndex(Z[0].els); scrollEl.style.transform = 'translateY(0)'; return paint('u'); }
        st.area = 'rail'; st.ri = railIndexForState(); return paint('l');
      }
      if (k === 'home') { while (st.layers.length) popLayer(); st.view = 'home'; setFilter('all'); focusZone('hero', 0); st.area = 'content'; paint(); return toast('Home'); }
      if (k === 'pp') { var L2 = top(); if (L2 && L2.P) return openPlayer.toggle(); return resume(); }
      if (k === 'siri') { if (top() && top().cls === 'atv-siri') return; return openSiri(); }
      if (k === 'vup') return volume(1);
      if (k === 'vdown') return volume(-1);
      if (k === 'mute') return volume('mute');
    }

    // pointer: click a card or control directly
    screen.addEventListener('click', function (e) {
      if (!root.classList.contains('is-active') || root.hasAttribute('data-still')) return;
      var t = e.target.closest('[data-z], .atv-btn, .atv-mi, .atv-lopt, .atv-sc, .atv-poster, .atv-ep, .atv-season, .atv-card');
      if (!t) return;
      if (st.layers.length) {
        var L = top(), Zs = zonesOf(L);
        for (var zi = 0; zi < Zs.length; zi++) { var ix = Zs[zi].indexOf(t); if (ix > -1) { L.z = zi; L.c = ix; paint(); return cmd('select'); } }
        return;
      }
      if (t.getAttribute('data-z') === 'rail') { st.area = 'rail'; st.ri = +t.getAttribute('data-i'); paint(); return cmd('select'); }
      for (var i = 0; i < Z.length; i++) { var j = Z[i].els.indexOf(t); if (j > -1) { st.area = 'content'; st.zi = i; st.ci = j; paint(); return cmd('select'); } }
    });

    renderMain(); focusZone('hero', 0); paint();
    window.addEventListener('resize', function () { paint(); });

    return {
      cmd: cmd, task: task, state: st,
      go: function (s) {
        // jump to a named state (used for exported key screens)
        while (st.layers.length) popLayer();
        st.area = 'content';
        if (s === 'home') { setFilter('all'); focusZone('row', 0); st.zi = zoneIndex('hero') + 1; st.ci = 1; }
        if (s === 'originals') { setFilter('orig'); focusZone('filters', 3); }
        if (s === 'intl') { setFilter('intl'); st.region = 'KR'; renderMain(); focusZone('regions', 1); }
        if (s === 'rail') { setFilter('all'); st.area = 'rail'; st.ri = 2; }
        if (s === 'search') { st.view = 'search'; st.query = 'kor'; renderMain(); focusZone('keys', 10); }
        paint();
        if (s === 'siri') { setFilter('all'); paint(); openSiri(); openSiri.ask('kr'); }
        if (s === 'detail') { setFilter('all'); openDetail(BY.pach); var L = top(); L.z = 2; L.c = 2; paint(); }
        if (s === 'menu') { setFilter('all'); focusZone('row', 1); st.zi = zoneIndex('hero') + 2; st.ci = 1; paint(); openMenu(BY.silo); }
        if (s === 'options') { setFilter('movies'); openOptions(); }
        if (s === 'player') { setFilter('all'); SUB.pach = 1; openPlayer(BY.pach); var P = top(); P.P.shown = 99; clearInterval(timer); }
        if (s === 'lang') { setFilter('all'); openPlayer(BY.pach); clearInterval(timer); openLang(BY.pach, true); }
      }
    };
  }

  /* ------------------------------------------------------------------ remote */
  function remote(holder, api, root) {
    holder.innerHTML = '<div class="atv-remote" aria-label="Siri Remote">' +
      '<span class="rb pwr" data-k="power" aria-label="Power"></span>' +
      '<div class="rpad" aria-label="Clickpad: click the edges to move, the center to select, or drag to swipe"><span class="ring"></span><span class="ctr"></span><i class="ar u"></i><i class="ar d"></i><i class="ar l"></i><i class="ar r"></i></div>' +
      '<div class="rgrid"><span class="rb" data-k="back" aria-label="Back"><svg viewBox="0 0 24 24"><path d="M14.5 6 8.5 12l6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
      '<span class="rb" data-k="home" aria-label="TV, Home"><svg viewBox="0 0 24 24"><rect x="4" y="5.5" width="16" height="10.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 19h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>' +
      '<span class="rb" data-k="pp" aria-label="Play or pause"><svg viewBox="0 0 24 24"><path d="M5 6.5v11l7-5.5z" fill="currentColor"/><path d="M15 7v10M19 7v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>' +
      '<span class="rvol"><span class="rb" data-k="vup" aria-label="Volume up">+</span><span class="rb" data-k="vdown" aria-label="Volume down">−</span></span>' +
      '<span class="rb" data-k="mute" aria-label="Mute"><svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor"/><path d="m16 9.5 5 5M21 9.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span></div>' +
      '<span class="rb siri" data-k="siri" aria-label="Siri"><svg viewBox="0 0 24 24"><rect x="9" y="4" width="6" height="10" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>' +
      '<small class="rlabel">Siri Remote<br><span>Click edges · drag to swipe · hold center for options</span></small></div>';
    function activate() { if (!root.classList.contains('is-active')) { root.classList.add('is-active'); } }
    holder.querySelectorAll('[data-k]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation(); activate();
        var k = b.getAttribute('data-k'); flash(b);
        if (k === 'power') return api.cmd('home');
        api.cmd(k);
      });
    });
    var pad = holder.querySelector('.rpad'), sx = 0, sy = 0, moved = 0, acc = { x: 0, y: 0 }, downAt = 0, longT = null, longFired = false, dragging = false;
    pad.addEventListener('pointerdown', function (e) {
      activate(); pad.setPointerCapture(e.pointerId); dragging = true; sx = e.clientX; sy = e.clientY; acc = { x: 0, y: 0 }; moved = 0; downAt = Date.now(); longFired = false;
      var r = pad.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < r.width * 0.2) longT = setTimeout(function () { longFired = true; pad.classList.add('hold'); api.cmd('select', true); }, 550);
      pad.classList.add('touch');
    });
    pad.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - sx, dy = e.clientY - sy; sx = e.clientX; sy = e.clientY; acc.x += dx; acc.y += dy; moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 8) clearTimeout(longT);
      var step = 26;
      while (Math.abs(acc.x) > step) { api.cmd(acc.x > 0 ? 'r' : 'l'); acc.x -= step * Math.sign(acc.x); }
      while (Math.abs(acc.y) > step) { api.cmd(acc.y > 0 ? 'd' : 'u'); acc.y -= step * Math.sign(acc.y); }
      var r = pad.getBoundingClientRect(); pad.style.setProperty('--tx', (e.clientX - r.left) + 'px'); pad.style.setProperty('--ty', (e.clientY - r.top) + 'px');
    });
    pad.addEventListener('pointerup', function (e) {
      dragging = false; clearTimeout(longT); pad.classList.remove('touch', 'hold');
      if (longFired || moved > 8) return;
      var r = pad.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < r.width * 0.2) { flash(pad.querySelector('.ctr')); return api.cmd('select'); }
      var dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'd' : 'u');
      flash(pad.querySelector('.ar.' + dir)); api.cmd(dir);
    });
    function flash(b) { if (!b) return; b.classList.add('hit'); setTimeout(function () { b.classList.remove('hit'); }, 160); }
    return { flash: function (k) { var b = holder.querySelector('[data-k="' + k + '"]') || holder.querySelector('.ar.' + k) || (k === 'select' && holder.querySelector('.ctr')); flash(b); } };
  }

  /* ------------------------------------------------------------------ boot */
  window.ATV = {};
  document.querySelectorAll('[data-atv]').forEach(function (root) {
    var api = create(root); window.ATV[root.id || 'atv'] = api;
    if (root.hasAttribute('data-still')) { root.classList.add('is-active'); return; }
    var holder = document.querySelector('[data-atv-remote="' + root.id + '"]');
    var rm = holder ? remote(holder, api, root) : null;
    root.tabIndex = 0;
    function activate() { root.classList.add('is-active'); }
    root.addEventListener('focus', activate);
    root.addEventListener('pointerdown', function () { activate(); });
    document.addEventListener('pointerdown', function (e) { if (!root.contains(e.target) && !(holder && holder.contains(e.target))) root.classList.remove('is-active'); });
    var enterT = null, enterLong = false;
    document.addEventListener('keydown', function (e) {
      if (!root.classList.contains('is-active') || e.metaKey || e.ctrlKey || e.altKey) return;
      var k = { ArrowUp: 'u', ArrowDown: 'd', ArrowLeft: 'l', ArrowRight: 'r', Escape: 'back', Backspace: 'back', ' ': 'pp', h: 'home', H: 'home', s: 'siri', S: 'siri', '+': 'vup', '=': 'vup', '-': 'vdown', m: 'mute', M: 'mute' }[e.key];
      if (e.key === 'Enter') {
        e.preventDefault(); if (e.repeat) return;
        enterLong = false; enterT = setTimeout(function () { enterLong = true; api.cmd('select', true); }, 550);
        return;
      }
      if (e.key === 'o' || e.key === 'O') { e.preventDefault(); api.cmd('select', true); return; }
      if (!k) return;
      e.preventDefault(); api.cmd(k); if (rm) rm.flash(k);
    });
    document.addEventListener('keyup', function (e) {
      if (e.key !== 'Enter' || !root.classList.contains('is-active')) return;
      clearTimeout(enterT); if (!enterLong) { api.cmd('select'); if (rm) rm.flash('select'); }
    });
  });
})();
