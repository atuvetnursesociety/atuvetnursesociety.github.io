/* ============================================================
   committee.js — renders the committee card grid on committee.html
   ============================================================ */

(async function () {
  const config = window.SITE_CONFIG;
  const { rows } = await fetchCSV(config.committeeCsvUrl, 'data/committee.csv');
  const members = sortByOrder(cleanRows(rows), 'name');
  renderCommittee(members);
})();

/**
 * Renders a member's "bio" field as a list, exactly as written in the
 * sheet — one list item per line. A line written as "Label: detail" gets
 * its label bolded; a line with no colon just renders as plain text. This
 * deliberately does not rewrite or summarise what's in the cell.
 */
function renderCommitteeFacts(bio) {
  const lines = (bio || '').split('\n').map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return '';
  return lines
    .map((line) => {
      const match = line.match(/^([^:]{1,40}:)\s*(.*)$/);
      if (match) {
        return `<li><strong>${escapeHtml(match[1])}</strong> ${escapeHtml(match[2])}</li>`;
      }
      return `<li>${escapeHtml(line)}</li>`;
    })
    .join('');
}

function renderCommittee(members) {
  const container = document.getElementById('committee-grid');
  if (!container) return;

  if (!members.length) {
    container.innerHTML = '<p class="state-message">Committee details are coming soon.</p>';
    return;
  }

  container.innerHTML = '';
  members.forEach((member) => {
    const card = document.createElement('article');
    card.className = 'card committee-card';

    const photoWrap = document.createElement('div');
    photoWrap.className = 'committee-photo';
    const placeholder = document.createElement('svg');
    placeholder.setAttribute('viewBox', '0 0 64 64');
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.style.color = '#fff';
    placeholder.innerHTML = '<circle cx="32" cy="24" r="14" fill="currentColor"/><path d="M10 56c0-13 10-22 22-22s22 9 22 22" fill="currentColor"/>';
    photoWrap.appendChild(placeholder);

    const photoValue = resolveImagePath(member.photo, 'committee');
    if (photoValue) {
      const img = document.createElement('img');
      img.src = photoValue;
      img.alt = `Photo of ${member.name}`;
      img.hidden = true;
      img.addEventListener('load', () => {
        img.hidden = false;
        placeholder.style.display = 'none';
      });
      img.addEventListener('error', () => img.remove());
      photoWrap.appendChild(img);
    }

    const body = document.createElement('div');
    body.innerHTML = `
      <h3>${escapeHtml(member.name)}</h3>
      <span class="committee-role">${escapeHtml(member.role)}</span>
      <ul class="committee-facts">${renderCommitteeFacts(member.bio)}</ul>
      ${member.fun_fact ? `<span class="fun-fact">${escapeHtml(member.fun_fact)}</span>` : ''}
    `;

    card.appendChild(photoWrap);
    card.appendChild(body);
    container.appendChild(card);
  });
}
