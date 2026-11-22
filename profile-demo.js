(() => {
  const byId = id => document.getElementById(id);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = byId('pulse-toggle');
  const search = byId('order-search');
  const filters = byId('order-filters');
  const rows = byId('directory-rows');
  const dialog = byId('order-detail');
  const states = ['Yeni', 'İşlənir', 'Hazır'];
  const pageSize = 5;
  let {day,orders} = profileSchedule.snapshot();
  let paused = motion.matches;
  let statusFilter = -1;
  let dateFilter = 'today';
  let page = 0;
  let signature = '';
  const avatars = new Map();
  const hour = minute => String(Math.floor(minute/60)).padStart(2,'0') + ':' + String(minute%60).padStart(2,'0');
  const dateLabel = value => value === day ? 'Bu gün' : value === day-1 ? 'Dünən' :
    new Intl.DateTimeFormat('az',{day:'numeric',month:'short',timeZone:'UTC'}).format(value*86400000);
  const scoped = () => orders.filter(order => dateFilter === 'all' || order.day === day - (dateFilter === 'yesterday' ? 1 : 0));

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function normalize(value) {
    return value.toLocaleLowerCase('az').normalize('NFD').replace(/\p{M}/gu, '').replaceAll('ə','e').replaceAll('ı','i');
  }
  function showOrder(order) {
    byId('detail-title').textContent = order.name;
    const content = byId('detail-content');
    content.replaceChildren(...[
      'Sorğu № ' + order.id,
      'Xidmət: ' + order.service,
      'Vəziyyət: ' + states[order.phase],
      'Gediş: ' + order.progress + '%',
      'Tarix: ' + dateLabel(order.day),
      'Qəbul: ' + hour(order.received),
      (order.phase ? 'İşə başlandı: ' : 'Planlanan başlanğıc: ') + hour(order.start),
      (order.phase === 2 ? 'Təhvil: ' : 'Planlanan təhvil: ') + hour(order.finish)
    ].map(line => element('p',line)));
    dialog.showModal();
  }
  function renderTable() {
    const query = normalize(search.value.trim());
    const matching = scoped().filter(order => (statusFilter === -1 || statusFilter === order.phase)
      && normalize(order.name + ' ' + order.service).includes(query));
    const lastPage = Math.max(0, Math.ceil(matching.length / pageSize) - 1);
    page = Math.min(lastPage, page);
    const offset = page * pageSize;
    rows.replaceChildren();
    for (const order of matching.slice(offset, offset + pageSize)) {
      const row = rows.insertRow();
      const name = element('button', '', 'order-name');
      name.type = 'button';
      const avatar = element('img','', 'directory-avatar');
      avatar.alt = '';
      avatar.width = 27;
      avatar.height = 27;
      if (!avatars.has(order.name)) avatars.set(order.name, profileSchedule.avatar(order.name));
      avatar.src = avatars.get(order.name);
      name.append(avatar, order.name);
      const received = element('small',dateLabel(order.day) + ' · ' + hour(order.received), 'order-date');
      name.addEventListener('click', () => showOrder(order));
      row.insertCell().append(name,received);
      row.insertCell().textContent = order.service;
      const progress = document.createElement('progress');
      progress.max = 100;
      progress.value = order.progress;
      progress.setAttribute('aria-label','İşin gedişi');
      row.insertCell().append(progress);
      row.insertCell().append(element('span',states[order.phase],'order-state state-' + order.phase));
    }
    if (!matching.length) {
      const cell = rows.insertRow().insertCell();
      cell.colSpan = 4;
      cell.textContent = 'Uyğun demo sifarişi tapılmadı.';
    }
    byId('order-results').textContent = matching.length ? (offset + 1) + '–' + Math.min(offset + pageSize, matching.length) + ' / ' + matching.length : '0 nəticə';
    byId('order-prev').disabled = page === 0;
    byId('order-next').disabled = page >= lastPage;
    [...filters.children].forEach((button,index) => {
      const phase = index - 1;
      const count = phase === -1 ? scoped().length : scoped().filter(order => order.phase === phase).length;
      button.textContent = (states[phase] || 'Hamısı') + ' · ' + count;
      button.setAttribute('aria-pressed', phase === statusFilter);
    });
  }
  function renderSignal() {
    const recent = scoped().slice(0, 15).reverse();
    byId('pulse-points').replaceChildren(...recent.map((order, index) => {
      const point = element('button','', 'pulse-dot state-' + order.phase);
      point.type = 'button';
      point.style.left = (5 + index * 90 / Math.max(1,recent.length - 1)) + '%';
      point.style.top = (83 - order.progress * .66 + Math.sin(order.id * 1.7) * 8) + '%';
      point.title = order.name + ' · ' + states[order.phase] + ' · ' + hour(order.received);
      point.setAttribute('aria-label', point.title);
      point.addEventListener('click', () => showOrder(order));
      return point;
    }));
    const counts = [0,0,0];
    for (const order of orders) {
      if (order.day === day) counts[order.phase]++;
    }
    const [waiting, working, done] = counts;
    const received = waiting + working + done;
    byId('pulse-value').textContent = waiting + working;
    byId('pulse-total').textContent = received ? 'Bu gün ' + received + ' demo sifarişi daxil olub' : 'Bu gün demo sifarişi hələ daxil olmayıb';
    byId('meter-new').textContent = waiting + ' yeni';
    byId('meter-working').textContent = working + ' işlənir';
    byId('meter-done').textContent = done + ' hazır';
    const track = byId('pulse-bars');
    for (const [index, count] of [done,working,waiting].entries()) {
      track.children[index].style.flexBasis = (received ? count / received * 100 : 0) + '%';
    }
    const activity = orders.flatMap(order => [
      {order,phase:0,time:order.received},
      ...(order.phase >= 1 ? [{order,phase:1,time:order.start}] : []),
      ...(order.phase === 2 ? [{order,phase:2,time:order.finish}] : [])
    ]).sort((a,b) => b.order.day-a.order.day || b.time-a.time).slice(0,5);
    byId('pulse-log').replaceChildren(...activity.map(({order,phase,time}) => {
      const item = element('li');
      item.append(element('strong', order.service),
        element('span', order.name + ' · ' + states[phase]),
        element('span', dateLabel(order.day) + ' · ' + hour(time)));
      return item;
    }));
  }
  function refresh() {
    if (paused || document.hidden || dialog.open) return;
    const focused = document.activeElement;
    if (rows.contains(focused) || byId('pulse-points').contains(focused)) return;
    const next = profileSchedule.snapshot();
    const nextSignature = next.day + ':' + next.orders.filter(order => order.day === next.day)
      .map(order => [order.id,order.phase,order.progress].join('/')).join(',');
    if (nextSignature === signature) return;
    signature = nextSignature;
    ({day,orders} = next);
    renderTable();
    renderSignal();
  }
  function setToggle() {
    toggle.textContent = paused ? 'Başlat' : 'Dayandır';
    toggle.setAttribute('aria-pressed', String(!paused));
  }
  for (const [index, label] of ['Hamısı', ...states].entries()) {
    const button = element('button',label);
    button.type = 'button';
    button.addEventListener('click', () => {
      statusFilter = index - 1;
      page = 0;
      renderTable();
    });
    filters.append(button);
  }
  search.addEventListener('input', () => { page = 0; renderTable(); });
  byId('order-prev').addEventListener('click', () => { page--; renderTable(); });
  byId('order-next').addEventListener('click', () => { page++; renderTable(); });
  byId('order-period').addEventListener('change', event => {
    dateFilter = event.target.value;
    page = 0;
    renderTable();
    renderSignal();
  });
  toggle.addEventListener('click', () => {
    paused = !paused;
    setToggle();
    refresh();
  });
  motion.addEventListener('change', event => {
    paused = event.matches;
    setToggle();
    refresh();
  });
  renderTable();
  renderSignal();
  setToggle();
  toggle.hidden = false;
  setInterval(refresh, 30000);
  document.addEventListener('visibilitychange',refresh);
})();
