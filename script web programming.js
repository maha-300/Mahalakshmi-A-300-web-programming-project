/* SportsCare - Injury, Rehabilitation & Return-to-Play System (demo project)
   All data is saved in the browser (localStorage). */
const $ = s => document.querySelector(s), KEY = 'sirs_v2';
const byId = (a, i) => a.find(x => x.id == i);
const uid = () => Date.now() + Math.floor(Math.random() * 1000);
const iso = n => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const dd = s => Math.round((new Date(iso(0)) - new Date(s)) / 864e5);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PARTS = ['Knee', 'Ankle', 'Shoulder', 'Hamstring', 'Wrist', 'Lower Back', 'Elbow', 'Hip', 'Head', 'Foot'];
const CRIT = ['Pain-free full range of motion', 'Strength at least 90% of the uninjured side', 'Sport-specific drills completed', 'Cardio fitness restored', 'Athlete feels confident to return', 'Rehab plan fully completed'];
const ROLES = { admin: 'Admin', coach: 'Coach', physio: 'Physiotherapist' };
const CAN = { athlete: ['admin', 'coach'], del: ['admin'], injury: ['admin', 'physio'], rehab: ['physio'], clinic: ['physio'] };
const BC = { Severe: 'red', Injured: 'red', Cancelled: 'red', Moderate: 'org', 'In Rehab': 'org', Scheduled: 'blu', Mild: 'grn', Cleared: 'grn', Completed: 'grn', Fit: 'grn' };
const NAV = [['dash', '📊', 'Dashboard'], ['athletes', '🏃', 'Athletes'], ['injuries', '🩹', 'Injuries'], ['rehab', '💪', 'Rehabilitation'], ['treat', '💊', 'Treatment'], ['rtp', '✅', 'Return to Play'], ['appts', '📅', 'Appointments'], ['reports', '📄', 'Reports'], ['settings', '⚙️', 'Settings']];

