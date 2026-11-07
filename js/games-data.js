/* Game-o-Matic 3000: editable data only. No logic lives here.
   Swap in real Start.ng games any time: keep the same fields.
   cover_image is a colour for now; icon is an emoji used as the thumbnail art. */

window.GAME_O_MATIC_MOODS = {
  chaos: {
    label: 'CHAOS', code: 'CH',
    blurb: 'Fast, competitive and exciting.',
    quip: "Excellent choice. Let's cause some trouble.",
    color: '#ff8a4c', dark: '#b2481b'
  },
  brainpower: {
    label: 'BRAINY', code: 'BR',
    blurb: 'Give me something to think about.',
    quip: 'Ooh, someone likes a challenge.',
    color: '#b9a2ff', dark: '#6a4fc2'
  },
  chill: {
    label: 'CHILL', code: 'CL',
    blurb: 'Something relaxed and easy.',
    quip: 'Ahhh. Finally, someone with taste.',
    color: '#82e3b3', dark: '#2c9768'
  },
  together: {
    label: 'SQUAD', code: 'TG',
    blurb: "Let's play with other people.",
    quip: 'The more, the merrier!',
    color: '#ffd44f', dark: '#c29710'
  }
};

window.GAME_O_MATIC_GAMES = [
  { id: 'danfo-dash', title: 'Danfo Dash', icon: '🚌',
    description: 'Weave through traffic, dodge the potholes and never miss your bus stop.',
    cover_image: '#e8a21f', url: '/games/danfo-dash', moods: ['chaos'] },
  { id: 'lagos-rush-hour', title: 'Lagos Rush Hour', icon: '🏎️',
    description: 'Race the clock and the go-slow through packed Lagos streets.',
    cover_image: '#2f7fd1', url: '/games/lagos-rush-hour', moods: ['chaos', 'together'] },
  { id: 'jollof-wars', title: 'Jollof Wars', icon: '🍲',
    description: 'Cook faster than your rivals and defend the pot at all costs.',
    cover_image: '#d9482b', url: '/games/jollof-wars', moods: ['chaos', 'together'] },
  { id: 'naija-striker', title: 'Naija Striker', icon: '⚽',
    description: 'Quick-fire penalty shootouts, one match at a time.',
    cover_image: '#2e9a55', url: '/games/naija-striker', moods: ['chaos', 'together'] },
  { id: 'okada-outlaws', title: 'Okada Outlaws', icon: '🏍️',
    description: 'Outrun the traffic wardens in a high-speed chase.',
    cover_image: '#8a3fd1', url: '/games/okada-outlaws', moods: ['chaos'] },
  { id: 'mind-palace', title: 'Mind Palace', icon: '💡',
    description: 'Connect the clues, crack the rooms and light up every bulb.',
    cover_image: '#6a4fc2', url: '/games/mind-palace', moods: ['brainpower'] },
  { id: 'ayo-master', title: 'Ayo Master', icon: '🔴',
    description: 'Classic seed-sowing strategy. Easy to learn, hard to master.',
    cover_image: '#a5622b', url: '/games/ayo-master', moods: ['brainpower', 'together'] },
  { id: 'code-crackers', title: 'Code Crackers', icon: '🧩',
    description: 'Tiny coding puzzles that get sneakily tricky.',
    cover_image: '#157a86', url: '/games/code-crackers', moods: ['brainpower'] },
  { id: 'word-market', title: 'Word Market', icon: '🔤',
    description: 'Trade letters, build words and haggle for the best score.',
    cover_image: '#c2791c', url: '/games/word-market', moods: ['brainpower', 'chill'] },
  { id: 'stall-tycoon', title: 'Market Stall Tycoon', icon: '🧺',
    description: 'Grow a tiny market stall into a bustling business.',
    cover_image: '#3f8f5a', url: '/games/stall-tycoon', moods: ['brainpower', 'chill'] },
  { id: 'cosy-corner', title: 'Cosy Corner Café', icon: '☕',
    description: 'Serve warm drinks and decorate at your own pace.',
    cover_image: '#b0703f', url: '/games/cosy-corner', moods: ['chill'] },
  { id: 'coin-garden', title: 'Coin Garden', icon: '🪙',
    description: 'Collect shiny coins in a calm, endless garden.',
    cover_image: '#d1a31f', url: '/games/coin-garden', moods: ['chill'] },
  { id: 'ludo-lounge', title: 'Ludo Lounge', icon: '🎲',
    description: 'Roll, race and send your friends back to start.',
    cover_image: '#d1432f', url: '/games/ludo-lounge', moods: ['together', 'chill'] },
  { id: 'whot-night', title: 'Whot! Night', icon: '🃏',
    description: 'The beloved card game, with extra drama at the table.',
    cover_image: '#2c5fa8', url: '/games/whot-night', moods: ['together'] }
];
