export const UI = {
    SEARCH_FORM : document.querySelector(".search"),
    SEARCH_INPUT : document.querySelector(".search-input"),

    TABS : {
        NOW : document.getElementById('tab01'),
        DETAILS : document.getElementById('tab02'),
        FORECAST : document.getElementById('tab03')
    },

    NAV_BTN : {
        NOW : document.querySelector('.now-btn'),
        DETAILS : document.querySelector('.details-btn'),
        FORECAST : document.querySelector('.forecast-btn'),
    },

    PARAM_BLOCKS : {
        temp : document.querySelectorAll('.temp'),
        feelsLike : document.querySelectorAll('.feels-like'),
        locationName : document.querySelectorAll('.location-name'),
        sunrise : document.querySelectorAll('.sunrise'),
        sunset : document.querySelectorAll('.sunset'),
    },
    
    LOCATIONS_UL : document.querySelector('.locations-ul'),
    CHOOSE_LOCTION : document.querySelector('.liked-location'),
    LIKE_BTN : document.querySelector('.like-btn'),
    DELETE_BTN : document.querySelector('.delete-location'),
}