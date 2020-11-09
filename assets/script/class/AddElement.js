class AddElement {

    constructor(restaurantName, address) {
        this.restaurantName = restaurantName;
        this.address = address;
    }

    async addRestaurant(resto) {

        console.log(`nom du resto : ${resto.restaurantName}\n\nadresse : ${resto.address}\n\nlatitude : ${resto.lat}\n\nlongitude : ${resto.long}`);

        const restaurants = await getRestaurants();

        $('.content-restaurant').html(
            restaurants.map(resto => (
                `
                <div class="container-restaurant">
                  <img alt="${resto.restaurantName}" src="${resto.imgUrl}"></img>
                  <h2>${resto.restaurantName}</h2>
                  <p>${resto.address}</p>
                </div>
                `
            )).join('')
        );
    }
}