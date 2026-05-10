/* ============================================
   TRAVELOOP — Screen Renderers (8–14)
   ============================================ */

(() => {
  /* ── 8. Activity Search ── */
  TLScreens.activities = async function() {
    const data = await TLData.load();
    const categories = ['All', ...new Set(data.activities.map(a => a.category))];
    return `<div class="container activity-search">
      ${TLComponents.pageHeader('Activities', 'Discover amazing experiences')}
      <div class="search-bar mb-24 animate-on-scroll">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Search activities...">
      </div>
      <div class="filter-bar animate-on-scroll">
        ${categories.map((c, i) => `<span class="chip ${i === 0 ? 'active' : ''}" onclick="this.parentElement.querySelector('.active')?.classList.remove('active');this.classList.add('active');">${c}</span>`).join('')}
      </div>
      <div class="activity-grid" data-skeleton="cards" data-skeleton-count="4">
        ${data.activities.map(a => TLComponents.activityCard(a)).join('')}
      </div>
    </div>`;
  };

  /* ── 9. Budget Breakdown ── */
  TLScreens.budget = async function(params) {
    const trip = await TLData.getTrip(params.id);
    if (!trip) return TLScreens.notFound('Trip');
    const bd = trip.budget_breakdown || {};
    const categories = Object.keys(bd);
    const values = Object.values(bd);
    const total = values.reduce((s, v) => s + v, 0);
    const colors = ['#ff7043', '#00629e', '#006972', '#7b1fa2', '#f57c00', '#2e7d32'];
    const segments = categories.map((c, i) => ({ label: c.charAt(0).toUpperCase() + c.slice(1), value: bd[c], color: colors[i % colors.length] }));
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // Deterministic UI: remove Math.random() usage and guard divide-by-zero
    const safeTotal = total === 0 ? 1 : total;

    return `<div class="container budget-screen">
      ${TLComponents.pageHeader(trip.name + ' — Budget', 'Track your travel expenses',
        `<a href="#/itinerary/${trip.id}" class="btn btn-ghost btn-sm">← Back to Trip</a>`)}

      ${total > trip.budget ? `<div class="budget-alert animate-on-scroll">⚠️ You're ${TLData.formatCurrency(total - trip.budget)} over your ${TLData.formatCurrency(trip.budget)} budget!</div>` : ''}

      <div class="budget-summary">
        ${TLComponents.statCard('Total Budget', trip.budget, '💰', null, '$')}
        ${TLComponents.statCard('Total Spent', total, '📊', null, '$')}
        ${TLComponents.statCard('Remaining', Math.max(0, trip.budget - total), '💵', null, '$')}
        ${TLComponents.statCard('Categories', categories.length, '📂')}
      </div>

      <div class="charts-row">
        <div class="chart-container animate-on-scroll">
          <h3 style="margin-bottom:var(--space-16);">Spending by Category</h3>
          ${TLComponents.donutChart(segments)}
        </div>
        <div class="chart-container animate-on-scroll">
          <h3 style="margin-bottom:var(--space-16);">Category Breakdown</h3>
          ${TLComponents.barChart(values, categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)), Math.max(...values, 1))}
        </div>
      </div>

      <!-- Progress Bars -->
      <div class="chart-container animate-on-scroll" style="margin-bottom:var(--space-24);">
        <h3 style="margin-bottom:var(--space-16);">Budget Allocation</h3>
        ${categories.map((c, i) => {
          const pct = Math.round((bd[c] / safeTotal) * 100);
          const width = (bd[c] / safeTotal) * 100;
          const statusScore = bd[c] / safeTotal;
          return `
            <div style="margin-bottom:var(--space-16);">
              <div class="flex justify-between mb-8">
                <span class="label-md">${c.charAt(0).toUpperCase() + c.slice(1)}</span>
                <span class="label-md" style="color:${colors[i % colors.length]}">${TLData.formatCurrency(bd[c])} (${pct}%)</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${width}%;background:${colors[i % colors.length]}"></div>
              </div>
            </div>`;
        }).join('')}
      </div>

      <!-- Budget Table -->
      <div class="budget-table-container animate-on-scroll">
        <div style="padding:var(--space-16) var(--space-20);border-bottom:1px solid var(--divider-light);">
          <h3>Expense Details</h3>
        </div>
        <table class="data-table">
          <thead><tr><th>Category</th><th>Amount</th><th>% of Total</th><th>Status</th></tr></thead>
          <tbody>
            ${categories.map((c, i) => {
              const pct = Math.round((bd[c] / safeTotal) * 100);
              const status = (bd[c] / safeTotal) > 0.3 ? 'High' : (bd[c] / safeTotal) > 0.15 ? 'Medium' : 'Low';
              return `<tr>
                <td><div class="flex items-center gap-8"><div style="width:10px;height:10px;border-radius:50%;background:${colors[i % colors.length]}"></div>${c.charAt(0).toUpperCase() + c.slice(1)}</div></td>
                <td>${TLData.formatCurrency(bd[c])}</td>
                <td>${pct}%</td>
                <td><span class="chip">${status}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  };

  /* ── 10. Packing Checklist ── */
  TLScreens.packing = async function(params) {
    const trip = await TLData.getTrip(params.id);
    if (!trip) return TLScreens.notFound('Trip');
    const packing = trip.packing || {};
    const allItems = Object.values(packing).flat();
    const packed = allItems.filter(i => i.packed).length;
    const total = allItems.length;
    const pct = total ? Math.round(packed / total * 100) : 0;
    const categoryEmojis = { essentials: '📋', clothing: '👕', toiletries: '🧴', electronics: '📱' };

    return `<div class="container packing-screen">
      ${TLComponents.pageHeader(trip.name + ' — Packing List', `${packed}/${total} items packed`,
        `<a href="#/itinerary/${trip.id}" class="btn btn-ghost btn-sm">← Back</a>`)}

      <div class="packing-progress animate-on-scroll">
        <div class="progress-label">
          <span>${pct}% packed</span>
          <span>${packed} of ${total}</span>
        </div>
        <div class="progress-bar" style="height:12px">
          <div class="progress-fill" style="width:${pct}%;background:${pct === 100 ? 'var(--tertiary)' : 'var(--primary)'}"></div>
        </div>
      </div>

      ${Object.entries(packing).map(([cat, items]) => `
        <div class="packing-category animate-on-scroll">
          <div class="packing-category-header">
            <span class="packing-category-title">${categoryEmojis[cat] || '📦'} ${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
            <span class="badge" style="background:var(--surface-container);color:var(--text-tertiary)">${items.filter(i => i.packed).length}/${items.length}</span>
          </div>
          ${items.map(item => TLComponents.checkboxItem(item, cat, trip.id)).join('')}
          <div class="add-item-row">
            <input type="text" class="input-field" id="add-pack-${cat}" placeholder="Add item..." style="padding:var(--space-8) var(--space-12);font-size:14px;">
            <button class="btn btn-ghost btn-sm" onclick="TLApp.addPackItem('${trip.id}','${cat}')">+</button>
          </div>
        </div>`).join('')}
    </div>`;
  };

  /* ── 11. Public Itinerary ── */
  TLScreens.publicItinerary = async function(params) {
    const trip = await TLData.getTrip(params.id);
    if (!trip) return TLScreens.notFound('Trip');
    return `<div class="public-itinerary">
      <div class="container">
        <div class="public-header animate-on-scroll">
          <small style="color:rgba(255,255,255,0.6);letter-spacing:0.05em;text-transform:uppercase;">Shared Itinerary</small>
          <h2 style="margin-top:var(--space-8);">${trip.name}</h2>
          <p>${trip.description || ''}</p>
          <p style="margin-top:var(--space-4);">📅 ${TLData.formatDate(trip.startDate)} — ${TLData.formatDate(trip.endDate)} · 📍 ${trip.stops?.length || 0} cities</p>
          <div class="share-bar">
            <button class="share-btn" onclick="navigator.clipboard?.writeText(window.location.href);TLAnimations.showToast('Link copied!','success')">🔗 Copy Link</button>
            <button class="share-btn">📧 Email</button>
            <button class="share-btn">💬 Share</button>
          </div>
        </div>

        ${trip.stops.map((stop, i) => `
          <div class="animate-on-scroll stagger-${Math.min(i + 1, 5)}" style="margin-bottom:var(--space-24);">
            <h3 style="margin-bottom:var(--space-12);display:flex;align-items:center;gap:var(--space-8);">
              <span style="width:32px;height:32px;background:var(--tertiary);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;">${i + 1}</span>
              ${stop.city}, ${stop.country}
            </h3>
            <small style="color:var(--text-muted);display:block;margin-bottom:var(--space-12)">${stop.dates}</small>
            ${stop.activities.length ? stop.activities.map(a => `
              <div class="activity-block">
                <div>
                  <div class="activity-time">${a.time}</div>
                  <div class="activity-cost">${a.cost ? TLData.formatCurrency(a.cost) : 'Free'}</div>
                </div>
                <div style="flex:1">
                  <strong>${a.name}</strong>
                  <span class="chip" style="margin-left:var(--space-8)">${a.category}</span>
                </div>
              </div>`).join('') : '<p style="color:var(--text-muted);padding:var(--space-16);">No activities listed</p>'}
          </div>`).join('')}

        <div class="text-center" style="padding:var(--space-32) 0;">
          <p style="color:var(--text-muted);margin-bottom:var(--space-16);">Plan your own trips with Traveloop</p>
          <a href="#/login" class="btn btn-primary ripple-container">Get Started Free</a>
        </div>
      </div>
    </div>`;
  };

  /* ── 12. User Profile ── */
  TLScreens.profile = async function() {
    const data = await TLData.load();
    const user = data.user;
    const displayName  = TLAuth.getName();
    const displayEmail = TLAuth.getEmail() || user.email;
    const initials     = TLAuth.getInitials();
    return `<div class="container profile-screen">
      ${TLComponents.pageHeader('Profile', '')}

      <div class="profile-header animate-on-scroll">
        <div class="profile-avatar-wrapper">
          <div class="avatar avatar-lg">${initials}</div>
          <div class="profile-avatar-edit">📷</div>
        </div>
        <h2>${displayName}</h2>
        <p style="color:var(--text-tertiary)">${displayEmail}</p>
        <small>Member since ${TLData.formatDate(user.joinDate)}</small>
      </div>

      <div class="profile-section animate-on-scroll">
        <h3 class="profile-section-title">Personal Information</h3>
        <div class="input-group">
          <input type="text" class="input-field" id="profile-name" value="${displayName}" placeholder=" ">
          <label class="input-label" style="top:0;transform:translateY(-50%) scale(0.85);color:var(--secondary);font-weight:600;">Full Name</label>
        </div>
        <div class="input-group">
          <input type="email" class="input-field" id="profile-email" value="${displayEmail}" placeholder=" ">
          <label class="input-label" style="top:0;transform:translateY(-50%) scale(0.85);color:var(--secondary);font-weight:600;">Email</label>
        </div>
        <button class="btn btn-primary btn-sm ripple-container" onclick="
          const n = document.getElementById('profile-name').value.trim();
          const e = document.getElementById('profile-email').value.trim();
          if(n) TLAuth.login(TLAuth.getRole(), n, e);
          TLAnimations.showToast('Profile updated!','success');
        ">Save Changes</button>
      </div>

      <div class="profile-section animate-on-scroll">
        <h3 class="profile-section-title">Saved Destinations</h3>
        <div class="saved-destinations">
          ${user.savedDestinations.map(d => `<span class="chip active">${d} ✕</span>`).join('')}
        </div>
      </div>

      <div class="profile-section animate-on-scroll">
        <h3 class="profile-section-title">Preferences</h3>
        <div class="flex justify-between items-center" style="padding:var(--space-8) 0;">
          <span>Currency</span>
          <select class="input-field" style="width:auto;padding:var(--space-8) var(--space-16);border:1px solid var(--input-border);border-radius:var(--radius-md);">
            <option ${user.preferences.currency === 'USD' ? 'selected' : ''}>USD</option>
            <option ${user.preferences.currency === 'EUR' ? 'selected' : ''}>EUR</option>
            <option ${user.preferences.currency === 'GBP' ? 'selected' : ''}>GBP</option>
          </select>
        </div>
        <div class="flex justify-between items-center" style="padding:var(--space-8) 0;">
          <span>Notifications</span>
          <div class="toggle ${user.preferences.notifications ? 'active' : ''}" onclick="this.classList.toggle('active')"><div class="toggle-thumb"></div></div>
        </div>
        <div class="flex justify-between items-center" style="padding:var(--space-8) 0;">
          <span>Dark Mode</span>
          <div class="toggle ${user.preferences.darkMode ? 'active' : ''}" onclick="this.classList.toggle('active')"><div class="toggle-thumb"></div></div>
        </div>
      </div>

      <div class="profile-section danger-zone animate-on-scroll">
        <h3 class="profile-section-title">Danger Zone</h3>
        <button class="btn btn-danger btn-sm" onclick="TLData.reset();TLAnimations.showToast('All data has been reset','error');TLApp.navigate('#/login');">Reset All Data</button>
      </div>
    </div>`;
  };

  /* ── 13. Trip Notes ── */
  TLScreens.notes = async function(params) {
    const trip = await TLData.getTrip(params.id);
    if (!trip) return TLScreens.notFound('Trip');
    const stops = trip.stops?.map(s => s.city) || ['General'];

    return `<div class="container notes-screen">
      ${TLComponents.pageHeader(trip.name + ' — Notes', `${trip.notes?.length || 0} notes`,
        `<a href="#/itinerary/${trip.id}" class="btn btn-ghost btn-sm">← Back</a>`)}

      <div class="note-editor animate-on-scroll">
        <h3 style="margin-bottom:var(--space-12);font-size:16px;">Add a Note</h3>
        <div class="flex gap-12 mb-16">
          <select class="input-field" id="new-note-stop" style="padding:var(--space-8) var(--space-12);border:1px solid var(--input-border);border-radius:var(--radius-md);flex:0 0 auto;width:auto;">
            ${stops.map(s => `<option value="${s}">${s}</option>`).join('')}
            <option value="General">General</option>
          </select>
        </div>
        <textarea class="input-field" id="new-note-input" placeholder="Write your travel notes..." style="min-height:80px;border:1px solid var(--input-border);border-radius:var(--radius-md);padding:var(--space-12);margin-bottom:var(--space-12);"></textarea>
        <button class="btn btn-primary btn-sm ripple-container" onclick="TLApp.addNote('${trip.id}')">Add Note</button>
      </div>

      <div class="notes-list">
        ${trip.notes?.length ? trip.notes.map(n => TLComponents.noteCard(n)).join('') :
          `<div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <h3 class="empty-state-title">No notes yet</h3>
            <p class="empty-state-text">Add notes about your trip above</p>
          </div>`}
      </div>
    </div>`;
  };

  /* ── 14. Admin Dashboard ── */
  TLScreens.admin = async function() {
    const data = await TLData.load();
    const admin = data.admin;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    return `<div class="container admin-screen">
      ${TLComponents.pageHeader('Admin Dashboard', 'Platform overview & analytics')}

      <div class="admin-stats">
        ${TLComponents.statCard('Total Users', admin.totalUsers, '👥', 12)}
        ${TLComponents.statCard('Active Trips', admin.activeTrips, '✈️', 8)}
        ${TLComponents.statCard('Revenue', admin.revenue, '💰', 15, '$')}
        ${TLComponents.statCard('Avg Rating', admin.avgRating, '⭐')}
      </div>

      <div class="admin-charts">
        <div class="chart-container animate-on-scroll">
          <h3 style="margin-bottom:var(--space-16);">Monthly Trips</h3>
          ${TLComponents.barChart(admin.monthlyTrips, months, Math.max(...admin.monthlyTrips), 'var(--secondary)')}
        </div>
        <div class="chart-container animate-on-scroll">
          <h3 style="margin-bottom:var(--space-16);">Monthly Revenue</h3>
          ${TLComponents.barChart(admin.monthlyRevenue, months, Math.max(...admin.monthlyRevenue), 'var(--primary)')}
        </div>
      </div>

      <div class="admin-table-container animate-on-scroll">
        <div class="admin-table-header">
          <h3>Recent Users</h3>
          <span class="badge">${admin.recentUsers.length}</span>
        </div>
        <table class="data-table">
          <thead><tr><th>User</th><th>Email</th><th>Trips</th><th>Status</th><th>Joined</th></tr></thead>
          <tbody>
            ${admin.recentUsers.map(u => `<tr>
              <td><div class="user-row"><div class="user-status ${u.status}"></div><strong>${u.name}</strong></div></td>
              <td>${u.email}</td>
              <td>${u.trips}</td>
              <td><span class="chip ${u.status === 'online' ? 'active' : ''}">${u.status}</span></td>
              <td>${TLData.formatDate(u.joined)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  };
})();
