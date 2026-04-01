'use strict';

const STORAGE_KEY = 'osc_clipboard_items';

let items = [];

const container = document.getElementById('items-container');
const empty     = document.getElementById('empty');
const addBtn    = document.getElementById('add-btn');

// ── Icons ──────────────────────────────────────────────────────────────────

function makeCopyIcon() {
  return `<svg width="13" height="13" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="8" height="9" rx="1.2" stroke="currentColor" stroke-width="1.4"/>
    <path d="M2 10V2.8A.8.8 0 012.8 2H10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
  </svg>`;
}

function makeCheckIcon() {
  return `<svg width="13" height="13" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 7l4 4 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function makeDeleteIcon() {
  return `<svg width="13" height="13" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`;
}

// ── Render ─────────────────────────────────────────────────────────────────

function updateEmpty() {
  empty.style.display = items.length === 0 ? 'flex' : 'none';
}

function createItemEl(item) {
  const el = document.createElement('div');
  el.className = 'item';
  el.dataset.id = item.id;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'item-input';
  input.placeholder = 'Paste or type…';
  input.value = item.text || '';
  input.spellcheck = false;

  const actionBtn = document.createElement('button');
  actionBtn.className = 'action-btn';

  function updateButton() {
    const isEmpty = input.value.trim() === '';
    actionBtn.innerHTML = isEmpty ? makeDeleteIcon() : makeCopyIcon();
    actionBtn.title = isEmpty ? 'Delete item' : 'Copy to clipboard';
    actionBtn.classList.toggle('delete-btn', isEmpty);
  }

  input.addEventListener('input', () => {
    item.text = input.value;
    chrome.storage.local.set({ [STORAGE_KEY]: items });
    updateButton();
  });

  actionBtn.addEventListener('click', async () => {
    if (input.value.trim() === '') {
      // Delete
      items = items.filter(i => i.id !== item.id);
      chrome.storage.local.set({ [STORAGE_KEY]: items });
      el.remove();
      updateEmpty();
    } else {
      // Copy
      try {
        await navigator.clipboard.writeText(input.value);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = input.value;
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      actionBtn.classList.add('copied');
      actionBtn.innerHTML = makeCheckIcon();
      setTimeout(() => {
        actionBtn.classList.remove('copied');
        actionBtn.innerHTML = makeCopyIcon();
      }, 1500);
    }
  });

  updateButton();
  el.appendChild(input);
  el.appendChild(actionBtn);
  return el;
}

function render() {
  container.querySelectorAll('.item').forEach(el => el.remove());
  items.forEach(item => container.appendChild(createItemEl(item)));
  updateEmpty();
}

// ── Add item ───────────────────────────────────────────────────────────────

addBtn.addEventListener('click', () => {
  const item = { id: Date.now().toString(), text: '' };
  items.push(item);
  const el = createItemEl(item);
  container.appendChild(el);
  updateEmpty();
  chrome.storage.local.set({ [STORAGE_KEY]: items });
  setTimeout(() => {
    el.querySelector('.item-input').focus();
    container.scrollTop = container.scrollHeight;
  }, 20);
});

// ── Init ───────────────────────────────────────────────────────────────────

chrome.storage.local.get([STORAGE_KEY], (result) => {
  items = Array.isArray(result[STORAGE_KEY]) ? result[STORAGE_KEY] : [];
  render();
});
