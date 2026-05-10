/* ============================================
   TRAVELOOP — SPA Router & App Shell
   ============================================ */

/* ── Auth / Session ── */
const TLAuth = (() => {
  const KEY = 'traveloop_session';
  function login(role, name, email) {
    localStorage.setItem(KEY, JSON.stringify({ role, name: name || '', email: email || '' }));
  }
  function logout() { localStorage.removeItem(KEY); }
  function _session() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
  function getRole()  { return _session().role  || null; }
  function getName()  { return _session().name  || 'Traveller'; }
  function getEmail() { return _session().email || ''; }
  function getInitials() {
    const n = getName();
    return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
  function isAdmin() { return getRole() === 'admin'; }
  function isUser()  { return getRole() === 'user'; }
  return { login, logout, getRole, getName, getEmail, getInitials, isAdmin, isUser };
})();

const TLApp = (() => {
  let currentRoute = '';
  let navStack = [];
  const app = () => document.getElementById('app');

  /* ── Route Map ── */
  const routes = {
    '/login': { title: 'Login', screen: 'login', noNav: true },
    '/dashboard': { title: 'Dashboard', screen: 'dashboard' },
    '/create-trip': { title: 'Create Trip', screen: 'createTrip' },
    '/trips': { title: 'My Trips', screen: 'myTrips' },
    '/builder/:id': { title: 'Itinerary Builder', screen: 'builder' },
    '/itinerary/:id': { title: 'Itinerary', screen: 'itinerary' },
    '/cities': { title: 'Explore Cities', screen: 'cities' },
    '/activities': { title: 'Activities', screen: 'activities' },
    '/budget/:id': { title: 'Budget', screen: 'budget' },
    '/packing/:id': { title: 'Packing', screen: 'packing' },
    '/public/:id': { title: 'Shared Itinerary', screen: 'publicItinerary', noNav: true },
    '/profile': { title: 'Profile', screen: 'profile' },
    '/notes/:id': { title: 'Trip Notes', screen: 'notes' },
    '/admin': { title: 'Admin', screen: 'admin' }
  };

  /* ── Route Matching ── */
  function matchRoute(path) {
    for (const [pattern, config] of Object.entries(routes)) {
      const regex = new RegExp('^' + pattern.replace(/:(\w+)/g, '([\\w-]+)') + '$');
      const match = path.match(regex);
      if (match) {
        const params = {};
        const paramNames = [...pattern.matchAll(/:(\w+)/g)].map(m => m[1]);
        paramNames.forEach((name, i) => params[name] = match[i + 1]);
        return { ...config, params };
      }
    }
    return null;
  }

  /* ── Navigation ── */
  function navigate(hash) {
    const path = hash.replace('#', '') || '/dashboard';
    const matched = matchRoute(path);
    if (!matched) { navigate('#/dashboard'); return; }

    // Route guards
    const role = TLAuth.getRole();
    if (!matched.noNav && !role) { navigate('#/login'); return; }
    if (path === '/admin' && !TLAuth.isAdmin()) { navigate('#/dashboard'); return; }
    if (path.startsWith('/dashboard') && TLAuth.isAdmin()) { navigate('#/admin'); return; }

    const isBack = navStack.length > 1 && navStack[navStack.length - 2] === path;
    if (isBack) navStack.pop();
    else navStack.push(path);

    const oldRoute = currentRoute;
    currentRoute = path;

    document.title = `${matched.title} — Traveloop`;

    renderPage(matched, isBack, oldRoute);
  }

  /* ── Render Page ── */
  function renderPage(route, isBack, oldRoute) {
    const screenEl = document.getElementById('screen-container');
    const exitClass = isBack ? 'page-exit-back' : 'page-exit';
    const enterClass = isBack ? 'page-enter-back' : 'page-enter';

    if (screenEl && oldRoute) {
      screenEl.classList.add(exitClass);
      setTimeout(() => buildPage(route, enterClass), 280);
    } else {
      buildPage(route, 'page-fade-in');
    }
  }

  async function buildPage(route, animClass) {
    const showNav = !route.noNav;
    const isAdmin = TLAuth.isAdmin();
    let html = '';

    if (showNav) {
      html += isAdmin ? TLComponents.adminSidebar(currentRoute) : TLComponents.sidebar(currentRoute);
    }

    html += `<div id="screen-container" class="${animClass}">`;
    html += `<div class="screen-content ${route.noNav ? 'login-wrapper' : ''} ${isAdmin ? 'admin-layout' : ''}">`;

    // Render screen
    const screenFn = TLScreens[route.screen];
    if (screenFn) {
      html += await screenFn(route.params || {});
    } else {
      html += `<div class="container" style="padding-top:100px;text-align:center;">
        <h2>Screen not found</h2>
        <p>Route: ${currentRoute}</p>
        <a href="#/dashboard" class="btn btn-primary" style="margin-top:24px;">Go Home</a>
      </div>`;
    }

    html += '</div>'; // .screen-content

    if (showNav && !isAdmin) {
      html += TLComponents.bottomNav(currentRoute);
    }

    html += '</div>'; // #screen-container

    app().innerHTML = html;

    // Post-render hooks
    requestAnimationFrame(() => {
      TLAnimations.initAfterRender();
      simulateLoading();
      window.scrollTo(0, 0);
    });
  }

  /* ── Simulate Loading ── */
  function simulateLoading() {
    const skeletonEls = document.querySelectorAll('[data-skeleton]');
    skeletonEls.forEach(el => {
      const type = el.dataset.skeleton;
      const count = parseInt(el.dataset.skeletonCount || '3');
      const content = el.innerHTML;
      TLAnimations.showSkeleton(el, type, count);
      setTimeout(() => {
        TLAnimations.removeSkeleton(el, content);
      }, 800 + Math.random() * 400);
    });
  }

  /* ── App Actions ── */
  function deleteTrip(id) {
    TLComponents.showModal('Delete Trip', '<p>Are you sure you want to delete this trip? This action cannot be undone.</p>',
      `<button class="btn btn-ghost" onclick="TLComponents.closeModal()">Cancel</button>
       <button class="btn btn-danger ripple-container" onclick="TLApp.confirmDeleteTrip('${id}')">Delete</button>`);
  }

  async function confirmDeleteTrip(id) {
    await TLData.deleteTrip(id);
    TLComponents.closeModal();
    TLAnimations.showToast('Trip deleted successfully', 'success');
    navigate('#/trips');
  }

  async function completeTrip(id) {
    await TLData.updateTrip(id, { status: 'completed' });
    TLUpgrade.award('trip_completed');
    TLAnimations.showToast('Trip marked as completed! 🎉', 'success');
    navigate(`#/itinerary/${id}`);
  }

  async function togglePack(tripId, category, itemId) {
    const trip = await TLData.getTrip(tripId);
    if (!trip) return;
    const item = trip.packing[category]?.find(i => i.id === itemId);
    if (item) {
      item.packed = !item.packed;
      if (item.packed) TLUpgrade.award('item_packed');
      await TLData.updateTrip(tripId, { packing: trip.packing });
      navigate(`#/packing/${tripId}`);
    }
  }

  async function removePack(tripId, category, itemId) {
    const trip = await TLData.getTrip(tripId);
    if (!trip) return;
    trip.packing[category] = trip.packing[category].filter(i => i.id !== itemId);
    await TLData.updateTrip(tripId, { packing: trip.packing });
    navigate(`#/packing/${tripId}`);
  }

  async function saveTrip(e) {
    e.preventDefault();
    const form = e.target;
    const trip = {
      name: form.tripName.value,
      description: form.tripDesc.value,
      startDate: form.startDate.value,
      endDate: form.endDate.value,
      coverPhoto: '',
      status: 'planning',
      budget: 0,
      stops: [],
      budget_breakdown: {},
      notes: [],
      packing: { essentials: [], clothing: [], toiletries: [], electronics: [] }
    };
    await TLData.addTrip(trip);
    TLUpgrade.award('trip_created');
    TLAnimations.showToast('Trip created! Start planning your adventure 🎉', 'success');
    navigate('#/trips');
  }

  async function addNote(tripId) {
    const input = document.getElementById('new-note-input');
    const stop = document.getElementById('new-note-stop');
    if (!input || !input.value.trim()) return;
    const trip = await TLData.getTrip(tripId);
    if (!trip) return;
    trip.notes = trip.notes || [];
    trip.notes.push({
      id: 'n' + Date.now(),
      stop: stop ? stop.value : 'General',
      content: input.value.trim(),
      timestamp: new Date().toISOString().split('T')[0]
    });
    await TLData.updateTrip(tripId, { notes: trip.notes });
    TLUpgrade.award('note_added');
    TLAnimations.showToast('Note added!', 'success');
    navigate(`#/notes/${tripId}`);
  }

  async function addPackItem(tripId, category) {
    const input = document.getElementById(`add-pack-${category}`);
    if (!input || !input.value.trim()) return;
    const trip = await TLData.getTrip(tripId);
    if (!trip) return;
    if (!trip.packing) trip.packing = {};
    if (!trip.packing[category]) trip.packing[category] = [];
    trip.packing[category].push({
      id: 'p' + Date.now(),
      name: input.value.trim(),
      packed: false
    });
    await TLData.updateTrip(tripId, { packing: trip.packing });
    navigate(`#/packing/${tripId}`);
  }

  // Activity booking payment (simulated)
  function showActivityPayment(activityId) {
    const booking = window._activity_booking;
    const activityCost = Number(booking?.activityCost || 0);

    const bodyHtml = `
      <div class="booking-step">
        <h4 style="margin-bottom:var(--space-12);">2) Payment</h4>
        <div style="margin-bottom:var(--space-12);">
          <div class="flex justify-between" style="margin-bottom:var(--space-8);">
            <span class="label-md">Activity</span>
            <span class="label-md">${booking?.activityName || '—'}</span>
          </div>
          <div class="flex justify-between" style="margin-bottom:var(--space-8);">
            <span class="label-md">Date</span>
            <span class="label-md">${document.getElementById('booking-date')?.value || '—'}</span>
          </div>
          <div class="flex justify-between" style="margin-bottom:var(--space-8);">
            <span class="label-md">Total</span>
            <span class="label-md" style="color:var(--primary); font-weight:700;">${TLData.formatCurrency(activityCost)}</span>
          </div>
        </div>

        <form id="activity-payment-form" onsubmit="event.preventDefault(); TLApp.confirmActivityPayment('${activityId}');">
          <div class="input-group">
            <input class="input-field" id="pay-card" placeholder=" " required maxlength="19" inputmode="numeric" />
            <label class="input-label" for="pay-card">Card Number</label>
          </div>
          <div class="date-row" style="grid-template-columns: 1.2fr 0.8fr; gap: var(--space-16);">
            <div class="input-group">
              <input class="input-field" id="pay-exp" placeholder=" " required maxlength="5" />
              <label class="input-label" for="pay-exp">Expiry (MM/YY)</label>
            </div>
            <div class="input-group">
              <input class="input-field" id="pay-cvv" placeholder=" " required maxlength="4" inputmode="numeric" />
              <label class="input-label" for="pay-cvv">CVV</label>
            </div>
          </div>

          <div class="flex gap-12" style="justify-content:flex-end; margin-top:var(--space-16);">
            <button type="button" class="btn btn-ghost" onclick="TLComponents.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary ripple-container">Pay Now</button>
          </div>
        </form>
      </div>`;

    TLComponents.showModal('Payment', bodyHtml);
  }

  function confirmActivityPayment(activityId) {
    // Very light validation (UI simulation)
    const card = document.getElementById('pay-card')?.value?.replace(/\s+/g,'') || '';
    const exp = document.getElementById('pay-exp')?.value?.trim() || '';
    const cvv = document.getElementById('pay-cvv')?.value?.trim() || '';

    const cardOk = card.length >= 12;
    const expOk = /^\d{2}\/(\d{2})$/.test(exp);
    const cvvOk = /^\d{3,4}$/.test(cvv);

    if (!cardOk || !expOk || !cvvOk) {
      TLAnimations.showToast('Enter valid payment details', 'error');
      return;
    }

    TLComponents.closeModal();
    TLUpgrade.award('activity_booked');
    TLAnimations.showToast('Payment successful! Booking confirmed 🎉', 'success');
  }


  function logout() {
    TLAuth.logout();
    navigate('#/login');
  }

  /* ── Init ── */
  function init() {
    // Force fresh data with images on first load after update
    const DATA_VERSION = 'v3_images';
    if (localStorage.getItem('traveloop_version') !== DATA_VERSION) {
      TLData.reset();
      localStorage.setItem('traveloop_version', DATA_VERSION);
    }

    // Splash screen
    const splash = document.getElementById('splash');
    setTimeout(() => {
      if (splash) splash.classList.add('hidden');
      setTimeout(() => { if (splash) splash.remove(); }, 500);
    }, 1500);

    // Route handler
    window.addEventListener('hashchange', () => navigate(location.hash));

    // Initial route
    setTimeout(() => {
      navigate(location.hash || '#/login');
    }, 1600);
  }

  return {
    init, navigate, logout, deleteTrip, confirmDeleteTrip,
    togglePack, removePack, saveTrip, addNote, addPackItem, completeTrip,
    showActivityPayment, confirmActivityPayment
  };
})();

// Boot
document.addEventListener('DOMContentLoaded', TLApp.init);
