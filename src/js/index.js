///Global App Controller

//Imports
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderSpinner, clearLoader } from './views/base';

/* Global State Of The App
 * - Search Object
 * - Recipe Object
 * - Shopping List Object
 * - Liked Recipes
 */
const state = {};

// ------ Search Controller ----- //

//Submit Button - Function
const control_Search = async () => {

    //Get Query from the view
    const query = searchView.getInput(); 
    
    //If Query - create new search object
    //and add it to the global state object
    if (query) {
        state.search = new Search(query);

        //Prep User Interface - Show Loading Spinner
        searchView.clearInput();
        searchView.clearResults();
        renderSpinner(elements.searchRes);

        try {

            // Run the search
            await state.search.getResults();

            // Render results on UI

            searchView.renderResults(state.search.result);
        } catch (error) {
            alert(`Error processing recipes!`);
        }

        clearLoader();
    }

};

//Submit Button - Handler
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    control_Search();
});

//Next & Prev Button - Handler
elements.searchResPages.addEventListener('click', e => {

    //Get closest clicked button with the '.btn-inline' class
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        //Get the 'goto' from the data attribute of the button - parse to int in base10
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }

});

// ------ Recipe Controller ----- //

//Hash Change Handler added to main window

const control_Recipe = async () => {

    //Get the hash from the window URL
    let id = window.location.hash;

    //Remove the hash symbol
    id = id.replace('#', '');

    if (id) {

        //Prepare UI For Changes
        recipeView.clearRecipe();
        renderSpinner(elements.recipe);

        //Highlight Selected Search Item
        if (state.search) searchView.highlightSelected(id);

        //Create new recipe object
        state.recipe = new Recipe(id);

        try {

            //Get Recipe data
            await state.recipe.getRecipe();

            //Calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();
            state.recipe.parseIngredients();

            //Render Recipe to UI
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (error) {

            alert(`Error processing recipe! ${error}`);

        }

    }

}

//Hash Change - Event Handler
['hashchange', 'load'].forEach(event => window.addEventListener(event, control_Recipe));