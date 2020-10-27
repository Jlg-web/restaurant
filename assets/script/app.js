const $map = document.querySelector("#map");

// Fonction getRestaurant (Fetch)
const getRestaurant = async () => {
  const response = await fetch('assets/list-restaurant.json');
  return response.json();
}

// GESTION MAP
class GoogleMap {

  constructor() {
    this.map = null;
    this.bounds = null;
  }

  async load(element) {
    return new Promise((resolve, reject) => {

      $script('https://maps.googleapis.com/maps/api/js?key=AIzaSyCzFwWZ9ZZTlhTFhJc95JH-YT181mXx08I', () => {
        const center = {
          lat: -25.344,
          lng: 131.036
        };
        this.map = new google.maps.Map(element);
        this.bounds = new google.maps.LatLngBounds();
        this.map.addListener("click", (e) => {
          const modal = document.querySelector("#modal");
          const clickPosition = e.latLng;
          this.placeMarkerAndPanTo(e.latLng, this.map);
          modal.classList.add("active");

          // Récupération de l'adresse du restaurant
          let geocoder = new google.maps.Geocoder();
          geocoder.geocode({
            'location': clickPosition
          }, function (results, status) {
            if (status === 'OK') {
              if (results[0]) {
                $('#restaurant-address').val(results[0].formatted_address);
              } else {
                window.alert('No results found');
              }
            } else {
              window.alert('Geocoder failed due to: ' + status);
            }
          });

          // submit modal
          $('#form-add-restaurant').submit(function () {
            $('#modal').modal('close'); 
          });
        });
        resolve();
      });
    });
  };

  // Méthode addmarker (Ajout des markers restaurants)
  addMarker(props) {
    let point = props.coords;
    let marker = new google.maps.Marker({
      position: point,
      map: this.map
    });
    this.bounds.extend(point)
  }

  //Méthode centerMap (Centrage de la map)
  centerMap() {
    this.map.panToBounds(this.bounds);
    this.map.fitBounds(this.bounds);
  }

  // Position User
  positionUser() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(

        (position) => {
          const marker = new google.maps.Marker({
            position: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            map: this.map,
            icon: 'assets/img/user.svg'
          });
        },
        () => {
          handleLocationError(true, infoWindow, this.map.getCenter());
        }
      );
    } else {
      // Le navigateur ne prend pas en charge la géolocalisation
      handleLocationError(false, infoWindow, this.map.getCenter());
    }
  }

  //placeMarkerAndPanTo
  placeMarkerAndPanTo(latLng, map) {
    new google.maps.Marker({
      position: latLng,
      map: map,
    });
    map.panTo(latLng);
  }
}

const initMap = async function () {
  let map = new GoogleMap();
  await map.load($map);
  const restaurants = await getRestaurant();
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

// GESTION RESTAURANTS
const displayRestaurants = async () => {

  const restaurants = await getRestaurant();

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