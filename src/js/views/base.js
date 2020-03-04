//HTML Elements
export const elements = {

    searchInput: document.querySelector('.search__field'),
    searchForm: document.querySelector('.search'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe')

};

export const elementStrings = {
    loader: 'loader'
}

//AJAX Loading Spinner
export const renderSpinner = parent => {

    //Loader HTML
    const loader =
        `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;

    //Attach loader as HTML
    parent.insertAdjacentHTML('afterbegin', loader);
};

//Clear AJAX Loading Spinner
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);

    //Remove Loader
    if (loader) loader.parentElement.removeChild(loader);
};