let map, geocoder, service, infoWindow, lat, lng;

//Initialisation MAP
const initMap = async function () {

  // ************************************************************************** //
  // ********** Récupération Latitude et longitude de l'utilisateur grâce à navigator.geolocation ********** //
  // ************************************************************************** //
  navigator.geolocation.getCurrentPosition(function (pos) {
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
  });

  $(".btn-display-map").ready(function () {

    // ************************************************************************** //
    // ********** Affichage de la MAP ********** //
    // ************************************************************************** //

    // On centre la map sur l'utilisateur
    let centerMap = new google.maps.LatLng(lat, lng);

    // On définie des options
    let options = {
      zoom: 15,
      center: centerMap,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    // On affiche la map + les options
    map = new google.maps.Map(document.getElementById("map"), options);

    // ************************************************************************** //
    // ********** On ajoute le marker de l'utilisateur pour le repérer sur la map ********** //
    // ************************************************************************** //

    // Ajout marker utilisateur
    let marker = new google.maps.Marker({
      position: centerMap,
      map: map,
      title: "Vous êtes ici !",
      icon: 'assets/img/user.svg'
    })

    // ************************************************************************** //
    // ********** Récupération des restaurants autour de l'utilisateur ********** //
    // ************************************************************************** //

    // On initialise les paramètres de la récupération des restaurants autour de l'utilisateur
    let request = {
      location: centerMap,
      radius: '1000',
      type: ['restaurant']
    }
  
    // On récupère les restaurants autour de l'utilisateur et on affiche les markers grâce à la fonction "createMarker"
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

    return false;
  });
}

// Fonction callBack
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}


//Fonction createMarker
// function createMarker(place) {
  

//   const marker = new google.maps.Marker({
//     map,
//     title: place.name,
//     position: place.geometry.location,
//   });

//   google.maps.event.addListener(marker, "click", () => {
//     infowindow.setContent(place.name);
//     infowindow.open(map);
//   });

// }



