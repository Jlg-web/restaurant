class RestaurantController {

    constructor(googleMap) {
        this.modalDetailsButton = document.createElement("button");
        this.modalDetailsElement = document.getElementById("modal-details");
        this.restaurants = [];
        this.notices = [];
        this.googleMap = googleMap;
        this.modal = document.getElementById('modal');
        this.btnModal = document.getElementById("btn-modal");
        this.modalDetails = document.getElementById("modal-details-restaurant");
    }

    // Ajout restaurant
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

    //Ajout avis
    addNotice() {
        let textareaNotice = document.getElementById('textarea-notice').value;
        let recoveryNotice = document.querySelector('.recovery-notice');

        this.notices.push(textareaNotice);
        console.log(this.notices);
        document.forms[0].reset();

        this.notices.forEach(notice => {
            console.log(notice);
            recoveryNotice.innerHTML += `<p>${notice}</p>`;
        })
    }

    // Affichage - Apparition modal 
    showModal() {
        this.modal.style.display = "block";
    }

    showDetailsModal() {
        this.modalDetails.style.display = "flex";
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

    // Create btn 
    createBtn() {
        this.modalDetailsButton.classList.add("btn");
        this.modalDetailsButton.textContent = "Ajouter un avis";
        this.modalDetailsElement.appendChild(this.modalDetailsButton);
    }

    // display restaurant
    displayRestaurant(place, status) {

            if (status == this.googleMap.google.maps.places.PlacesServiceStatus.OK) {

                this.restaurants.push(place);
                const placesList = document.querySelector(".content-restaurant");

                console.log(place);

                new this.googleMap.google.maps.Marker({
                    map: this.googleMap.map,
                    title: place.name,
                    position: place.geometry.location
                });

                const li = document.createElement("li");
                li.id = place.place_id;
                placesList.appendChild(li);
                const recupRestoName = place.name;
                const restaurantAverage = place.rating;
                const address = place.formatted_address;

                li.innerHTML =
                    ` 
                <h3>${recupRestoName}</h3>
                <p>Moyenne du restaurant : ${restaurantAverage}</p>
                <p>${address}</p>
                `
                li.addEventListener("click", () => {
                    this.showDetailsModal();
                    this.createBtn();
                    this.modalDetailsButton.addEventListener("click", () => {
                        this.addNotice();
                    })

                });

                //Récupération du bon li avec son id (document.getelementbyid)
                // // Ajout des caractéristiques
                // const li = document.createElement("li");
                // this.li.id = place.place_id;
                // this.placesList.appendChild(this.li);
                // this.recupRestoName = place.name;
                // this.restaurantAverage = place.rating;
            }
    }

    //Fonction create markers
    createMarkers(places) {

        const bounds = new this.googleMap.google.maps.LatLngBounds();


        for (let i = 0; i < places.length; i++) {

            const place = places[i];

            const request = {
                placeId: place.place_id,
                fields: ['name', 'rating', 'formatted_address', 'geometry']
            };

            this.googleMap.placesService.getDetails(request, this.displayRestaurant.bind(this));
            // bounds.extend(place.geometry.location);
        }
        // map.fitBounds(bounds);
    }

}