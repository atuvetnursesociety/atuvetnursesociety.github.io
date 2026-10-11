/* ============================================================
   suggestions.js — embeds the Google Form on suggestions.html,
   or shows an email fallback if no form URL is configured yet
   ============================================================ */

(function () {
  const config = window.SITE_CONFIG;
  const wrap = document.getElementById('suggestion-form-wrap');
  if (!wrap) return;

  const formUrl = (config && config.suggestionFormUrl || '').trim();

  if (!formUrl) {
    wrap.innerHTML = `
      <p class="state-message">The suggestion form isn't set up yet — in the
      meantime, email your suggestion to
      <a href="mailto:${config.email}">${config.email}</a> or send it to us
      on <a href="${config.instagramUrl}">Instagram</a>.</p>
    `;
    return;
  }

  wrap.innerHTML = `
    <iframe class="suggestion-embed" src="${formUrl}" title="Suggestion box form" loading="lazy">Loading…</iframe>
  `;
})();
