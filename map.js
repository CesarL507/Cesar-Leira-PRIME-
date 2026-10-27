// =========================================================
// PRIME — map.js (solo para map.html)
// Mapa con Leaflet + lista de espacios deportivos con
// buscador y filtros por categoría.
// =========================================================
function boot() {

  var CATEGORIES = {
    football:   { label: 'Football',        color: '#16a34a' },
    baseball:   { label: 'Baseball',        color: '#dc2626' },
    multisport: { label: 'Multi-sport',     color: '#2563eb' },
    futsal:     { label: 'Futsal / Indoor', color: '#ea580c' },
    fitness:    { label: 'Fitness / Gym',   color: '#7c3aed' },
    gymnastics: { label: 'Gymnastics',      color: '#db2777' }
  };

  // Las coordenadas son aproximadas: ajústalas con las reales de cada lugar.
  var SPACES = [
    {
      name: 'Estadio Agustín "Muquita" Sánchez', cat: 'football', extra: '~5,000',
      address: 'Calle Matuna, Barrio Colón, La Chorrera',
      desc: 'Historic football stadium since 1963, known locally as "La Cancha de La Cocobola". Home ground of San Francisco F.C.',
      lat: 8.8836, lng: -79.7826
    },
    {
      name: 'Estadio Mariano Rivera', cat: 'baseball', extra: 'In progress',
      address: 'La Chorrera, Panamá Oeste (under construction)',
      desc: 'New baseball stadium and High Performance Baseball Center under construction in the district of La Chorrera.',
      lat: 8.8750, lng: -79.7700
    },
    {
      name: 'Complejo Deportivo 28 de Noviembre', cat: 'multisport', extra: '350 seated',
      address: 'Calle 21, Barrio Colón, La Chorrera',
      desc: 'Renovated municipal sports complex featuring a synthetic football pitch, a recreational court and a seated area.',
      lat: 8.8830, lng: -79.7790
    },
    {
      name: 'Complejo Deportivo Municipal de La Chorrera', cat: 'multisport', extra: 'Open-air',
      address: 'Calle 34 y 35 Sur, Barrio Balboa, La Chorrera',
      desc: 'Municipal sports complex in Barrio Balboa, near the Club de Leones de La Chorrera. Hosts local leagues and community events.',
      lat: 8.8730, lng: -79.7800
    },
    {
      name: 'Canchas Aéreas Panamá Oeste', cat: 'futsal', extra: 'By reservation',
      address: 'Av. Libertador (frente a la E/S Delta), Barrio Colón, La Chorrera',
      desc: 'First rooftop/aerial courts in Panamá Oeste. Rentable futsal courts with an on-site sports bar and restaurant.',
      lat: 8.8810, lng: -79.7760
    },
    {
      name: 'Smart Fit Costa Verde', cat: 'fitness', extra: 'Membership',
      address: 'C.C. Plaza Central, Vía Interamericana, Costa Verde, La Chorrera',
      desc: 'Modern fitness center in Plaza Central, Costa Verde. Equipped with cardio machines, free weights and group classes.',
      lat: 8.9330, lng: -79.7340
    },
    {
      name: 'FP Gimnasia — La Chorrera', cat: 'gymnastics', extra: 'Class-based',
      address: '6ta Sur, La Chorrera, Panamá Oeste',
      desc: 'Gymnastics training branch of the Federación Panameña de Gimnasia in La Chorrera. Instructional classes for all ages.',
      lat: 8.8765, lng: -79.7820
    }
  ];

  var listEl = document.getElementById('spaceList');
  var countEl = document.getElementById('count');
  var emptyEl = document.getElementById('emptyMsg');
  var searchInput = document.getElementById('searchInput');
  var chipEls = document.querySelectorAll('#chips .chip');
  var activeCats = {};      // categorías seleccionadas (vacío = todas)
  var markers = [];
  var items = [];
  var map = null;
  var selected = -1;

  /* ---------- Mapa ---------- */
  if (typeof L === 'undefined') {
    // Sin Leaflet: si ya hay mapa de respaldo (iframe) no se muestra el aviso de error
    if (!document.querySelector('#map iframe')) document.getElementById('mapError').hidden = false;
  } else {
    map = L.map('map', { zoomControl: true }).setView([8.8830, -79.7770], 13);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, HERE, Garmin, OpenStreetMap contributors'
    }).addTo(map);
  }

  function makeIcon(color) {
    return L.divIcon({
      className: '',
      html: '<div class="pin" style="--c:' + color + '"></div>',
      iconSize: [18, 18], iconAnchor: [9, 9], popupAnchor: [0, -12]
    });
  }

  function popupHtml(s) {
    var c = CATEGORIES[s.cat];
    return '<div class="pop-name">' + s.name + '</div>' +
      '<div class="pop-addr">' + s.address + '</div>' +
      '<div class="pop-desc">' + s.desc + '</div>' +
      '<div class="pop-tags" style="--c:' + c.color + '"><span class="tag">' + c.label + '</span><span class="tag-soft">' + s.extra + '</span></div>';
  }

  /* ---------- Lista + marcadores ---------- */
  SPACES.forEach(function (s, i) {
    var c = CATEGORIES[s.cat];

    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'space';
    card.style.setProperty('--c', c.color);
    card.innerHTML =
      '<div class="space-name"><span class="dot"></span>' + s.name + '</div>' +
      '<div class="space-addr">' + s.address + '</div>' +
      '<div class="space-desc">' + s.desc + '</div>' +
      '<div class="tags"><span class="tag">' + c.label + '</span><span class="tag-soft">' + s.extra + '</span></div>';
    card.addEventListener('click', function () { select(i); });
    listEl.appendChild(card);

    var marker = null;
    if (map) {
      marker = L.marker([s.lat, s.lng], { icon: makeIcon(c.color) }).addTo(map);
      marker.bindPopup(popupHtml(s));
      marker.on('click', function () { select(i, true); });
    }
    markers.push(marker);
    items.push(card);
  });

  function select(i, fromMarker) {
    selected = i;
    items.forEach(function (el, k) { el.classList.toggle('active', k === i); });
    markers.forEach(function (m, k) {
      if (!m) return;
      var pin = m.getElement() && m.getElement().querySelector('.pin');
      if (pin) pin.classList.toggle('active', k === i);
    });
    if (map && markers[i]) {
      if (!fromMarker) map.flyTo([SPACES[i].lat, SPACES[i].lng], 16, { duration: .8 });
      markers[i].openPopup();
    }
    if (fromMarker) items[i].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ---------- Filtros y búsqueda ---------- */
  function applyFilters() {
    var q = searchInput.value.trim().toLowerCase();
    var anyCat = Object.keys(activeCats).length > 0;
    var visible = 0;

    SPACES.forEach(function (s, i) {
      var okCat = !anyCat || activeCats[s.cat];
      var text = (s.name + ' ' + s.address + ' ' + s.desc + ' ' + CATEGORIES[s.cat].label + ' ' + s.extra).toLowerCase();
      var show = okCat && (!q || text.indexOf(q) !== -1);
      items[i].hidden = !show;
      if (markers[i]) {
        if (show) { if (!map.hasLayer(markers[i])) markers[i].addTo(map); }
        else if (map.hasLayer(markers[i])) map.removeLayer(markers[i]);
      }
      if (show) visible++;
    });

    countEl.textContent = visible + (visible === 1 ? ' SPACE' : ' SPACES');
    emptyEl.hidden = visible !== 0;
  }

  chipEls.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var cat = chip.getAttribute('data-cat');
      if (activeCats[cat]) { delete activeCats[cat]; } else { activeCats[cat] = true; }
      chip.classList.toggle('active', !!activeCats[cat]);
      applyFilters();
    });
  });

  searchInput.addEventListener('input', applyFilters);
  document.getElementById('clearBtn').addEventListener('click', function () {
    searchInput.value = '';
    activeCats = {};
    chipEls.forEach(function (c) { c.classList.remove('active'); });
    applyFilters();
    searchInput.focus();
  });

  applyFilters();

}

// ---------------------------------------------------------
// Arranque: usa Leaflet de cdnjs; si no cargó, prueba unpkg;
// si tampoco, muestra un mapa de respaldo (OpenStreetMap).
// ---------------------------------------------------------
function showFallbackMap() {
  var box = document.getElementById('map');
  box.innerHTML = '<iframe title="Map" style="width:100%;height:100%;border:0" ' +
    'src="https://www.openstreetmap.org/export/embed.html?bbox=-79.8300%2C8.8500%2C-79.7000%2C8.9500&layer=mapnik"></iframe>';
  document.getElementById('mapError').hidden = true;
  boot();
}

function loadScript(src, ok, fail) {
  var s = document.createElement('script');
  s.src = src; s.onload = ok; s.onerror = fail;
  document.head.appendChild(s);
}

if (window.L) {
  boot();
} else {
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(css);
  loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', boot, showFallbackMap);
}