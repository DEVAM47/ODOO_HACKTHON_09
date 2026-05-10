/* ============================================
   TRAVELOOP — Screen Renderers (1–7)
   ============================================ */

const TLScreens = (() => {

  /* ── 1. Login / Signup ── */
  async function login() {
    return `<div class="login-screen">
      <div class="login-bg-orb"></div>
      <div class="login-bg-orb"></div>
      <div class="login-card">
        <div class="login-logo">Travel<span>oop</span></div>
        <p class="login-subtitle">Plan your dream trips with ease</p>

        <!-- Role Toggle -->
        <div class="login-role-toggle">
          <button class="login-role-btn active" id="role-user" onclick="TLScreens._setLoginRole('user')">👤 Traveller</button>
          <button class="login-role-btn" id="role-admin" onclick="TLScreens._setLoginRole('admin')">🛡️ Admin</button>
        </div>

        <form onsubmit="event.preventDefault(); TLScreens._doLogin();">
          <div class="input-group" id="name-group">
            <input type="text" class="input-field" id="login-name" placeholder=" " autocomplete="name">
            <label class="input-label" for="login-name">Your Name</label>
          </div>
          <div class="input-group">
            <input type="email" class="input-field" id="login-email" placeholder=" " required autocomplete="email">
            <label class="input-label" for="login-email">Email Address</label>
          </div>
          <div class="input-group">
            <input type="password" class="input-field" id="login-password" placeholder=" " required autocomplete="current-password">
            <label class="input-label" for="login-password">Password</label>
          </div>
          <div class="login-hint" id="login-hint">Use any email &amp; password to sign in as Traveller</div>
          <button type="submit" class="btn btn-primary w-full ripple-container" style="margin-top:var(--space-16);">
            <span class="btn-text">Sign In</span>
          </button>
        </form>
        <div class="login-divider">or continue with</div>
        <div class="social-btns">
          <button class="social-btn" onclick="TLAuth.login('user', 'Google User', '');TLApp.navigate('#/dashboard')">🔵 Google</button>
          <button class="social-btn" onclick="TLAuth.login('user', 'Apple User', '');TLApp.navigate('#/dashboard')">⚫ Apple</button>
        </div>
        <div class="login-footer">
          <p style="color:var(--text-muted);">Don't have an account? <a href="#" onclick="TLAuth.login('user', document.getElementById('login-name')?.value||'Traveller', document.getElementById('login-email')?.value||'');TLApp.navigate('#/dashboard')">Sign Up</a></p>
        </div>
      </div>
    </div>`;
  }

  /* ── 2. Dashboard ── */
  async function dashboard() {
    const data = await TLData.load();
    const trips = data.trips;
    const upcoming = trips.filter(t => t.status === 'upcoming').length;
    const totalBudget = trips.reduce((s, t) => s + (t.budget || 0), 0);
    const totalCities = trips.reduce((s, t) => s + (t.stops?.length || 0), 0);

    return `<div class="container">
      ${TLComponents.pageHeader('Dashboard', '')}

      <!-- Welcome Banner -->
      <div class="dashboard-welcome animate-on-scroll">
        <div class="dashboard-welcome-bg">✈️</div>
        <h2>Welcome back, ${TLAuth.getName().split(' ')[0]}! 👋</h2>
        <p>You have ${upcoming} upcoming ${upcoming === 1 ? 'trip' : 'trips'}. Ready to explore?</p>
        <a href="#/create-trip" class="btn btn-sm ripple-container" style="background:rgba(255,255,255,0.2);color:white;margin-top:var(--space-16);backdrop-filter:blur(4px);">+ Plan New Trip</a>
      </div>

      <!-- Upgrade Progress -->
      ${TLUpgrade.renderCard()}

      <!-- Stats -->
      <div class="stats-grid">
        ${TLComponents.statCard('Total Trips', trips.length, '✈️', 12)}
        ${TLComponents.statCard('Cities Visited', totalCities, '🏙️', 8)}
        ${TLComponents.statCard('Total Budget', totalBudget, '💰', -3, '$')}
        ${TLComponents.statCard('Upcoming', upcoming, '📅', 25)}
      </div>

      <!-- Recent Trips -->
      <div class="section-header animate-on-scroll">
        <h3 class="section-title">Recent Trips</h3>
        <a href="#/trips" class="btn btn-ghost btn-sm">View All →</a>
      </div>
      <div class="trips-grid" data-skeleton="cards" data-skeleton-count="3">
        ${trips.slice(0, 3).map(t => TLComponents.tripCard(t)).join('')}
      </div>

      <!-- Recent Activities -->
      <div class="section-header animate-on-scroll" style="margin-top:var(--space-32)">
        <h3 class="section-title">Earn XP</h3>
      </div>
      <div class="xp-actions-grid">
        <div class="xp-action-card animate-on-scroll" onclick="TLApp.navigate('#/create-trip')">
          <span class="xp-action-icon">✈️</span>
          <span class="xp-action-label">Create Trip</span>
          <span class="xp-action-xp">+50 XP</span>
        </div>
        <div class="xp-action-card animate-on-scroll" onclick="TLApp.navigate('#/activities')">
          <span class="xp-action-icon">🎯</span>
          <span class="xp-action-label">Book Activity</span>
          <span class="xp-action-xp">+20 XP</span>
        </div>
        <div class="xp-action-card animate-on-scroll" onclick="TLApp.navigate('#/packing/t1')">
          <span class="xp-action-icon">🧳</span>
          <span class="xp-action-label">Pack an Item</span>
          <span class="xp-action-xp">+5 XP</span>
        </div>
        <div class="xp-action-card animate-on-scroll" onclick="TLApp.navigate('#/notes/t1')">
          <span class="xp-action-icon">📝</span>
          <span class="xp-action-label">Add a Note</span>
          <span class="xp-action-xp">+10 XP</span>
        </div>
      </div>

      <!-- Recommended Destinations -->
      <div class="section-header animate-on-scroll" style="margin-top:var(--space-32)">
        <h3 class="section-title">Recommended Destinations</h3>
        <a href="#/cities" class="btn btn-ghost btn-sm">Explore →</a>
      </div>
      <div class="destination-scroll">
        ${data.destinations.slice(0, 6).map(d => TLComponents.destinationCard(d)).join('')}
      </div>
    </div>`;
  }

  /* ── 3. Create Trip ── */
  async function createTrip() {
    return `<div class="container">
      ${TLComponents.pageHeader('Create New Trip', 'Start planning your next adventure')}
      <form class="create-trip-form" onsubmit="TLApp.saveTrip(event)">
        <div class="input-group">
          <input type="text" class="input-field" id="tripName" name="tripName" placeholder=" " required>
          <label class="input-label" for="tripName">Trip Name</label>
        </div>
        <div class="date-row">
          <div class="input-group">
            <input type="date" class="input-field" id="startDate" name="startDate" placeholder=" " required>
            <label class="input-label" for="startDate" style="top:0;transform:translateY(-50%) scale(0.85);color:var(--secondary);font-weight:600;">Start Date</label>
          </div>
          <div class="input-group">
            <input type="date" class="input-field" id="endDate" name="endDate" placeholder=" " required>
            <label class="input-label" for="endDate" style="top:0;transform:translateY(-50%) scale(0.85);color:var(--secondary);font-weight:600;">End Date</label>
          </div>
        </div>
        <div class="input-group">
          <textarea class="input-field" id="tripDesc" name="tripDesc" placeholder=" " rows="4"></textarea>
          <label class="input-label" for="tripDesc" style="top:20px;transform:translateY(0);">Description</label>
        </div>
        <div class="cover-upload" onclick="document.getElementById('coverFile').click()">
          <span class="upload-icon">📷</span>
          <span>Click to upload cover photo</span>
          <small>JPG, PNG up to 5MB</small>
          <input type="file" id="coverFile" accept="image/*" class="visually-hidden">
        </div>
        <button type="submit" class="btn btn-primary w-full ripple-container" style="margin-bottom:var(--space-24);">
          <span class="btn-text">Create Trip 🚀</span>
        </button>
      </form>
    </div>`;
  }

  /* ── 4. My Trips ── */
  async function myTrips() {
    const data = await TLData.load();
    const trips = data.trips;
    return `<div class="container">
      <div class="trips-header">
        <div>
          <h1>My Trips</h1>
          <p style="color:var(--text-tertiary)">${trips.length} ${trips.length === 1 ? 'trip' : 'trips'} total</p>
        </div>
        <a href="#/create-trip" class="btn btn-primary ripple-container">+ New Trip</a>
      </div>
      <!-- Filter Tabs -->
      <div class="tabs mb-24 animate-on-scroll">
        <div class="tab-item active" onclick="this.parentElement.querySelector('.active')?.classList.remove('active');this.classList.add('active');">All</div>
        <div class="tab-item" onclick="this.parentElement.querySelector('.active')?.classList.remove('active');this.classList.add('active');">Upcoming</div>
        <div class="tab-item" onclick="this.parentElement.querySelector('.active')?.classList.remove('active');this.classList.add('active');">Planning</div>
        <div class="tab-item" onclick="this.parentElement.querySelector('.active')?.classList.remove('active');this.classList.add('active');">Completed</div>
      </div>
      <div class="trips-grid" data-skeleton="cards" data-skeleton-count="3">
        ${trips.length ? trips.map(t => TLComponents.tripCard(t)).join('') :
          `<div class="empty-state" style="grid-column:1/-1;">
            <div class="empty-state-icon">🗺️</div>
            <h3 class="empty-state-title">No trips yet</h3>
            <p class="empty-state-text">Create your first trip and start exploring the world!</p>
            <a href="#/create-trip" class="btn btn-primary ripple-container">+ Create Trip</a>
          </div>`}
      </div>
    </div>`;
  }

  /* ── 5. Itinerary Builder ── */
  async function builder(params) {
    if (!TLAuth.isAdmin()) return notFound('Page');
    const trip = await TLData.getTrip(params.id);
    if (!trip) return notFound('Trip');
    return `<div class="container itinerary-builder">
      ${TLComponents.pageHeader(trip.name, 'Build your itinerary',
        `<a href="#/itinerary/${trip.id}" class="btn btn-secondary btn-sm">Preview</a>
         <button class="btn btn-primary btn-sm ripple-container" onclick="TLAnimations.showToast('Changes saved!','success')">💾 Save</button>`)}
      <div class="timeline">
        ${trip.stops.map((stop, i) => `
          <div class="timeline-stop animate-on-scroll stagger-${Math.min(i + 1, 5)}">
            <div class="timeline-dot"></div>
            <div class="timeline-stop-card">
              <div class="flex justify-between items-center mb-8">
                <div>
                  <h3 style="font-size:18px;">${stop.city}, ${stop.country}</h3>
                  <small>${stop.dates}</small>
                </div>
                <div class="flex gap-4">
                  <button class="btn-icon btn-ghost drag-handle" aria-label="Drag to reorder">⋮⋮</button>
                  <button class="btn-icon btn-ghost" style="color:var(--error);font-size:14px" aria-label="Remove stop">✕</button>
                </div>
              </div>
              <div class="activity-list">
                ${stop.activities.map(a => `
                  <div class="activity-item">
                    <span style="font-size:16px">${TLData.getCategoryEmoji(a.category)}</span>
                    <span style="flex:1">${a.name}</span>
                    <span style="color:var(--text-muted);font-size:12px">${a.time}</span>
                    <span style="color:var(--primary);font-size:12px;font-weight:600">${a.cost ? TLData.formatCurrency(a.cost) : 'Free'}</span>
                  </div>`).join('')}
                <button class="btn btn-ghost btn-sm w-full" style="margin-top:var(--space-8);border:1px dashed var(--outline-variant)">+ Add Activity</button>
              </div>
            </div>
          </div>`).join('')}
      </div>
      <button class="btn btn-secondary w-full" style="margin-top:var(--space-16);border-style:dashed;">+ Add New Stop</button>
    </div>`;
  }

  /* ── 6. Itinerary View ── */
  async function itinerary(params) {
    const trip = await TLData.getTrip(params.id);
    if (!trip) return notFound('Trip');
    return `<div class="container itinerary-view">
      ${TLComponents.pageHeader(trip.name, `${TLData.formatDate(trip.startDate)} — ${TLData.formatDate(trip.endDate)}`,
        `${TLAuth.isAdmin() ? `<a href="#/builder/${trip.id}" class="btn btn-secondary btn-sm">✏️ Edit</a>` : ''}
         <a href="#/public/${trip.id}" class="btn btn-ghost btn-sm">🔗 Share</a>`)}
      <!-- View Toggle -->
      <div class="tabs mb-24 animate-on-scroll" style="max-width:300px;">
        <div class="tab-item active">📋 List</div>
        <div class="tab-item">📅 Calendar</div>
      </div>
      ${trip.stops.map((stop, si) => `
        <div class="day-accordion animate-on-scroll stagger-${Math.min(si + 1, 5)}">
          <div class="day-header" onclick="this.nextElementSibling.classList.toggle('open');this.querySelector('.chevron').style.transform=this.nextElementSibling.classList.contains('open')?'rotate(180deg)':''">
            <h3><span style="font-size:20px">📍</span> ${stop.city}, ${stop.country}</h3>
            <div class="flex items-center gap-12">
              <small>${stop.dates}</small>
              <span class="chevron" style="transition:transform 0.3s var(--ease-standard)">▼</span>
            </div>
          </div>
          <div class="day-content ${si === 0 ? 'open' : ''}">
            <div class="day-content-inner">
              ${stop.activities.length ? stop.activities.map(a => `
                <div class="activity-block">
                  <div>
                    <div class="activity-time">${a.time}</div>
                    <div class="activity-cost">${a.cost ? TLData.formatCurrency(a.cost) : 'Free'}</div>
                  </div>
                  <div style="flex:1">
                    <div class="flex items-center gap-8">
                      <span style="font-size:18px">${TLData.getCategoryEmoji(a.category)}</span>
                      <strong>${a.name}</strong>
                    </div>
                    <span class="chip" style="margin-top:var(--space-4)">${a.category}</span>
                  </div>
                </div>`).join('') :
                `<div class="empty-state" style="padding:var(--space-24)">
                  <p style="color:var(--text-muted)">No activities planned yet</p>
                  <a href="#/builder/${trip.id}" class="btn btn-ghost btn-sm">+ Add activities</a>
                </div>`}
            </div>
          </div>
        </div>`).join('')}

      <!-- Quick Links -->
      <div class="flex gap-12 flex-wrap" style="margin-top:var(--space-24)">
        <a href="#/budget/${trip.id}" class="btn btn-secondary btn-sm">💰 Budget</a>
        <a href="#/packing/${trip.id}" class="btn btn-secondary btn-sm">🧳 Packing</a>
        <a href="#/notes/${trip.id}" class="btn btn-secondary btn-sm">📝 Notes</a>
        ${trip.status !== 'completed'
          ? `<button class="btn btn-sm" style="background:var(--tertiary);color:white;" onclick="TLApp.completeTrip('${trip.id}')">✅ Complete Trip +100 XP</button>`
          : `<span class="chip active">✅ Completed</span>`}
      </div>
    </div>`;
  }

  /* ── 7. City Search ── */
  async function cities() {
    const data = await TLData.load();
    const regions = ['All', ...new Set(data.destinations.map(d => d.region))];
    return `<div class="container city-search">
      ${TLComponents.pageHeader('Explore Cities', 'Find your next destination')}
      <div class="search-bar mb-24 animate-on-scroll">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Search cities, countries..." id="city-search-input" oninput="TLApp.filterCities && TLApp.filterCities(this.value)">
      </div>
      <div class="filter-chips animate-on-scroll">
        ${regions.map((r, i) => `<span class="chip ${i === 0 ? 'active' : ''}" onclick="this.parentElement.querySelector('.active')?.classList.remove('active');this.classList.add('active');">${r}</span>`).join('')}
      </div>
      <div class="city-grid" data-skeleton="cards" data-skeleton-count="6">
        ${data.destinations.map(d => TLComponents.destinationCard(d)).join('')}
      </div>
    </div>`;
  }

  /* ── Helper ── */
  function notFound(type) {
    return `<div class="container"><div class="empty-state" style="min-height:60vh;">
      <div class="empty-state-icon">🔍</div>
      <h3 class="empty-state-title">${type} not found</h3>
      <p class="empty-state-text">The ${type.toLowerCase()} you're looking for doesn't exist.</p>
      <a href="#/dashboard" class="btn btn-primary ripple-container">Go to Dashboard</a>
    </div></div>`;
  }

  // Ensure availability across multiple screens files
  return { login, dashboard, createTrip, myTrips, builder, itinerary, cities, notFound,
    _setLoginRole, _doLogin };

  function _setLoginRole(role) {
    window._loginRole = role;
    document.getElementById('role-user')?.classList.toggle('active', role === 'user');
    document.getElementById('role-admin')?.classList.toggle('active', role === 'admin');
    const hint = document.getElementById('login-hint');
    if (hint) hint.textContent = role === 'admin'
      ? 'Use admin@traveloop.com / admin123 to sign in as Admin'
      : 'Use any email & password to sign in as Traveller';
    // hide name field for admin
    const nameGroup = document.getElementById('name-group');
    if (nameGroup) nameGroup.style.display = role === 'admin' ? 'none' : '';
  }

  function _doLogin() {
    const role  = window._loginRole || 'user';
    const name  = document.getElementById('login-name')?.value.trim() || '';
    const email = document.getElementById('login-email')?.value.trim() || '';
    const pass  = document.getElementById('login-password')?.value || '';
    if (role === 'admin') {
      if (email !== 'admin@traveloop.com' || pass !== 'admin123') {
        TLAnimations.showToast('Invalid admin credentials', 'error'); return;
      }
      TLAuth.login('admin', 'Admin', email);
      TLApp.navigate('#/admin');
    } else {
      const displayName = name || email.split('@')[0] || 'Traveller';
      TLAuth.login('user', displayName, email);
      TLApp.navigate('#/dashboard');
    }
  }
})();
