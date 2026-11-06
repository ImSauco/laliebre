// Build the mobile view from the same table, keeping one source of plan content.
document.querySelectorAll('#gratis .table-scroll, #trail .table-scroll').forEach((wrap, index) => {
  const table = wrap.querySelector('table');
  const days = [...table.querySelectorAll('thead th')].slice(1);
  const mobile = document.createElement('div');
  mobile.className = 'plan-days';
  table.querySelectorAll('tbody tr').forEach((row, index) => {
    const week = document.createElement('details');
    week.open = index === 0;
    const heading = document.createElement('summary');
    heading.textContent = row.querySelector('th').textContent;
    week.append(heading);
    [...row.querySelectorAll('td')].forEach((cell, day) => {
      const item = document.createElement('p');
      const label = document.createElement('strong');
      label.textContent = days[day].textContent + ': ';
      item.append(label, ...[...cell.childNodes].map(node => node.cloneNode(true)));
      week.append(item);
    });
    mobile.append(week);
  });
  wrap.after(mobile);
  wrap.classList.add('has-mobile-view');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'plan-print btn-primary';
  button.textContent = 'IMPRIMIR / GUARDAR PDF';
  button.addEventListener('click', () => {
    const printTable = table.cloneNode(true);
    printTable.classList.add('print-plan');
    document.body.append(printTable);
    document.body.classList.add('printing-plan');
    window.print();
  });
  mobile.after(button);

  const carousel = document.createElement('div');
  carousel.className = 'plan-months';
  const viewport = document.createElement('div');
  viewport.className = 'plan-month-viewport';
  const track = document.createElement('div');
  track.className = 'plan-month-track';
  track.id = `plan-months-${index}`;
  const currentMonth = document.createElement('div');
  currentMonth.className = 'plan-month-current';
  const nextMonth = document.createElement('div');
  nextMonth.className = 'plan-month-locked';
  nextMonth.inert = true;
  nextMonth.setAttribute('aria-hidden', 'true');

  // The free table is reused only as a blurred preview, not as next month's plan.
  const preview = document.createElement('div');
  preview.className = 'plan-month-preview';
  preview.setAttribute('aria-hidden', 'true');
  preview.inert = true;
  const previewTable = table.cloneNode(true);
  previewTable.querySelector('caption').textContent = 'Siguiente mes';
  previewTable.querySelectorAll('tbody th').forEach((cell, week) => {
    cell.textContent = `Semana ${week + 5}`;
  });
  previewTable.querySelectorAll('a').forEach(link => {
    link.replaceWith(document.createTextNode(link.textContent));
  });
  preview.append(previewTable);

  const invitation = document.createElement('div');
  invitation.className = 'plan-month-invitation';
  const message = document.createElement('p');
  message.textContent = 'Para ver los siguientes meses, suscríbete por 29,99€ al mes';
  const contact = document.createElement('a');
  contact.className = 'btn-primary';
  contact.href = 'contacto.html';
  contact.textContent = 'SUSCRIBIRME ↗';
  invitation.append(message, contact);
  nextMonth.append(preview, invitation);

  wrap.before(carousel);
  currentMonth.append(wrap, mobile);
  track.append(currentMonth, nextMonth);
  viewport.append(track);
  const navigation = document.createElement('div');
  navigation.className = 'plan-month-navigation';
  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.className = 'btn-primary';
  nextButton.textContent = 'Ver siguiente mes';
  nextButton.setAttribute('aria-controls', track.id);
  const monthStatus = document.createElement('span');
  monthStatus.setAttribute('aria-live', 'polite');
  monthStatus.textContent = 'Mes 1 · Gratis';
  nextButton.addEventListener('click', () => {
    const locked = carousel.classList.toggle('show-next-month');
    currentMonth.inert = locked;
    currentMonth.setAttribute('aria-hidden', String(locked));
    nextMonth.inert = !locked;
    nextMonth.setAttribute('aria-hidden', String(!locked));
    nextButton.textContent = locked ? 'Volver al mes gratuito' : 'Ver siguiente mes';
    monthStatus.textContent = locked ? 'Siguientes meses · Con suscripción' : 'Mes 1 · Gratis';
  });
  navigation.append(button, monthStatus, nextButton);
  carousel.append(viewport, navigation);
});
window.addEventListener('afterprint', () => {
  document.body.classList.remove('printing-plan');
  document.querySelectorAll('body > .print-plan').forEach(table => table.remove());
});
document.querySelectorAll('.site-menu a').forEach(link => {
  link.addEventListener('click', () => link.closest('details').removeAttribute('open'));
});

// The first click outside closes the menu without activating the page behind it.
document.addEventListener('click', event => {
  const menu = document.querySelector('.site-menu[open]');
  if (!menu || menu.contains(event.target)) return;
  menu.open = false;
  event.preventDefault();
  event.stopPropagation();
}, true);

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const menu = document.querySelector('.site-menu[open]');
  if (!menu) return;
  menu.open = false;
  menu.querySelector('summary').focus();
});
