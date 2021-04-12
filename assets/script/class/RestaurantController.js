class RestaurantController {

    constructor(googleMap) {
        this.googleMap = googleMap;
        this.restaurants = [];
        this.modalAddRestaurantButton = document.createElement("button");
        this.modalAddRestaurantElement = document.querySelector(".Add-restaurant-details");
        this.modalDetailsButton = document.createElement("button");
        this.modalDetailsElement = document.getElementById("modal-details");
        this.modal = document.getElementById('modal');
        this.modalDetails = document.getElementById("modal-details-restaurant");
        this.overlay = document.getElementById("overlay")
        this.placesList = document.querySelector(".content-restaurant ul");
    }

    // Récupération des restaurants autour de l'utilisateur
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

    // Création des marqueurs
    createMarkers(places) {
        for (let i = 0; i < places.length; i++) {
            const place = places[i];
            const request = {
                placeId: place.place_id,
                fields: ['name', 'rating', 'formatted_address', 'geometry', 'place_id', 'review']
            };
            this.googleMap.placesService.getDetails(request, (place, status) => {
                if (status == this.googleMap.google.maps.places.PlacesServiceStatus.OK) {
                    this.restaurants.push(place);
                    this.displayRestaurant(place);
                }
            });
        }
    }

    // Affichage des restaurants
    displayRestaurant(place) {

        this.googleMap.addMarker(place);

        const galleryItems = document.createElement("li");
        galleryItems.id = place.place_id;
        this.placesList.appendChild(galleryItems);
        galleryItems.classList = "gallery-item";
        galleryItems.innerHTML = this.createContent(place);

        // Click liste restaurant
        galleryItems.addEventListener("click", () => {
            this.modalDetails.style.display = "flex";
            this.overlay.style.display = "block";
            this.displayRestaurantModal(place);
        });

    }

    // Affichage de la modale de détail d'un restaurant
    displayRestaurantModal(place) {
        this.modalDetailsElement.innerHTML =
            ` 
        <p id="close" class="close-modal close">Fermer la modale</p>
        <h3 class="title-resto">${place.name}</h3>
        <p class="address-resto">${place.formatted_address}</p>
        <div id="pano"></div>
        <h3>Votre avis</h3>
        <h4>Indiquez votre note (entre 1 et 5)</h4>
        <input type="number" id="note" min="1" max="5" value="1"></input>
        <h4>Entrez votre nom et votre commentaire</h4>
        <form action="" id="add-notice">
            <input type="text" id="author-name" name="" placeholder="Votre nom"></input>
            <textarea id="textarea-comment" name="textarea-comment" rows="5" cols="33" placeholder="Votre commentaire"></textarea>
        </form>
        `
        this.displayPanorama(place);
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

    // Affichage de google street view
    displayPanorama(place) {
        new this.googleMap.google.maps.StreetViewPanorama(
            document.getElementById("pano"), {
                position: place.geometry.location,
                pov: {
                    heading: 34,
                    pitch: 10,
                },
            }
        );
    }

    // Ajout des filtres
    addFilter(startValue, finishValue) {
        const filteredRestaurants = this.restaurants.filter(restaurant => restaurant.rating >= startValue && restaurant.rating <= finishValue);
        this.placesList.innerHTML = "";
        this.googleMap.removeMarkers();
        for (let i = 0; i < filteredRestaurants.length; i++) {
            this.displayRestaurant(filteredRestaurants[i]);
        }
    }

    // Suppression des filtres
    cancelFilter(selectStart, selectFinish) {
        this.placesList.innerHTML = "";
        this.googleMap.removeMarkers();
        for (let i = 0; i < this.restaurants.length; i++) {
            this.displayRestaurant(this.restaurants[i]);
        }
        selectStart.selectedIndex = 0;
        selectFinish.selectedIndex = 0;
    }

    //Ajout des commentaires
    addComment(placeId) {
        const restaurant = this.restaurants.find(r => r.place_id === placeId);
        let authorName = document.getElementById('author-name').value;
        let textareaComment = document.getElementById('textarea-comment').value;
        let rating = document.getElementById('note').value;
        let imgDefault = document.getElementById('img-author').src.value;
        imgDefault = "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/7_avatar-512.png";

        restaurant.reviews.push({
            text: textareaComment,
            rating: rating,
            author_name: authorName,
            profile_photo_url: imgDefault
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
                <img id='img-author' src="${comment.profile_photo_url}"></img>
                <h3>${comment.author_name}</h3>
                <p class="rating">${comment.rating} étoiles</p>
                <p class="time-description">${comment.relative_time_description}</p>
                <p>${comment.text}</p>
                </div>
                `;
        });
    }

    // Création contennu liste des restaurants
    createContent(place) {
        return ` 
            <h3>${place.name}</h3>
            <p class="moyenne">Moyenne du restaurant : ${place.rating} étoiles</p>
            <p>${place.formatted_address}</p>
            `
    }

    // Ajout des restaurants
    addRestaurant(latLng) {

        const newRestaurant = {
            name: document.getElementById('restaurant-name').value,
            formatted_address: document.getElementById('restaurant-address').value,
            geometry: {
                location: latLng
            }
        }

        this.restaurants.push(newRestaurant);
        console.log(this.restaurants);

        document.forms[0].reset();

        this.displayRestaurant(newRestaurant);

        modal.style.display = "none";
        this.closeModal();
    }

    // Affichage modale ajout restaurant
    showModal(latLng) {

        this.modal.style.display = "block";
        this.overlay.style.display = "block";
        this.modalAddRestaurantElement.innerHTML =
            `
        <div class="modal-content">
        <p id="close-add-restaurant" class="close-modal close">Fermer la modale</p>
        <h3>Ajouter un restaurant</h3>
  
        <form action="" id="form-add-restaurant" onsubmit="return false">
          <div class="flex flex-column m-b-16">
            <label for="text">Nom du restaurant</label>
            <input id="restaurant-name" type="text">
          </div>
          <div class="flex flex-column m-b-16">
            <label for="text">Adresse du restaurant</label>
            <input type="text" id="restaurant-address" disabled>
          </div>
          <!-- <button id="btn-modal" href="#" type="submit" class="btn m-t-16 mr btn-blue"
            form="form-add-restaurant">Ajouter</button>
          <button id="btn-modal-cancel" href="#" type="submit" class="btn btn-red"
            form="form-add-restaurant">Annuler</button> -->
        </form>
  
      </div>
    `

        this.createBtnAddRestaurant();

        this.modalAddRestaurantButton.addEventListener("click", () => {
            this.addRestaurant(latLng);
        })

    }

    // Fermeture modale détail restaurant
    closeModal() {
        this.modalDetails.style.display = "none";
        this.overlay.style.display = "none";
    }

    // Fermeture modale ajout restaurant
    closeModalAddRestaurant() {
        const closeAddRestaurant = document.getElementById("close-add-restaurant");

        closeAddRestaurant.addEventListener("click", () => {
            this.modal.style.display = "none";
            this.overlay.style.display = "none";
        })

        this.overlay.addEventListener("click", () => {
            this.overlay.style.display = "none";
            this.modal.style.display = "none";
        });
    }

    // Bouton rédiger un avis
    createBtn() {
        this.modalDetailsButton.classList.add("btn");
        this.modalDetailsButton.classList.add("btn-blue");
        this.modalDetailsButton.textContent = "Rédiger un avis";
        this.modalDetailsElement.appendChild(this.modalDetailsButton);
    }

    // Bouton Ajouter un restaurant
    createBtnAddRestaurant() {
        this.modalAddRestaurantButton.classList.add("btn");
        this.modalAddRestaurantButton.classList.add("btn-blue");
        this.modalAddRestaurantButton.textContent = "Ajouter";
        this.modalAddRestaurantElement.appendChild(this.modalAddRestaurantButton);
    }

}