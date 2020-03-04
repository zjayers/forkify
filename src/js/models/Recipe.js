//Import Axios For Fetching HTTP Requests
import axios from 'axios';

//Recipe Model for getting recipe data from Forkify API
export default class Recipe {

    //Standard Constructor
    constructor (id) {
        this.id = id;
    }

    //Get Results From Recipe
    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        } catch (error) {

            alert(`Something went wrong! ${error}`);

        }
    }

    //Calculate the amount of time to cook recipe
    //For every 3 ingredients - estimate 15 minutes
    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    //Set servings to 4 for each recipe
    calcServings() {
        this.servings = 4;
    }

    /* Ingredient Parsing */

    //Format ingredient units & count
    formatIngredient(ingredient) {

        //Long Form Units
        const unitsLong = [
            'tablespoons',
            'tablespoon',
            'teaspoons',
            'teaspoon',
            'ounces',
            'ounce',
            'cups',
            'pounds',
            'grams',
            'gram',
            'kilograms',
            'kilogram'];

        //UNit Abbreviations for formatting
        const unitsShort = [
            'tbsp',
            'tbsp',
            'tsp',
            'tsp',
            'oz',
            'oz',
            'cup',
            'pound',
            'g',
            'g',
            'kg',
            'kg'];


        //Uniform Units
        let formattedIngredient = ingredient.toLowerCase();

        //If any units corresponding to units in the unitsLong array exist in the ingredient string, replace them with the abbreviation

        unitsLong.forEach((unit, i) => {
            formattedIngredient = formattedIngredient.replace(unit, unitsShort[i]);
        });

        //Remove Parenthesis & text inside parenthesis using Regex
        formattedIngredient = formattedIngredient.replace(/_/g, '');
        formattedIngredient = formattedIngredient.replace(/ *\([^)]*\) */g, ' ');      

        //Parse into Count, Unit, Ingredient
        const arrIgn = formattedIngredient.split(' ');
        const unitIndex = arrIgn.findIndex(unit => unitsShort.includes(unit));

        let ingObj = {};

        if (unitIndex > -1) {
            // Ingredient contains a unit
            let count;

            //Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval (4+1/2) = 4.5
            //Ex. 4 cups, arrCount is [4]
            const arrCount = arrIgn.slice(0, unitIndex);

            if (arrCount.length === 1) {
                //Remove minus sign
                let fixCount = arrIgn[0].replace('-', '+');
                count = eval(fixCount);

            } else {
                let joinCount = arrCount.join('+');
                count = eval(joinCount);
            }

            let formattedArr = arrIgn.slice(unitIndex + 1);
            formattedIngredient = formattedArr.join(' ');

            if (count === undefined) count = 1;

            //Round number to 2 decimal places and use 'parseFloat' to remove trailing zeroes
            count = parseFloat(count.toFixed(2));

            ingObj = {
                count: count,
                unit: arrIgn[unitIndex],
                ingredient: formattedIngredient
            };

        } else if (parseInt(arrIgn[0], 10)) {
            //There is no unit, but the 1st element is a number

            ingObj = {
                count: parseInt(arrIgn[0], 10),
                unit: '',
                ingredient: arrIgn.slice(1).join(' ')
            };

        } else if (unitIndex === -1) {
            //There is NO unit & NO number in the 1st position]

            let count = 0;

            arrIgn[0] === 'for' ? count = '' : count = 1;

            ingObj = {
                count: count,
                unit: '',
                ingredient: formattedIngredient
            };

        }

        //Return
        return ingObj;

    }

    //Function to parse ingredients - run them through the formatter function then return them
    parseIngredients() {
        const newIngredients = this.ingredients.map(this.formatIngredient).filter(el => el.ingredient != '');
        this.ingredients = newIngredients;
    }

}