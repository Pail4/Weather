import {UI} from "./view.js";

const serverUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
const serverIconUrl = 'https://openweathermap.org/img/wn/';

let locationList = ["Perm"];

let currentTimeData = {
    locationName: "",
    temperature : "",
    feelsLike: "",
    weather: "",
    weatherIcon: "",
    sunrise: "",
    sunset: "",
    liked() { return locationList.includes(this.locationName) },
}

// let currentDayData = {
//     "00:00": currentTimeData,
//     "03:00": currentTimeData,
// }

function searchLocation(event){
    event.preventDefault();
    
    const cityName = UI.SEARCH_INPUT.value;
    const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;
    parseData(cityName, url);
    this.reset();
}

function parseData(cityName, url){
    const promise = fetch(url);
    promise.then((response) => response.json())
    .then((commit) => {
        const iconCode = commit.weather[0].icon;
        currentTimeData.weatherIcon = `${serverIconUrl}${iconCode}@4x.png`;

        currentTimeData.locationName = commit.name;
        currentTimeData.temperature = toGrad(commit.main.temp);
        currentTimeData.feelsLike = toGrad(commit.main.feels_like);
        currentTimeData.weather = commit.weather[0].main;
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
    return hours + ':' + minutes.slice(-2);
}

function toGrad(kelvin){
    return Math.round((kelvin - 273.14));
}

function addLocation(e){
    if (currentTimeData.liked()){
        deleteLocation(e, true);
        return;
    }

    let liElem = document.createElement('li');
    let likedLocation = document.createElement('input');
    likedLocation.classList.add('liked-location');
    likedLocation.type = "button"
    likedLocation.addEventListener("click", changeLocation);

    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-location');
    deleteBtn.addEventListener("click", deleteLocation);

    likedLocation.value = currentTimeData.locationName;

    locationList.push(currentTimeData.locationName);
    UI.LIKE_BTN.classList.add('active');
    liElem.append(likedLocation, deleteBtn);
    UI.LOCATIONS_UL.prepend(liElem);
}

function deleteLocation(e, isCurrentLocation = false){
    let locationName = isCurrentLocation ?
     currentTimeData.locationName : this.previousSibling.value
    
    let itemIndex = locationList.findIndex((item) => item === locationName)
    if (itemIndex === -1)
        return
    locationList.splice(itemIndex, 1);
    if (isCurrentLocation){
        let deletingElement = Array.from(UI.LOCATIONS_UL.querySelectorAll('li input'))
            .find((item) => item.value === currentTimeData.locationName)
        //deletingElement.find((item) => item.value === currentTimeData.locationName)
        deletingElement.parentNode.remove();
    }
    else { e.target.parentNode.remove(); }
    
    if (locationName === currentTimeData.locationName){
        UI.LIKE_BTN.classList.remove('active');
    }
}

function changeLocation(){
    UI.SEARCH_INPUT.value = this.value;
    let event = new Event("submit");
    UI.SEARCH_FORM.dispatchEvent(event);
}

function changeTab(){
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
    let isInList = currentTimeData.liked() ? 'active' : '';
    UI.LIKE_BTN.className = "like-btn " + isInList ;

    let img = document.querySelector('.weather-img')
    img.src = currentTimeData.weatherIcon;
    img.alt = currentTimeData.weather;
    //document.querySelector('.weather-img').className = "weather-img " + currentTimeData.weather.toLocaleLowerCase();
}

function setValueForBlocks(blocks, value){
    blocks.forEach((item) => { item.textContent = value; });
}


window.onload = function() {
    UI.SEARCH_FORM.addEventListener('submit', searchLocation);
    UI.LIKE_BTN.addEventListener('click', addLocation);
    UI.DELETE_BTN.addEventListener('click', deleteLocation);
    UI.CHOOSE_LOCTION.addEventListener('click', changeLocation);

    for (let btn in UI.NAV_BTN){
        UI.NAV_BTN[btn].addEventListener('click', changeTab);
    }
    let startEvent = new Event("submit");
    UI.SEARCH_INPUT.value = "Perm";
    UI.SEARCH_FORM.dispatchEvent(startEvent);
}