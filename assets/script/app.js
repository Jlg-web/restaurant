const $map = document.querySelector("#map");

// GESTION MAP
const initMap = async function () {

  let map = new GoogleMap();
  let restaurant = new Restaurant();
  let restaurantController = new RestaurantController();
  let reviewGestion = new ReviewGestion();
  let restaurants = await restaurantController.getRestaurants();
  await map.load($map);

  restaurants.forEach(elmt => {
    map.addMarker({
      coords: {
        lat: elmt.lat,
        lng: elmt.lon
      }
    }, map);
  })
  
  reviewGestion.initRating();
  map.centerMap();
  map.positionUser();
  restaurantController.addNewRestaurant(restaurant);
}

if ($map !== null) {
  initMap();
}

