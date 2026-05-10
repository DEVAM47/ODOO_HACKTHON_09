/* ============================================
   TRAVELOOP — Reusable UI Components
   ============================================ */

const TLComponents = (() => {

  /* ── Bottom Navigation ── */
  function bottomNav(activeRoute) {
    const items = [
      { icon: '🏠', label: 'Home', route: '#/dashboard' },
      { icon: '✈️', label: 'Trips', route: '#/trips' },
      { icon: '🔍', label: 'Explore', route: '#/cities' },
      { icon: '💰', label: 'Budget', route: '#/budget/t1' },
      { icon: '👤', label: 'Profile', route: '#/profile' }
    ];
    return `<nav class="nav-bottom" role="navigation" aria-label="Main navigation">
      ${items.map(i => `
        <a href="${i.route}" class="nav-bottom-item ${activeRoute.startsWith(i.route.replace('#','')) ? 'active' : ''}" aria-label="${i.label}">
          <div class="nav-bottom-indicator"></div>
          <span class="nav-icon">${i.icon}</span>
          <span>${i.label}</span>
        </a>`).join('')}
    </nav>`;
  }

  /* ── Sidebar Navigation (User) ── */
  function sidebar(activeRoute) {
    const items = [
      { icon: '📊', label: 'Dashboard', route: '#/dashboard' },
      { icon: '✈️', label: 'My Trips', route: '#/trips' },
      { icon: '➕', label: 'Create Trip', route: '#/create-trip' },
      { icon: '🔍', label: 'Explore Cities', route: '#/cities' },
      { icon: '🎯', label: 'Activities', route: '#/activities' },
      { divider: true },
      { icon: '💰', label: 'Budget', route: '#/budget/t1' },
      { icon: '🧳', label: 'Packing List', route: '#/packing/t1' },
      { icon: '📝', label: 'Trip Notes', route: '#/notes/t1' },
      { divider: true },
      { icon: '👤', label: 'Profile', route: '#/profile' }
    ];
    return `<aside class="nav-sidebar" role="navigation" aria-label="Sidebar navigation">
      <a href="#/dashboard" class="nav-logo">Travel<span>oop</span></a>
      <div class="nav-menu">
        ${items.map(i => i.divider ? '<div class="nav-divider"></div>' :
          `<a href="${i.route}" class="nav-item ${activeRoute.startsWith(i.route.replace('#','')) ? 'active' : ''}">
            <span class="nav-icon">${i.icon}</span>
            <span>${i.label}</span>
          </a>`).join('')}
      </div>
      <div style="margin-top:auto;padding-top:var(--space-16);border-top:1px solid var(--divider-light);">
        <div class="sidebar-user">
          <div class="avatar" style="width:36px;height:36px;font-size:13px;background:var(--primary-container);color:var(--primary);">${TLAuth.getInitials()}</div>
          <div style="flex:1;min-width:0;">
            <div style="font:var(--text-label-md);color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${TLAuth.getName()}</div>
            <div style="font:var(--text-body-sm);color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${TLAuth.getEmail()}</div>
          </div>
        </div>
        <button class="nav-item w-full" style="color:var(--error);background:none;border:none;cursor:pointer;margin-top:var(--space-4);" onclick="TLApp.logout()">
          <span class="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>`;
  }
  function adminSidebar(activeRoute) {
    const items = [
      { icon: '🛡️', label: 'Admin Dashboard', route: '#/admin' },
      { divider: true },
      { icon: '👥', label: 'Users', route: '#/admin' },
      { icon: '✈️', label: 'All Trips', route: '#/trips' },
      { icon: '💰', label: 'Revenue', route: '#/admin' },
      { icon: '📊', label: 'Analytics', route: '#/admin' },
    ];
    return `<aside class="nav-sidebar admin-sidebar" role="navigation" aria-label="Admin navigation">
      <div class="nav-logo" style="color:#fff;">Travel<span style="color:rgba(255,255,255,0.5)">oop</span>
        <span class="admin-badge">ADMIN</span>
      </div>
      <div class="nav-menu">
        ${items.map(i => i.divider ? '<div class="nav-divider" style="border-color:rgba(255,255,255,0.1)"></div>' :
          `<a href="${i.route}" class="nav-item admin-nav-item ${activeRoute.startsWith(i.route.replace('#','')) ? 'active' : ''}">
            <span class="nav-icon">${i.icon}</span>
            <span>${i.label}</span>
          </a>`).join('')}
      </div>
      <div style="margin-top:auto;padding-top:var(--space-16);border-top:1px solid rgba(255,255,255,0.1);">
        <div class="sidebar-user" style="margin-bottom:var(--space-8);">
          <div class="avatar" style="width:36px;height:36px;font-size:13px;background:rgba(255,112,67,0.25);color:#ff8a65;">${TLAuth.getInitials()}</div>
          <div style="flex:1;min-width:0;">
            <div style="font:var(--text-label-md);color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${TLAuth.getName()}</div>
            <div style="font:var(--text-body-sm);color:rgba(255,255,255,0.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${TLAuth.getEmail()}</div>
          </div>
        </div>
        <button class="nav-item admin-nav-item w-full" style="color:#ff8a80;background:none;border:none;cursor:pointer;" onclick="TLApp.logout()">
          <span class="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>`;
  }

  /* ── Trip Card ── */
  function tripCard(trip) {
    const totalStops = trip.stops ? trip.stops.length : 0;
    const statusClass = trip.status || 'planning';
    const imageHtml = trip.coverPhoto
      ? `<img src="${trip.coverPhoto}" alt="${trip.name}" style="width:100%;height:100%;object-fit:cover;display:block;">`
      : `<div style="width:100%;height:100%;background:linear-gradient(135deg,var(--secondary)0%,var(--tertiary)100%);display:flex;align-items:center;justify-content:center;font-size:48px;color:rgba(255,255,255,0.3);"><span>✈️</span></div>`;
    return `<div class="card animate-on-scroll" data-trip-id="${trip.id}">
      <div class="card-image overflow-hidden" style="height:180px;position:relative;">
        ${imageHtml}
      </div>
      <div class="card-body">
        <div class="flex justify-between items-center">
          <h3 class="card-title">${trip.name}</h3>
          <span class="trip-status ${statusClass}">${statusClass}</span>
        </div>
        <p class="card-subtitle">${trip.description || ''}</p>
        <div class="trip-card-meta">
          <span>📅 ${TLData.formatDate(trip.startDate)}</span>
          <span>📍 ${totalStops} ${totalStops === 1 ? 'city' : 'cities'}</span>
        </div>
      </div>
      <div class="card-actions">
        <a href="#/itinerary/${trip.id}" class="btn btn-sm btn-primary ripple-container">View</a>
        ${TLAuth.isAdmin() ? `<a href="#/builder/${trip.id}" class="btn btn-sm btn-secondary">Edit</a>` : ''}
        ${TLAuth.isAdmin() ? `<button class="btn btn-sm btn-ghost" onclick="TLApp.deleteTrip('${trip.id}')" aria-label="Delete trip">🗑️</button>` : ''}
      </div>
    </div>`;
  }

  /* ── Destination Card ── */
  function destinationCard(dest) {
    const costLabel = ['', 'Budget', 'Mid-range', 'Premium'][dest.cost];
    const imageHtml = dest.image
      ? `<img src="${dest.image}" alt="${dest.name}" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.4s var(--ease-spring);">`
      : `<div style="width:100%;height:100%;background:linear-gradient(135deg,${dest.cost===3?'var(--primary)':'var(--secondary)'}0%,var(--tertiary)100%);display:flex;align-items:center;justify-content:center;font-size:52px;">${dest.emoji}</div>`;
    return `<div class="card destination-card animate-on-scroll" onclick="TLComponents.showDestinationDetail(${JSON.stringify(dest).replace(/"/g,'&quot;')})" style="cursor:pointer;">
      <div class="dest-card-image overflow-hidden" style="position:relative;">
        ${imageHtml}
        <div class="dest-card-overlay">
          <span class="dest-rating">⭐ ${dest.rating || ''}</span>
          <span class="dest-region-badge">${dest.region}</span>
        </div>
      </div>
      <div class="card-body dest-card-body">
        <div class="dest-card-title-row">
          <h3 class="card-title">${dest.name}</h3>
          <span class="dest-cost-badge dest-cost-${dest.cost}">${costLabel}</span>
        </div>
        <p class="dest-country">📍 ${dest.country}</p>
        ${dest.description ? `<p class="dest-description">${dest.description}</p>` : ''}
        <div class="dest-meta-row">
          <span class="dest-meta-item">📅 ${dest.bestTime || 'Year-round'}</span>
          <span class="dest-meta-item">💰 ${dest.avgCost || ''}</span>
        </div>
        ${dest.tags ? `<div class="dest-tags">${dest.tags.map(t => `<span class="dest-tag">${t}</span>`).join('')}</div>` : ''}
        <div class="dest-popularity-row">
          <span style="font-size:12px;color:var(--text-muted);">Popularity</span>
          <div class="popularity-bar" style="flex:1;"><div class="popularity-fill" style="width:${dest.popularity}%"></div></div>
          <span style="font-size:12px;color:var(--tertiary);font-weight:600;">${dest.popularity}%</span>
        </div>
      </div>
    </div>`;
  }

  function showDestinationDetail(dest) {
    const costLabel = ['', 'Budget', 'Mid-range', 'Premium'][dest.cost];
    const imageHtml = dest.image
      ? `<img src="${dest.image}" alt="${dest.name}" style="width:100%;height:220px;object-fit:cover;border-radius:var(--radius-lg);margin-bottom:var(--space-16);">`
      : '';
    showModal(
      `${dest.emoji} ${dest.name}`,
      `${imageHtml}
      <p style="color:var(--text-tertiary);margin-bottom:var(--space-12);">📍 ${dest.country} &nbsp;·&nbsp; ${dest.region}</p>
      <p style="color:var(--text-secondary);line-height:1.7;margin-bottom:var(--space-16);">${dest.description || ''}</p>
      <div class="dest-detail-grid">
        <div class="dest-detail-item"><span class="dest-detail-label">⭐ Rating</span><span class="dest-detail-value">${dest.rating}</span></div>
        <div class="dest-detail-item"><span class="dest-detail-label">📅 Best Time</span><span class="dest-detail-value">${dest.bestTime || 'Year-round'}</span></div>
        <div class="dest-detail-item"><span class="dest-detail-label">💰 Avg Cost</span><span class="dest-detail-value">${dest.avgCost || 'Varies'}</span></div>
        <div class="dest-detail-item"><span class="dest-detail-label">📊 Popularity</span><span class="dest-detail-value">${dest.popularity}%</span></div>
      </div>
      ${dest.tags ? `<div class="dest-tags" style="margin-top:var(--space-16);">${dest.tags.map(t => `<span class="dest-tag">${t}</span>`).join('')}</div>` : ''}`,
      `<button class="btn btn-ghost" onclick="TLComponents.closeModal()">Close</button>
       <a href="#/create-trip" class="btn btn-primary ripple-container" onclick="TLComponents.closeModal()">✈️ Plan a Trip Here</a>`
    );
  }

  /* ── Activity Card ── */
  function activityCard(act) {
    const imageHtml = act.image
      ? `<img src="${act.image}" alt="${act.name}" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.4s var(--ease-spring);">`
      : `<div style="width:100%;height:100%;background:${TLData.getCategoryColor(act.category)};display:flex;align-items:center;justify-content:center;font-size:48px;">${act.emoji || TLData.getCategoryEmoji(act.category)}</div>`;
    return `<div class="card animate-on-scroll">
      <div class="card-image activity-card-img overflow-hidden" style="position:relative;">
        ${imageHtml}
      </div>
      <div class="card-body">
        <h3 class="card-title">${act.name}</h3>
        <p class="card-subtitle">${act.city}</p>
        <div class="activity-meta">
          <span>💰 ${TLData.formatCurrency(act.cost)}</span>
          <span>⏱️ ${act.duration}</span>
          <span>⭐ ${act.rating}</span>
        </div>
      </div>
      <div class="card-actions">
        <span class="chip">${act.category}</span>
        <button class="btn btn-sm btn-primary ripple-container" onclick="TLComponents.openActivityBooking('${act.id}','${act.name}', '${act.city}', ${act.cost})">Book</button>
      </div>
    </div>`;
  }

  /* ── Stat Card ── */
  function statCard(label, value, icon, change, prefix = '', suffix = '') {
    return `<div class="stat-card animate-on-scroll">
      <div class="flex justify-between items-center">
        <span class="stat-label">${label}</span>
        <span style="font-size:24px">${icon}</span>
      </div>
      <div class="stat-value" data-count-to="${typeof value === 'number' ? value : ''}" data-prefix="${prefix}" data-suffix="${suffix}">${prefix}${typeof value === 'number' ? '0' : value}${suffix}</div>
      ${change ? `<div class="stat-change ${change > 0 ? 'up' : 'down'}">${change > 0 ? '↑' : '↓'} ${Math.abs(change)}%</div>` : ''}
    </div>`;
  }

  /* ── Checkbox Item ── */
  function checkboxItem(item, category, tripId) {
    return `<div class="packing-item ${item.packed ? 'packed' : ''}" data-item-id="${item.id}">
      <div class="checkbox-group" onclick="TLApp.togglePack('${tripId}','${category}','${item.id}')">
        <div class="checkbox ${item.packed ? 'checked' : ''}">
          ${item.packed ? '<svg width="14" height="14" viewBox="0 0 14 14"><polyline points="2,7 6,11 12,3" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        </div>
        <span class="checkbox-label">${item.name}</span>
      </div>
      <button class="btn-icon btn-ghost" onclick="TLApp.removePack('${tripId}','${category}','${item.id}')" aria-label="Remove item" style="font-size:14px;width:32px;height:32px;">✕</button>
    </div>`;
  }

  /* ── Note Card ── */
  function noteCard(note) {
    return `<div class="note-card animate-on-scroll">
      <div class="note-header">
        <span class="note-stop">📍 ${note.stop}</span>
        <span class="note-time">${TLData.formatDate(note.timestamp)}</span>
      </div>
      <p class="note-content">${note.content}</p>
    </div>`;
  }

  /* ── Bar Chart (CSS) ── */
  function barChart(data, labels, maxVal, color = 'var(--primary)') {
    const max = maxVal || Math.max(...data);
    return `<div class="chart-canvas flex items-end gap-4" style="padding:var(--space-16) 0;">
      ${data.map((v, i) => `
        <div class="flex flex-col items-center gap-4" style="flex:1;">
          <div style="width:100%;height:${(v / max) * 200}px;background:${color};border-radius:var(--radius-sm) var(--radius-sm) 0 0;transform-origin:bottom;transform:scaleY(0);animation:barGrow 0.6s ${i * 80}ms var(--ease-out-expo) forwards;"></div>
          <span style="font-size:10px;color:var(--text-muted);white-space:nowrap;">${labels[i]}</span>
        </div>`).join('')}
    </div>`;
  }

  /* ── Donut Chart (SVG) ── */
  function donutChart(segments, size = 180) {
    const r = 35; const c = 2 * Math.PI * r;
    let offset = 0;
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" style="margin:0 auto;display:block;">
      ${segments.map((seg, i) => {
        const pct = seg.value / total;
        const dashArray = `${pct * c} ${c}`;
        const el = `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${seg.color}" stroke-width="12" stroke-dasharray="${dashArray}" stroke-dashoffset="${-offset}" transform="rotate(-90 50 50)" style="animation:pieReveal 1s ${i * 150}ms var(--ease-out-expo) forwards;opacity:0.9;"/>`;
        offset += pct * c;
        return el;
      }).join('')}
      <text x="50" y="48" text-anchor="middle" style="font-size:12px;font-weight:700;fill:var(--text-primary);font-family:var(--font-headline);">${TLData.formatCurrency(total)}</text>
      <text x="50" y="58" text-anchor="middle" style="font-size:5px;fill:var(--text-muted);font-family:var(--font-body);">Total Budget</text>
    </svg>
    <div class="flex flex-wrap gap-8 justify-center" style="margin-top:var(--space-16);">
      ${segments.map(s => `<div class="flex items-center gap-4"><div style="width:10px;height:10px;border-radius:50%;background:${s.color}"></div><span style="font-size:12px;color:var(--text-tertiary)">${s.label}</span></div>`).join('')}
    </div>`;
  }

  /* ── Modal ── */
  function showModal(title, bodyHtml, footerHtml = '') {
    let backdrop = document.querySelector('.modal-backdrop');
    let modal = document.querySelector('.modal');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      backdrop.onclick = closeModal;
      document.body.appendChild(backdrop);
    }
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal';
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="btn-icon" onclick="TLComponents.closeModal()" aria-label="Close">✕</button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
      ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}`;
    requestAnimationFrame(() => {
      backdrop.classList.add('active');
      modal.classList.add('active');
    });
  }

  function closeModal() {
    const backdrop = document.querySelector('.modal-backdrop');
    const modal = document.querySelector('.modal');
    if (backdrop) backdrop.classList.remove('active');
    if (modal) modal.classList.remove('active');
  }

  // Activity booking + simulated payment (UI only)
  function openActivityBooking(activityId, activityName, activityCity, activityCost) {
    const safeName = String(activityName ?? 'Activity').replace(/</g, '<').replace(/>/g, '>');
    const safeCity = String(activityCity ?? '').replace(/</g, '<').replace(/>/g, '>');
    const cost = Number(activityCost || 0);

    const bodyHtml = `
      <div class="booking-step">
        <h4 style="margin-bottom:var(--space-12);">1) Booking Details</h4>
        <form id="activity-booking-form" onsubmit="event.preventDefault(); TLApp.showActivityPayment('${activityId}');">
          <div class="input-group">
            <input class="input-field" id="booking-name" placeholder=" " required value="${TLAuth.getName()}" />
            <label class="input-label" for="booking-name">Full Name</label>
          </div>
          <div class="input-group">
            <input class="input-field" id="booking-email" type="email" placeholder=" " required value="${TLAuth.getEmail()}" />
            <label class="input-label" for="booking-email">Email</label>
          </div>
          <div class="input-group">
            <input class="input-field" id="booking-date" type="date" placeholder=" " required />
            <label class="input-label" for="booking-date">Date</label>
          </div>
          <div class="input-group">
            <select class="input-field" id="booking-qty" style="width:auto;">
              ${[1,2,3,4,5].map(n => `<option value="${n}">${n} ticket${n===1?'':'s'}</option>`).join('')}
            </select>
            <label class="input-label" for="booking-qty" style="top:0;transform:translateY(-50%) scale(0.85);">Quantity</label>
          </div>
          <div style="margin:var(--space-12) 0;">
            <div class="chip active" style="cursor:default;">${safeName}</div>
            <div style="margin-top:var(--space-8);color:var(--text-tertiary);font-size:14px;">📍 ${safeCity || '—'} · 💰 ${TLData.formatCurrency(cost)}</div>
          </div>
          <div class="flex gap-12" style="justify-content:flex-end;">
            <button type="button" class="btn btn-ghost" onclick="TLComponents.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary ripple-container">Continue to Payment</button>
          </div>
        </form>
      </div>`;

    showModal('Book Activity', bodyHtml);
    // Persist activity details on app for payment step
    window._activity_booking = { activityId, activityName: safeName, activityCity: safeCity, activityCost: cost };
  }


  /* ── Page Header ── */
  function pageHeader(title, subtitle, actions = '') {
    return `<div class="page-header container">
      <div class="flex justify-between items-center flex-wrap gap-16">
        <div>
          <h1>${title}</h1>
          ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
        ${actions ? `<div class="flex gap-8">${actions}</div>` : ''}
      </div>
    </div>`;
  }

  return {
    bottomNav, sidebar, adminSidebar, tripCard, destinationCard, activityCard, statCard,
    checkboxItem, noteCard, barChart, donutChart,
    showModal, closeModal, pageHeader, showDestinationDetail
  };
})();
