const form = document.getElementById('request-form');
const selectedPlan = new URLSearchParams(window.location.search).get('plan');
if (['app', 'personalizado'].includes(selectedPlan)) form.elements.plan.value = selectedPlan;
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const body = document.getElementById('email-body').content.textContent.replace(/\{\{(\w+)\}\}/g, (_, field) => {
    const input = form.elements.namedItem(field);
    return input?.tagName === 'SELECT' ? input.selectedOptions[0].textContent : data.get(field) || '';
  });
  window.location.href = `${form.getAttribute('action')}?subject=${encodeURIComponent(form.dataset.emailSubject)}&body=${encodeURIComponent(body)}`;
  document.getElementById('status').textContent = document.getElementById('email-status').content.textContent;
});
