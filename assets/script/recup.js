// GESTION MAP
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
    google.maps.event.addListener(map, 'click', function (event) {
        // Add marker
        addMarker({
            coords: event.latLng
        });
    });

    // Add user geoloc
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(

            function (position) {

                const marker = new google.maps.Marker({
                    position: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
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
}

// FONCTIONS
//addMarker
function addMarker(props, map) {
    let marker = new google.maps.Marker({
        position: props.coords,
        map: map
    })
}


restaurants.forEach(resto => {
    addMarker({
        coords: {
            lat: resto.lat,
            lng: resto.lon
        }
    }, map);
})

// section.innerHTML = (
//   restaurants.map(restaurant => (
//     `
//     <article>
//     <div class="content-text">
//     <h2>${restaurant.restaurantName}</h2>
//      <p class="article-adress">Adresse : ${restaurant.address}</p>
//      </div>
//      </article>
//     `
//   )).join('')
// );