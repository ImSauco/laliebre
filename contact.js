const form = document.getElementById('request-form');
const selectedPlan = new URLSearchParams(window.location.search).get('plan');
if (['app', 'personalizado'].includes(selectedPlan)) form.elements.plan.value = selectedPlan;
const selectedPack = new URLSearchParams(window.location.search).get('pack');
if (MARATHON_PACKS_2027.some(pack => pack.id === selectedPack)) {
  form.elements.plan.value = `pack-${selectedPack}`;
}
function currentMarathonPack() {
  return MARATHON_PACKS_2027.find(pack => `pack-${pack.id}` === form.elements.plan.value);
}
const packNotice = document.createElement('p');
packNotice.className = 'form-status info visible';
packNotice.setAttribute('role', 'status');
function checkPackRequest() {
  const selectedMarathonPack = currentMarathonPack();
  if (!selectedMarathonPack) {
    packNotice.hidden = true;
    return true;
  }
  packNotice.hidden = false;
  const state = packAvailability(selectedMarathonPack);
  packNotice.textContent = state === 'closed'
    ? `El plazo del pack ${selectedMarathonPack.city} 2027 terminó el ${formatPackDate(packDeadline(selectedMarathonPack))}. Ya no se admiten solicitudes para esta oferta; puedes elegir otra modalidad.`
    : state === 'pending'
      ? 'La fecha de esta edición está pendiente de confirmar. Puedes enviar una consulta, pero el pack todavía no está disponible para contratar.'
      : `Pack de 3 meses por 179,97 € en pago único. Plazo hasta el ${formatPackDate(packDeadline(selectedMarathonPack))}, incluido. Confirmaremos los datos y el pago por email.`;
  return state !== 'closed';
}
let generatedPackMessage = '';
function updatePackSelection() {
  const pack = currentMarathonPack();
  if (pack) {
    form.elements.distancia.value = 'Maratón';
    if (!form.elements.mensaje.value || form.elements.mensaje.value === generatedPackMessage) {
      generatedPackMessage = `Me interesa el Pack Maratón de ${pack.city} 2027: 3 meses de preparación por 179,97 € en pago único.\nMi experiencia: \nMi objetivo: `;
      form.elements.mensaje.value = generatedPackMessage;
    }
  } else if (generatedPackMessage && form.elements.mensaje.value === generatedPackMessage) {
    form.elements.mensaje.value = '';
    generatedPackMessage = '';
  }
  checkPackRequest();
}
form.elements.plan.after(packNotice);
form.elements.plan.addEventListener('change', updatePackSelection);
updatePackSelection();
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!checkPackRequest()) { packNotice.scrollIntoView({ block: 'center' }); return; }
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const body = document.getElementById('email-body').content.textContent.replace(/\{\{(\w+)\}\}/g, (_, field) => {
    const input = form.elements.namedItem(field);
    return input?.tagName === 'SELECT' ? input.selectedOptions[0].textContent : data.get(field) || '';
  });
  window.location.href = `${form.getAttribute('action')}?subject=${encodeURIComponent(form.dataset.emailSubject)}&body=${encodeURIComponent(body)}`;
  document.getElementById('status').textContent = document.getElementById('email-status').content.textContent;
});