/* ---------- demo data ---------- */
function seed() {
  const ex = (a, k) => a.map((n, i) => ({ n, done: i < k }));
  const all = [true, true, true, true, true, true];
  return {
    theme: 'light',
    users: { admin: { name: 'Alex Admin', email: 'admin@sportscare.demo' }, coach: { name: 'Coach Rivera', email: 'coach@sportscare.demo' }, physio: { name: 'Dr. Priya Sharma', email: 'physio@sportscare.demo' } },
    log: [{ t: Date.now(), x: 'Demo data loaded' }],
    athletes: [
      { id: 1, name: 'Aarav Kumar', age: 21, sport: 'Football', team: 'Varsity A', contact: 'aarav@college.edu' },
      { id: 2, name: 'Meera Singh', age: 20, sport: 'Basketball', team: 'Women Varsity', contact: 'meera@college.edu' },
      { id: 3, name: 'Rohan Das', age: 22, sport: 'Cricket', team: 'College XI', contact: 'rohan@college.edu' },
      { id: 4, name: 'Sana Khan', age: 19, sport: 'Athletics', team: 'Track Team', contact: 'sana@college.edu' },
      { id: 5, name: 'Vikram Patel', age: 23, sport: 'Hockey', team: 'Varsity A', contact: 'vikram@college.edu' },
      { id: 6, name: 'Diya Nair', age: 20, sport: 'Badminton', team: 'Singles Squad', contact: 'diya@college.edu' }
    ],
    injuries: [
      { id: 1, aid: 1, name: 'ACL Sprain (Grade 2)', part: 'Knee', sport: 'Football', sev: 'Severe', date: iso(-40), rec: 90, symptoms: 'Swelling, instability when turning', treatment: 'Physio 3x/week, knee brace, ice therapy', follow: iso(2), status: 'In Rehab', ex: ex(['Quad sets', 'Straight leg raises', 'Stationary bike 15 min', 'Balance board'], 2), notes: [{ d: iso(-5), by: 'Dr. Priya Sharma', t: 'Swelling reduced well. Progress to balance drills next week.' }] },
      { id: 2, aid: 2, name: 'Ankle Sprain', part: 'Ankle', sport: 'Basketball', sev: 'Moderate', date: iso(-20), rec: 28, symptoms: 'Pain on landing, mild swelling', treatment: 'Compression, mobility work, taping', follow: iso(1), status: 'In Rehab', ex: ex(['Ankle alphabet', 'Calf raises', 'Single-leg balance', 'Agility ladder'], 3), notes: [{ d: iso(-2), by: 'Dr. Priya Sharma', t: 'Good range of motion. Needs agility work before assessment.' }] },
      { id: 3, aid: 3, name: 'Shoulder Strain', part: 'Shoulder', sport: 'Cricket', sev: 'Mild', date: iso(-45), rec: 21, symptoms: 'Pain when throwing', treatment: 'Rotator cuff strengthening', follow: '', status: 'Cleared', ex: ex(['Band external rotation', 'Scapular squeezes', 'Throwing progression'], 3), notes: [] },
      { id: 4, aid: 4, name: 'Hamstring Strain', part: 'Hamstring', sport: 'Athletics', sev: 'Moderate', date: iso(-3), rec: 21, symptoms: 'Sharp pain while sprinting', treatment: 'Rest, ice, gentle stretching', follow: iso(3), status: 'Injured', ex: ex(['Glute bridges', 'Hamstring curls', 'Light jogging'], 0), notes: [] },
      { id: 5, aid: 5, name: 'Wrist Fracture', part: 'Wrist', sport: 'Hockey', sev: 'Severe', date: iso(-8), rec: 60, symptoms: 'Pain, swelling, limited grip', treatment: 'Cast for 6 weeks, specialist review', follow: iso(-1), status: 'Injured', ex: ex(['Finger mobility', 'Shoulder and elbow movement'], 0), notes: [] },
      { id: 6, aid: 6, name: 'Lower Back Strain', part: 'Lower Back', sport: 'Badminton', sev: 'Mild', date: iso(-10), rec: 14, symptoms: 'Stiffness after training', treatment: 'Core stability, heat therapy', follow: iso(4), status: 'In Rehab', ex: ex(['Cat-cow stretch', 'Bird-dog', 'Plank holds'], 2), notes: [] },
      { id: 7, aid: 1, name: 'Ankle Sprain', part: 'Ankle', sport: 'Football', sev: 'Mild', date: iso(-200), rec: 14, symptoms: 'Mild swelling', treatment: 'Taping and strengthening', follow: '', status: 'Cleared', ex: ex(['Calf raises', 'Balance work'], 2), notes: [] }
    ],
    appts: [
      { id: 1, aid: 1, with: 'Physiotherapist', type: 'Treatment', date: iso(1), time: '10:00', status: 'Scheduled', note: 'Knee strength session' },
      { id: 2, aid: 2, with: 'Coach', type: 'Consultation', date: iso(0), time: '16:00', status: 'Scheduled', note: 'Training load discussion' },
      { id: 3, aid: 4, with: 'Physiotherapist', type: 'Assessment', date: iso(2), time: '09:30', status: 'Scheduled', note: 'Initial hamstring assessment' },
      { id: 4, aid: 5, with: 'Physiotherapist', type: 'Follow-up', date: iso(-2), time: '11:00', status: 'Completed', note: 'Cast check' },
      { id: 5, aid: 6, with: 'Physiotherapist', type: 'Treatment', date: iso(5), time: '14:00', status: 'Scheduled', note: '' },
      { id: 6, aid: 3, with: 'Coach', type: 'Consultation', date: iso(-10), time: '15:00', status: 'Completed', note: 'Return plan' }
    ],
    asm: [
      { id: 1, iid: 7, date: iso(-190), by: 'Dr. Priya Sharma', checks: all, note: 'Fully recovered.' },
      { id: 2, iid: 3, date: iso(-3), by: 'Dr. Priya Sharma', checks: all, note: 'All criteria met.' },
      { id: 3, iid: 2, date: iso(-2), by: 'Dr. Priya Sharma', checks: [true, true, false, true, true, false], note: 'Agility drills pending.' }
    ]
  };
}
let db = JSON.parse(localStorage.getItem(KEY) || 'null') || seed();
let me = JSON.parse(sessionStorage.getItem('me') || 'null'), page = 'dash', F = {};
const V = {}, T = {}, A = {};

