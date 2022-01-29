import {changeTab, UI, updateTabs, updateThirdTab} from "./view.js";
import {weatherNow, weatherForecast} from "./storage.js";

const server = {
    serverUrl : 'https://api.openweathermap.org/data/2.5/weather',
    apiKey : '3fe949c0b26e50dd4a636123c3945f54',
    serverIconUrl : 'https://openweathermap.org/img/wn/',
    forecastServerUrl : 'https://api.openweathermap.org/data/2.5/forecast',
    metric : '&units=metric',
}


function searchLocation(event){
    event.preventDefault();
    
    const cityName = UI.SEARCH_INPUT.value;
    const url = `${server.serverUrl}?q=${cityName}&appid=${server.apiKey}`;
    const forecastUrl = `${server.forecastServerUrl}?q=${cityName}&appid=${server.apiKey}`;
    parseData(url, forecastUrl);
    this.reset();
}

function parseData(url, forecastUrl) {
    getCurrentWeather(url);
    getForecast(forecastUrl);
}

function getCurrentWeather(url){
    fetch(url).then((response) => response.json())
        .then((commit) => {
            Object.assign(weatherNow, setWeatherToObject(commit, commit.name));
            weatherNow.pushCurrentWeather();
            updateTabs();
        })
        .catch(() => {
            let input = UI.SEARCH_FORM.querySelector('input');
            input.classList.add('error');
            setTimeout(() => {
                input.classList.remove('error')
            }, 1000);
        })
}

function setWeatherToObject(fromObj, locationName){
    const targetObj = {};
    targetObj.locationName = locationName;
    targetObj.temperature = toGrad(fromObj.main.temp);
    targetObj.feelsLike = toGrad(fromObj.main["feels_like"]);
    targetObj.weather = fromObj.weather[0].main;
    targetObj.sunrise = parseTime(fromObj.sys.sunrise);
    targetObj.sunset = parseTime(fromObj.sys.sunset);
    const iconCode = fromObj.weather[0].icon;
    targetObj.weatherIcon = `${server.serverIconUrl}${iconCode}@4x.png`;

    return targetObj;
}

function  getForecast(url){
    fetch(url)
        .then(response => { return response.json() })
        .then(forecast => {
            if (forecast === 404) {
                throw Error("Forecast not found:(")
            }
            forecast.list.forEach((item) => {
                const time = parseDate(item["dt"]) + ' ' + parseTime(item["dt"]);
                weatherForecast[time] = setWeatherToObject(item, forecast["city"]["name"]);
                updateThirdTab();
            })
        })
        .catch(alert)
}

function parseTime(timeUNIX){
    if (!timeUNIX) return undefined;

    let date = new Date(timeUNIX * 1000);

    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    return hours + ':' + minutes.slice(-2);
}

function parseDate(timeUNIX){
    let date = new Date(timeUNIX * 1000);

    return date.getDate() + ' ' + date.toLocaleString('en', {month: 'short'});
}

function toGrad(kelvin){
    return Math.round((kelvin - 273.14));
}

function addLocationInList(event){
    if (weatherNow.liked()){
        deleteLocation(event, true);
        return;
    }
    if (!weatherNow.locationName) return;
    let liElem = createLikedElement(weatherNow.locationName);
    UI.LOCATIONS_UL.prepend(liElem);

    UI.LIKE_BTN.classList.add('active');

    weatherNow.locationList.push(weatherNow.locationName);
    weatherNow.push();
}

function loadLocationInList(locationName){
    let liElem = createLikedElement(locationName);
    UI.LOCATIONS_UL.prepend(liElem);
}

function createLikedElement(locationName){
    let liElem = document.createElement('li');
    let likedLocation = document.createElement('input');
    likedLocation.classList.add('liked-location');
    likedLocation.type = "button"
    likedLocation.addEventListener("click", () => {changeLocation(locationName)});
    likedLocation.value = locationName;

    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-location');
    deleteBtn.addEventListener("click", deleteLocation);

    liElem.append(likedLocation, deleteBtn);
    return liElem;
}

function deleteLocation(e, isCurrentLocation = false){
    let locationName = isCurrentLocation ?
     weatherNow.locationName : this.previousSibling.value
    
    let itemIndex = weatherNow.locationList.findIndex((item) => item === locationName)
    if (itemIndex === -1) return;

    weatherNow.locationList.splice(itemIndex, 1);
    if (isCurrentLocation){
        let deletingElement = Array.from(UI.LOCATIONS_UL.querySelectorAll('li input'))
            .find((item) => item.value === weatherNow.locationName)
        //deletingElement.find((item) => item.value === currentTimeData.locationName)
        deletingElement.parentNode.remove();
    }
    else e.target.parentNode.remove();
    
    if (locationName === weatherNow.locationName){
        UI.LIKE_BTN.classList.remove('active');
    }
    weatherNow.push();
}

function changeLocation(locationName){
    if (!locationName) return;
    UI.SEARCH_INPUT.value = locationName;
    let event = new Event("submit");
    UI.SEARCH_FORM.dispatchEvent(event);
}


window.onload = function() {
    weatherNow.get();
    //weatherNow.getCurrentWeather();

    if (!weatherNow.locationList){
        weatherNow.locationList = [];
    }
    weatherNow.locationList.forEach((name) => loadLocationInList(name))
    UI.SEARCH_FORM.addEventListener('submit', searchLocation);
    UI.LIKE_BTN.addEventListener('click', addLocationInList);

    for (let btn in UI.NAV_BTN){
        UI.NAV_BTN[btn].addEventListener('click', changeTab);
    }
    changeLocation(weatherNow.locationName);
}