// Uydurma demo qeydləri. Şəbəkədən məlumat alınmır.
const profileSampleNames = (() => {
  const givenNames = ['Aylin','Nərmin','Leyla','Günel','Aysel','Sevinc','Səbinə','Fidan','Zəhra','Nigar',
    'Murad','Elvin','Orxan','Tural','Rəşad','Kənan','Emin','Fərid','Nurlan','Rauf'];
  const familyNames = ['Əliyev','Məmmədov','Hüseynov','Həsənov','Quliyev','İbrahimov','Rzayev','Səfərov','Əhmədov','İsmayılov',
    'Cabbarov','Abbasov','Mustafayev','Hacıyev','Qasımov','Şirinov','Bağırov','Babayev','Ələkbərov','Sultanov'];
  return givenNames.flatMap((given, index) => Array.from({length:5}, (_, offset) => {
    const family = familyNames[(index * 3 + offset * 7) % familyNames.length];
    return given + ' ' + family + (index < 10 ? 'a' : '');
  }));
})();

// Sabit Bakı təqvimi. Eyni tarix və saat eyni demo vəziyyətini verir.
const profileSchedule = (() => {
  const dateFormat = new Intl.DateTimeFormat('en-GB', {
    timeZone:'Asia/Baku', year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', hourCycle:'h23'
  });
  const dayMs = 86400000;
  const anchor = Date.UTC(2025,0,1) / dayMs;
  // Sabit sərhədlər: hər yeni versiyada demo hesabı eyni tarixdən başlayır.
  const ledgerStart = Date.UTC(2026,0,1) / dayMs;
  const growthStart = Date.UTC(2026,7,22) / dayMs;
  const scheduledStart = Date.UTC(2026,10,22) / dayMs;
  const regularNames = ['Fidan Rzayeva','Aysel Quliyeva','Nərmin Həsənova','Leyla Hüseynova','Rauf Sultanov'];
  const profiles = [...regularNames, ...profileSampleNames].filter((name,index,list) => list.indexOf(name) === index);
  const women = profiles.filter(name => name.endsWith('a') && name !== regularNames[4]);
  const men = profiles.filter(name => !women.includes(name));

  function random(seed) {
    let state = seed >>> 0;
    return (min,max) => {
      state = (Math.imul(1664525,state) + 1013904223) >>> 0;
      return min + Math.floor(state / 4294967296 * (max - min + 1));
    };
  }
  function shuffle(items, pick) {
    for (let i=items.length-1; i>0; i--) {
      const j=pick(0,i);
      [items[i],items[j]]=[items[j],items[i]];
    }
    return items;
  }
  function occurs(day, low, high, seed) {
    const pick = random(seed);
    if (day < anchor) return false;
    let current = anchor + pick(0,high-1);
    while (current < day) current += pick(low,high);
    return current === day;
  }
  function historicalCount(day) {
    const pick = random(Math.imul(day,2246822519) ^ 0x40c9a23b);
    return day < growthStart ? pick(5,7) : pick(10,15);
  }

  function plan(day) {
    const pick = random(Math.imul(day,2654435761));
    const first = shuffle([...regularNames],pick);
    const second = shuffle(regularNames.filter(() => pick(0,1)),pick);
    const guestCount = pick(0,3);
    const dailyCount = day >= scheduledStart ? first.length + second.length + guestCount : historicalCount(day);
    const extras = Math.max(0,dailyCount-first.length-second.length);
    const guestPool = profiles.filter(name => !regularNames.includes(name));
    const used = new Set(regularNames);
    const arrivals = [...first,...second].slice(0,dailyCount);
    for (let i=0; i<extras; i++) {
      const pool = (pick(1,10) <= 2 ? women : men).filter(name => guestPool.includes(name) && !used.has(name));
      const name = pool[pick(0,pool.length-1)];
      used.add(name);
      arrivals.splice(pick(1,arrivals.length),0,name);
    }
    const special = [];
    if (occurs(day,3,6,9451)) special.push('Loqo dizaynı');
    if (occurs(day,4,7,4827)) special.push('Vizit kart');
    const specialSlots = shuffle(arrivals.map((_,index) => index),pick).slice(0,special.length);
    const opening = 9 * 60 + 20;
    const slot = Math.floor(550 / arrivals.length);
    return arrivals.map((name,index) => {
      const received = opening + index * slot + pick(0,Math.min(slot-1,21));
      const start = received + 20;
      const finish = received + pick(120,Math.min(240,23*60+30-received));
      return {
        id: day + '-' + (index+1), day, name, received, start, finish,
        service: special[specialSlots.indexOf(index)] || (pick(1,10) <= 7 ? 'Sosial media posteri' : 'Reklam vizualı')
      };
    });
  }
  function snapshot(now = new Date()) {
    const parts = Object.fromEntries(dateFormat.formatToParts(now).map(part => [part.type,part.value]));
    const day = Date.UTC(+parts.year,+parts.month-1,+parts.day) / dayMs;
    const minute = +parts.hour*60 + +parts.minute;
    const visibleDays = Math.min(15,Math.max(0,day-ledgerStart+1));
    const orders = Array.from({length:visibleDays},(_,index) => plan(day-index)).flat()
      .filter(order => order.day < day || order.received <= minute)
      .map(order => {
        const phase = order.day < day || minute >= order.finish ? 2 : minute >= order.start ? 1 : 0;
        const progress = phase === 2 ? 100 : phase === 0 ? 0 :
          Math.min(99,Math.round(100 * (minute-order.start)/(order.finish-order.start)));
        return {...order,phase,progress};
      }).sort((a,b) => b.day-a.day || b.received-a.received);
    return {day,minute,orders};
  }

  function avatar(name) {
    const seed = [...name].reduce((value,char) => Math.imul(value,31) + char.codePointAt(0),7);
    const pick = random(seed);
    const hue = pick(0,359);
    const skin = ['#f9cba9','#d99c77','#edb789','#b87555'][pick(0,3)];
    const shadow = ['#d49276','#a86047','#ba7656'][pick(0,2)];
    const hair = ['#322137','#442b2a','#242337','#6b4131'][pick(0,3)];
    const female = women.includes(name);
    const longHair = female && pick(0,1);
    const fringe = pick(0,1) ? 'M12 19Q10 7 22 7Q32 7 33 19Q25 17 23 12Q20 19 12 19' :
      'M11 19Q9 9 18 7Q31 3 34 17L31 20Q26 13 16 15Z';
    const glasses = pick(0,4) === 0;
    const highlight = 'profile-light-' + String(seed >>> 0);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44">
      <defs><radialGradient id="${highlight}" cx=".35" cy=".2" r=".92">
      <stop stop-color="hsl(${hue} 80% 92%)"/><stop offset="1" stop-color="hsl(${hue} 47% 72%)"/></radialGradient></defs>
      <rect width="44" height="44" rx="13" fill="url(#${highlight})"/>
      ${longHair ? `<path d="M11 14Q12 6 22 6Q35 6 35 18L36 33Q27 36 9 32Z" fill="${hair}"/>` : ''}
      <path d="M3 44Q6 32 18 31H26Q38 32 41 44Z" fill="hsl(${(hue+45)%360} 38% 42%)"/>
      <path d="M18 28H26V34Q22 37 18 34Z" fill="${shadow}"/>
      <ellipse cx="22" cy="21" rx="10" ry="12" fill="${skin}"/>
      <path d="M32 19Q35 32 23 33Q29 29 32 19" fill="${shadow}" opacity=".45"/>
      <path d="${fringe}" fill="${hair}"/><path d="M15 12Q21 7 27 10" fill="none" stroke="#fff" stroke-opacity=".19" stroke-linecap="round"/>
      <path d="M17 22h1m8 0h1" stroke="#302337" stroke-width="1.7" stroke-linecap="round"/>
      <path d="M20 27q2 2 4 0" fill="none" stroke="#974d51" stroke-width="1" stroke-linecap="round"/>
      ${glasses ? '<path d="M14 20h7v4h-7zm9 0h7v4h-7zm-2 1h2" fill="none" stroke="#443647" stroke-width=".9"/>' : ''}
      </svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  return {snapshot,avatar};
})();
