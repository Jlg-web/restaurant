class GoogleMap {

  constructor(placesService) {
    this.google = google;
    this.placesService = placesService;
    this.markers = [];
  }

  // Méthode d'ajout des marqueurs 
  addMarker(place) {
    const marker = new this.google.maps.Marker({
      map: map,
      title: place.name,
      position: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
    });
    this.markers.push(marker);
  }

  // Méthode de suppression des marqueurs
  removeMarkers() {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
  }

}