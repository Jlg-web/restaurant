let map, geocoder, infoWindow, lat, lng, panorama;
let restaurants = [];
const outPut = document.getElementById("lsOutput");
const btnModal = document.getElementById("btn-modal");
const btnFilter = document.getElementById("btn-filter");
const btnCancel = document.getElementById("btn-cancel");
const btnToggle = document.getElementById("btn-toggle");
const containerToggleBtn = document.querySelector(".toggle-button-list");
const containerMap = document.querySelector(".map");
const btnToggleTxt = document.querySelector("#btn-toggle p");
const menuMobile = document.getElementById("menu-mobile");
const menuMobileTxt = document.querySelector("#menu-mobile p")

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

  // On affiche la map + les options
  map = new google.maps.Map(document.getElementById("map"), options);

  // *** On ajoute le marker de l'utilisateur pour le repérer sur la map ***//
  // Ajout marker utilisateur
  const marker = new google.maps.Marker({
    position: centerMap,
    map: map,
    title: "Vous êtes ici !",
    icon: 'assets/img/user.svg'
  })

  const placesService = new google.maps.places.PlacesService(map);
  const googleMap = new GoogleMap(placesService);
  const restaurants = new RestaurantController(googleMap);
  restaurants.getRestaurants(centerMap);

  //Appliquer les filtres
  btnFilter.addEventListener("click", () => {
    let startValue = parseInt(start.value, 10);
    let finishValue = parseInt(finish.value, 10);
    restaurants.addilter(startValue, finishValue);
  });

  //Retirer les filtres
  btnCancel.addEventListener("click", () => {
    const selectStart = document.querySelector("select#start");
    const selectFinish = document.querySelector("select#finish");
    restaurants.cancelFilter(selectStart, selectFinish);
  })

  // Toggle
  btnToggle.addEventListener("click", () => {
    if(outPut.style.left === "-100%") {

      outPut.classList.add("hide");
      outPut.style.left = "0";
      containerToggleBtn.style.right = "68.3%";
      containerMap.style.width = "70%";
      btnToggleTxt.innerHTML = "Hide";
    } else {
      containerToggleBtn.classList.add = "toggle-button-arrow";
      outPut.classList.add("show");
      outPut.style.left = "-100%";
      containerToggleBtn.style.right = "inherit";
      containerMap.style.width = "100%";
      btnToggleTxt.innerHTML = "Show";
    }
  })

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

  // Mobile
  menuMobile.addEventListener("click", () => {
    if(outPut.style.display === "flex") {
      outPut.style.display = "none";
      menuMobileTxt.innerHTML = "Afficher la liste";
    } else {
      outPut.style.display = "flex";
      menuMobileTxt.innerHTML = "Réduire la liste";
    }
  });
}

//Gecoding
function geocodeLatLng(e, geocoder) {

  const inputRestaurantAddress = document.getElementById("restaurant-address");

  geocoder.geocode({
    location: e.latLng
  }, function (results, status) {
    if (status === 'OK') {
      if (results[0]) {
        inputRestaurantAddress.value = results[0].formatted_address;
      }
    }
  });

}