let map, geocoder, infoWindow, lat, lng, panorama;

let restaurants = [];
const outPut = document.getElementById("lsOutput");
const btnModal = document.getElementById("btn-modal");

const getUserPosition = async () => {
  const pos = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

  lat = pos.coords.latitude;
  lng = pos.coords.longitude;
};

//Initialisation MAP
const initMap = async function () {

  // *** Récupération Latitude et longitude de l'utilisateur grâce à navigator.geolocation *** //
  await getUserPosition();

  // *** Affichage de la MAP ***//
  // On centre la map sur l'utilisateur
  let centerMap = new google.maps.LatLng(lat, lng);

  // On définie des options
  let options = {
    zoom: 15,
    center: centerMap,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: false,
  }

  const city = {
    lat: 48.897386,
    lng: 2.5231119
  };

  //PANORAMA STREET VIEW
  // const sv = new google.maps.StreetViewService();
  // panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"));

  // sv.getPanorama({
  //   location: city,
  //   radius: 50
  // }, processSVData);

  // On affiche la map + les options
  map = new google.maps.Map(document.getElementById("map"), options);

  // *** On ajoute le marker de l'utilisateur pour le repérer sur la map ***//
  // Ajout marker utilisateur
  let marker = new google.maps.Marker({
    position: centerMap,
    map: map,
    title: "Vous êtes ici !",
    icon: 'assets/img/user.svg'
  })

  const placesService = new google.maps.places.PlacesService(map);
  const googleMap = new GoogleMap(placesService, google, map);
  const restaurants = new RestaurantController(googleMap);

  restaurants.getRestaurants(centerMap);
  btnModal.addEventListener("click", () => {
    restaurants.addRestaurant();
  });


  //Ecoute click map
  map.addListener("click", (e) => {
    placeMarkerAndPanTo(e.latLng, map);
    restaurants.showModal();
    // sv.getPanorama({
    //   location: e.latLng,
    //   radius: 50
    // }, processSVData);
  });

  //Ecoute click marker
  marker.addListener("click", () => {
    const markerPanoID = location.pano;
    panorama.setPano(markerPanoID);
    panorama.setPov({
      heading: 270,
      pitch: 0,
    });
    panorama.setVisible(true);
  });
}

// Fonction add marker
function placeMarkerAndPanTo(latLng, map) {
  new google.maps.Marker({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
}

// Fonction Panorama
// function processSVData(data, status) {

//   if (status === "OK") {
//     const location = data.location;

//     panorama.setPano(location.pano);
//     panorama.setPov({
//       heading: 270,
//       pitch: 0,
//     });

//     panorama.setVisible(true);

//   } else {
//     console.error("Street View data not found for this location.");
//   }
// }