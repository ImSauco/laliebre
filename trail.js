const trailPanels = [...document.querySelectorAll('[data-trail-panel]')];
function showTrail(key) {
  if (!trailPanels.some(panel => panel.dataset.trailPanel === key)) return;
  trailPanels.forEach(panel => { panel.hidden = panel.dataset.trailPanel !== key; });
  document.querySelectorAll('[data-trail]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.trail === key)));
}
document.querySelectorAll('[data-trail]').forEach(button => button.addEventListener('click', () => showTrail(button.dataset.trail)));
showTrail(trailPanels[0]?.dataset.trailPanel);
document.querySelector('#trail [data-plan-controls]').hidden = false;
