/* ============================================
   TRAVELOOP — Upgrade / Gamification System
   ============================================ */

const TLUpgrade = (() => {
  const KEY = 'traveloop_upgrade';

  const LEVELS = [
    { level: 1, title: 'Wanderer',     xpRequired: 0,    badge: '🌱' },
    { level: 2, title: 'Explorer',     xpRequired: 100,  badge: '🧭' },
    { level: 3, title: 'Adventurer',   xpRequired: 300,  badge: '⛺' },
    { level: 4, title: 'Globetrotter', xpRequired: 600,  badge: '🌍' },
    { level: 5, title: 'Voyager',      xpRequired: 1000, badge: '🚀' },
    { level: 6, title: 'Legend',       xpRequired: 1500, badge: '🏆' },
  ];

  const ACTIONS = {
    trip_created:    { xp: 50,  label: 'Created a trip' },
    activity_booked: { xp: 20,  label: 'Booked an activity' },
    item_packed:     { xp: 5,   label: 'Packed an item' },
    note_added:      { xp: 10,  label: 'Added a note' },
    trip_completed:  { xp: 100, label: 'Completed a trip' },
    destination_saved: { xp: 15, label: 'Saved a destination' },
  };

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || { xp: 0, level: 1, history: [] };
    } catch { return { xp: 0, level: 1, history: [] }; }
  }

  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function getLevelInfo(xp) {
    let current = LEVELS[0];
    let next = LEVELS[1];
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].xpRequired) { current = LEVELS[i]; next = LEVELS[i + 1] || null; break; }
    }
    return { current, next };
  }

  function award(actionKey) {
    const action = ACTIONS[actionKey];
    if (!action) return;

    const state = load();
    const oldLevel = getLevelInfo(state.xp).current.level;

    state.xp += action.xp;
    state.history.push({ action: actionKey, xp: action.xp, ts: Date.now() });
    save(state);

    const newLevelInfo = getLevelInfo(state.xp);
    const newLevel = newLevelInfo.current.level;

    // Show XP toast
    TLAnimations.showToast(`+${action.xp} XP — ${action.label}`, 'success');

    // Level up!
    if (newLevel > oldLevel) {
      setTimeout(() => showLevelUpModal(newLevelInfo.current), 800);
    }

    // Refresh upgrade card if on dashboard
    const card = document.getElementById('upgrade-progress-card');
    if (card) card.outerHTML = renderCard();
  }

  function showLevelUpModal(levelInfo) {
    TLComponents.showModal(
      '🎉 Level Up!',
      `<div class="upgrade-levelup-body">
        <div class="upgrade-badge-big">${levelInfo.badge}</div>
        <h2 class="upgrade-levelup-title">You're now a <span>${levelInfo.title}</span>!</h2>
        <p style="color:var(--text-tertiary);margin-top:8px;">Keep exploring to unlock the next rank.</p>
      </div>`,
      `<button class="btn btn-primary ripple-container" onclick="TLComponents.closeModal()">Awesome! 🚀</button>`
    );
  }

  function renderCard() {
    const state = load();
    const { current, next } = getLevelInfo(state.xp);
    const xpInLevel = state.xp - current.xpRequired;
    const xpNeeded = next ? next.xpRequired - current.xpRequired : 1;
    const pct = next ? Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)) : 100;

    return `<div class="upgrade-card animate-on-scroll" id="upgrade-progress-card">
      <div class="upgrade-card-top">
        <div class="upgrade-badge">${current.badge}</div>
        <div class="upgrade-info">
          <div class="upgrade-level-title">${current.title} <span class="upgrade-level-num">Lv.${current.level}</span></div>
          <div class="upgrade-xp-label">${state.xp} XP total</div>
        </div>
        ${next ? `<div class="upgrade-next-hint">Next: ${next.badge} ${next.title}</div>` : `<div class="upgrade-next-hint">🏆 Max Level!</div>`}
      </div>
      <div class="upgrade-bar-wrap">
        <div class="progress-bar" style="height:10px;">
          <div class="progress-fill upgrade-bar-fill" style="width:${pct}%;"></div>
        </div>
        <div class="upgrade-bar-labels">
          <span>${xpInLevel} XP</span>
          <span>${next ? xpNeeded + ' XP to next level' : 'Maxed out!'}</span>
        </div>
      </div>
    </div>`;
  }

  return { award, renderCard, getLevelInfo, load, LEVELS, ACTIONS };
})();
