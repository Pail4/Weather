import {weatherNow, weatherForecast} from "./storage.js";

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

    FORECAST_BLOCKS : {
        timeBlockTemplate : document.querySelector('.time-block').cloneNode(true),
        timeBlockList : document.querySelector('.time-block-list'),
    },
    
    LOCATIONS_UL : document.querySelector('.locations-ul'),
    CHOOSE_LOCATION : document.querySelector('.liked-location'),
    LIKE_BTN : document.querySelector('.like-btn'),
    DELETE_BTN : document.querySelector('.delete-location'),
}


export function updateTabs(){
    let blocks = UI.PARAM_BLOCKS;

    setValueForBlocks(blocks.temp, weatherNow.temperature);
    setValueForBlocks(blocks.feelsLike, weatherNow.feelsLike);
    setValueForBlocks(blocks.locationName, weatherNow.locationName);
    setValueForBlocks(blocks.sunrise, weatherNow.sunrise);
    setValueForBlocks(blocks.sunset, weatherNow.sunset);
    let isInList = weatherNow.liked() ? 'active' : '';
    UI.LIKE_BTN.className = "like-btn " + isInList ;

    let img = document.querySelector('.weather-img');
    img.src = weatherNow.weatherIcon;
    img.alt = weatherNow.weather;
    updateThirdTab();

    weatherNow.push();
}

function updateThirdTab(){
    const timeBlockList = UI.FORECAST_BLOCKS.timeBlockList.cloneNode();
    UI.FORECAST_BLOCKS.timeBlockList.remove();
    for (let date in weatherForecast) {
        const time = date.slice(-5).trim();
        const day = date.slice(0, -5).trim();

        const from = weatherForecast[date];
        const block = UI.FORECAST_BLOCKS.timeBlockTemplate.cloneNode(true);
        block.querySelector('.date').textContent = day;
        block.querySelector('.time').textContent = time;
        block.querySelector('.temp').textContent = from.temperature;
        block.querySelector('.feels-like').textContent = from.feelsLike;
        block.querySelector('.time-weather-name').textContent = from.weather;
        block.querySelector('.time-weather-img').src = from.weatherIcon;
        timeBlockList.append(block);
    }
    UI.TABS.FORECAST.append(timeBlockList);
}

export function setValueForBlocks(blocks, value){
    blocks.forEach((item) => { item.textContent = value; });
}

export function changeTab(){
    for (let tabName in UI.TABS){
        UI.NAV_BTN[tabName].classList.remove('active');
        UI.TABS[tabName].classList.remove('active');
    }
    this.classList.add('active')
    UI.TABS[this.dataset.tab].classList.add('active');
}