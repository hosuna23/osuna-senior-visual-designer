(function () {
  'use strict';
  var group = document.querySelector('.work-focus');
  if (!group) return;
  var lists = Array.from(document.querySelectorAll('.index__list'));
  var rows = Array.from(document.querySelectorAll('.index__row'));
  var paths = {
    all: { keys: ['adi','ws','cs','ca','fn','lab','ms','fs','co'], text: 'Start with responsive UI and visual systems, then explore research, prototypes and supporting brand work.' },
    systems: { keys: ['adi','cs','ws','lab','fn','ms'], text: 'Reusable page components, audience journeys, brand adoption and interactive UI explorations.' },
    growth: { keys: ['ca','cs','fs','adi','ws'], text: 'Multichannel campaigns, focused landing pages and analytics-informed web design.' },
    brand: { keys: ['ws','fs','co','ca'], text: 'Identity systems, campaign production, presentation templates, packaging and environmental applications.' }
  };
  group.querySelectorAll('button').forEach(function (button) {
    button.addEventListener('click', function () {
      var path = paths[button.dataset.focus];
      group.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === button)); });
      lists.forEach(function (list) {
        var members = Array.from(list.children);
        members.sort(function (a,b) { return path.keys.indexOf(a.dataset.key) - path.keys.indexOf(b.dataset.key); });
        members.forEach(function (row) { row.hidden = !path.keys.includes(row.dataset.key); list.appendChild(row); });
        var empty = members.every(function (r) { return r.hidden; });
        list.hidden = empty;
        if (list.previousElementSibling && list.previousElementSibling.classList.contains('index__sub')) list.previousElementSibling.hidden = empty;
      });
      document.getElementById('focus-summary').textContent = path.text;
      var first = rows.find(function (r) { return r.dataset.key === path.keys[0]; });
      if (first) first.dispatchEvent(new MouseEvent('mouseenter'));
    });
  });
})();
