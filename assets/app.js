const header = document.querySelector('header');
const section = document.querySelector('section');
const nameRestaurant = document.createElement('h2');
const address = document.createElement('p');
let map;

const fetchSearch = async () => {
  return fetch('assets/list-restaurant.json')
    .then(res => res.json())
    .then(res => res.restaurants) 
};

  // Function Add Marker
  function addMarker(props, map) {
    let marker = new google.maps.Marker({
      position: props.coords,
      map: map
    })
  }

//*** AFFICHAGE MAP ***/
function initMap() {
  
  // Map options
  let optionsMap = {
    zoom: 11,
    center: {
      lat: 48.8833024,
      lng: 2.5329664
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  // New map
  map = new google.maps.Map(document.getElementById("map"), optionsMap);

  // Listen click map
  google.maps.event.addListener(map, 'click', function(event){
    // Add marker
    addMarker({coords:event.latLng});
  });

  // Add user geoloc
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(

      function (position) {

        const marker = new google.maps.Marker({
          position: { lat: position.coords.latitude, lng: position.coords.longitude},
          map: map,
          icon: 'assets/img/user.svg'
        });
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Le navigateur ne prend pas en charge la géolocalisation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  //Markers
  // addMarker({ coords:{lat: 48.8737815,lng: 2.3501649 }});
  // addMarker({ coords:{lat: 48.8551297,lng: 2.3610925 }});
  // addMarker({ coords:{lat: 48.8468771,lng: 2.34899663 }});
  // addMarker({ coords:{lat: 48.8865035,lng: 2.3442197 }});
  // addMarker({ coords:{lat: 48.8686307,lng: 2.3170153}});
  // addMarker({ coords:{lat: 48.8860196,lng: 2.3487899}});

}

//*** AFFICHAGE RESTAURANTS ***/
const display = async () => {

  const restaurants = await fetchSearch();
  console.log(restaurants);

  restaurants.forEach(restaurant => {
    addMarker({ coords:{lat: restaurant.lat,lng: restaurant.lon }}, map);
  });

  // Liste des restaurants
  section.innerHTML = (
    restaurants.map(restaurant => (
      `
      <article>
      <div class="content-text">
      <h2>${restaurant.restaurantName}</h2>
       <p class="article-adress">Adresse : ${restaurant.address}</p>
       </div>
       </article>
      `
    )).join('')
  );
};

// Appel fonction
display();