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
