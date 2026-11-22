const pulseToggle = document.querySelector('#pulse-toggle');
const pulseValue = document.querySelector('#pulse-value');
const pulsePoints = document.querySelector('#pulse-points');
const pulseBars = document.querySelector('#pulse-bars');
const pulseLog = document.querySelector('#pulse-log');
const pulseMotion = matchMedia('(prefers-reduced-motion: reduce)');
const demoEvents = [
  ['Önizləmə hazırlandı','Vitrin'],
  ['Fayllar yoxlanıldı','Portfolio'],
  ['Panel yeniləndi','Profil'],
  ['Konsept kartı açıldı','Portfolio'],
  ['Maketi yoxlama tamamlandı','Vitrin'],
  ['Dizayn paketi önizləndi','Kataloq']
];

const dots = Array.from({length:24}, (_, index) => {
  const dot = document.createElement('i');
  dot.className = 'pulse-dot';
  dot.style.left = (5 + index * 90 / 23) + '%';
  pulsePoints.append(dot);
  return dot;
});
const bars = Array.from({length:9}, () => pulseBars.appendChild(document.createElement('i')));

let pulsePaused = pulseMotion.matches;
let latency = 34;
let lastEvent = 0;
function paintSignal() {
  dots.forEach(dot => {
    dot.style.top = (14 + Math.random() * 75) + '%';
    dot.style.opacity = String(0.45 + Math.random() * 0.55);
  });
  bars.forEach(bar => bar.style.setProperty('--height', (20 + Math.random() * 73) + '%'));
}
function tickPulse() {
  if (pulsePaused || document.hidden) return;
  latency = Math.max(22, Math.min(54, latency + Math.floor(Math.random() * 11) - 5));
  pulseValue.firstChild.nodeValue = latency + ' ';
  paintSignal();
  lastEvent = (lastEvent + 1 + Math.floor(Math.random() * (demoEvents.length - 1))) % demoEvents.length;
  const row = pulseLog.insertRow(0);
  for (const label of demoEvents[lastEvent]) row.insertCell().textContent = label;
  const state = document.createElement('span');
  state.textContent = 'Hazır';
  row.insertCell().append(state);
  pulseLog.deleteRow(-1);
}
function updatePulseButton() {
  pulseToggle.textContent = pulsePaused ? 'Başlat' : 'Dayandır';
}
pulseToggle.addEventListener('click', () => {
  pulsePaused = !pulsePaused;
  updatePulseButton();
  if (!pulsePaused) tickPulse();
});
pulseMotion.addEventListener('change', event => {
  pulsePaused = event.matches;
  updatePulseButton();
});
paintSignal();
updatePulseButton();
pulseToggle.hidden = false;
setInterval(tickPulse, 4200);
