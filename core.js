document.querySelectorAll('[data-print]').forEach(button => {
  button.addEventListener('click', () => {
    const routine = document.getElementById(button.dataset.print);
    document.body.dataset.printRoutine = routine.id;
    routine.classList.add('print-selected');
    window.print();
  });
});
window.addEventListener('afterprint', () => {
  delete document.body.dataset.printRoutine;
  document.querySelectorAll('.print-selected').forEach(routine => routine.classList.remove('print-selected'));
});

// Remember progress on this device; storage may be disabled by the browser.
const progressKey = document.body.dataset.progressKey || 'laliebre-core-circuit-progress-v2';
const checkboxes = [...document.querySelectorAll('.routine input[type="checkbox"]')];
try {
  const saved = JSON.parse(localStorage.getItem(progressKey) || '[]');
  checkboxes.forEach((checkbox, index) => { checkbox.checked = saved[index] === true; });
} catch { /* The routines also work without browser storage. */ }
checkboxes.forEach(checkbox => checkbox.addEventListener('change', () => {
  try { localStorage.setItem(progressKey, JSON.stringify(checkboxes.map(input => input.checked))); } catch {}
}));
const reset = document.createElement('button');
reset.type = 'button';
reset.className = 'btn-primary';
reset.textContent = 'REINICIAR CASILLAS';
reset.addEventListener('click', () => {
  checkboxes.forEach(input => { input.checked = false; });
  try { localStorage.removeItem(progressKey); } catch {}
});
const progressNote = document.createElement('p');
progressNote.textContent = 'Las casillas se guardan en este navegador cuando el almacenamiento está disponible.';
document.querySelector('.core-guide').append(progressNote, reset);

const levels = [...document.querySelectorAll('input[name="nivel"]')];
function updateLevel() {
  const rounds = Number(levels.find(input => input.checked).value);
  document.querySelectorAll('[data-round]').forEach(label => {
    label.hidden = Number(label.dataset.round) > rounds;
  });
  document.getElementById('level-summary').textContent = [
    'Básico: completa el circuito una vez.',
    'Intermedio: completa el circuito dos veces.',
    'Avanzado: completa el circuito tres veces.'
  ][rounds - 1];
}
levels.forEach(input => input.addEventListener('change', updateLevel));
updateLevel();
