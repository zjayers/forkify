import {elements} from './base';
import { Fraction } from 'fractional';


//Clear the recipe window
export const clearRecipe = () => {

    elements.recipe.innerHTML = '';

}

const checkIfInstruction = ingredient => {

    //Remove the check if the ingredient string starts with 'for'
    let ingSplit = ingredient.split(' ');
    let makeUpper = true;    
    let html = '';

    if (ingSplit[0] !== 'for') {    
       makeUpper = false;   
       html = 
       `
            <svg class="recipe__icon">
                <use href="img/icons.svg#icon-check"></use>
            </svg>
        `;   
    }

    return [html, makeUpper];
}

//Use Fractional.js to 
const formatCount = count => {
        
    if (count) {

        //count = 2.5 --> 2 1/2
        //count = 0.5 --> 1/2
        const splStr = count.toString().split('.');
        const [int, dec] = splStr.map(el => parseInt(el, 10));

        if (!dec) return count;

        if (int === 0) {
            const frac = new Fraction(count);
            return `${frac.numerator}/${frac.denominator}`;
        } else {
            const frac = new Fraction(count - int);
            return `${int} ${frac.numerator}/${frac.denominator}`;
        }
    }

    return ''
};

//Get Ingredient HTML
const getIngredientsHTML = recipe => {

    var ingHtml = recipe.ingredients.map(el => {

        const ingCheck = checkIfInstruction(el.ingredient);
        let ingText = el.ingredient;
        if (ingCheck[1]) ingText = ingText.toUpperCase();

        var ingStr = 
        `
            <li class="recipe__item">
                ${ingCheck[0]}
                <div class="recipe__count">${formatCount(el.count)}</div>
                <div class="recipe__ingredient">
                    <span class="recipe__unit">${el.unit}</span>
                    ${ingText}
                </div>
            </li>
        `;

        
        return ingStr;
    });

    //Join all HTML elements of the array together
    return ingHtml.join('');

}

//Render the current recipe to the UI
export const renderRecipe = recipe => {

    const markup =
        `
            <figure class="recipe__fig">
                <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>

            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                    <span class="recipe__info-text"> minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                    <span class="recipe__info-text"> servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn-tiny">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>

                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart-outlined"></use>
                    </svg>
                </button>
            </div>

            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                   
                    ${getIngredientsHTML(recipe)}
     
                </ul>

                <button class="btn-small recipe__btn">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>

            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>

                </a>
            </div>
    `;

    //Render the HTML to the UI
    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};