class RestaurantController {

    constructor(googleMap) {
        this.restaurants = [];
        this.googleMap = googleMap;
        this.modal = document.getElementById('modal');
        this.btnModal = document.getElementById("btn-modal");
        this.modalDetails = document.getElementById("modal-details-restaurant");
    }

    addRestaurant() {

        console.log(this.restaurants);

        let newRestaurant = {
            name: document.getElementById('restaurant-name').value,
            formatted_address: document.getElementById('restaurant-address').value
        }

        this.restaurants.push(newRestaurant);
        document.forms[0].reset();

        this.restaurants.forEach(restaurant => {
            console.log(restaurant);
            outPut.innerHTML +=
            `
          <div class="global-recup-resto">
            <h3 class="title-resto">${restaurant.name}</h3>
            <p class="address-resto">${restaurant.formatted_address}</p>
          </div>
          `
        });
        modal.style.display = "none";
    }

    // Affichage - Apparition modal 
    showModal() {
        this.modal.style.display = "block";
    }

    showDetailsModal() {
        this.modalDetails.style.display = "block";
    }

    // Récupération des restaurants
    getRestaurants(centerMap) {
        this.googleMap.placesService.nearbySearch({
                location: centerMap,
                radius: 380,
                type: "restaurant"
            },
            (results, status) => {
                if (status !== "OK") return;
                this.createMarkers(results);
            }
        );
    }

    //Fonction create markers
    createMarkers(places) {

        const bounds = new this.googleMap.google.maps.LatLngBounds();
        const placesList = document.querySelector(".content-restaurant");

        function callback(place, status) {

            if (status == this.googleMap.google.maps.places.PlacesServiceStatus.OK) {

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

            // À mettre dans le callback
            this.restaurants.push(place);

            const request = {
                placeId: place.place_id,
                fields: ['name', 'rating', 'formatted_address', 'geometry']
            };

            this.googleMap.placesService.getDetails(request, callback.bind(this));
            new this.googleMap.google.maps.Marker({
                map: this.googleMap.map,
                title: place.name,
                position: place.geometry.location
            });

            //Nouvelle instance de ReviewGestion 
            let reviewGestion = new ReviewGestion();
            reviewGestion.initRating();
            const li = document.createElement("li");
            li.id = place.place_id;
            placesList.appendChild(li);
            const recupRestoName = place.name;
            const restaurantAverage = place.rating;
            li.innerHTML =
            ` 
            <h3>${recupRestoName}</h3>
            <p> Moyenne du restaurant : ${restaurantAverage}</p>
            `
            li.addEventListener("click", () => {
                this.showDetailsModal();
                const modalDetailsElement = document.getElementById("modal-details");
                const modalDetailsButton = document.createElement("button");
                modalDetailsButton.textContent = "Ajouter un commentaire";
                modalDetailsElement.appendChild(modalDetailsButton);
                modalDetailsButton.addEventListener("click", () => {
                    console.log(place.place_id);
                })
            });
            // bounds.extend(place.geometry.location);
        }
        // map.fitBounds(bounds);
    }

}