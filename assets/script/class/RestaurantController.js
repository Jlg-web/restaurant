class RestaurantController {

    //e.preventDefault() au moment du click;

    constructor() {
        this.restaurants = [];
        console.log(this.restaurants);        
    }

    //Méthode récupération restaurants
    async getRestaurants() {
        const response = await fetch('assets/list-restaurant.json');
        return response.json();

        // let request = new Request('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyCzFwWZ9ZZTlhTFhJc95JH-YT181mXx08I');
        // fetch(request, {mode: 'cors'}).then(function(response) {
        //     this.restaurants = response.json();
        // })
    }

    // Méthode affichage restaurants
    async addNewRestaurant(elmt) {

        console.log(`nom du resto : ${elmt.restaurantName}\n\nadresse : ${elmt.address}`);

        $('.content-restaurant').html(`nom du resto : ${elmt.restaurantName}\n\nadresse : ${elmt.address}`);

        this.recupResto = await this.getRestaurants();

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
        
        // this.modalGestion();
        this.displayModal();
    }


    displayModal() {

        //Créer une nouvelle instance de ReviewGestion 
        // Appeler initRating

        const modal = document.querySelector(".modal-details-restaurant");
        const buttons = document.querySelectorAll(".btn-details");
        const close = document.querySelectorAll(".close");

        for (let i = 0; i < buttons.length; i++) {
            let openModalBtn = buttons[i];
            openModalBtn.addEventListener("click", (event) => {
                modal.style.display = "block";
                event.preventDefault();
            })
        }

        for (let i = 0; i < close.length; i++) {
            let closeModalBtn = close[i];
            closeModalBtn.addEventListener("click", (event) => {
                modal.style.display = "none";
                event.preventDefault();
            })
        }

    }


    // modalGestion() {
        
    //     $('.modal-details-restaurant').html(
    //         this.recupResto.map(elmt => (
    //             `
    //             <div id="modal-details" class="modal-content-restaurant">

    //               <div class="close">Fermer</div>
            
    //               <h1 class="name-modal-restaurant">${elmt.restaurantName}</h1>

    //               <h2>Votre avis</h2>
            
    //               <div class="star-container">
    //                 <h3>nombre d'étoiles :</h3>
    //                 <div class="star-symbol-container">
    //                   <span class="fas fa-star" data-star="1 étoile (Très mauvais)"></span>
    //                   <span class="fas fa-star" data-star="2 étoiles (Mauvais)"></span>
    //                   <span class="fas fa-star" data-star="3 étoiles (Bon)"></span>
    //                   <span class="fas fa-star" data-star="4 étoiles (Très bon !)"></span>
    //                   <span class="fas fa-star" data-star="5 étoiles (Excellent !)"></span>
    //                 </div>
    //                 <div class="star-vote">
    //                   Vote : <span class="rating"></span>
    //                 </div>
    //               </div>
            
    //               <div class="comm-container">
    //                 <h3>Votre commentaire :</h3>
    //                 <textarea name="" id="" cols="40" rows="10" placeholder="Votre commentaire :">
            
    //                 </textarea>
    //               </div>
            
    //               <button class="btn-details">Poster mon avis</button>
            
    //             </div>
    //             `
    //         )).join('')
    //     );
    // }


}