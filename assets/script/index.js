let map, geocoder, service, infoWindow, lat, lng, panorama;

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
  const sv = new google.maps.StreetViewService();
  panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"));

  sv.getPanorama({
    location: city,
    radius: 50
  }, processSVData);

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

  // ***Récupération des restaurants autour de l'utilisateur *** //
  // On récupère les restaurants autour de l'utilisateur grâce à nearbySearch()
  service = new google.maps.places.PlacesService(map);

  // Récupération détails du restaurant
  service.nearbySearch({
      location: centerMap,
      radius: 380,
      type: "restaurant"
    },
    (results, status, pagination) => {
      if (status !== "OK") return;
      createMarkers(results, map);
      // moreButton.disabled = !pagination.hasNextPage;

      // if (pagination.hasNextPage) {
      //   getNextPage = pagination.nextPage;
      // }
    }
  );

  //Ecoute click map
  map.addListener("click", (e) => {
    placeMarkerAndPanTo(e.latLng, map);
    sv.getPanorama({
      location: e.latLng,
      radius: 50
    }, processSVData);

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


//Fonction modal
function displayModal() {

  // let reviewGestion = new ReviewGestion();
  // reviewGestion.initRating();

  const modal = document.querySelector(".modal-details-restaurant");
  const buttons = document.querySelectorAll(".btn-details");
  const close = document.querySelectorAll(".close");

  for (let i = 0; i < buttons.length; i++) {
    let openModalBtn = buttons[i];
    openModalBtn.addEventListener("click", function (event) {
        event.preventDefault();
        modal.style.display = "block";
    });
}

for (let i = 0; i < close.length; i++) {
  let closeModalBtn = close[i];
  closeModalBtn.addEventListener("click", function (event) {
      event.preventDefault();
      modal.style.display = "none";
      // Fonction Reset qui va retirer les eventListeners et retirer le vote HTML ("chaine de caractère")
      // ex: star.addEventListener("mouseleave", removeStar);
  });
}


}

//Fonction create markers
function createMarkers(places, map) {

  const bounds = new google.maps.LatLngBounds();
  const placesList = document.querySelector(".content-restaurant");

  service = new google.maps.places.PlacesService(map);

  function callback(place, status) {

    if (status == google.maps.places.PlacesServiceStatus.OK) {

      //Récupération du bon li avec son id (document.geteelementbyid)
      // // Ajout des caractéristiques
      // const li = document.createElement("li");
      // li.id = place.place_id;
      // placesList.appendChild(li);
      // recupRestoName = place.name;
    }

  }

  for (let i = 0; i < places.length; i++) {


    const place = places[i];

    const request = {
      placeId: place.place_id,
      fields: ['name', 'rating', 'formatted_phone_number', 'geometry']
    };

    service.getDetails(request, callback);

    new google.maps.Marker({
      map,
      title: place.name,
      position: place.geometry.location
    });

    //Nouvelle instance de ReviewGestion 
    let reviewGestion = new ReviewGestion();
    reviewGestion.initRating();

    const li = document.createElement("li");
    li.id = place.place_id;
    placesList.appendChild(li);

    recupRestoName = place.name;

    li.innerHTML =
      ` 
    <h3>${recupRestoName}</h3>
    `
    bounds.extend(place.geometry.location);
  }

  map.fitBounds(bounds);
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
function processSVData(data, status) {

  if (status === "OK") {
    const location = data.location;

    panorama.setPano(location.pano);
    panorama.setPov({
      heading: 270,
      pitch: 0,
    });

    panorama.setVisible(true);

  } else {
    console.error("Street View data not found for this location.");
  }
}