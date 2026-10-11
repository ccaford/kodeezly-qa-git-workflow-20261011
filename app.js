'use strict';
const storageKey = 'kodeezly-synthetic-trail-notes-v1';
const form = document.getElementById('observation-form');
const list = document.getElementById('observations');
const status = document.getElementById('status');
let observations = [];
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) observations = saved.filter(item => item && typeof item.id === 'string' && typeof item.trail === 'string' && ['clear', 'muddy', 'closed'].includes(item.condition));
} catch {
  status.textContent = 'Saved observations could not be read.';
}
function persist(next) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
    observations = next;
    render();
    return true;
  } catch {
    status.textContent = 'Storage is unavailable. Your observation was not saved.';
    return false;
  }
}
function render() {
  list.replaceChildren();
  document.getElementById('empty').hidden = observations.length > 0;
  for (const observation of observations) {
    const item = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = `${observation.trail} — ${observation.condition}`;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Delete';
    remove.setAttribute('aria-label', `Delete ${observation.trail}`);
    remove.addEventListener('click', () => {
      if (persist(observations.filter(value => value.id !== observation.id))) status.textContent = 'Observation deleted.';
    });
    item.append(label, remove);
    list.append(item);
  }
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const trail = document.getElementById('trail').value.trim();
  if (!trail) return;
  const observation = { id: crypto.randomUUID(), trail, condition: document.getElementById('condition').value };
  if (persist([...observations, observation])) {
    form.reset();
    status.textContent = 'Observation saved.';
  }
});
render();
