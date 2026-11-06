const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('packs-2027.js', 'utf8');
const updates = [];
const nodes = [];
const context = vm.createContext({ Intl, Date, document: {
  querySelectorAll: () => nodes, addEventListener() {}
}, setInterval: callback => updates.push(callback) });
vm.runInContext(source, context);
const evaluate = expression => vm.runInContext(expression, context);
assert.equal(evaluate('MARATHON_PACKS_2027.length'), 14);
assert.equal(evaluate('MARATHON_PACKS_2027.filter(p => p.group === "majors").length'), 8);
assert.equal(evaluate('packDeadline({date:"2027-03-14"})'), '2026-12-25');
assert.equal(evaluate('packDeadline({date:"2027-02-21"})'), '2026-11-25');
assert.equal(evaluate('packDeadline({date:"2027-01-10"})'), '2026-10-25');
assert.equal(evaluate('packDeadline({date:null})'), null);
assert.equal(evaluate('packAvailability({date:null})'), 'pending');
assert.equal(evaluate('packAvailability({date:"2027-03-14"},new Date("2026-12-25T22:59:59Z"))'), 'open');
assert.equal(evaluate('packAvailability({date:"2027-03-14"},new Date("2026-12-25T23:00:00Z"))'), 'closed');
assert.equal(evaluate('packAvailability({date:"2027-10-10"},new Date("2027-07-25T21:59:59Z"))'), 'open');
assert.equal(evaluate('packAvailability({date:"2027-10-10"},new Date("2027-07-25T22:00:00Z"))'), 'closed');
const html = fs.readFileSync('index.html', 'utf8');
for (const pack of evaluate('MARATHON_PACKS_2027')) {
  assert.ok(html.includes(`data-marathon-pack="${pack.id}"`));
  assert.ok(html.includes(`contacto.html?pack=${pack.id}`));
}
assert.equal(updates.length, 1);

// A direct URL for a closed pack must not open an email request.
function contactScenario(packId, now) {
  const handlers = {};
  const notice = { setAttribute() {}, scrollIntoView() {} };
  const elements = {
    plan: { value: 'app', append() {}, after() {}, addEventListener: (type, callback) => { handlers.planChange = callback; } },
    distancia: {}, mensaje: { value: '' }
  };
  const form = { elements, addEventListener: (type, callback) => { handlers[type] = callback; }, reportValidity() { throw Error('Closed pack passed validation guard'); } };
  class TestDate extends Date { constructor(value) { super(value === undefined ? now : value); } }
  const sandbox = vm.createContext({ URLSearchParams, Intl, Date: TestDate,
    window: { location: { search: `?pack=${packId}` } },
    document: { querySelectorAll: () => [], addEventListener() {}, getElementById: () => form, createElement: tag => tag === 'p' ? notice : {} }, setInterval() {}
  });
  vm.runInContext(source, sandbox);
  vm.runInContext(fs.readFileSync('contact.js', 'utf8'), sandbox);
  return { handlers, notice, sandbox, elements };
}
let result = contactScenario('sevilla', '2026-11-26T00:00:00Z');
result.handlers.submit({ preventDefault() {} });
assert.match(result.notice.textContent, /Ya no se admiten/);
assert.equal(result.sandbox.window.location.href, undefined);
result = contactScenario('alicante', '2026-11-06T12:00:00Z');
assert.match(result.notice.textContent, /todavía no está disponible para contratar/);
result = contactScenario('chicago', '2026-11-06T12:00:00Z');
assert.equal(result.elements.plan.value, 'pack-chicago');
assert.match(result.notice.textContent, /179,97/);
result = contactScenario('', '2026-11-06T12:00:00Z');
assert.equal(result.notice.hidden, true);
result.elements.plan.value = 'pack-barcelona';
result.handlers.planChange();
assert.equal(result.elements.distancia.value, 'Maratón');
assert.match(result.elements.mensaje.value, /Barcelona 2027/);
assert.match(result.notice.textContent, /25 de diciembre de 2026/);
result.elements.plan.value = 'pack-madrid';
result.handlers.planChange();
assert.match(result.elements.mensaje.value, /Madrid 2027/);
result.elements.mensaje.value = 'Mensaje personal del cliente';
result.elements.plan.value = 'pack-boston';
result.handlers.planChange();
assert.equal(result.elements.mensaje.value, 'Mensaje personal del cliente');
result.elements.plan.value = 'app';
result.handlers.planChange();
assert.equal(result.notice.hidden, true);
console.log('OK: 14 packs, 8 Majors, winter/summer cutoff boundaries in Madrid, pending dates, and expired direct contact links.');
