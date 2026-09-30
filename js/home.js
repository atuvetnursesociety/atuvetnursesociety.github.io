/* ============================================================
   home.js — next-event banner and the 3-event preview on index.html
   ============================================================ */

(async function () {
  const config = window.SITE_CONFIG;
  const { rows } = await fetchCSV(config.eventsCsvUrl, 'data/events.csv');
  const today = getDublinTodayDateString();
  const upcoming = sortEventsByDate(cleanRows(rows).filter((e) => isUpcoming(e.date, today)));

  renderNextEventBanner(upcoming[0]);
  renderEventsPreview(upcoming.slice(0, 3));
})();

function renderNextEventBanner(event) {
  const container = document.getElementById('next-event-banner');
  if (!container) return;

  if (!event) {
    container.innerHTML =
      '<p class="state-message">No upcoming events right now. Check back soon, or follow us on Instagram for updates.</p>';
    return;
  }

  const [y, m, d] = event.date.split('-').map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d, 12));
  const day = dateObj.getUTCDate();
  const month = new Intl.DateTimeFormat('en-IE', { month: 'short', timeZone: 'UTC' }).format(dateObj);
  const metaBits = [formatEventDate(event.date)];
  if (event.start_time) metaBits.push(`at ${event.start_time}`);
  if (event.location) metaBits.push(event.location);

  container.innerHTML = `
    <div class="next-event">
      <div class="next-event__date"><span class="day">${day}</span><span class="month">${escapeHtml(month)}</span></div>
      <div class="next-event__body">
        <h3>${escapeHtml(event.title)}</h3>
        <p class="next-event__meta">${escapeHtml(metaBits.join(' · '))}</p>
        <p><a class="btn btn-small btn-secondary" href="events.html">See details</a></p>
      </div>
    </div>
  `;
}

function renderEventsPreview(events) {
  const container = document.getElementById('home-events-preview');
  if (!container) return;

  if (!events.length) {
    container.innerHTML = '<p class="state-message">No upcoming events right now. Check back soon!</p>';
    return;
  }

  container.innerHTML = '';
  events.forEach((event) => {
    const card = document.createElement('article');
    card.className = 'card';
    const metaBits = [formatEventDate(event.date)];
    if (event.location) metaBits.push(event.location);
    card.innerHTML = `
      <h3>${escapeHtml(event.title)}</h3>
      <p class="card-meta">${escapeHtml(metaBits.join(' · '))}</p>
      <p class="card-price">${escapeHtml(formatPrice(event.price))}</p>
    `;
    container.appendChild(card);
  });
}
