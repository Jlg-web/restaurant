class RestaurantController {
    // Fonction qui sépare la logique de l'affichage
    // Appel à l' API et récupère les restaurants du localstorage et qui merge les 2
    // Création d'un tableau restaurant
    // Une autre fonction d'affichage

    constructor() {
        // this.restaurants = [];
        // console.log(this.restaurants);
        this.keyRestaurant = "restaurant";
        this.restaurants = localStorage.getItem(this.keyRestaurant);
        // initialize();

    }

    //Méthode récupération restaurants
    async getRestaurants() {

        // return [];
        const url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Restaurant%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyCzFwWZ9ZZTlhTFhJc95JH-YT181mXx08I';
        // let request = new Request('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyCzFwWZ9ZZTlhTFhJc95JH-YT181mXx08I');
        const response = await fetch(url, {mode: 'cors'});
        return response;

        // .then(function(response) {
        //     this.restaurants = response.json();
        //     console.log(this.restaurants);
        // })

        // const response = await fetch('assets/list-restaurant.json');
        // return response.json();

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

}