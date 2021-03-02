class RestaurantController {

    constructor(googleMap) {
        this.restaurants = [];
        this.googleMap = googleMap;
        this.modal = document.getElementById('modal');
        this.btnModal = document.getElementById("btn-modal");
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
            // bounds.extend(place.geometry.location);
        }
        // map.fitBounds(bounds);
    }


    //Affichage de la modale
    // displayModal() {
    //     //Nouvelle instance de ReviewGestion 
    //     let reviewGestion = new ReviewGestion();
    //     // Appel initRating
    //     reviewGestion.initRating();

    //     const modal = document.querySelector(".modal-details-restaurant");
    //     const buttons = document.querySelectorAll(".btn-details");
    //     const close = document.querySelectorAll(".close");

    //     for (let i = 0; i < buttons.length; i++) {
    //         let openModalBtn = buttons[i];
    //         openModalBtn.addEventListener("click", function (event) {
    //             event.preventDefault();
    //             modal.style.display = "block";
    //         });
    //     }

    //     for (let i = 0; i < close.length; i++) {
    //         let closeModalBtn = close[i];
    //         closeModalBtn.addEventListener("click", function (event) {
    //             event.preventDefault();
    //             modal.style.display = "none";
    //             // Fonction Reset qui va retirer les eventListeners et retirer le vote HTML ("chaine de caractère")
    //             // ex: star.addEventListener("mouseleave", removeStar);
    //         });
    //     }
    // }



    // Méthode affichage restaurants
    // async addNewRestaurant() {

    //     this.recupResto = await this.getRestaurants();

    //     if (this.restaurants === null) {
    //         localStorage.setItem(this.keyRestaurant, "[]");
    //     }

    //     const lsOutput = document.getElementById('lsOutput');
    //     const restaurants = JSON.parse(localStorage.getItem(this.keyRestaurant));
    //     console.log(restaurants);

    //     if (restaurants === null) {
    //         lsOutput.innerHTML = "Aucun restaurant";
    //     } else {
    //         lsOutput.innerHTML = `${restaurants}`;
    //     }

    //     const valueRestaurant = document.getElementById('restaurant-name').value;
    //     restaurants.push(valueRestaurant);
    //     localStorage.setItem(this.keyRestaurant, JSON.stringify(restaurants));

    //     $('.content-restaurant').html(
    //         this.recupResto.map(elmt => (
    //             `
    //             <div class="container-restaurant">
    //               <img alt="${elmt.restaurantName}" src="${elmt.imgUrl}"></img>
    //               <h2>${elmt.restaurantName}</h2>
    //               <p>${elmt.address}</p>
    //               <button id="btn-details" class="btn-details">Voir en détails</button>
    //             </div>
    //             `
    //         )).join('')
    //     );
    // }
}