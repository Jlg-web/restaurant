let map, geocoder, infoWindow, lat, lng, panorama;

let restaurants = [];
const outPut = document.getElementById("lsOutput");
const btnModal = document.getElementById("btn-modal");
const btnFilter = document.getElementById("btn-filter");

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

  //Filter
  btnFilter.addEventListener("click", () => {

    const startValue = parseInt(start.value, 10);
    const finishValue = parseInt(finish.value, 10);

    if (startValue !== finishValue) {
      console.log(`Start value = ${startValue}, Finish value = ${finishValue}`);
    } else if (startValue === finishValue) {
      console.log("Choisissez 2 valeurs différents.");
    }
    restaurants.filter(startValue, finishValue);
  });

  //Ecoute click map
  map.addListener("click", (e) => {
    restaurants.showModal(e.latLng);
    geocoder = new google.maps.Geocoder();
    geocodeLatLng(e, geocoder, map);
    restaurants.closeModalAddRestaurant();
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

//Gecoding inversé
function geocodeLatLng(e, geocoder) {

  const inputRestaurantAddress = document.getElementById("restaurant-address");

  geocoder.geocode({
    location: e.latLng
  }, function (results, status) {
    if (status === 'OK') {
      if (results[0]) {
        // console.log(results[0].formatted_address);
        inputRestaurantAddress.value = results[0].formatted_address;
      }
    }
  });

}