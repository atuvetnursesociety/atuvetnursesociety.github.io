/* ============================================================
   events.js — renders upcoming events with sign-up and
   add-to-calendar (Google Calendar link + downloadable .ics)
   ============================================================ */

(async function () {
  const config = window.SITE_CONFIG;
  const { rows } = await fetchCSV(config.eventsCsvUrl, 'data/events.csv');
  const today = getDublinTodayDateString();
  const upcoming = sortEventsByDate(cleanRows(rows).filter((e) => isUpcoming(e.date, today)));
  renderEvents(upcoming);
})();

function renderEvents(events) {
  const container = document.getElementById('events-list');
  if (!container) return;

  if (!events.length) {
    container.innerHTML =
      '<p class="state-message">No upcoming events at the moment. Follow us on Instagram for updates.</p>';
    return;
  }

  container.innerHTML = '';
  events.forEach((event) => container.appendChild(buildEventCardElement(event)));
}

function buildEventCardElement(event) {
  const card = document.createElement('article');
  card.className = 'card event-card';

  const imgSrc = resolveImagePath(event.image, 'events');
  const timeRange = event.start_time ? event.start_time + (event.end_time ? `–${event.end_time}` : '') : '';
  const metaBits = [formatEventDate(event.date)];
  if (timeRange) metaBits.push(timeRange);
  if (event.location) metaBits.push(event.location);

  card.innerHTML = `
    ${imgSrc ? '<img alt="">' : ''}
    <h3>${escapeHtml(event.title)}</h3>
    <p class="card-meta">${escapeHtml(metaBits.join(' · '))}</p>
    <p class="card-price">${escapeHtml(formatPrice(event.price))}</p>
    ${event.description ? `<p>${escapeHtml(event.description)}</p>` : ''}
    <div class="card-actions"></div>
  `;

  if (imgSrc) {
    const img = card.querySelector('img');
    img.src = imgSrc;
    attachImageFallback(img);
  }

  const actions = card.querySelector('.card-actions');

  if (event.signup_url) {
    const signupLink = document.createElement('a');
    signupLink.className = 'btn btn-small btn-primary';
    signupLink.href = event.signup_url;
    signupLink.textContent = 'Sign up';
    signupLink.target = '_blank';
    signupLink.rel = 'noopener';
    actions.appendChild(signupLink);
  }

  const calWrap = document.createElement('div');
  calWrap.className = 'calendar-actions';

  const gcalLink = document.createElement('a');
  gcalLink.className = 'btn btn-small btn-secondary';
  gcalLink.href = buildGoogleCalendarUrl(event);
  gcalLink.textContent = 'Google Calendar';
  gcalLink.target = '_blank';
  gcalLink.rel = 'noopener';
  calWrap.appendChild(gcalLink);

  const icsButton = document.createElement('button');
  icsButton.type = 'button';
  icsButton.className = 'btn btn-small btn-secondary';
  icsButton.textContent = 'Download .ics';
  icsButton.addEventListener('click', () => downloadIcs(event));
  calWrap.appendChild(icsButton);

  actions.appendChild(calWrap);

  return card;
}

/** Returns {start, end} as "HH:MM" strings, defaulting end to start+1hr if missing/invalid. */
function getEventTimes(event) {
  const start = event.start_time && /^\d{1,2}:\d{2}$/.test(event.start_time) ? event.start_time : '00:00';
  let end = event.end_time && /^\d{1,2}:\d{2}$/.test(event.end_time) ? event.end_time : null;
  if (!end) {
    const [h, m] = start.split(':').map(Number);
    const endHour = (h + 1) % 24;
    end = `${String(endHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  return { start, end };
}

function buildGoogleCalendarUrl(event) {
  const { start, end } = getEventTimes(event);
  const dateCompact = event.date.replace(/-/g, '');
  const startCompact = `${dateCompact}T${start.replace(':', '')}00`;
  const endCompact = `${dateCompact}T${end.replace(':', '')}00`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title || 'Event',
    dates: `${startCompact}/${endCompact}`,
    details: event.description || '',
    location: event.location || '',
    ctz: 'Europe/Dublin',
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

function escapeIcsText(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function buildIcsContent(event) {
  const { start, end } = getEventTimes(event);
  const dateCompact = event.date.replace(/-/g, '');
  const dtStart = `${dateCompact}T${start.replace(':', '')}00`;
  const dtEnd = `${dateCompact}T${end.replace(':', '')}00`;
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `${dateCompact}-${(event.title || 'event').replace(/\s+/g, '-').toLowerCase()}@atuvns`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ATU Vet Nursing Society//Events//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Europe/Dublin:${dtStart}`,
    `DTEND;TZID=Europe/Dublin:${dtEnd}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    event.description ? `DESCRIPTION:${escapeIcsText(event.description)}` : null,
    event.location ? `LOCATION:${escapeIcsText(event.location)}` : null,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  return lines.join('\r\n') + '\r\n';
}

function downloadIcs(event) {
  const content = buildIcsContent(event);
  const blob = new Blob([content], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const slug = (event.title || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const link = document.createElement('a');
  link.href = url;
  link.download = `${slug || 'event'}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
