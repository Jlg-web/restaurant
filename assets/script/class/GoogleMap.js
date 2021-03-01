class GoogleMap {

  constructor(placesService, google, map) {
    this.btnDetails = document.getElementById("btn-details");
    this.map = map;
    this.bounds = null;
    this.placesService = placesService;
    this.google = google;

  }

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