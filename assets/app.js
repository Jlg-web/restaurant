// const request = new XMLHttpRequest();
// request.open('GET', url, true)
// request.responseType = 'json';
// request.onload = () => {
//   let restaurant = request.response;
//   showCard(restaurant);
// }
// request.send();

let header = document.querySelector('header');
let section = document.querySelector('section');
const url = 'assets/list-restaurant.json';
// 1- Méthode fetch -> url de la ressource
// 2- Méthode .then() -> retourne promesse 1 (opération asynchrones) : retourne une promesse qui résout une réponse HTTP 
// 3- On récupère le contenu de la réponse en json 
// 4- Méthode .then() -> retourne promesse 2 (opération asynchrones) : nouvelle fonction qui décide de ce que nous faisons avec le json récupéré
fetch(url).then(function(response) {
  response.json().then(function(cardRestaurant) {
    showCard(cardRestaurant);
  });
});

function showCard(jsonObj) {

  let resto = jsonObj['restaurants'];

  for (let i = 0; i < resto.length; i++) {
    let myArticle = document.createElement('article');

    //Name
    let nameRestaurant = document.createElement('h2');
    nameRestaurant.textContent = resto[i].restaurantName;
    myArticle.appendChild(nameRestaurant);

    //Address
    let address = document.createElement('p');
    address.textContent = resto[i].address;
    myArticle.appendChild(address);

    section.appendChild(myArticle);
  }
}

//MAP
let map;
function initMap() {

  let paris = {
    lat: 48.8566969,
    lng: 2.3514616
  }

  map = new google.maps.Map(document.getElementById("map"), {
    center: paris,
    zoom: 8
  });

  let marker = new google.maps.Marker({
    position: paris,
    map: map
  })
}
