// =========================================================
// PRIME — community.js (solo para community.html)
//  1) Filtro de deportes
//  2) Ventana de registro al pulsar "JOIN TEAM"
//  3) Panel lateral de perfil al pulsar "VIEW PROFILE"
// =========================================================
(function () {

  /* ---------- 1) Filtro de deportes ---------- */
  var buttons = document.querySelectorAll('#filters .filter');
  var cards = document.querySelectorAll('#teamGrid .team-card');

  function applyFilter(filter) {
    buttons.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-filter') === filter);
    });
    cards.forEach(function (card) {
      card.hidden = !(filter === 'all' || card.getAttribute('data-sport') === filter);
    });
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () { applyFilter(b.getAttribute('data-filter')); });
  });
  applyFilter('all');

  /* ---------- Utilidades de ventanas ---------- */
  var joinOverlay = document.getElementById('joinOverlay');
  var profileOverlay = document.getElementById('profileOverlay');

  function openOverlay(el) {
    el.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(function () { el.classList.add('show'); });
  }
  function closeOverlay(el) {
    el.classList.remove('show');
    setTimeout(function () {
      el.hidden = true;
      if (joinOverlay.hidden && profileOverlay.hidden) document.body.classList.remove('no-scroll');
    }, 250);
  }
  [joinOverlay, profileOverlay].forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (e.target === el || e.target.hasAttribute('data-close')) closeOverlay(el);
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!joinOverlay.hidden) closeOverlay(joinOverlay);
      if (!profileOverlay.hidden) closeOverlay(profileOverlay);
    }
  });

  /* ---------- 2) Registro de equipo ---------- */
  var FEATURES = {
    'El Coco Court': ['Pro lighting', 'Locker rooms', 'Artificial turf', 'Parking', 'Showers'],
    'Hurtado Football Club': ['Active league', 'Weekly training', 'Artificial turf', 'Referees'],
    'La Chorrera Padel Club': ['Tempered glass', 'Climate lounge', 'Pro lighting', 'Parking'],
    'Colón Padel Team': ['Monthly tournaments', 'Coaching', 'Pro lighting', 'Locker rooms'],
    'Puerto Caimito Arena': ['Regulation hoops', 'Bleachers (120)', 'Locker rooms', 'Parking'],
    'Guácimo Ballers': ['Youth program', 'Certified coaches', 'Weekly practice'],
    'Playa Leona Sports Hub': ['Pro net', 'Regulation floor', 'Locker rooms', 'Showers'],
    'Los Andes Volley Squad': ['Weekend matches', 'Mixed teams', 'Friendly league'],
    'Farallón Tennis Center': ['Fast-clay courts', 'Certified coaches', 'Pro lighting', 'Parking'],
    'El Trébol Tennis Academy': ['Group classes', 'All levels', 'Equipment loan'],
    'Vacamonte Run Track': ['Seaside track', 'Calisthenics stations', 'Free access'],
    'Cardona Runners': ['Sunrise outings', 'Group runs', 'Free access']
  };

  var joinForm = document.getElementById('joinForm');
  var joinDone = document.getElementById('joinDone');

  document.querySelectorAll('[data-join]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var card = btn.closest('.team-card');
      var court = card.querySelector('h4').textContent.trim();

      document.getElementById('joinTag').textContent = card.querySelector('.sport-tag').textContent;
      document.getElementById('joinName').textContent = card.querySelector('.team-cover h3').textContent;
      document.getElementById('joinPlace').textContent = court;
      document.getElementById('joinRating').textContent = '★ ' + card.querySelector('.rating').textContent.replace('★', '').trim();
      document.getElementById('joinMembers').textContent = card.querySelector('.members').textContent;
      document.getElementById('joinDesc').textContent =
        card.querySelector('.desc').textContent + ' Secure your spot in the community.';

      var list = document.getElementById('joinFeatures');
      list.innerHTML = '';
      (FEATURES[court] || []).forEach(function (f) {
        var li = document.createElement('li');
        li.textContent = f;
        list.appendChild(li);
      });

      joinForm.reset();
      joinForm.hidden = false;
      joinDone.hidden = true;
      openOverlay(joinOverlay);
    });
  });

  joinForm.addEventListener('submit', function (e) {
    e.preventDefault();
    joinForm.hidden = true;
    joinDone.hidden = false;
  });

  /* ---------- 3) Perfil de atleta ---------- */
  var ATHLETES = {
    df: {
      initials: 'DF', name: 'Diego Fábrega', level: 'ADVANCED', badge: '★ 4.9 · FOOTBALL',
      about: '8 years coaching youth teams. Specialist in individual technique.',
      perf: [['Overall Rating', 4.9], ['Coaching Quality', 4.9], ['Communication', 4.7], ['Value for Money', 4.8]],
      specialties: ['Individual Technique', 'Youth Training', 'Ball Control'],
      stats: [['124', 'MATCHES'], ['38', 'GOALS'], ['5', 'TROPHIES']],
      reviews: [
        ['Carlos M.', '2 weeks ago', 'Scored 10 goals in a month', '"Diego fixed my first touch in just a few sessions."'],
        ['Jorge P.', '1 month ago', 'Made the club squad', '"Patient, clear and very professional."'],
        ['Lucía R.', '2 months ago', 'Improved finishing', '"My son loves training with him."']
      ],
      email: 'diego.fabrega@primecoach.io', phone: '+507 6345-1120', place: 'El Coco Court',
      hours: 'Mon–Fri · 4PM–8PM', rate: '$45 / session'
    },
    cu: {
      initials: 'CU', name: 'Camila Ureña', level: 'PROFESSIONAL', badge: '★ 5 · PADEL',
      about: 'Former professional padel player. Personalized lessons for all levels.',
      perf: [['Overall Rating', 5.0], ['Coaching Quality', 5.0], ['Communication', 4.8], ['Value for Money', 4.9]],
      specialties: ['Backhand Wall Play', 'Net Positioning', 'Match Strategy'],
      stats: [['98', 'MATCHES'], ['72', 'WINS'], ['8', 'TROPHIES']],
      reviews: [
        ['Paola V.', '1 week ago', 'Climbed from 2.5 to 3.5', '"Camila is incredible. Her attention to footwork detail changed my game."'],
        ['Andrés L.', '3 weeks ago', 'Won first club tournament', '"The best padel coach in La Chorrera."'],
        ['Mónica S.', '1 month ago', 'Improved serve consistency', '"Amazing coach and person. Highly recommend."']
      ],
      email: 'camila.urena@primecoach.io', phone: '+507 6234-8890', place: 'La Chorrera Padel Club',
      hours: 'Tue–Sat · 7AM–12PM', rate: '$60 / session'
    },
    rs: {
      initials: 'RS', name: 'Ricardo Solis', level: 'COACH', badge: '★ 4.8 · ATHLETICS',
      about: 'Strength & conditioning coach and running guide. Progressive plans from 5K to 21K.',
      perf: [['Overall Rating', 4.8], ['Coaching Quality', 4.9], ['Communication', 4.6], ['Value for Money', 4.8]],
      specialties: ['Endurance Plans', 'Strength Training', 'Race Pacing'],
      stats: [['45', 'RACES'], ['1:32:10', 'PR'], ['3', 'TROPHIES']],
      reviews: [
        ['Ana G.', '1 week ago', 'First 10K finished', '"His plan made running feel doable for me."'],
        ['Marcos T.', '1 month ago', 'Cut 8 minutes off 10K', '"Great coach, always on time."'],
        ['Elena F.', '2 months ago', 'Half marathon completed', '"Motivating and very organized."']
      ],
      email: 'ricardo.solis@primecoach.io', phone: '+507 6456-2231', place: 'Vacamonte Run Track',
      hours: 'Mon–Sat · 5AM–9AM', rate: '$35 / session'
    },
    mg: {
      initials: 'MG', name: 'Mariana Gómez', level: 'INTERMEDIATE', badge: '★ 4.7 · 5-A-SIDE FOOTBALL',
      about: 'Forward for Los Halcones FC. Active player every week in El Coco.',
      perf: [['Overall Rating', 4.7], ['Teamwork', 4.8], ['Communication', 4.6], ['Reliability', 4.9]],
      specialties: ['Finishing', 'Pressing', 'Team Play'],
      stats: [['42', 'MATCHES'], ['21', 'GOALS'], ['2', 'TROPHIES']],
      reviews: [
        ['Luis T.', '1 week ago', 'Hat trick last Saturday', '"Always shows up and plays hard."'],
        ['Sofía R.', '3 weeks ago', 'Team captain', '"Great teammate, great energy."'],
        ['Daniel V.', '1 month ago', 'Top scorer of the month', '"Makes everyone around her better."']
      ],
      email: 'mariana.gomez@prime.app', phone: '+507 6111-4021', place: 'El Coco Court',
      hours: 'Weeknights · 7PM–10PM', rate: 'Free · team play'
    },
    lt: {
      initials: 'LT', name: 'Luis Torres', level: 'ADVANCED', badge: '★ 4.6 · BASKETBALL',
      about: 'Match organizer at Puerto Caimito. Point guard with great court vision.',
      perf: [['Overall Rating', 4.6], ['Organization', 4.8], ['Communication', 4.7], ['Court Vision', 4.9]],
      specialties: ['Playmaking', 'Match Organization', 'Fast Break'],
      stats: [['87', 'MATCHES'], ['412', 'POINTS'], ['4', 'TROPHIES']],
      reviews: [
        ['Pedro A.', '2 weeks ago', 'Joined weekly league', '"Games with Luis are always well organized."'],
        ['Karla B.', '1 month ago', 'First tournament', '"Super friendly and fair."'],
        ['Ivan C.', '2 months ago', 'Improved passing', '"Learned so much from his court vision."']
      ],
      email: 'luis.torres@prime.app', phone: '+507 6222-3098', place: 'Puerto Caimito Arena',
      hours: 'Mon–Thu · 6PM–9PM', rate: 'Free · open games'
    },
    av: {
      initials: 'AV', name: 'Andrea Vega', level: 'INTERMEDIATE', badge: '★ 4.8 · PADEL',
      about: 'Padel player in La Chorrera. Climbed 2 levels in 6 months with Prime.',
      perf: [['Overall Rating', 4.8], ['Consistency', 4.7], ['Communication', 4.8], ['Sportsmanship', 4.9]],
      specialties: ['Volley Control', 'Doubles Play', 'Defense'],
      stats: [['56', 'MATCHES'], ['34', 'WINS'], ['1', 'TROPHY']],
      reviews: [
        ['Rosa M.', '1 week ago', 'Reached level 3.0', '"A fun and fair partner to play doubles with."'],
        ['Tomás H.', '1 month ago', 'Won club doubles', '"Very reliable on court."'],
        ['Nadia P.', '2 months ago', 'Improved defense', '"Great energy every match."']
      ],
      email: 'andrea.vega@prime.app', phone: '+507 6333-7712', place: 'La Chorrera Padel Club',
      hours: 'Tue–Thu · 6AM–8AM', rate: 'Free · doubles'
    }
  };

  var drawerContent = document.getElementById('drawerContent');
  var quickInput = document.getElementById('quickInput');
  var currentFirstName = '';

  function stars() { return '★★★★★'; }

  function renderAthlete(a) {
    var perf = a.perf.map(function (p) {
      return '<div class="perf-row"><div class="perf-top"><span>' + p[0].toUpperCase() + '</span><b>' + p[1].toFixed(1) +
        '</b></div><div class="bar"><i style="width:' + (p[1] / 5 * 100) + '%"></i></div></div>';
    }).join('');
    var spec = a.specialties.map(function (s) { return '<li><i>⚡</i>' + s + '</li>'; }).join('');
    var stats = a.stats.map(function (s) { return '<li><strong>' + s[0] + '</strong><span>' + s[1] + '</span></li>'; }).join('');
    var reviews = a.reviews.map(function (r) {
      return '<article class="review"><div class="review-top"><div><b>' + r[0] + '</b><small>' + r[1] +
        '</small></div><span class="stars">' + stars() + '</span></div><p class="achv">🏆 ' + r[2] +
        '</p><p class="quote">' + r[3] + '</p></article>';
    }).join('');

    return '' +
      '<div class="drawer-hero"><div class="avatar xl">' + a.initials + '</div></div>' +
      '<div class="drawer-head"><span class="pill static">' + a.badge + '</span><span class="level-chip">' + a.level + '</span>' +
      '<h3>' + a.name + '</h3></div>' +
      '<p class="d-label">ABOUT</p><p class="d-text">' + a.about + '</p>' +
      '<p class="d-label">PERFORMANCE</p><div class="perf">' + perf + '</div>' +
      '<p class="d-label">SPECIALTIES</p><ul class="spec">' + spec + '</ul>' +
      '<p class="d-label">CAREER STATS</p><ul class="career">' + stats + '</ul>' +
      '<p class="d-label">FIELD NOTES · ' + a.reviews.length + ' REVIEWS</p>' + reviews +
      '<p class="d-label">CONTACT</p><div class="contact-box">' +
      '<p><i>✉</i>' + a.email + '</p><p><i>☎</i>' + a.phone + '</p><p><i>📍</i>' + a.place + '</p><p><i>🕐</i>' + a.hours + '</p>' +
      '<div class="rate"><span>SESSION RATE</span><b>' + a.rate + '</b></div></div>';
  }

  document.querySelectorAll('[data-athlete]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var a = ATHLETES[btn.getAttribute('data-athlete')];
      currentFirstName = a.name.split(' ')[0];
      drawerContent.innerHTML = renderAthlete(a);
      drawerContent.scrollTop = 0;
      quickInput.value = '';
      quickInput.placeholder = 'Quick message to ' + currentFirstName + '...';
      document.getElementById('secureBtn').textContent = 'SECURE SESSION';
      openOverlay(profileOverlay);
    });
  });

  document.getElementById('quickForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!quickInput.value.trim()) return;
    quickInput.value = '';
    quickInput.placeholder = 'Message sent to ' + currentFirstName + ' ✓';
  });

  document.getElementById('secureBtn').addEventListener('click', function () {
    this.textContent = 'SESSION REQUESTED ✓';
  });

  /* ---------- Contacto (demostración) ---------- */
  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      contactForm.reset();
      var btn = contactForm.querySelector('.btn-send');
      btn.textContent = 'MESSAGE SENT ✓';
    });
  }

})();