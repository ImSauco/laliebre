// Race dates checked against the organisers on 6 November 2026.
// null means that the 2027 date has not been verified: accept enquiries only.
const MARATHON_PACKS_2027 = Object.freeze([
  { id: 'madrid', city: 'Madrid', group: 'spain', date: '2027-04-25', source: 'https://rocknrollmadridrun.com/informacion-general/' },
  { id: 'barcelona', city: 'Barcelona', group: 'spain', date: '2027-03-14', source: 'https://zurichmaratobarcelona.es/' },
  { id: 'malaga', city: 'Málaga', group: 'spain', date: null, source: 'https://www.generalimaratonmalaga.com/' },
  { id: 'sevilla', city: 'Sevilla', group: 'spain', date: '2027-02-21', source: 'https://www.zurichmaratonsevilla.es/zms-preguntas-frecuentes' },
  { id: 'valencia', city: 'Valencia', group: 'spain', date: null, source: 'https://www.valenciaciudaddelrunning.com/maraton/reglamento-maraton-valencia/' },
  { id: 'alicante', city: 'Alicante', group: 'spain', date: null, source: 'https://maratonelchealicante.com/' },
  { id: 'tokio', city: 'Tokio', group: 'majors', date: '2027-03-07', source: 'https://www.marathon.tokyo/en/' },
  { id: 'boston', city: 'Boston', group: 'majors', date: '2027-04-19', source: 'https://www.baa.org/races/boston-marathon/history/' },
  { id: 'londres', city: 'Londres', group: 'majors', date: '2027-04-24', endDate: '2027-04-25', source: 'https://www.londonmarathonevents.co.uk/london-marathon/event-overview' },
  { id: 'ciudad-del-cabo', city: 'Ciudad del Cabo', group: 'majors', date: '2027-05-23', source: 'https://www.worldmarathonmajors.com/cape-town-major' },
  { id: 'sidney', city: 'Sídney', group: 'majors', date: '2027-08-29', source: 'https://www.tcssydneymarathon.com/marathon' },
  { id: 'berlin', city: 'Berlín', group: 'majors', date: '2027-09-26', source: 'https://www.generali-berlin-marathon.com/en' },
  { id: 'chicago', city: 'Chicago', group: 'majors', date: '2027-10-10', source: 'https://www.chicagomarathon.com/' },
  { id: 'nueva-york', city: 'Nueva York', group: 'majors', date: '2027-11-07', source: 'https://prod.nyrr.org/tcsnycmarathon/home' }
]);

function packDeadline(pack) {
  if (!pack.date) return null;
  const [year, month] = pack.date.split('-').map(Number);
  // March race -> 25 December of the previous year; Jan–Mar preparation.
  return new Date(Date.UTC(year, month - 4, 25)).toISOString().slice(0, 10);
}

function madridCalendarDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(now);
  const part = type => parts.find(item => item.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function packAvailability(pack, now = new Date()) {
  const deadline = packDeadline(pack);
  return !deadline ? 'pending' : madridCalendarDay(now) <= deadline ? 'open' : 'closed';
}

function formatPackDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(`${date}T12:00:00Z`));
}

function updatePackCards() {
  document.querySelectorAll('[data-marathon-pack]').forEach(card => {
    const pack = MARATHON_PACKS_2027.find(item => item.id === card.dataset.marathonPack);
    if (!pack) return;
    const state = packAvailability(pack);
    const link = card.querySelector('.btn-primary');
    const deadline = card.querySelector('.race-pack-closing');
    card.dataset.availability = state;
    if (state === 'closed') {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      link.textContent = 'PLAZO FINALIZADO';
      deadline.textContent = `Plazo finalizado el ${formatPackDate(packDeadline(pack))}.`;
    } else {
      link.href = `contacto.html?pack=${pack.id}`;
      link.removeAttribute('aria-disabled');
      link.textContent = state === 'pending' ? 'CONSULTAR PRÓXIMA EDICIÓN ↗' : 'SOLICITAR PACK ↗';
      deadline.textContent = state === 'pending'
        ? 'Fecha y plazo pendientes de confirmar. Consulta informativa; contratación aún no disponible.'
        : `Solicítalo hasta el ${formatPackDate(packDeadline(pack))}, incluido (horario de España peninsular).`;
    }
  });
}
updatePackCards();
setInterval(updatePackCards, 60000);
document.addEventListener('visibilitychange', updatePackCards);
