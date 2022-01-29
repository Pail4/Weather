import Cookies from 'js-cookie'
import {updateTabs} from "./view";

export const weatherNow = {
    locationName: "",
    temperature : "",
    feelsLike: "",
    weather: "",
    weatherIcon: "",
    sunrise: "",
    sunset: "",
    locationList : [""],
    liked() { return this.locationList.includes(this.locationName) },
    push() { localStorage.setItem("favoriteLocations", JSON.stringify(this.locationList)) },
    pushCurrentWeather() { Cookies.set("weatherNow", JSON.stringify(this), {"path" : '/', "max-age" : "3600"}); },
    getCurrentWeather() {
        let cache = Cookies.get("weatherNow");
        if (!cache)  return;
        cache = JSON.parse(cache);
        for (const key in this){
            if (key === "locationList") continue;
            this[key] = cache[key];
        }
    },
    get() { this.locationList = JSON.parse(localStorage.getItem("favoriteLocations")); }
}

export const weatherForecast = {};