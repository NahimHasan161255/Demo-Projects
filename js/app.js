/**
 * Product Inspection Form Demo - Application Logic
 */

/**
 * Formats a number with an explicit sign ('+' for positive) and 1 decimal place.
 * @param {number} n
 * @returns {string}
 */
function fmt(n) {
  return n > 0 ? '+' + n.toFixed(1) : n.toFixed(1);
}

/**
 * Accordion Section Management
 */
function toggleSection(id) {
  const sec = document.querySelector(`.section[data-section="${id}"]`);
  if (!sec) return;
  
  const body = sec.querySelector('.sec-body');
  const isOpen = sec.classList.contains('open');

  if (isOpen) {
    body.style.maxHeight = null;
    sec.classList.remove('open');
  } else {
    sec.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
  }
}

function openOnly(id) {
  const sec = document.querySelector(`.section[data-section="${id}"]`);
  if (sec && !sec.classList.contains('open')) {
    toggleSection(id);
  }
}

function closeSection(id) {
  const sec = document.querySelector(`.section[data-section="${id}"]`);
  if (sec && sec.classList.contains('open')) {
    toggleSection(id);
  }
}

function saveAndNext(currentId, nextId) {
  closeSection(currentId);
  setTimeout(() => {
    openOnly(nextId);
    const nextSec = document.querySelector(`.section[data-section="${nextId}"]`);
    if (nextSec) {
      nextSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 150);
}

function finishForm() {
  alert('検査データを保存しました。');
}

/**
 * Dynamic Calculation Controllers
 */
function recalcZenchou() {
  const input = document.getElementById('zenchou-m');
  const out = document.getElementById('zenchou-diff');
  if (!input || !out) return;

  const raw = input.value.replace(/,/g, '');
  const m = parseFloat(raw);
  const design = 7003.0;

  if (isNaN(m)) {
    out.textContent = '—';
    return;
  }

  const diff = m - design;
  out.textContent = fmt(diff) + ' mm';
  out.style.color = Math.abs(diff) > 3 ? 'var(--red)' : 'var(--ink)';
}

function recalcDia(idx, design) {
  const input = document.getElementById('dia-' + idx);
  const out = document.getElementById('dia-diff-' + idx);
  if (!input || !out) return;

  const m = parseFloat(input.value);
  if (isNaN(m)) {
    out.textContent = '—';
    return;
  }

  const diff = m - design;
  out.textContent = fmt(diff);
  out.style.color = Math.abs(diff) > 3 ? 'var(--red)' : 'var(--ink)';
}

function recalcSimple(inputId, outId, design) {
  const input = document.getElementById(inputId);
  const out = document.getElementById(outId);
  if (!input || !out) return;

  const m = parseFloat(input.value);
  if (isNaN(m)) {
    out.textContent = '—';
    return;
  }

  const diff = m - design;
  out.textContent = Number.isInteger(diff) ? (diff > 0 ? '+' : '') + diff : fmt(diff);
}

// Expose functions globally for accessibility
window.toggleSection = toggleSection;
window.openOnly = openOnly;
window.closeSection = closeSection;
window.saveAndNext = saveAndNext;
window.finishForm = finishForm;
window.recalcZenchou = recalcZenchou;
window.recalcDia = recalcDia;
window.recalcSimple = recalcSimple;

/**
 * DOM Ready Event Handlers
 */
document.addEventListener('DOMContentLoaded', () => {
  // Bind click events on section headers
  document.querySelectorAll('.sec-header').forEach((header) => {
    header.addEventListener('click', () => {
      const section = header.closest('.section');
      if (section) {
        const id = section.getAttribute('data-section');
        if (id) toggleSection(id);
      }
    });
  });

  // Bind click events on Save & Next buttons
  document.querySelectorAll('[data-action="save-next"]').forEach((button) => {
    button.addEventListener('click', () => {
      const currentId = button.getAttribute('data-current');
      const nextId = button.getAttribute('data-next');
      if (currentId && nextId) {
        saveAndNext(currentId, nextId);
      }
    });
  });

  // Bind click event on Finish button
  document.querySelectorAll('[data-action="finish-form"]').forEach((button) => {
    button.addEventListener('click', () => {
      finishForm();
    });
  });

  // Bind input listeners for dynamic calculations
  document.querySelectorAll('input[data-recalc]').forEach((input) => {
    input.addEventListener('input', () => {
      const type = input.getAttribute('data-recalc');
      if (type === 'zenchou') {
        recalcZenchou();
      } else if (type === 'dia') {
        const idx = input.getAttribute('data-idx');
        const design = parseFloat(input.getAttribute('data-design'));
        if (idx && !isNaN(design)) recalcDia(idx, design);
      } else if (type === 'simple') {
        const outId = input.getAttribute('data-out');
        const design = parseFloat(input.getAttribute('data-design'));
        if (outId && !isNaN(design)) recalcSimple(input.id, outId, design);
      }
    });
  });

  // Open default sections on initial load
  openOnly('zenchou');
  openOnly('diaphragm');
});
