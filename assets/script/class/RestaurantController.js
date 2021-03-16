class RestaurantController {

    constructor(googleMap) {
        this.modalDetailsButton = document.createElement("button");
        this.modalDetailsElement = document.getElementById("modal-details");
        this.restaurants = [];
        this.googleMap = googleMap;
        this.modal = document.getElementById('modal');
        this.btnModal = document.getElementById("btn-modal");
        this.modalDetails = document.getElementById("modal-details-restaurant");
        this.overlay = document.getElementById("overlay");
    }

    // Ajout restaurant
    addRestaurant() {

        const newRestaurant = {
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
        this.closeModal();

    }

    //Ajout avis
    addComment(placeId) {
        const restaurant = this.restaurants.find(r => r.place_id === placeId);
        let textareaComment = document.getElementById('textarea-comment').value;
        let rating = document.getElementById('note').value;
        restaurant.reviews.push({
            text: textareaComment,
            rating: rating,

        });
        console.log(this.restaurants);
        document.forms[0].reset();
        this.displayComments(restaurant.reviews);
    }

    // Affichage des commentaires
    displayComments(comments) {
        let recoveryComment = document.querySelector('.recovery-comment');
        recoveryComment.innerHTML = "";

        comments.forEach(comment => {
            recoveryComment.innerHTML +=
                `
            <div class="recovery-comment">
            <img src="${comment.profile_photo_url}"></img>
            <h3>${comment.author_name}</h3>
            <p class="rating">${comment.rating}</p>
            <p class="time-description">${comment.relative_time_description}</p>
            <p>${comment.text}</p>
            </div>
            `;
        });

    }

    // Affichage - Apparition modal 
    showModal() {
        this.modal.style.display = "block";
        this.overlay.style.display = "block";
    }


    // Fermeture de la modale
    closeModal() {
        this.modalDetails.style.display = "none";
        this.overlay.style.display = "none";
    }

    // Affichage de la modale
    showDetailsModal() {
        this.modalDetails.style.display = "flex";
        this.overlay.style.display = "block";
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

    // Création bouton
    createBtn() {
        this.modalDetailsButton.classList.add("btn");
        this.modalDetailsButton.textContent = "Rédiger un avis";
        this.modalDetailsElement.appendChild(this.modalDetailsButton);
    }

    // Panorama
    displayPanorama(place) {
        const panorama = new this.googleMap.google.maps.StreetViewPanorama(
            document.getElementById("pano"), {
                position: place.geometry.location,
                pov: {
                    heading: 34,
                    pitch: 10,
                },
            }
        );
    }


    
    displayRestaurantModal(place) {

        this.modalDetailsElement.innerHTML =
            ` 
        <p id="close" class="close-modal">Fermer la modale</p>
        <h3 class="title-resto">${place.name}</h3>
        <p class="address-resto">${place.formatted_address}</p>
        <div id="pano"></div>
        <h3>Votre avis</h3>
        <input type="number" id="note" min="1" max="5"></input>
        <form action="" id="add-notice">
            <textarea id="textarea-comment" name="textarea-comment" rows="5" cols="33"></textarea>
        </form>
        `
        this.displayPanorama(place);
        this.showDetailsModal();
        this.displayComments(place.reviews);
        this.createBtn();

        const close = document.getElementById("close");

        close.addEventListener("click", () => {
            this.closeModal();
        })

        this.overlay.addEventListener("click", () => {
            this.overlay.style.display = "none";
            this.closeModal();
        });

        this.modalDetailsButton.addEventListener("click", () => {
            this.addComment(place.place_id);
        })
    }




    // Affichage restaurant
    displayRestaurant(place, status) {

        if (status == this.googleMap.google.maps.places.PlacesServiceStatus.OK) {

            this.restaurants.push(place);
            const placesList = document.querySelector(".content-restaurant");

            new this.googleMap.google.maps.Marker({
                map: this.googleMap.map,
                title: place.name,
                position: place.geometry.location
            });

            const li = document.createElement("li");
            li.id = place.place_id;
            placesList.appendChild(li);

            li.innerHTML =
                ` 
                <h3>${place.name}</h3>
                <p class="moyenne">Moyenne du restaurant : ${place.rating}</p>
                <p>${place.formatted_address}</p>
                `

            // Click liste restaurant
            li.addEventListener("click", () => {
                this.displayRestaurantModal(place);
            });
        }
    }

    //Fonction create markers
    createMarkers(places) {

        const bounds = new this.googleMap.google.maps.LatLngBounds();

        for (let i = 0; i < places.length; i++) {

            const place = places[i];

            const request = {
                placeId: place.place_id,
                fields: ['name', 'rating', 'formatted_address', 'geometry', 'place_id', 'review']
            };

            this.googleMap.placesService.getDetails(request, this.displayRestaurant.bind(this));
            // bounds.extend(place.geometry.location);
        }
        // map.fitBounds(bounds);
    }

}