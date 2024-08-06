const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
const API_KEY = "430ccb072c3b495d7a4b7d95a0d22a41";
currentTab.classList.add("current-tab");


function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click" , ()=>{
    switchTab(userTab);

});


searchTab.addEventListener("click" , ()=>{
    switchTab(searchTab);
});

// check cordinate are present in session storage
function getfromSessionStorage(){
    const localCoordinate = sessionStorage.getItem("user-coordinates");
    if(!localCoordinate){
        grantAccessContainer.classList.add('active');
    }
    else{
        const coordinates = JSON.parse(localCoordinate);

        featchUserWeatherInfo(coordinates);
    }
}

async function featchUserWeatherInfo(coordinates) {
    const {lat , lon}  = coordinates;
    grantAccessContainer.classList.remove('active');

    loadingScreen.classList.add("active");

    try{
        const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                        );
        const data = await response.json();    

        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');

        renderWeatherInfo(data);

    }
    catch(err){
        loadingScreen.classList.remove('active');
        grantAccessContainer.classList.add('active');
    }
}

function renderWeatherInfo(data){

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector('[data-countryIcon]');
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloud = document.querySelector("[data-cloud]");


    cityName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} °C`;
    windSpeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity} %`;
    cloud.innerText = `${data?.clouds?.all} %`;

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{

    }
}

function showPosition(position){
    const userCoordinate = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinate));
    featchUserWeatherInfo(userCoordinate);
}


const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener('click', getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return ;
    else
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){

    }
}