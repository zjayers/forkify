import { elements } from './base'

//Get Input from the search box
export const getInput = () => elements.searchInput.value;

//Clear the user input field
export const clearInput = () => {
    elements.searchInput.value = '';
}

//Clear results from previous search
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

//Private function for shortening recipe titles to One line followed by '...'
const limitRecipeTitle = (title, limit = 17) => {

    if (title.length > limit) {

        //Empty array to push words to
        const newTitle = [];

        //Reducer function to count letters in title
        const reducer = (accumulator, currentValue) => {

            const sumLetters = accumulator + currentValue.length;

            if (sumLetters <= limit) {
                newTitle.push(currentValue);
            }

            //Return number for next accumulator
            return sumLetters;
        };

        //Split title at each ' ' (space) so we have full words
        var tArr = title.split(' ');

        //Use the reducer to push
        tArr.reduce(reducer, 0);

        //Create returnable title string
        title = `${newTitle.join(' ')}...`;
    }

    //Return the title - changed or not
    return title;
};


//Render single recipe to the UI
const renderRecipe = recipe => {

    const recipeTitle = limitRecipeTitle(recipe.title);

    //Create HTML Field
    const markup =
        `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipeTitle}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${recipeTitle}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    //Add new HTML code
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

//Function to create Prev or Next Button
//type: 'prev' or 'next'
const createButton = (page, type) => {

    let pageToDisplay = 0;
    let directionToDisplay = '';

    //Determine page number to display and arrow direction to show
    if (type === 'next') {

        pageToDisplay = page + 1;
        directionToDisplay = 'right';

    } else if (type === 'prev') {
        pageToDisplay = page - 1;
        directionToDisplay = 'left';
    }

    const htmlElement =
        `
            <button class="btn-inline results__btn--${type}" data-goto=${pageToDisplay}>
                <span>Page ${pageToDisplay}</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-${directionToDisplay}"></use>
                </svg>
            </button>
        `;

    //Return the HTML Code
    return htmlElement;

}

//Function to keep the selected item highlighted
export const highlightSelected = id => {

    const resArr = Array.from(document.querySelectorAll('.results__link'));

    resArr.forEach( el => {
        el.classList.remove('results__link--active');
    })

    const el = document.querySelector(`a[href="#${id}"]`);
    el.classList.add('results__link--active');
}


//Render Page Number Buttons To Change Pages
const renderButtons = (page, totalResults, resultsPerPage) => {

    //Determine the number of pages needed and round up to the next integer
    const pages = Math.ceil(totalResults / resultsPerPage);

    let newBtn;

    if (page === 1 && pages > 1) {
        //Only show button for next page
        newBtn = createButton(page, 'next');

    } else if (page < pages) {
        //Show next and previous buttons
        newBtn =
            `${createButton(page, 'next')}
             ${createButton(page, 'prev')}`;

    } else if (page === pages && pages > 1) {
        //Only show the button for previous page
        newBtn = createButton(page, 'prev');

    }

    //Insert The Button HTML
    elements.searchResPages.insertAdjacentHTML('afterbegin', newBtn);

};

//Recieves an array of recipes and prints them to the UI
export const renderResults = (recipes, pageToDisplay = 1, resultsPerPage = 10) => {
    //page:1 - results per page: 10
    // (1-1) * 10 = array start at 0
    const start = (pageToDisplay - 1) * resultsPerPage;
    const end = pageToDisplay * resultsPerPage;

    //Slice array so only the amount of resultsPerPage are displayed
    const arrToRender = recipes.slice(start, end);

    //Render the recipes to the UI
    arrToRender.forEach(renderRecipe);

    //Render Buttons
    renderButtons(pageToDisplay, recipes.length, resultsPerPage);

};