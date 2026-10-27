// =========================================================
// PRIME — training.js (solo para training.html)
//  - Rutinas base (selector + vista previa)
//  - Lista de rutinas con filtros, crear y editar
//  - Personalización del plan (guardar)
// =========================================================
(function () {

  var ROUTINES = [
    { id: 1, name: 'Full Body Blast', level: 'Intermediate', cat: 'Full Body', min: 45,
      desc: 'A complete full-body workout targeting all major muscle groups for maximum results.',
      ex: [['Squats', '4×12'], ['Bench Press', '4×10'], ['Deadlifts', '3×8'], ['Pull-ups', '3×10'], ['Plank', '3×60']] },
    { id: 2, name: 'Upper Body Power', level: 'Advanced', cat: 'Upper Body', min: 40,
      desc: 'Focus on chest, back, shoulders, and arms to build upper body strength.',
      ex: [['Push-ups', '4×20'], ['Shoulder Press', '4×10'], ['Barbell Rows', '4×12'], ['Bicep Curls', '3×12'], ['Tricep Dips', '3×15']] },
    { id: 3, name: 'Lower Body Strength', level: 'Intermediate', cat: 'Lower Body', min: 35,
      desc: 'Build powerful legs and glutes with this intensive lower body routine.',
      ex: [['Squats', '5×10'], ['Lunges', '4×12'], ['Leg Press', '4×15'], ['Calf Raises', '4×20'], ['Glute Bridge', '3×15']] },
    { id: 4, name: 'Core Crusher', level: 'Beginner', cat: 'Core', min: 20,
      desc: 'Sculpt and strengthen your core with targeted abdominal exercises.',
      ex: [['Plank', '3×60'], ['Crunches', '3×20'], ['Russian Twists', '3×30'], ['Leg Raises', '3×15'], ['Mountain Climbers', '3×40']] },
    { id: 5, name: 'HIIT Cardio Burn', level: 'Advanced', cat: 'Cardio', min: 25,
      desc: 'High-intensity interval training to torch calories and boost endurance.',
      ex: [['Burpees', '5×15'], ['Jumping Jacks', '5×30'], ['High Knees', '5×40'], ['Mountain Climbers', '4×30'], ['Box Jumps', '4×12']] },
    { id: 6, name: 'Beginner Foundation', level: 'Beginner', cat: 'Full Body', min: 30,
      desc: 'Perfect starting point for those new to fitness. Build a solid base.',
      ex: [['Bodyweight Squats', '3×12'], ['Wall Push-ups', '3×15'], ['Glute Bridge', '3×12'], ['Plank', '3×30'], ['Calf Raises', '3×15']] }
  ];
  var nextId = 7;
  var BASE_COUNT = ROUTINES.length;

  var pickerList = document.getElementById('pickerList');
  var pickerDetail = document.getElementById('pickerDetail');
  var grid = document.getElementById('routineGrid');
  var emptyMsg = document.getElementById('routineEmpty');
  var tabs = document.querySelectorAll('#tabs .tab');
  var activeCat = 'All';
  var pickedId = 1;
  var plan = {};            // rutinas añadidas al plan

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function byId(id) { return ROUTINES.filter(function (r) { return r.id === id; })[0]; }

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2200);
  }

  /* ---------- Selector de rutina base ---------- */
  function renderPicker() {
    pickerList.innerHTML = ROUTINES.slice(0, BASE_COUNT).map(function (r) {
      return '<button type="button" class="pick' + (r.id === pickedId ? ' active' : '') + '" data-id="' + r.id + '">' +
        '<span><b>' + esc(r.name) + '</b><small>' + esc(r.cat) + ' · ' + r.min + 'min</small></span><i>›</i></button>';
    }).join('');

    var r = byId(pickedId);
    pickerDetail.innerHTML =
      '<div class="detail-top"><div class="icon-sq">💪</div><div><h3>' + esc(r.name) + '</h3><p>' + esc(r.desc) + '</p>' +
      '<div class="chips-row"><span class="chip-lvl">' + esc(r.level) + '</span><span class="chip-dark">⏱ ' + r.min + ' min</span>' +
      '<span class="chip-dark">' + r.ex.length + ' exercises</span></div></div></div>' +
      '<div class="breakdown"><p class="bd-label">EXERCISE BREAKDOWN</p>' +
      r.ex.map(function (e, i) {
        return '<div class="ex-row"><span class="ex-num">' + (i + 1) + '</span><b>' + esc(e[0]) + '</b><em>' + esc(e[1]) + '</em></div>';
      }).join('') +
      '<button type="button" class="btn-addplan' + (plan[r.id] ? ' done' : '') + '" data-add="' + r.id + '">' +
      (plan[r.id] ? '✓ Added to My Plan' : '+ Add This Routine to My Plan') + '</button></div>';
  }

  pickerList.addEventListener('click', function (e) {
    var b = e.target.closest('.pick'); if (!b) return;
    pickedId = Number(b.getAttribute('data-id'));
    renderPicker();
  });
  pickerDetail.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]'); if (!b) return;
    var id = Number(b.getAttribute('data-add'));
    plan[id] = !plan[id];
    toast(plan[id] ? '✓ Added to your plan' : 'Removed from your plan');
    renderPicker();
  });

  /* ---------- Tarjetas de rutinas ---------- */
  function renderGrid() {
    var list = ROUTINES.filter(function (r) { return activeCat === 'All' || r.cat === activeCat; });
    emptyMsg.hidden = list.length !== 0;
    grid.innerHTML = list.map(function (r) {
      var shown = r.ex.slice(0, 3).map(function (e) {
        return '<div class="r-ex"><span>' + esc(e[0]) + '</span><em>' + esc(e[1]) + '</em></div>';
      }).join('');
      var more = r.ex.length > 3 ? '+' + (r.ex.length - 3) + ' more...' : '';
      return '<article class="r-card"><div class="r-top"><div class="icon-sq">💪</div><h3>' + esc(r.name) + '</h3></div>' +
        '<p class="r-desc">' + esc(r.desc) + '</p>' +
        '<div class="r-chips"><span class="c-level">' + esc(r.level) + '</span><span class="c-cat">' + esc(r.cat) +
        '</span><span class="c-time">⏱ ' + r.min + ' min</span></div>' +
        '<p class="r-label">EXERCISES (' + r.ex.length + ')</p>' + shown + '<p class="r-more">' + more + '</p>' +
        '<button type="button" class="btn-edit" data-edit="' + r.id + '">✎ Edit</button></article>';
    }).join('');
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      activeCat = t.getAttribute('data-cat');
      tabs.forEach(function (x) { x.classList.toggle('active', x === t); });
      renderGrid();
    });
  });

  /* ---------- Ventana: nueva / editar rutina ---------- */
  var overlay = document.getElementById('routineOverlay');
  var form = document.getElementById('routineForm');
  var exList = document.getElementById('exList');
  var editingId = null;

  function exRow(name, reps) {
    var d = document.createElement('div');
    d.className = 'ex-edit';
    d.innerHTML = '<input type="text" placeholder="Exercise" value="' + esc(name || '') + '">' +
      '<input type="text" placeholder="3×10" value="' + esc(reps || '') + '">' +
      '<button type="button" aria-label="Remove">✕</button>';
    d.querySelector('button').addEventListener('click', function () { d.remove(); checkEmpty(); });
    return d;
  }
  function checkEmpty() {
    var has = exList.querySelector('.ex-edit');
    var msg = exList.querySelector('.ex-empty');
    if (!has && !msg) {
      exList.innerHTML = '<p class="ex-empty">No exercises yet. Click "+ Add" to start</p>';
    } else if (has && msg) { msg.remove(); }
  }

  function openModal(id) {
    editingId = id || null;
    var r = id ? byId(id) : null;
    document.getElementById('modalTitle').textContent = r ? 'EDIT ROUTINE' : 'NEW ROUTINE';
    document.getElementById('modalSubmit').textContent = r ? 'Save Changes' : 'Create Routine';
    document.getElementById('rName').value = r ? r.name : '';
    document.getElementById('rDesc').value = r ? r.desc : '';
    document.getElementById('rLevel').value = r ? r.level : 'Beginner';
    document.getElementById('rCat').value = r ? r.cat : 'Custom';
    document.getElementById('rMin').value = r ? r.min : 30;
    exList.innerHTML = '';
    if (r) { r.ex.forEach(function (e) { exList.appendChild(exRow(e[0], e[1])); }); }
    checkEmpty();
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('rName').focus();
  }
  function closeModal() { overlay.hidden = true; document.body.style.overflow = ''; }

  document.getElementById('newRoutineBtn').addEventListener('click', function () { openModal(); });
  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-edit]'); if (!b) return;
    openModal(Number(b.getAttribute('data-edit')));
  });
  document.getElementById('addExercise').addEventListener('click', function () {
    var msg = exList.querySelector('.ex-empty'); if (msg) msg.remove();
    var row = exRow('', '');
    exList.appendChild(row);
    row.querySelector('input').focus();
  });
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target.hasAttribute('data-close')) closeModal();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) closeModal(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ex = [];
    exList.querySelectorAll('.ex-edit').forEach(function (row) {
      var i = row.querySelectorAll('input');
      if (i[0].value.trim()) ex.push([i[0].value.trim(), i[1].value.trim() || '3×10']);
    });
    var data = {
      name: document.getElementById('rName').value.trim(),
      desc: document.getElementById('rDesc').value.trim() || 'Custom routine.',
      level: document.getElementById('rLevel').value,
      cat: document.getElementById('rCat').value,
      min: Number(document.getElementById('rMin').value) || 30,
      ex: ex
    };
    if (editingId) {
      Object.assign(byId(editingId), data);
      toast('✓ Routine updated');
    } else {
      data.id = nextId++;
      ROUTINES.push(data);
      toast('✓ Routine created');
    }
    closeModal();
    renderGrid();
    renderPicker();
  });

  /* ---------- Personalizar entrenamiento ---------- */
  var prefs = { health: 'Excellent', level: 'Beginner', budget: 50, times: [], days: [], goals: '', notes: '' };
  try {
    var saved = JSON.parse(localStorage.getItem('primePlan') || 'null');
    if (saved) prefs = Object.assign(prefs, saved);
  } catch (err) { /* sin almacenamiento: no pasa nada */ }

  function single(groupId, key) {
    var btns = document.querySelectorAll('#' + groupId + ' button');
    btns.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-v') === prefs[key]);
      b.addEventListener('click', function () {
        prefs[key] = b.getAttribute('data-v');
        btns.forEach(function (x) { x.classList.toggle('active', x === b); });
        b.closest('.panel').classList.add('touched');
      });
    });
  }
  function multi(groupId, key) {
    document.querySelectorAll('#' + groupId + ' button').forEach(function (b) {
      var v = b.getAttribute('data-v');
      b.classList.toggle('active', prefs[key].indexOf(v) !== -1);
      b.addEventListener('click', function () {
        var i = prefs[key].indexOf(v);
        if (i === -1) prefs[key].push(v); else prefs[key].splice(i, 1);
        b.classList.toggle('active');
        b.closest('.panel').classList.add('touched');
      });
    });
  }
  single('healthOpts', 'health');
  single('levelOpts', 'level');
  multi('timeOpts', 'times');
  multi('dayOpts', 'days');

  var range = document.getElementById('budgetRange');
  var budgetVal = document.getElementById('budgetVal');
  range.value = prefs.budget;
  budgetVal.textContent = '$' + prefs.budget;
  range.addEventListener('input', function () {
    prefs.budget = Number(range.value);
    budgetVal.textContent = '$' + prefs.budget;
    range.closest('.panel').classList.add('touched');
  });

  var goals = document.getElementById('goals');
  var notes = document.getElementById('notes');
  goals.value = prefs.goals; notes.value = prefs.notes;

  document.getElementById('savePlan').addEventListener('click', function () {
    prefs.goals = goals.value; prefs.notes = notes.value;
    try { localStorage.setItem('primePlan', JSON.stringify(prefs)); } catch (err) { /* ignorar */ }
    toast('✓ Saved!');
  });

  /* ---------- Inicio ---------- */
  renderPicker();
  renderGrid();

})();