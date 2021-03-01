// GESTION MAP
const initMap = async function () {

  // let googleMap = new GoogleMap();
  // let restaurant = new Restaurant();
  
  // const paris = new google.maps.LatLng(48.8566, 2.3522);
  let paris = location;

  let map = new google.maps.Map(document.getElementById('map'), {
    center: paris,
    zoom: 17
  });

  new google.maps.Marker({
    position: paris,
    map,
    title: "Hello World!",
  });

  let request = {
    location: paris,
    radius: '500',
    type: ['restaurant']
  };

  infowindow = new google.maps.InfoWindow();
  let service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);

  // let service = new google.maps.places.PlacesService(document.getElementById('map'));
  // service.nearbySearch(request, callback);

  
  // let service = new google.maps.places.PlacesService(map);
  // service.findPlaceFromQuery(request, (results, status) => {
  //   if (status === google.maps.places.PlacesServiceStatus.OK) {
  //     for (let i = 0; i < results.length; i++) {
  //       createMarker(results[i]);
  //     }
  //     map.setCenter(results[0].geometry.location);
  //   }
  // });


  // let restaurantController = new RestaurantController();
  // let restaurants = await restaurantController.getRestaurants();
  // console.log(restaurants);
  // await map.load($map);


  // The marker, positioned at Paris
  // const marker = new google.maps.Marker({
  //   position: paris,
  //   map: map,
  // });

  // restaurants.forEach(elmt => {
  //   map.addMarker({
  //     coords: {
  //       lat: elmt.lat,
  //       lng: elmt.lon
  //     }
  //   }, map);
  // })
  // Récuperer la position de l'utilisateur
  // map.centerMap();
  // map.positionUser();
  
  // restaurantController.addNewRestaurant();
}


function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {

  let placeLoc = place.geometry.location;
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });
  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name);
    infowindow.open(map);
  });
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var marker = new google.maps.Marker({
      map: map,
      place: {
        placeId: results[0].place_id,
        location: results[0].geometry.location
      }
    });
  }
}

google.maps.event.addDomlistener(window, 'load', initMap)

