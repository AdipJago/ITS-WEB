// ----- Data -----
var reports = [
  { title: 'Overflowing bin', category: 'Cleanliness',     location: 'Canteen',            status: 'Resolved',    photo: null },
  { title: 'Flickering lamp', category: 'Lighting',        location: 'Library, 2nd floor', status: 'In Progress', photo: null },
  { title: 'Wobbly desk',     category: 'Broken Furniture', location: 'Room B201',          status: 'Pending',     photo: null }
];
// Urutan di atas: yang terbaru ada di bawah array, ditampilkan paling atas.
var photoData = null;

// ----- Navigation -----
var screens = {
  home: document.getElementById('homeScreen'),
  'new': document.getElementById('newScreen'),
  reports: document.getElementById('reportsScreen')
};
function show(name) {
  Object.keys(screens).forEach(function (k) { screens[k].hidden = (k !== name); });
  if (name === 'reports') renderList();
}
document.querySelectorAll('[data-go]').forEach(function (el) {
  el.addEventListener('click', function () { show(el.getAttribute('data-go')); });
});

// ----- Photo -----
var photoInput = document.getElementById('photo');
var attachBtn = document.getElementById('attachBtn');
attachBtn.addEventListener('click', function () { photoInput.click(); });
photoInput.addEventListener('change', function () {
  var file = photoInput.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function () {
    photoData = reader.result;
    attachBtn.innerHTML = '';
    var img = document.createElement('img');
    img.src = photoData; img.alt = '';
    var name = document.createElement('span');
    name.textContent = file.name;
    attachBtn.appendChild(img);
    attachBtn.appendChild(name);
  };
  reader.readAsDataURL(file);
});

// ----- Submit -----
var form = document.getElementById('reportForm');
var errorEl = document.getElementById('error');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  var category = document.getElementById('category').value;
  var description = document.getElementById('description').value.trim();
  var location = document.getElementById('location').value.trim();
  if (!category || !description || !location) {
    errorEl.textContent = 'Please choose a category and fill in the description and location.';
    return;
  }
  errorEl.textContent = '';
  reports.push({ title: description, category: category, location: location, status: 'Pending', photo: photoData });
  form.reset();
  photoData = null;
  attachBtn.textContent = '+ Attach Photo';
  show('reports');
});

// ----- Render list -----
function statusClass(s) {
  return s === 'Resolved' ? 'resolved' : (s === 'In Progress' ? 'progress' : 'pending');
}
function renderList() {
  var list = document.getElementById('list');
  list.innerHTML = '';
  reports.slice().reverse().forEach(function (r) {
    var card = document.createElement('article');
    card.className = 'card';
    if (r.photo) {
      var img = document.createElement('img');
      img.className = 'thumb'; img.src = r.photo; img.alt = 'Foto laporan';
      card.appendChild(img);
    }
    var body = document.createElement('div');
    body.className = 'body';
    var t = document.createElement('div'); t.className = 't'; t.textContent = r.title;
    var s = document.createElement('div'); s.className = 's'; s.textContent = r.category + ' · ' + r.location;
    var p = document.createElement('div'); p.className = 'pill ' + statusClass(r.status); p.textContent = r.status;
    body.appendChild(t); body.appendChild(s); body.appendChild(p);
    card.appendChild(body);
    list.appendChild(card);
  });
}
