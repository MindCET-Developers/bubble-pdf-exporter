function escapeHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSection(section) {
  const { type } = section;

  if (['h1', 'h2', 'h3', 'h4'].includes(type)) {
    return `<${type}>${escapeHtml(section.text)}</${type}>`;
  }

  if (type === 'p') {
    return `<p>${escapeHtml(section.text)}</p>`;
  }

  if (type === 'ul') {
    const items = (section.items || [])
      .map(item => `<li>${escapeHtml(item)}</li>`)
      .join('');
    return `<ul>${items}</ul>`;
  }

  if (type === 'ol') {
    const items = (section.items || [])
      .map(item => `<li>${escapeHtml(item)}</li>`)
      .join('');
    return `<ol>${items}</ol>`;
  }

  if (type === 'table') {
    const headers = (section.headers || [])
      .map(h => `<th>${escapeHtml(h)}</th>`)
      .join('');
    const rows = (section.rows || [])
      .map(row => {
        const cells = row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  }

  if (type === 'image') {
    const caption = section.caption
      ? `<div class="image-caption">${escapeHtml(section.caption)}</div>`
      : '';
    return `<img class="section-image" src="${escapeHtml(section.url)}" alt="${escapeHtml(section.caption || '')}">${caption}`;
  }

  if (type === 'lesson_details') {
    const fields = [
      { label: 'זמן', value: section.time },
      { label: 'דרגת קושי', value: section.level },
      { label: 'צורת ישיבה', value: section.sitting },
      { label: 'התערבות', value: section.intervention },
    ].filter(f => f.value);

    const items = fields
      .map(f => `<span class="ld-item"><strong>${escapeHtml(f.label)}</strong> ${escapeHtml(f.value)}</span>`)
      .join('');

    return `<div class="lesson-details"><span class="ld-arrow">&gt;&gt;</span>${items}<span class="ld-arrow">&lt;&lt;</span></div>`;
  }

  if (type === 'divider') {
    return `<hr class="divider">`;
  }

  if (type === 'spacer') {
    const height = section.height || '20px';
    return `<div class="spacer" style="height:${escapeHtml(height)}"></div>`;
  }

  if (type === 'page_break') {
    return `<div style="page-break-after: always;"></div>`;
  }

  return '';
}


const COPYRIGHT_HTML = `
<div class="copyright-block">
  <p class="copyright-intro">מורה יקר/ה, אנחנו שמחים לשתף אותך בתכנים המקצועיים שפיתחנו</p>
  <div class="copyright-box">חשוב להדגיש שתכנים אלו מוגנים בזכויות יוצרים ואין לשתף או להפיץ אותם.</div>
</div>`;

const COPYRIGHT_CSS = `
.copyright-block {
  margin-top: 32px;
  text-align: center;
  direction: rtl;
}
.copyright-intro {
  font-size: 13px;
  color: #2B2B2B;
  margin-bottom: 10px;
}
.copyright-box {
  display: inline-block;
  border: 2px solid #00B0C7;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 13px;
  font-weight: 700;
  color: #2B2B2B;
  max-width: 480px;
  line-height: 1.6;
}`;

function buildHTML(css, sections, metadata, styles, lang) {
  const dir = lang === 'he' || lang === 'ar' ? 'rtl' : 'ltr';
  const content = sections.map(renderSection).join('\n');

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang || 'he')}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(metadata?.title || 'Document')}</title>
  <style>
${css}
${COPYRIGHT_CSS}
  </style>
</head>
<body>
  <div class="page-content">
    ${content}
    ${COPYRIGHT_HTML}
  </div>
</body>
</html>`;
}

module.exports = { buildHTML };
