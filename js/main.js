import { UI } from "./view.js";

function searchLocation(event){
    event.preventDefault();
}

function changeTab(event){
    for (let tabName in UI.TABS){
        UI.NAV_BTN[tabName].classList.remove('active');
        UI.TABS[tabName].classList.remove('active');
    }
    this.classList.add('active')
    UI.TABS[this.dataset.tab].classList.add('active');
}

window.onload = function() {
    UI.SEARCH_FORM.addEventListener('submit', searchLocation);

    for (let btn in UI.NAV_BTN){
        UI.NAV_BTN[btn].addEventListener('click', changeTab);
    }
}