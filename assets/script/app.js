const $map = document.querySelector("#map");

// Fonction getRestaurant (Fetch)
const getRestaurants = async () => {
  const response = await fetch('assets/list-restaurant.json');
  return response.json();
}

// GESTION MAP
const initMap = async function () {
  let map = new GoogleMap();
  let resto = new Restaurant();
  await map.load($map);
  const restaurants = await getRestaurants();
  restaurants.forEach(resto => {
    map.addMarker({
      coords: {
        lat: resto.lat,
        lng: resto.lon
      }
    }, map);
  })
  map.centerMap();
  map.positionUser();
}

if ($map !== null) {
  initMap();
}

// Ajout restaurant
const displayRestaurants = async () => {

  const restaurants = await getRestaurants();

  $('.content-restaurant').html (
    restaurants.map(resto => (
      `
      <div class="container-restaurant">
        <img alt="${resto.restaurantName}" src="${resto.imgUrl}"></img>
        <h2>${resto.restaurantName}</h2>
        <p>${resto.address}</p>
      </div>
      `
    )).join('')
  );
}

displayRestaurants();