/* ---------- helpers ---------- */
const can = k => CAN[k] ? CAN[k].includes(me.role) : true;
const nm = id => (byId(db.athletes, id) || { name: '(removed)' }).name;
const prog = i => i.status === 'Cleared' ? 100 : i.ex.length ? Math.round(i.ex.filter(e => e.done).length / i.ex.length * 100) : 0;
const lastAsm = i => db.asm.filter(s => s.iid == i.id).pop();
const active = () => db.injuries.filter(i => i.status !== 'Cleared');
const bd = s => `<span class="bd ${BC[s] || 'blu'}">${esc(s)}</span>`;
const pb = p => `<div class="pb"><i style="width:${p}%"></i></div><small>${p}%</small>`;
const btn = (a, id, t, c = '') => `<button class="sm ${c}" data-a="${a}" data-id="${id}">${t}</button>`;
const head = (t, b = '') => `<div class="ph"><h2>${t}</h2><div class="noprint">${b}</div></div>`;
const tbl = (h, r) => r.length ? `<div class="tw"><table><thead><tr>${h.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${r.map(x => `<tr>${x.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : '<p class="empty">No records found.</p>';
const opts = (arr, sel) => arr.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${v == sel ? 'selected' : ''}>${esc(l)}</option>`; }).join('');
const athState = a => { const x = db.injuries.filter(i => i.aid == a.id && i.status !== 'Cleared'); return x.length ? (x.some(i => i.status === 'Injured') ? 'Injured' : 'In Rehab') : 'Fit'; };

function toast(m) { if (!m) return; const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2800); }
function commit(msg) {
  if (msg) db.log.unshift({ t: Date.now(), x: msg + ' (' + me.name + ')' });
  db.log = db.log.slice(0, 30);
  localStorage.setItem(KEY, JSON.stringify(db));
  toast(msg); draw();
}
function show(html) { $('#mb').innerHTML = html + '<div class="row"><button class="btn ghost" data-a="close">Close</button></div>'; $('#modal').classList.add('on'); }
function form(title, fields, v, save) {
  $('#mb').innerHTML = `<h3>${title}</h3><form id="f">${fields.map(f => f.t === 'check'
    ? `<label class="ck"><input type="checkbox" name="${f.k}" ${v[f.k] ? 'checked' : ''}> ${esc(f.l)}</label>`
    : `<label>${esc(f.l)}${f.t === 'select' ? `<select name="${f.k}">${opts(f.o, v[f.k])}</select>`
      : f.t === 'textarea' ? `<textarea name="${f.k}">${esc(v[f.k])}</textarea>`
      : `<input type="${f.t || 'text'}" name="${f.k}" value="${esc(v[f.k])}" ${f.r === 0 ? '' : 'required'} ${f.t === 'number' ? 'min="1"' : ''}>`}</label>`).join('')}
    <div class="row"><button type="button" class="btn ghost" data-a="close">Cancel</button><button class="btn">Save</button></div></form>`;
  $('#modal').classList.add('on');
  $('#f').onsubmit = e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); fields.forEach(f => { if (f.t === 'check') d[f.k] = !!d[f.k]; }); A.close(); save(d); };
}

/* ---------- notifications ---------- */
function notes() {
  const n = [], t = iso(0), t2 = iso(2), t3 = iso(3);
  db.appts.filter(a => a.status === 'Scheduled' && a.date >= t && a.date <= t2).forEach(a => n.push(['📅', `Appointment: ${nm(a.aid)} with ${a.with} on ${a.date} at ${a.time}`]));
  active().filter(i => i.follow && i.follow <= t3).forEach(i => n.push(['🔔', `Follow-up ${i.follow < t ? 'OVERDUE (' + i.follow + ')' : 'due ' + i.follow}: ${nm(i.aid)} - ${i.name}`]));
  db.injuries.filter(i => i.status === 'In Rehab' && prog(i) < 100).forEach(i => n.push(['💪', `${nm(i.aid)}: ${i.ex.filter(e => !e.done).length} rehab task(s) pending`]));
  return n;
}

/* ---------- main draw ---------- */
function draw() {
  document.documentElement.dataset.theme = db.theme;
  $('#nav').innerHTML = NAV.map(([k, i, l]) => `<a data-a="go" data-id="${k}" class="${k === page ? 'on' : ''}">${i} ${l}</a>`).join('');
  $('#un').textContent = me.name; $('#ur').textContent = ROLES[me.role];
  const n = notes(); $('#nb').textContent = n.length || '';
  $('#np').innerHTML = '<h4 style="margin-top:0">Notifications</h4>' + (n.map(x => `<p>${x[0]} ${esc(x[1])}</p>`).join('') || '<p>You are all caught up.</p>');
  const qa = [['Add athlete', 'addAth', 'athlete'], ['Report injury', 'addInj', 'injury'], ['Book appointment', 'addAppt', ''], ['Export report (CSV)', 'csv', '']];
  $('#qa').innerHTML = qa.filter(q => !q[2] || can(q[2])).map(q => `<button class="btn ghost" data-a="${q[1]}">${q[0]}</button>`).join('');
  $('#view').innerHTML = V[page]();
  $('#side').classList.remove('open');
}
function go(p) { page = p; $('#np').classList.remove('on'); $('#qa').classList.remove('on'); draw(); window.scrollTo(0, 0); }

/* ---------- charts ---------- */
function bars(d) { const m = Math.max(1, ...Object.values(d)); return `<div class="bars">${Object.entries(d).map(([k, v]) => `<div class="bar" data-a="part" data-id="${esc(k)}" title="${esc(k)}: ${v} (click to view)"><span>${v}</span><i style="height:${v / m * 100}%"></i><em>${esc(k)}</em></div>`).join('')}</div>`; }
function donut(d, col) {
  let s = 0; const T = Object.values(d).reduce((a, b) => a + b, 0) || 1, g = [];
  Object.values(d).forEach((v, i) => { g.push(`${col[i]} ${s / T * 100}% ${(s + v) / T * 100}%`); s += v; });
  return `<div class="dnw"><div class="dn" style="background:conic-gradient(${g.join(',')})"><b>${T}</b></div><div class="lg">${Object.keys(d).map((k, i) => `<span><u style="background:${col[i]}"></u>${k}: ${d[k]}</span>`).join('')}</div></div>`;
}

/* ---------- DASHBOARD ---------- */
V.dash = () => {
  const inj = db.injuries, act = active(), clr = inj.length - act.length;
  const rec = db.athletes.filter(a => inj.some(i => i.aid == a.id && i.status === 'Cleared') && !act.some(i => i.aid == a.id)).length;
  const part = {}, st = { Injured: 0, 'In Rehab': 0, Cleared: 0 }, sev = { Mild: 0, Moderate: 0, Severe: 0 };
  inj.forEach(i => { part[i.part] = (part[i.part] || 0) + 1; st[i.status]++; sev[i.sev]++; });
  const cards = [['🏃', db.athletes.length, 'Total athletes', 'athletes'], ['🩹', inj.length, 'Total injuries', 'injuries'], ['⚠️', act.length, 'Active injuries', 'injuries'], ['✅', rec, 'Recovered athletes', 'athletes'], ['🚨', act.filter(i => i.sev === 'Severe').length, 'Severe (active)', 'injuries'], ['📈', (inj.length ? Math.round(clr / inj.length * 100) : 0) + '%', 'Recovery rate', 'reports']];
  const up = db.appts.filter(a => a.status === 'Scheduled' && a.date >= iso(0)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 5);
  const showTasks = can('clinic') || me.role === 'admin', showAvail = me.role !== 'physio';
  return head(`Welcome, ${esc(me.name)}`, `<small>${ROLES[me.role]} dashboard • ${iso(0)}</small>`) +
    `<div class="stats">${cards.map(c => `<div class="stat" data-a="go" data-id="${c[3]}"><span>${c[0]} ${c[2]}</span><b>${c[1]}</b></div>`).join('')}</div>
    <div class="grid2"><div class="panel"><h3>Injuries by body part</h3><small>Click a bar to see those injuries</small>${bars(part)}</div>
    <div class="panel"><h3>Injury status</h3>${donut(st, ['#e5484d', '#f59e0b', '#16a34a'])}<h4>Severity</h4>${donut(sev, ['#16a34a', '#f59e0b', '#e5484d'])}</div></div>
    <div class="grid2">
    ${showTasks ? `<div class="panel list"><h3>Tasks &amp; reminders</h3>${notes().map(x => `<p>${x[0]} ${esc(x[1])}</p>`).join('') || '<p>No pending tasks.</p>'}</div>` : ''}
    ${showAvail ? `<div class="panel list"><h3>Team availability</h3>${db.athletes.map(a => `<p>${esc(a.name)} <small>(${esc(a.sport)})</small> ${bd(athState(a))}</p>`).join('')}</div>` : ''}
    <div class="panel list"><h3>Upcoming appointments</h3>${up.map(a => `<p>📅 ${a.date} ${a.time} - ${esc(nm(a.aid))} with ${a.with}</p>`).join('') || '<p>None scheduled.</p>'}</div>
    <div class="panel list"><h3>Recent activities</h3>${db.log.slice(0, 7).map(l => `<p>${esc(l.x)}<br><small>${new Date(l.t).toLocaleString()}</small></p>`).join('')}</div></div>`;
};

/* ---------- ATHLETES ---------- */
V.athletes = () => head('Athlete Management', can('athlete') ? `<button class="btn" data-a="addAth">+ Add Athlete</button>` : '<small>View only</small>') +
  `<div class="panel"><div class="tools"><input data-f="aq" placeholder="Search name, sport, team..." value="${esc(F.aq || '')}"><select data-f="as"><option>All</option>${opts([...new Set(db.athletes.map(a => a.sport))], F.as)}</select></div><div id="tbl">${T.athletes()}</div></div>`;
T.athletes = () => {
  const q = (F.aq || '').toLowerCase(), s = F.as || 'All';
  return tbl(['Athlete', 'Age', 'Sport', 'Team', 'Status', 'Actions'], db.athletes.filter(a => (a.name + a.sport + a.team).toLowerCase().includes(q) && (s === 'All' || a.sport === s))
    .map(a => [`<b>${esc(a.name)}</b><br><small>${esc(a.contact)}</small>`, a.age, esc(a.sport), esc(a.team), bd(athState(a)), btn('viewAth', a.id, 'Profile') + (can('athlete') ? btn('editAth', a.id, 'Edit', 'ghost') : '') + (can('del') ? btn('delAth', a.id, 'Delete', 'dng') : '')]));
};
function athForm(a) {
  form(a.id ? 'Edit athlete' : 'Add athlete', [{ k: 'name', l: 'Full name' }, { k: 'age', l: 'Age', t: 'number' }, { k: 'sport', l: 'Sport' }, { k: 'team', l: 'Team' }, { k: 'contact', l: 'Email / phone' }], a, d => {
    d.age = +d.age; if (a.id) Object.assign(a, d); else db.athletes.push({ id: uid(), ...d });
    commit((a.id ? 'Updated athlete ' : 'Added athlete ') + d.name);
  });
}
A.addAth = () => can('athlete') ? athForm({}) : toast('Not allowed for your role');
A.editAth = id => can('athlete') && athForm(byId(db.athletes, id));
A.delAth = id => {
  const a = byId(db.athletes, id); if (!can('del') || !confirm('Delete ' + a.name + ' and all their records?')) return;
  const ids = db.injuries.filter(i => i.aid == a.id).map(i => i.id);
  db.athletes = db.athletes.filter(x => x !== a); db.injuries = db.injuries.filter(i => i.aid != a.id);
  db.appts = db.appts.filter(p => p.aid != a.id); db.asm = db.asm.filter(s => !ids.includes(s.iid));
  commit('Deleted athlete ' + a.name);
};
A.viewAth = id => {
  const a = byId(db.athletes, id);
  show(`<h3>${esc(a.name)} ${bd(athState(a))}</h3><p class="mut">${a.age} yrs • ${esc(a.sport)} • ${esc(a.team)} • ${esc(a.contact)}</p>
  <h4>Injury history</h4>${tbl(['Injury', 'Date', 'Severity', 'Status'], db.injuries.filter(i => i.aid == a.id).map(i => [esc(i.name) + '<br><small>' + esc(i.part) + '</small>', i.date, bd(i.sev), bd(i.status)]))}
  <h4>Appointments</h4>${tbl(['Date', 'With', 'Status'], db.appts.filter(p => p.aid == a.id).map(p => [p.date + ' ' + p.time, p.with, bd(p.status)]))}`);
};

/* ---------- INJURIES ---------- */
V.injuries = () => head('Injury Management', can('injury') ? `<button class="btn" data-a="addInj">+ Report Injury</button>` : '<small>View only</small>') +
  `<div class="panel"><div class="tools"><input data-f="iq" placeholder="Search athlete, injury, body part..." value="${esc(F.iq || '')}"><select data-f="is"><option>All</option>${opts(['Injured', 'In Rehab', 'Cleared'], F.is)}</select></div><div id="tbl">${T.injuries()}</div></div>`;
T.injuries = () => {
  const q = (F.iq || '').toLowerCase(), s = F.is || 'All';
  return tbl(['Athlete', 'Injury', 'Severity', 'Date', 'Symptoms', 'Status', 'Rehab', 'Actions'], db.injuries.filter(i => (nm(i.aid) + i.name + i.part + i.sport).toLowerCase().includes(q) && (s === 'All' || i.status === s))
    .map(i => [`<b>${esc(nm(i.aid))}</b><br><small>${esc(i.sport)}</small>`, esc(i.name) + '<br><small>' + esc(i.part) + '</small>', bd(i.sev), i.date, me.role === 'coach' ? '<small>Confidential</small>' : esc(i.symptoms), bd(i.status), pb(prog(i)),
      can('injury') ? (i.status === 'Injured' ? btn('startRehab', i.id, 'Start Rehab', 'ok') : '') + btn('editInj', i.id, 'Edit', 'ghost') + (can('del') ? btn('delInj', i.id, 'Delete', 'dng') : '') : '—']));
};
function injForm(i) {
  if (!db.athletes.length) return toast('Add an athlete first');
  const f = [{ k: 'aid', l: 'Athlete', t: 'select', o: db.athletes.map(a => [a.id, a.name]) }, { k: 'name', l: 'Injury name' }, { k: 'part', l: 'Body part', t: 'select', o: PARTS }, { k: 'sport', l: 'Sport' }, { k: 'sev', l: 'Severity', t: 'select', o: ['Mild', 'Moderate', 'Severe'] }, { k: 'date', l: 'Injury date', t: 'date' }, { k: 'rec', l: 'Estimated recovery (days)', t: 'number' }, { k: 'symptoms', l: 'Symptoms', t: 'textarea' }, { k: 'treatment', l: 'Treatment', t: 'textarea' }, { k: 'follow', l: 'Follow-up date (optional)', t: 'date', r: 0 }];
  if (i.status !== 'Cleared') f.push({ k: 'status', l: 'Status', t: 'select', o: ['Injured', 'In Rehab'] });
  form(i.id ? 'Edit injury' : 'Report injury', f, { sev: 'Mild', date: iso(0), status: 'Injured', ...i }, d => {
    d.aid = +d.aid; d.rec = +d.rec;
    if (i.id) Object.assign(i, d); else db.injuries.push({ id: uid(), ex: ['Gentle range-of-motion', 'Isometric strengthening', 'Low-impact cardio'].map(n => ({ n, done: false })), notes: [], ...d });
    commit((i.id ? 'Updated injury: ' : 'Recorded injury: ') + d.name);
  });
}
A.addInj = () => can('injury') ? injForm({}) : toast('Not allowed for your role');
A.editInj = id => can('injury') && injForm(byId(db.injuries, id));
A.startRehab = id => { if (!can('injury')) return; const i = byId(db.injuries, id); i.status = 'In Rehab'; commit('Started rehab for ' + nm(i.aid)); };
A.delInj = id => { const i = byId(db.injuries, id); if (!can('del') || !confirm('Delete this injury record?')) return; db.injuries = db.injuries.filter(x => x !== i); db.asm = db.asm.filter(s => s.iid != i.id); commit('Deleted injury record'); };
A.part = p => { F.iq = p; F.is = 'All'; go('injuries'); };

/* ---------- REHABILITATION ---------- */
function timeline(i) {
  const el = Math.max(0, dd(i.date)), p = Math.min(100, Math.round(el / i.rec * 100)), end = new Date(i.date); end.setDate(end.getDate() + +i.rec);
  return `<div class="tl"><i style="width:${p}%"></i></div><div class="tls"><span>Injured ${i.date}</span><span>Day ${el} of ${i.rec}</span><span>Expected ${end.toISOString().slice(0, 10)}</span></div>`;
}
V.rehab = () => {
  const list = active();
  return head('Rehabilitation Plans', can('rehab') ? '' : '<small>View only - physiotherapists edit plans</small>') +
    (list.length ? `<div class="grid2">${list.map(i => `<div class="panel"><div class="rt"><div><b>${esc(nm(i.aid))}</b><br><small>${esc(i.name)}</small></div>${bd(i.status)}</div>${pb(prog(i))}
    <h4>Daily exercise checklist</h4>${i.ex.map((e, k) => `<label class="ck"><input type="checkbox" data-a="tog" data-id="${i.id}:${k}" ${e.done ? 'checked' : ''} ${can('rehab') ? '' : 'disabled'}> ${esc(e.n)}</label>`).join('') || '<small>No exercises yet.</small>'}
    ${can('rehab') ? btn('addEx', i.id, '+ Exercise') + btn('resetEx', i.id, 'Reset checklist', 'ghost') : ''}
    <h4>Recovery timeline</h4>${timeline(i)}
    <h4>Physiotherapist notes</h4>${i.notes.map(n => `<p class="note"><small>${n.d} • ${esc(n.by)}</small><br>${esc(n.t)}</p>`).join('') || '<small>No notes yet.</small>'}<br>${can('rehab') ? btn('addNote', i.id, '+ Add note') : ''}</div>`).join('')}</div>` : '<p class="empty">No active rehabilitation plans.</p>');
};
A.tog = s => { if (!can('rehab')) return; const [id, k] = s.split(':'), i = byId(db.injuries, id); i.ex[k].done = !i.ex[k].done; commit(); };
A.resetEx = id => { byId(db.injuries, id).ex.forEach(e => e.done = false); commit('Reset daily checklist'); };
A.addEx = id => form('Add exercise', [{ k: 'n', l: 'Exercise name' }], {}, d => { byId(db.injuries, id).ex.push({ n: d.n, done: false }); commit('Added exercise: ' + d.n); });
A.addNote = id => form('Physiotherapist note', [{ k: 't', l: 'Note', t: 'textarea' }], {}, d => { byId(db.injuries, id).notes.unshift({ d: iso(0), by: me.name, t: d.t }); commit('Added physiotherapist note'); });

/* ---------- TREATMENT ---------- */
V.treat = () => head('Treatment Tracking') + `<div class="panel">${tbl(['Athlete / Injury', 'Treatment plan', 'Follow-up', 'Recovery', 'Actions'], active().map(i => {
  const od = i.follow && i.follow < iso(0);
  return [`<b>${esc(nm(i.aid))}</b><br><small>${esc(i.name)}</small>`, me.role === 'coach' ? '<small>Confidential</small>' : esc(i.treatment), i.follow ? i.follow + (od ? ' ' + bd('Severe').replace('Severe', 'Overdue') : '') : '—', pb(prog(i)), can('injury') ? btn('editTr', i.id, 'Update plan') : '—'];
}))}</div>`;
A.editTr = id => { const i = byId(db.injuries, id); form('Update treatment plan', [{ k: 'treatment', l: 'Treatment plan', t: 'textarea' }, { k: 'follow', l: 'Next follow-up date', t: 'date' }, { k: 'rec', l: 'Estimated recovery (days)', t: 'number' }], i, d => { d.rec = +d.rec; Object.assign(i, d); commit('Updated treatment for ' + nm(i.aid)); }); };

/* ---------- RETURN TO PLAY ---------- */
const res = s => s.checks.filter(Boolean).length + '/6 criteria met';
V.rtp = () => head('Return-to-Play Assessment') +
  `<div class="warn">⚠️ This tool supports decisions only. Return-to-play clearance must be decided and recorded by a qualified healthcare professional (the Physiotherapist role in this demo). Estimated recovery days are not a clearance.</div>
  <div class="panel"><h3>Athletes awaiting clearance</h3>${tbl(['Athlete / Injury', 'Rehab', 'Latest assessment', 'Status', 'Actions'], active().map(i => { const a = lastAsm(i); return [`<b>${esc(nm(i.aid))}</b><br><small>${esc(i.name)}</small>`, pb(prog(i)), a ? res(a) + '<br><small>' + a.date + '</small>' : '<small>Not assessed</small>', bd(i.status), can('clinic') ? btn('asm', i.id, 'Assess') + btn('clear', i.id, 'Clear for play', 'ok') : '<small>Clinician only</small>']; }))}</div>
  <div class="panel"><h3>Assessment history</h3>${tbl(['Date', 'Athlete / Injury', 'Result', 'Assessed by', 'Notes'], [...db.asm].reverse().map(s => { const i = byId(db.injuries, s.iid); return i ? [s.date, esc(nm(i.aid)) + '<br><small>' + esc(i.name) + '</small>', res(s), esc(s.by), esc(s.note)] : null; }).filter(Boolean))}</div>`;
A.asm = id => {
  if (!can('clinic')) return toast('Only a physiotherapist can record assessments');
  form('Readiness assessment', [...CRIT.map((c, k) => ({ k: 'c' + k, l: c, t: 'check' })), { k: 'note', l: 'Clinical notes', t: 'textarea', r: 0 }], {}, d => { db.asm.push({ id: uid(), iid: id, date: iso(0), by: me.name, checks: CRIT.map((_, k) => d['c' + k]), note: d.note }); commit('Recorded assessment for ' + nm(byId(db.injuries, id).aid)); });
};
A.clear = id => {
  const i = byId(db.injuries, id), a = lastAsm(i);
  if (!can('clinic')) return toast('Only a physiotherapist can record clearance');
  if (prog(i) < 100 || !a || a.checks.includes(false)) return toast('Cannot clear: rehab must be 100% and the latest assessment must meet all 6 criteria');
  if (!confirm('I am a qualified healthcare professional and I confirm this clearance decision for ' + nm(i.aid) + '.')) return;
  i.status = 'Cleared'; commit('Cleared ' + nm(i.aid) + ' for return to play');
};

/* ---------- APPOINTMENTS ---------- */
V.appts = () => head('Appointments', `<button class="btn" data-a="addAppt">+ Book Appointment</button>`) +
  `<div class="panel"><div class="tools"><input data-f="pq" placeholder="Search athlete or type..." value="${esc(F.pq || '')}"><select data-f="ps"><option>All</option>${opts(['Scheduled', 'Completed', 'Cancelled'], F.ps)}</select></div><div id="tbl">${T.appts()}</div></div>`;
T.appts = () => {
  const q = (F.pq || '').toLowerCase(), s = F.ps || 'All';
  return tbl(['Date & time', 'Athlete', 'With', 'Type', 'Status', 'Actions'], [...db.appts].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).filter(a => (nm(a.aid) + a.type + a.note).toLowerCase().includes(q) && (s === 'All' || a.status === s))
    .map(a => [a.date + '<br><small>' + a.time + '</small>', esc(nm(a.aid)), a.with, esc(a.type), bd(a.status), a.status === 'Scheduled' ? btn('editAppt', a.id, 'Edit', 'ghost') + btn('doneAppt', a.id, 'Complete', 'ok') + btn('cancelAppt', a.id, 'Cancel', 'dng') : '—']));
};
function apptForm(p) {
  if (!db.athletes.length) return toast('Add an athlete first');
  form(p.id ? 'Edit appointment' : 'Book appointment', [{ k: 'aid', l: 'Athlete', t: 'select', o: db.athletes.map(a => [a.id, a.name]) }, { k: 'with', l: 'With', t: 'select', o: ['Physiotherapist', 'Coach'] }, { k: 'type', l: 'Type', t: 'select', o: ['Treatment', 'Assessment', 'Follow-up', 'Consultation'] }, { k: 'date', l: 'Date', t: 'date' }, { k: 'time', l: 'Time', t: 'time' }, { k: 'note', l: 'Notes', t: 'textarea', r: 0 }], { date: iso(1), time: '10:00', ...p }, d => {
    d.aid = +d.aid; if (p.id) Object.assign(p, d); else db.appts.push({ id: uid(), status: 'Scheduled', ...d });
    commit((p.id ? 'Updated' : 'Booked') + ' appointment for ' + nm(d.aid));
  });
}
A.addAppt = () => apptForm({}); A.editAppt = id => apptForm(byId(db.appts, id));
A.cancelAppt = id => { if (confirm('Cancel this appointment?')) { byId(db.appts, id).status = 'Cancelled'; commit('Cancelled appointment'); } };
A.doneAppt = id => { byId(db.appts, id).status = 'Completed'; commit('Completed appointment'); };

/* ---------- REPORTS ---------- */
function rep() {
  const q = (F.rq || '').toLowerCase(), f = F.rf || '', t = F.rt || '', ty = F.ry || 'Injuries', s = F.rs || 'All', ok = d => (!f || d >= f) && (!t || d <= t);
  if (ty === 'Injuries') return { head: ['Athlete', 'Sport', 'Injury', 'Body part', 'Severity', 'Date', 'Status', 'Rehab', 'Treatment'], rows: db.injuries.filter(i => ok(i.date) && (s === 'All' || i.status === s) && (nm(i.aid) + i.name + i.part).toLowerCase().includes(q)).map(i => [nm(i.aid), i.sport, i.name, i.part, i.sev, i.date, i.status, prog(i) + '%', me.role === 'coach' ? 'Confidential' : i.treatment]) };
  return { head: ['Date', 'Time', 'Athlete', 'With', 'Type', 'Status', 'Notes'], rows: db.appts.filter(a => ok(a.date) && (s === 'All' || a.status === s) && (nm(a.aid) + a.type).toLowerCase().includes(q)).map(a => [a.date, a.time, nm(a.aid), a.with, a.type, a.status, a.note]) };
}
V.reports = () => head('Reports & Analytics', `<button class="btn ghost" data-a="print">🖨 Print</button> <button class="btn" data-a="csv">⬇ Export CSV</button>`) +
  `<div class="panel"><div class="tools"><select data-f="ry">${opts(['Injuries', 'Appointments'], F.ry)}</select><input data-f="rq" placeholder="Search..." value="${esc(F.rq || '')}"><input type="date" data-f="rf" value="${F.rf || ''}" title="From"><input type="date" data-f="rt" value="${F.rt || ''}" title="To"><select data-f="rs"><option>All</option>${opts(['Injured', 'In Rehab', 'Cleared', 'Scheduled', 'Completed', 'Cancelled'], F.rs)}</select></div><h3 class="mut">SportsCare report - generated ${iso(0)} by ${esc(me.name)}</h3><div id="tbl">${T.reports()}</div></div>`;
T.reports = () => { const r = rep(); return tbl(r.head, r.rows.map(x => x.map(esc))) + `<small>${r.rows.length} record(s)</small>`; };
A.print = () => window.print();
A.csv = () => {
  const r = rep(), c = [r.head, ...r.rows].map(x => x.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([c], { type: 'text/csv' })); a.download = 'sportscare-report-' + iso(0) + '.csv'; a.click(); toast('CSV downloaded');
};

/* ---------- SETTINGS ---------- */
V.settings = () => head('Profile & Settings') + `<div class="grid2"><div class="panel"><h3>My profile</h3><form id="pf"><label>Name<input name="name" value="${esc(me.name)}" required></label><label>Email<input name="email" type="email" value="${esc(me.email)}" required></label><label>Role<input value="${ROLES[me.role]}" disabled></label><button class="btn">Save profile</button></form></div>
  <div class="panel"><h3>Preferences</h3><p>Theme: <b>${db.theme}</b></p><button class="btn ghost" data-a="theme">Switch dark / light mode</button><h4>Demo data</h4><button class="btn dng" data-a="reset">Reset all demo data</button>
  <h4>Role permissions</h4><small>Admin: manage athletes, injuries, appointments, delete records. Coach: manage athletes and appointments, view injuries (medical details hidden). Physiotherapist: manage injuries, rehab, treatment, assessments and clearance.</small></div></div>
  <div class="warn">🔒 <b>Security note:</b> this demo stores data and the login in your browser (localStorage), so it is NOT secure. Anyone with the browser can read or change the data. A real system needs a backend server (for example Node.js or Django with a database), password hashing, secure sessions and role checks on the server.</div>`;
A.reset = () => { if (confirm('Reset ALL data back to the demo data?')) { db = seed(); commit('Demo data reset'); } };

/* ---------- global actions & events ---------- */
A.go = go; A.close = () => $('#modal').classList.remove('on');
A.theme = () => { db.theme = db.theme === 'dark' ? 'light' : 'dark'; commit(); };
A.menu = () => $('#side').classList.toggle('open');
A.bell = () => { $('#qa').classList.remove('on'); $('#np').classList.toggle('on'); };
A.qa = () => { $('#np').classList.remove('on'); $('#qa').classList.toggle('on'); };
A.out = () => { sessionStorage.removeItem('me'); location.reload(); };

document.addEventListener('click', e => {
  const b = e.target.closest('[data-a]');
  if (e.target.id === 'modal') A.close();
  if (!e.target.closest('#np') && !(b && b.dataset.a === 'bell')) $('#np').classList.remove('on');
  if (!e.target.closest('#qa') && !(b && b.dataset.a === 'qa')) $('#qa').classList.remove('on');
  if (b && A[b.dataset.a]) A[b.dataset.a](b.dataset.id);
});
document.addEventListener('input', e => {
  const k = e.target.dataset.f; if (!k) return;
  F[k] = e.target.value; if ($('#tbl')) $('#tbl').innerHTML = T[page]();
});
document.addEventListener('submit', e => {
  if (e.target.id !== 'pf') return; e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target)); db.users[me.role] = d; me = { role: me.role, ...d };
  sessionStorage.setItem('me', JSON.stringify(me)); commit('Updated profile');
});
$('#gs').addEventListener('keydown', e => { if (e.key === 'Enter') { F.aq = e.target.value; F.as = 'All'; go('athletes'); e.target.value = ''; } });

/* ---------- login ---------- */
function start() { $('#login').hidden = true; $('#app').hidden = false; draw(); }
$('#lf').onsubmit = e => {
  e.preventDefault();
  if ($('#lp').value !== 'demo123') { $('#le').textContent = 'Incorrect password. Please try again.'; return; }
  const r = $('#lr').value; me = { role: r, ...db.users[r] };
  sessionStorage.setItem('me', JSON.stringify(me)); start();
};
if (me) start();