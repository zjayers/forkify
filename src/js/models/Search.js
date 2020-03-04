//Import Axios For Fetching HTTP Requests
import axios from 'axios';

//Search Model for getting recipe data from Forkify API
export default class Search {

    //Standard Constructor
    constructor (query) {
        this.query = query;
    }

    //Get Results From Search
    async getResults() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);

            this.result = res.data.recipes;

        } catch (error) {

            alert(`Something went wrong! ${error}`);

        }
    }
}
