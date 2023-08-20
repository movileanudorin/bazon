// Datele initiale
var data = [];

// Afiseaza datele in pagina web
var dataContainer = document.getElementById('data-container');

// Incarca datele initiale
fetch('Films4K.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(jsonData) {
    data = jsonData;
    renderData();
  })
  .catch(function(error) {
    console.error('Eroare la incarcarea datelor:', error);
  });

// Afiseaza datele in pagina web
function renderData() {
  dataContainer.innerHTML = '';

  var list = document.createElement('ul');
  list.classList.add('data-list');

  data.forEach(function(item, index) {
    var listItem = document.createElement('li');
    listItem.classList.add('data-item');

    var nameLabel = document.createElement('label');
    nameLabel.textContent = 'NUME:';
    listItem.appendChild(nameLabel);

    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = item.name;
    listItem.appendChild(nameInput);

    var pictureLabel = document.createElement('label');
    pictureLabel.textContent = 'IMAGINE:';
    listItem.appendChild(pictureLabel);

    var pictureInput = document.createElement('input');
    pictureInput.type = 'text';
    pictureInput.value = item.picture;
    listItem.appendChild(pictureInput);
    
    var videoLabel = document.createElement('label');
    videoLabel.textContent = 'Video:';
    listItem.appendChild(videoLabel);

    var videoInput = document.createElement('input');
    videoInput.type = 'text';
    videoInput.value = item.video;
    listItem.appendChild(videoInput);
    
    list.appendChild(listItem);

    // Asculta evenimentele de modificare pentru a salva datele actualizate
    nameInput.addEventListener('change', function(event) {
      data[index].name = event.target.value;
      saveData();
    });

    pictureInput.addEventListener('change', function(event) {
      data[index].picture = event.target.value;
      saveData();
    });

    videoInput.addEventListener('change', function(event) {
      data[index].video = event.target.value;
      saveData();
    });
  });

  dataContainer.appendChild(list);
}

// Salveaza datele pe server
function saveData() {
  fetch('save-data.php', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(function(response) {
    if (response.ok) {
      console.log('Date salvate cu succes');
      updateData();
    } else {
      console.log('Eroare la salvarea datelor');
    }
  })
  .catch(function(error) {
    console.error('Eroare la salvarea datelor:', error);
  });
}

// Actualizeaza datele din fisierul Films4K.json
function updateData() {
  fetch('Films4K.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(jsonData) {
      data = jsonData;
      renderData();
    })
    .catch(function(error) {
      console.error('Eroare la actualizarea datelor:', error);
    });
}

// Apelati functia initiala pentru a afisa datele
renderData();


