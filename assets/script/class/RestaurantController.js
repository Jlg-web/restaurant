class RestaurantController {

    constructor(googleMap) {
        this.modalAddRestaurantButton = document.createElement("button");
        this.modalAddRestaurantElement = document.querySelector(".Add-restaurant-details");
        this.modalDetailsButton = document.createElement("button");
        this.modalDetailsElement = document.getElementById("modal-details");
        this.restaurants = [];
        this.googleMap = googleMap;
        this.modal = document.getElementById('modal');
        // this.btnModal = document.getElementById("btn-modal");
        this.modalDetails = document.getElementById("modal-details-restaurant");
        this.overlay = document.getElementById("overlay");
        this.placesList = document.querySelector(".content-restaurant ul");
    }


    filter(startValue, finishValue) {
        const filteredRestaurants = this.restaurants.filter(restaurant => restaurant.rating >= startValue && restaurant.rating <= finishValue);
        console.log(filteredRestaurants);

        this.placesList.innerHTML = "";

        for (let i = 0; i < filteredRestaurants.length; i++) {
            this.displayRestaurant(filteredRestaurants[i]);
        }

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
                <p class="rating">${comment.rating}</p>
                <p class="time-description">${comment.relative_time_description}</p>
                <p>${comment.text}</p>
                </div>
                `;
        });
    }


    // Create content
    createContent(place) {
        return ` 
            <h3>${place.name}</h3>
            <p class="moyenne">Moyenne du restaurant : ${place.rating}</p>
            <p>${place.formatted_address}</p>
        `
    }

    // Affichage restaurant
    displayRestaurant(place) {



        new this.googleMap.google.maps.Marker({
            map: this.googleMap.map,
            title: place.name,
            position: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            },
        });

        const galleryItems = document.createElement("li");

        galleryItems.id = place.place_id;
        this.placesList.appendChild(galleryItems);
        galleryItems.classList = "gallery-item";

        galleryItems.innerHTML = this.createContent(place);

        // Click liste restaurant
        galleryItems.addEventListener("click", () => {
            this.displayRestaurantModal(place);
        });
    }


















    // Ajout restaurant
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

    // Affichage - Apparition modal 
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

    // Fermeture de la modale
    closeModal() {
        this.modalDetails.style.display = "none";
        this.overlay.style.display = "none";
    }

    closeModalAddRestaurant() {
        const closeAddRestaurant = document.getElementById("close-add-restaurant");
        const cancelBtn = document.getElementById("btn-modal-cancel");

        closeAddRestaurant.addEventListener("click", () => {
            this.modal.style.display = "none";
            this.overlay.style.display = "none";
        })

        this.overlay.addEventListener("click", () => {
            this.overlay.style.display = "none";
            this.modal.style.display = "none";
        });

        // cancelBtn.addEventListener("click", () => {
        //     this.overlay.style.display = "none";
        //     this.modal.style.display = "none";
        // })
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
        this.modalDetailsButton.classList.add("btn-blue");
        this.modalDetailsButton.textContent = "Rédiger un avis";
        this.modalDetailsElement.appendChild(this.modalDetailsButton);
    }

    createBtnAddRestaurant() {
        this.modalAddRestaurantButton.classList.add("btn");
        this.modalAddRestaurantButton.classList.add("btn-blue");
        this.modalAddRestaurantButton.textContent = "Ajouter(btnjs)";
        this.modalAddRestaurantElement.appendChild(this.modalAddRestaurantButton);
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
        <p id="close" class="close-modal close">Fermer la modale</p>
        <h3 class="title-resto">${place.name}</h3>
        <p class="address-resto">${place.formatted_address}</p>
        <div id="pano"></div>
        <h3>Votre avis</h3>
        <input type="number" id="note" min="1" max="5"></input>
        <form action="" id="add-notice">
            <input type="text" id="author-name" name="" placeholder="Votre nom"></input>
            <textarea id="textarea-comment" name="textarea-comment" rows="5" cols="33" placeholder="Votre commentaire"></textarea>
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

    //Fonction create markers
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

    // Filtrer restaurants
    filterRestaurants() {

        // const choices = document.querySelectorAll(".choice");
        // const start = document.getElementById("start");
        // const finish = document.getElementById("finish");

        // console.log(start.value, finish.value);
        // console.log(parseInt(start.value, 10), parseInt(finish.value, 10));

        // if (start.value === "3" && finish.value === "4") {

        // }


        // if (start.value === "1" && finish.value === "2") {
        //     console.log('afficher les restaurant entre 1 et 2 étoiles');
        // } else if (start.value === "1" && finish.value === "3") {
        //     console.log('afficher les restaurant entre 1 et 3 étoiles');
        // } else if (start.value === "1" && finish.value === "4") {
        //     console.log('afficher les restaurant entre 1 et 4 étoiles');
        // } else if (start.value === "1" && finish.value === "5") {
        //     console.log('afficher les restaurant entre 1 et 5 étoiles');
        // } else if (start.value === "2" && finish.value === "3") {
        //     console.log('afficher les restaurant entre 2 et 3 étoiles');
        // } else if (start.value === "2" && finish.value === "4") {
        //     console.log('afficher les restaurant entre 2 et 4 étoiles');
        // } else if (start.value === "2" && finish.value === "5") {
        //     console.log('afficher les restaurant entre 2 et 5 étoiles');
        // } else if (start.value === "3" && finish.value === "4") {
        //     console.log('afficher les restaurant entre 3 et 4 étoiles');
        // } else if (start.value === "3" && finish.value === "5") {
        //     console.log('afficher les restaurant entre 3 et 5 étoiles');
        // } else if (start.value === "4" && finish.value === "5") {
        //     console.log('afficher les restaurant entre 4 et 5 étoiles');
        // }

        // for (let i = 0; i < choices.length; i++) {
        // choices[i].addEventListener("click", (e) => {
        //     e.preventDefault();
        //     const filter = e.target.dataset.filter;
        //     // console.log(filter);

        //     this.restaurants.forEach((choice) => {
        //         if (filter == "all") {
        //             choice.style.display = "block";
        //         } else {
        //             if (choice.classList.contains(filter)) {
        //                 choice.style.display = "block";
        //             } else {
        //                 choice.style.display = "none";
        //             }
        //         }
        //     })
        // });
        // }

    }

}