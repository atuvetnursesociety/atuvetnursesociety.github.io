/* ============================================================
   resources.js — renders the three resource sections on resources.html
   ============================================================ */

(async function () {
  const config = window.SITE_CONFIG;
  const { rows } = await fetchCSV(config.resourcesCsvUrl, 'data/resources.csv');
  const resources = cleanRows(rows);

  renderSection('Placement tips', 'resources-placement', resources, false);
  renderSection('Careers info', 'resources-careers', resources, false);
  renderSection('Wellbeing support', 'resources-wellbeing', resources, true);
})();

/**
 * Renders the resources for one section into a <ul>.
 * When keepExisting is true (Wellbeing support), the hardcoded default
 * item already in the HTML is left in place and any sheet-sourced rows
 * are appended after it, instead of clearing the list first.
 */
function renderSection(sectionName, containerId, allResources, keepExisting) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const items = sortByOrder(
    allResources.filter((r) => (r.section || '').trim().toLowerCase() === sectionName.toLowerCase()),
    'title'
  );

  if (!keepExisting) {
    container.innerHTML = '';
    if (!items.length) {
      container.innerHTML = '<li class="state-message">Nothing here yet. Check back soon.</li>';
      return;
    }
  } else if (!items.length) {
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'resource-item';
    const titleHtml = item.url
      ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.title)}</a>`
      : escapeHtml(item.title);
    li.innerHTML = `<h3>${titleHtml}</h3><p>${escapeHtml(item.description)}</p>`;
    container.appendChild(li);
  });
}
