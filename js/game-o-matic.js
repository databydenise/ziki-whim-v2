/* Game-o-Matic 3000: interaction logic. Data comes from games-data.js. */
(function () {
  'use strict';

  var GAMES = window.GAME_O_MATIC_GAMES || [];
  var MOODS = window.GAME_O_MATIC_MOODS || {};
  var root = document.querySelector('[data-gom]');
  if (!root) return;

  function q(sel, ctx) { return (ctx || root).querySelector(sel); }
  var el = {
    stage: q('[data-stage]'), machine: q('[data-machine]'),
    title: q('[data-title]'), sub: q('[data-sub]'), hint: q('[data-hint]'),
    actions: q('[data-actions]'), start: q('[data-start]'),
    picker: q('[data-picker]'), grid: q('[data-grid]'), close: q('[data-close]'),
    lever: q('[data-lever]'), bubble: q('[data-bubble]'),
    clip: q('[data-clip]'), ticket: q('[data-ticket]'), leds: q('[data-leds]'),
    live: q('[data-live]')
  };

  var state = { mood: null, lastId: null, busy: false, ticketOpen: false, picking: false };
  var bubbleTimer = null;

  /* ---------- helpers ---------- */
  function reduced() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function wait(ms) {
    return new Promise(function (r) { setTimeout(r, reduced() ? Math.min(ms, 60) : ms); });
  }
  function say(text) { el.live.textContent = text; }

  var ICONS = {
    chaos: '<path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="currentColor"/>',
    brainpower: '<path d="M9 18h6M10 21.5h4M12 2.5a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.3 1.1 2.2h5c0-.9.5-1.7 1.1-2.2A6 6 0 0 0 12 2.5z"/>',
    chill: '<path d="M4 10h12v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 11h1.5a2.5 2.5 0 0 1 0 5H16M8 3c-1 1.6 1 2.6 0 4.2M12 3c-1 1.6 1 2.6 0 4.2"/>',
    together: '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 14.2c.7-.2 1.300-.2 2-.2 2.800 0 5 2 5 5"/>'
  };
  function iconSvg(key) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[key] || '') + '</svg>';
  }

  function retick(node) {
    node.classList.remove('tick');
    void node.offsetWidth;
    node.classList.add('tick');
  }

  /* ---------- recommendation (pure logic) ---------- */
  function recommend(mood, lastId) {
    var matches = GAMES.filter(function (g) { return g.moods.indexOf(mood) !== -1; });
    var pool = matches.filter(function (g) { return g.id !== lastId; });
    var list = pool.length ? pool : matches;
    return list.length ? list[Math.floor(Math.random() * list.length)] : null;
  }

  /* ---------- screen ---------- */
  function setScreen(o) {
    el.title.replaceChildren();
    if (o.icon) { var s = document.createElement('span'); s.className = 'scr-icon'; s.innerHTML = iconSvg(o.icon); el.title.appendChild(s); }
    el.title.appendChild(document.createTextNode(o.title || ''));
    el.title.classList.toggle('is-small', !!o.small);
    el.sub.textContent = o.sub || '';
    el.hint.textContent = o.hint || '';
    el.actions.replaceChildren();
    (o.actions || []).forEach(function (a) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'key' + (a.alt ? ' alt' : '');
      b.textContent = a.label;
      b.addEventListener('click', a.fn);
      el.actions.appendChild(b);
    });
    retick(el.title);
    say([o.title, o.sub, o.hint].filter(Boolean).join('. '));
  }

  function setLever(enabled, ready) {
    el.lever.setAttribute('aria-disabled', enabled ? 'false' : 'true');
    el.lever.classList.toggle('is-ready', !!ready);
  }
  function wiggle() {
    el.lever.classList.remove('is-wiggle');
    void el.lever.offsetWidth;
    el.lever.classList.add('is-wiggle');
  }
  function showBubble(text, ms, nudge) {
    clearTimeout(bubbleTimer);
    el.bubble.textContent = text;
    el.bubble.classList.toggle('is-nudge', !!nudge);
    el.bubble.hidden = false;
    if (ms) bubbleTimer = setTimeout(hideBubble, ms);
  }
  function hideBubble() { clearTimeout(bubbleTimer); el.bubble.hidden = true; }

  /* ---------- stages 1 to 3 ---------- */
  function showIdle() {
    state.mood = null;
    el.start.hidden = false;
    setLever(false, false);
    hideBubble();
    setScreen({ title: 'PICK A MOOD', sub: 'Not sure what to play?', hint: 'Tap the screen to begin!' });
  }

  function openPicker() {
    if (state.busy || state.picking) return;
    state.picking = true;
    el.picker.inert = false;
    el.picker.classList.add('is-open');
    setTimeout(function () { var f = q('.mood', el.grid); if (f) f.focus({ preventScroll: true }); }, 120);
  }
  function closePicker(focusTarget) {
    if (!state.picking) return;
    state.picking = false;
    el.picker.classList.remove('is-open');
    el.picker.inert = true;
    if (focusTarget) focusTarget.focus({ preventScroll: true });
  }

  function chooseMood(key) {
    state.mood = key;
    closePicker();
    el.start.hidden = true;
    wait(520).then(function () { showReady(MOODS[key].quip, 'Now pull the lever!'); });
  }

  function showReady(sub, hint) {
    var m = MOODS[state.mood];
    setScreen({ title: m.label, icon: state.mood, sub: sub, hint: hint });
    setLever(true, true);
    wiggle();
    showBubble('Pull!', 0, true);
    el.lever.focus({ preventScroll: true });
  }

  /* ---------- stages 4 to 6 ---------- */
  function onPull() {
    if (state.busy) return;
    if (!state.mood) {
      wiggle();
      showBubble('Pick a mood first!', 1900);
      if (!state.picking) el.start.classList.add('is-pinged');
      setTimeout(function () { el.start.classList.remove('is-pinged'); }, 900);
      return;
    }
    run();
  }

  function cycle(ms) {
    return new Promise(function (resolve) {
      var order = GAMES.slice().sort(function () { return Math.random() - 0.5; });
      var i = 0;
      var every = reduced() ? 40 : 90;
      var timer = setInterval(function () {
        var g = order[i++ % order.length];
        if (!g) return;
        el.title.classList.add('is-small');
        el.title.textContent = g.title;
        retick(el.title);
      }, every);
      setTimeout(function () { clearInterval(timer); resolve(); }, reduced() ? 200 : ms);
    });
  }

  async function run() {
    state.busy = true;
    hideBubble();
    setLever(false, false);
    el.actions.replaceChildren();
    el.lever.classList.add('is-pulled');
    el.stage.classList.add('is-shaking');
    el.leds.classList.add('is-flash');
    setTimeout(function () { el.lever.classList.remove('is-pulled'); }, 420);
    setTimeout(function () {
      el.stage.classList.remove('is-shaking');
      el.leds.classList.remove('is-flash');
    }, 800);

    if (state.ticketOpen) await retractTicket();
    el.hint.textContent = '';
    el.sub.textContent = 'Thinking…';
    await cycle(1500);

    var game = recommend(state.mood, state.lastId);
    if (!game) {
      state.busy = false;
      setScreen({
        title: 'NO TICKETS!', sub: 'Nothing in this mood right now.',
        actions: [{ label: 'Pick another mood', fn: showIdle }]
      });
      return;
    }
    state.lastId = game.id;
    setScreen({ title: game.title, small: true, sub: 'Printing your ticket…' });
    await wait(450);
    await dispense(game);
    setScreen({ title: 'TICKET READY', sub: 'Grab it below!', hint: '' });
    state.busy = false;
    setLever(true, false);
  }

  /* ---------- ticket ---------- */
  function fillTicket(game) {
    var m = MOODS[state.mood];
    q('[data-t-title]', el.ticket).textContent = game.title;
    q('[data-t-desc]', el.ticket).textContent = game.description;
    q('[data-t-mood]', el.ticket).textContent = 'Mood: ' + m.label;
    q('[data-t-id]', el.ticket).textContent = 'No. ' + (1000 + Math.floor(Math.random() * 9000)) + '-' + m.code;
    var thumb = q('[data-t-thumb]', el.ticket);
    thumb.style.setProperty('--cover', game.cover_image || '#888');
    thumb.textContent = game.icon || '🎮';
    el.ticket.style.setProperty('--mc', m.color);
  }

  function layoutTicket() {
    var paper = q('.ticket-paper', el.ticket), foot = q('.ticket-foot', el.ticket);
    paper.style.setProperty('--notch', (paper.offsetHeight - foot.offsetHeight) + 'px');
    var th = el.ticket.offsetHeight;
    el.clip.style.height = (th + 40) + 'px';
    var top = el.clip.getBoundingClientRect().top - el.machine.getBoundingClientRect().top;
    var drop = Math.max(0, top + th + 24 - el.machine.offsetHeight);
    el.stage.style.setProperty('--drop', drop + 'px');
  }

  async function dispense(game) {
    fillTicket(game);
    layoutTicket();
    el.ticket.classList.remove('is-retracting');
    el.ticket.classList.add('is-out');
    state.ticketOpen = true;
    await wait(1350);
    el.ticket.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
    q('[data-t-close]', el.ticket).focus({ preventScroll: true });
  }

  async function retractTicket() {
    el.ticket.classList.remove('is-out');
    el.ticket.classList.add('is-retracting');
    el.stage.style.setProperty('--drop', '0px');
    await wait(520);
    el.ticket.classList.remove('is-retracting');
    el.clip.style.height = '0px';
    state.ticketOpen = false;
  }

  /* ---------- stage 7 ---------- */
  async function onTicketClose() {
    if (state.busy) return;
    await retractTicket();
    setLever(false, false);
    setScreen({
      title: 'TICKET TAKEN', sub: 'Mood: ' + MOODS[state.mood].label,
      actions: [
        { label: 'Fancy another spin?', fn: spinAgain },
        { label: 'Or pick another mood?', fn: showIdle, alt: true }
      ]
    });
    var first = q('.key', el.actions);
    if (first) first.focus({ preventScroll: true });
  }

  function spinAgain() {
    showReady('Same mood, fresh game.', 'Pull the lever!');
  }

  /* ---------- wiring ---------- */
  function buildPicker() {
    Object.keys(MOODS).forEach(function (key) {
      var m = MOODS[key];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'mood';
      b.style.setProperty('--c', m.color);
      b.style.setProperty('--cd', m.dark);
      b.innerHTML = iconSvg(key) + '<b></b><span class="mood-blurb"></span>';
      q('b', b).textContent = m.label;
      q('.mood-blurb', b).textContent = m.blurb;
      b.addEventListener('click', function () { chooseMood(key); });
      el.grid.appendChild(b);
    });
  }

  el.start.addEventListener('click', openPicker);
  el.close.addEventListener('click', function () { closePicker(el.start.hidden ? null : el.start); });
  el.lever.addEventListener('click', onPull);
  q('[data-t-close]', el.ticket).addEventListener('click', onTicketClose);

  document.addEventListener('pointerdown', function (e) {
    if (state.picking && !el.picker.contains(e.target)) closePicker();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && state.picking) closePicker(el.start.hidden ? null : el.start);
  });
  var resizeRaf = 0;
  window.addEventListener('resize', function () {
    if (!state.ticketOpen) return;
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(layoutTicket);
  });

  buildPicker();
  showIdle();
})();
