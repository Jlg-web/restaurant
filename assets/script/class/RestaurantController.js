class RestaurantController {
    // Fonction qui sépare la logique de l'affichage
    // Appel à l' API et récupère les restaurants du localstorage et qui merge les 2
    // Création d'un tableau restaurant
    // Une autre fonction d'affichage

    constructor(googleMap) {
        this.restaurants = [];
        this.googleMap = googleMap;
    }

    // Méthode affichage restaurants
    async addNewRestaurant() {

        this.recupResto = await this.getRestaurants();

        if (this.restaurants === null) {
            localStorage.setItem(this.keyRestaurant, "[]");
        }

        const lsOutput = document.getElementById('lsOutput');
        const restaurants = JSON.parse(localStorage.getItem(this.keyRestaurant));
        console.log(restaurants);

        if (restaurants === null) {
            lsOutput.innerHTML = "Aucun restaurant";
        } else {
            lsOutput.innerHTML = `${restaurants}`;
        }

        const valueRestaurant = document.getElementById('restaurant-name').value;
        restaurants.push(valueRestaurant);
        localStorage.setItem(this.keyRestaurant, JSON.stringify(restaurants));

        $('.content-restaurant').html(
            this.recupResto.map(elmt => (
                `
                <div class="container-restaurant">
                  <img alt="${elmt.restaurantName}" src="${elmt.imgUrl}"></img>
                  <h2>${elmt.restaurantName}</h2>
                  <p>${elmt.address}</p>
                  <button id="btn-details" class="btn-details">Voir en détails</button>
                </div>
                `
            )).join('')
        );

        this.displayModal();
    }

    //Affichage de la modale
    displayModal() {
        //Nouvelle instance de ReviewGestion 
        let reviewGestion = new ReviewGestion();
        // Appel initRating
        reviewGestion.initRating();

        const modal = document.querySelector(".modal-details-restaurant");
        const buttons = document.querySelectorAll(".btn-details");
        const close = document.querySelectorAll(".close");

        for (let i = 0; i < buttons.length; i++) {
            let openModalBtn = buttons[i];
            openModalBtn.addEventListener("click", function (event) {
                event.preventDefault();
                modal.style.display = "block";
            });
        }

        for (let i = 0; i < close.length; i++) {
            let closeModalBtn = close[i];
            closeModalBtn.addEventListener("click", function (event) {
                event.preventDefault();
                modal.style.display = "none";
                // Fonction Reset qui va retirer les eventListeners et retirer le vote HTML ("chaine de caractère")
                // ex: star.addEventListener("mouseleave", removeStar);
            });
        }
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
            const request = {
                placeId: place.place_id,
                fields: ['name', 'rating', 'formatted_phone_number', 'geometry']
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
            li.innerHTML =
            ` 
            <h3>${recupRestoName}</h3>
            `
            // bounds.extend(place.geometry.location);
        }
        // map.fitBounds(bounds);
    }
}