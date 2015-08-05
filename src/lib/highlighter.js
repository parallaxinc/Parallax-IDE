'use strict';

const cm = require('../code-mirror');

function highlighter(position, length) {
  const doc = cm.getDoc();

  const anchor = doc.posFromIndex(position);
  const head = doc.posFromIndex(position + length);

  doc.setSelection(anchor, head, { scroll: false });

  const charRect = cm.charCoords(anchor, 'local');
  const halfHeight = cm.getScrollerElement().offsetHeight / 2;
  const halfTextHeight = Math.floor((charRect.bottom - charRect.top) / 2);
  cm.scrollTo(null, charRect.top - halfHeight - halfTextHeight);
}

module.exports = highlighter;
