export const weatherNow = {
    locationName: "",
    temperature : "",
    feelsLike: "",
    weather: "",
    weatherIcon: "",
    sunrise: "",
    sunset: "",
    locationList : [],
    liked() { return this.locationList.includes(this.locationName) },
    push() { localStorage.setItem("currentTimeData", JSON.stringify(this)) },
    get() {
        let data = JSON.parse( localStorage.getItem("currentTimeData") );
        for (const key in data) {
            this[key] = data[key];
        }
    }
}

export const weatherForecast = {};