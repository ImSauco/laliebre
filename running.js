const distancePanels = [...document.querySelectorAll('[data-asphalt-distance]')];
function showGoal(panel) {
  const selected = panel.querySelector('[data-goal-select]').value;
  panel.querySelectorAll('[data-goal-panel]').forEach(goal => {
    goal.hidden = goal.dataset.goalPanel !== selected;
  });
}
function showPlan(distance) {
  if (!distancePanels.some(panel => panel.dataset.asphaltDistance === String(distance))) return;
  distancePanels.forEach(panel => { panel.hidden = panel.dataset.asphaltDistance !== String(distance); });
  document.querySelectorAll('[data-plan]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.plan === String(distance))));
}
distancePanels.forEach(panel => {
  panel.querySelector('[data-goal-select]').addEventListener('change', () => showGoal(panel));
  showGoal(panel);
  panel.querySelectorAll('[data-plan-controls]').forEach(control => { control.hidden = false; });
});
document.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => showPlan(button.dataset.plan)));
document.querySelectorAll('[data-distance]').forEach(link => link.addEventListener('click', () => showPlan(link.dataset.distance)));
showPlan(distancePanels[0]?.dataset.asphaltDistance);
document.querySelector('#gratis [data-plan-controls]').hidden = false;
