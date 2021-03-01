const keyRestaurant = "restaurant";
const restaurants = localStorage.getItem(keyRestaurant);

if (restaurants === null) {
    localStorage.setItem(keyRestaurant, "[]");
}

const addRestaurant = () => {
    const outPut = document.getElementById('output');
    const restaurants = JSON.parse(localStorage.getItem(keyRestaurant));
    console.log(restaurants);

    if (restaurants === null) {
        outPut.innerHTML = "Aucun restaurant";
    } else {
        outPut.innerHTML = `${restaurants}`;
    }
    
    const valueRestaurant = document.getElementById('valueRestaurant').value;
    restaurants.push(valueRestaurant);
    localStorage.setItem(keyRestaurant, JSON.stringify(restaurants));
}

const btn = document.getElementById("btn");
btn.addEventListener("click", addRestaurant);


































function initialize() {
    var geocoder = new google.maps.Geocoder();
 
    geocoder.geocode( { 'address': Ville}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            miseAjourCarte(results[0].geometry.location);
        } 
    });
}
 
function miseAjourCarte(location)
{
    var pyrmont = location;
    //  var pyrmont = new google.maps.LatLng(-33.8665433, 151.1956316);
 
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: pyrmont,
        zoom: 15
    });
 
    var request = {
        location: pyrmont,
        radius: 500,
        types: ['store']
    };
 
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}














//Stars
const allStars = document.querySelectorAll(".fa-star");
const rating = document.querySelector(".rating");

initRating();

function initRating() {
    allStars.forEach((star) => {
        star.addEventListener("click", saveRating);
        star.addEventListener("mouseover", addStar);
        star.addEventListener("mouseleave", removeStar);
    });
}

function saveRating(e) {
    removeEventListenerToAllStars();
    rating.innerText = e.target.dataset.star; 
}

function removeEventListenerToAllStars() {
    allStars.forEach(star => {
        star.removeEventListener("click", saveRating);
        star.removeEventListener("mouseover", addStar);
        star.removeEventListener("mouseleave", removeStar);
    });
}

// Fonction d'ajout d'une étoile
function addStar(e, className = "checked") {
    const hoverStar = e.target; 
    hoverStar.classList.add(className);

    const previousSiblings = getPreviousSiblings(hoverStar);
    previousSiblings.forEach(elem => elem.classList.add(className));
}

// Fonction de suppression d'une étoiles
function removeStar(e, className = "checked") {
    const hoverStar = e.target;
    hoverStar.classList.remove(className);

    const previousSiblings = getPreviousSiblings(hoverStar)
    previousSiblings.forEach(elem => elem.classList.remove(className));
}

// Fonction obtenir les éléments précédents
function getPreviousSiblings(elem) {
    // console.log("elemt.previousSibling", elem.previousSibling);
    let siblings = [];
    console.log(siblings);
    const spanNodeType = 1;

    // On attribue à une variable "elem" l'élément précédent
    while ((elem = elem.previousSibling)) {
        if (elem.nodeType === spanNodeType) {
            siblings = [elem, ...siblings];
        }
    }
    return siblings;
}