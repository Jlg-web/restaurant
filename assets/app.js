const header = document.querySelector('header');
const section = document.querySelector('section');
const url = 'assets/list-restaurant.json';

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    infoRestaurant(response);
  });

// MAP
function initMap() {

  // Localisation par défaut
  let defaultLocation = {
    lat: 48.8737815,
    lng: 2.3501649
  };

  // Affichage de la carte
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 10,
    mapTypeId: "roadmap"
  });

  // Geolocalisation utilisateur
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        map.setCenter(pos);
        let marker = new google.maps.Marker({
          position: pos,
          map: map,
          // icon: {
          //   url: "http://maps.google.com/mapfiles/ms/icons/grn-pushpin.png"
          // }
        });

      },
      function () {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // Ajout d'un marker au click
  map.addListener("click", (e) => {
    placeMarkerAndPanTo(e.latLng, map);
  });

}

// Ajout Marker et gestion
function placeMarkerAndPanTo(latLng, map) {
  new google.maps.Marker({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
}


function infoRestaurant(jsonObj) {

  const resto = jsonObj['restaurants'];

  for (let i = 0; i < resto.length; i++) {
    const myArticle = document.createElement('article');

    //Name
    const nameRestaurant = document.createElement('h2');
    nameRestaurant.textContent = resto[i].restaurantName;
    myArticle.appendChild(nameRestaurant);

    //Address
    const address = document.createElement('p');
    address.textContent = resto[i].address;
    myArticle.appendChild(address);

    section.appendChild(myArticle);
  }
}


