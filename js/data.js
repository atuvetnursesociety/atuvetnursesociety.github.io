/* ============================================================
   data.js — shared helpers for loading and cleaning content
   ============================================================
   Used by every page that shows events, committee members, gallery
   photos or resources. Nothing here needs to be edited to update
   site content — that happens in the Google Sheet (see README.md)
   or, for sample/fallback data, the CSV files in /data.
   ============================================================ */

/**
 * Today's date as "YYYY-MM-DD" in the Europe/Dublin timezone.
 * Using a plain string (not a Date object) for the "is this event
 * upcoming?" check avoids timezone bugs entirely, because YYYY-MM-DD
 * strings sort the same alphabetically as they do chronologically.
 */
function getDublinTodayDateString() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Dublin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return parts; // en-CA formats as YYYY-MM-DD
}

/** True if dateStr (YYYY-MM-DD) is today or later, compared as plain strings. */
function isUpcoming(dateStr, todayStr) {
  return typeof dateStr === 'string' && dateStr.trim() >= todayStr;
}

/**
 * Fetches a CSV from a published Google Sheets URL and parses it with
 * Papa Parse. If the URL is blank, or the fetch/parse fails, or the
 * sheet comes back empty, falls back to a local CSV file so the page
 * never shows a broken or empty section.
 * Returns { rows, usedFallback }.
 */
async function fetchCSV(publishedUrl, localFallbackPath) {
  if (publishedUrl && publishedUrl.trim()) {
    try {
      const response = await fetch(publishedUrl, { cache: 'no-store' });
      if (response.ok) {
        const text = await response.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        if (parsed.data && parsed.data.length > 0 && parsed.meta.fields) {
          return { rows: parsed.data, usedFallback: false };
        }
      }
    } catch (err) {
      console.warn('Could not load published sheet, using local sample data instead.', err);
    }
  }

  try {
    const response = await fetch(localFallbackPath, { cache: 'no-store' });
    const text = await response.text();
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    return { rows: parsed.data || [], usedFallback: true };
  } catch (err) {
    console.error('Could not load local fallback data either.', err);
    return { rows: [], usedFallback: true };
  }
}

/**
 * Cleans a parsed CSV row array: trims whitespace on every string field,
 * drops fully blank rows, and drops rows where the "show" column is "no"
 * (case-insensitive). A blank "show" column counts as "yes" so nobody
 * accidentally hides a row just by leaving the column empty.
 */
function cleanRows(rows) {
  return rows
    .map((row) => {
      const cleaned = {};
      Object.keys(row).forEach((key) => {
        const value = row[key];
        cleaned[key] = typeof value === 'string' ? value.trim() : value;
      });
      return cleaned;
    })
    .filter((row) => Object.values(row).some((v) => v !== '' && v != null))
    .filter((row) => (row.show || '').toLowerCase() !== 'no');
}

/**
 * Resolves an image value from a CSV cell into a usable <img> src.
 * - Blank value -> '' (caller should show a placeholder)
 * - Starts with http:// or https:// -> used as-is
 * - Otherwise treated as a filename inside images/<folder>/
 */
function resolveImagePath(value, folder) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `images/${folder}/${value}`;
}

/** Sorts rows by a numeric "order" column (ascending), then by name/title. */
function sortByOrder(rows, nameField) {
  return [...rows].sort((a, b) => {
    const orderA = parseFloat(a.order);
    const orderB = parseFloat(b.order);
    const hasOrderA = !Number.isNaN(orderA);
    const hasOrderB = !Number.isNaN(orderB);
    if (hasOrderA && hasOrderB && orderA !== orderB) return orderA - orderB;
    if (hasOrderA && !hasOrderB) return -1;
    if (!hasOrderA && hasOrderB) return 1;
    return (a[nameField] || '').localeCompare(b[nameField] || '');
  });
}

/** Sorts events soonest-first by date then start_time. */
function sortEventsByDate(rows) {
  return [...rows].sort((a, b) => {
    const keyA = `${a.date || ''} ${a.start_time || ''}`;
    const keyB = `${b.date || ''} ${b.start_time || ''}`;
    return keyA.localeCompare(keyB);
  });
}

/** Formats a YYYY-MM-DD date string for display, e.g. "Thursday 15 October 2026". */
function formatEventDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  return new Intl.DateTimeFormat('en-IE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Formats price text: blank or 0 (in any currency-free form) becomes "Free". */
function formatPrice(price) {
  const trimmed = (price || '').trim();
  if (!trimmed || trimmed === '0' || /^[€$£]?\s*0(\.0+)?$/.test(trimmed)) {
    return 'Free';
  }
  return trimmed;
}

/** Escapes text before inserting into innerHTML, to guard against a stray sheet cell containing markup. */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

/**
 * A small inline illustrated placeholder (soft paw print) used whenever a
 * photo filename from the sheet/CSV doesn't actually exist yet, so a missing
 * photo never shows a broken-image icon.
 */
const PLACEHOLDER_IMAGE_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23fbf8f4'/%3E%3Cpath d='M100 122c-20 0-42 15-42 33 0 10 8 17 19 17 9 0 15-6 23-6s14 6 23 6c11 0 19-7 19-17 0-18-22-33-42-33z' fill='%23c1a889'/%3E%3Ccircle cx='66' cy='96' r='14' fill='%23c1a889'/%3E%3Ccircle cx='96' cy='78' r='14' fill='%23c1a889'/%3E%3Ccircle cx='130' cy='78' r='14' fill='%23c1a889'/%3E%3Ccircle cx='154' cy='100' r='13' fill='%23c1a889'/%3E%3C/svg%3E";

/** Makes an <img> fall back to the paw placeholder if its src 404s or fails to load. */
function attachImageFallback(img) {
  img.addEventListener(
    'error',
    () => {
      if (img.src !== PLACEHOLDER_IMAGE_SRC) img.src = PLACEHOLDER_IMAGE_SRC;
    },
    { once: true }
  );
}
