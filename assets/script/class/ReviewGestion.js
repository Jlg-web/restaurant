class ReviewGestion {

    constructor() {
        this.allStars = document.querySelectorAll(".fa-star");
        this.rating = document.querySelector(".rating");
        this.previousSiblings = '';
        this.hoverStar = '';
        this.addStarCallback = this.addStar.bind(this);
        this.removeStarCallback = this.removeStar.bind(this);
        this.saveRatingCallback = this.saveRating.bind(this);
    }

    initRating() {
        this.allStars.forEach((star) => {
            star.addEventListener("click", this.saveRatingCallback);
            star.addEventListener("mouseover",  this.addStarCallback);
            star.addEventListener("mouseleave", this.removeStarCallback);
        });
    }

    saveRating(e) {
        this.removeEventListenerToAllStars();
        this.rating.innerText = e.target.dataset.star; 
    }

    removeEventListenerToAllStars() {
        this.allStars.forEach(star => {
            star.removeEventListener("click", this.saveRatingCallback);
            star.removeEventListener("mouseover", this.addStarCallback);
            star.removeEventListener("mouseleave", this.removeStarCallback);
        });
    }

    getPreviousSiblings(elem) {
        let siblings = [];
        const spanNodeType = 1;
        while ((elem = elem.previousSibling)) {
            if (elem.nodeType === spanNodeType) {
                siblings = [elem, ...siblings];
            }
        }
        return siblings;
    }

    addStar(e) {
        const className = "checked";
        this.hoverStar = e.target; 
        this.hoverStar.classList.add(className);
        this.previousSiblings = this.getPreviousSiblings(this.hoverStar);
        this.previousSiblings.forEach(elem => elem.classList.add(className));

    }

    removeStar(e) {
        const className = "checked";
        this.hoverStar = e.target;
        this.hoverStar.classList.remove(className);
        this.previousSiblings = this.getPreviousSiblings(this.hoverStar);
        this.previousSiblings.forEach(elem => elem.classList.remove(className));
    }

}