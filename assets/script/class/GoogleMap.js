class GoogleMap {

  constructor() {
    this.btnDetails = document.getElementById("btn-details");
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

        // EVENT CLICK MAP //
        this.map.addListener("click", (e) => {

          //Récupération de la valeur du champs "Nom du restaurant" du formulaire
          $('#restaurant-name').val('');
          //Récupération de la valeur du champs "Adresse du restaurant" du formulaire
          $('#restaurant-address').val('');
          // Ajout de la class active pour faire apparaitre la modal
          $('#modal').addClass("active");

          // Récupération de la position (latitude et longitude) et ajout du marker sur la map
          const clickPosition = e.latLng;
          this.placeMarkerAndPanTo(e.latLng, this.map);
          
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

          // EVENT SUBMIT MODAL //
          $('#form-add-restaurant').submit(function (e) {

            e.stopImmediatePropagation();
            $('#modal').removeClass("active");
            const restaurantName = $('#restaurant-name').val();
            const address = $('#restaurant-address').val();
            const lat = clickPosition.lat();
            const long = clickPosition.lng();

            // transformer l'objet en chaine de caractère
            // tableau pour recuperer les restaurants du localstorage

            let restaurants = new RestaurantController();
            let restaurant = new Restaurant(restaurantName, address);
            restaurants.addNewRestaurant(restaurant);
          })
          // END EVENT SUBMIT MODAL //
        });
        // END EVENT CLICK MAP
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
  placeMarkerAndPanTo(latLng) {
    new google.maps.Marker({
      position: latLng,
      map: this.map,
    });
    this.map.panTo(latLng);
  }
}