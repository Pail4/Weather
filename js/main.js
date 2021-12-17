import { UI } from "./view.js";

const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';

let locationList = []

let currentTimeData = {
    locationName: "",
    temperature : "",
    feelsLike: "",
    weather: "",
    sunrise: "",
    sunset: "",
}

let currentDayData = {
    "00:00": currentTimeData,
    "03:00": currentTimeData,
}

function searchLocation(event){
    event.preventDefault();
    const input = this.querySelector('input');
    
    const cityName = input.value;
    const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;
    parseData(cityName, url);
    this.reset();
}

function parseData(cityName, url){
    let promise = fetch(url);
    promise.then((response) => response.json())
    .then((commit) => {
        currentTimeData.locationName = commit.name;
        currentTimeData.temperature = toGrad(commit.main.temp);
        currentTimeData.feelsLike = toGrad(commit.main.feels_like);
        currentTimeData.weather = commit.weather[0].description;
        currentTimeData.sunrise = parseTime(commit.sys.sunrise);
        currentTimeData.sunset = parseTime(commit.sys.sunset);
        updateTabs();
    })
    .catch(() => {
        let input = UI.SEARCH_FORM.querySelector('input');
        input.classList.add('error');
        setTimeout(() => { input.classList.remove('error') }, 1000);
    })
}

function parseTime(timeUNIX){
    let date = new Date(timeUNIX * 1000);
    let hours = date.getHours();
    // Minutes part from the timestamp
    let minutes = "0" + date.getMinutes();

    // Will display time in 10:30:23 format
    let formattedTime = hours + ':' + minutes.slice(-2);
    
    return formattedTime;
}

function toGrad(kelvin){
    return Math.round((kelvin - 273), 2);
}

function changeTab(event){
    for (let tabName in UI.TABS){
        UI.NAV_BTN[tabName].classList.remove('active');
        UI.TABS[tabName].classList.remove('active');
    }
    this.classList.add('active')
    UI.TABS[this.dataset.tab].classList.add('active');
}

///////UPDATERS

function updateTabs(){
    let blocks = UI.PARAM_BLOCKS;

    setValueForBlocks(blocks.temp, currentTimeData.temperature);
    setValueForBlocks(blocks.feelsLike, currentTimeData.feelsLike);
    setValueForBlocks(blocks.locationName, currentTimeData.locationName);
    setValueForBlocks(blocks.sunrise, currentTimeData.sunrise);
    setValueForBlocks(blocks.sunset, currentTimeData.sunset);
}

function setValueForBlocks(blocks, value){
    blocks.forEach((item) => { item.textContent = value; })
}


window.onload = function() {
    UI.SEARCH_FORM.addEventListener('submit', searchLocation);

    for (let btn in UI.NAV_BTN){
        UI.NAV_BTN[btn].addEventListener('click', changeTab);
    }
}