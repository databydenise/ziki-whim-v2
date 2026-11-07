/* Mock of the existing category listing (from the reference screenshots).
   On the real site these come from Start.ng itself; the machine does not touch them. */
(function () {
  var GROUPS = [
    ['How you play', [
      ['Endless runners', 38, '#e0a13a', '#2f6c8f'], ['Racing and driving', 14, '#e0703a', '#1d3a5c'],
      ['Shooting and action', 12, '#d9532b', '#26304f'], ['Platformers', 13, '#4aa8d8', '#5ba04a'],
      ['Brainy games', 25, '#3a5bd9', '#1a1440'], ['Board and card', 9, '#a8702f', '#2b1a10'],
      ['Catch and dodge', 29, '#e0b13a', '#2f8f7a'], ['Coin collecting', 44, '#e0a81f', '#3d2608'],
      ['Survival', 10, '#6b5a3a', '#14110d'], ['Football and sports', 5, '#2f9a55', '#0d2236'],
      ['Simulation and management', 10, '#e0a13a', '#1d6f8f']
    ]],
    ['Setting and theme', [
      ['Nigerian themed', 43, '#e08a3a', '#3a5f9f'], ['Lagos', 24, '#2f4f8f', '#e0a13a'],
      ['Markets and street life', 9, '#d98a2f', '#2f7a5a'], ['Food and cooking', 11, '#d9622b', '#3a2210'],
      ['Space and sci-fi', 9, '#8f3fd1', '#10163a'], ['Neon and cyberpunk', 17, '#d12f9a', '#10163a'],
      ['Fantasy and magic', 5, '#3f6fd1', '#1a2a4a'], ['Ancient ruins and treasure', 8, '#8f7a2f', '#1a2a1a'],
      ['Horror and spooky', 3, '#6b3fd1', '#1a1020'], ['Cosy and relaxing', 4, '#4a8f7a', '#3a2a18']
    ]],
    ['Learn and grow', [
      ['Educational', 6, '#4a6fd1', '#3a2a1a'], ['Words and reading', 4, '#8f5fd1', '#2a1a10'],
      ['Coding and tech', 5, '#1f9f8f', '#0d2a3a']
    ]]
  ];

  var side = document.getElementById('category-side');
  var rest = document.getElementById('category-groups');
  if (!rest) return;
  GROUPS.forEach(function (g, i) {
    var host = (i === 0 && side) ? side : rest;
    var h = document.createElement('h2');
    h.textContent = g[0];
    var grid = document.createElement('div');
    grid.className = 'cat-grid';
    g[1].forEach(function (c) {
      var a = document.createElement('a');
      a.className = 'cat';
      a.href = '#';
      a.style.setProperty('--a', c[2]);
      a.style.setProperty('--b', c[3]);
      var n = document.createElement('span'); n.className = 'cat-name'; n.textContent = c[0];
      var k = document.createElement('span'); k.className = 'cat-count'; k.textContent = c[1] + ' games';
      a.append(n, k);
      grid.appendChild(a);
    });
    host.append(h, grid);
  });
})();
