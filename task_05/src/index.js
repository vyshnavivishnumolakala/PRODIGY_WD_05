searchCity("reykjavik")
let temperature = 0;

//time&date
function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let hour = date.getHours();
    if (hour < 10) {
      hour = `0${hour}`;
    }
  let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
  let day = days[date.getDay()];
  return `${day} ${hour}:${minutes}`;
}
document.querySelector("#date-time").innerHTML = formatDate(new Date());


//Current weather condition
function search(event){
  event.preventDefault();
  let cityInput = document.querySelector("#cityInput");
  let h1 = document.querySelector("#cityHeading");
  let val = cityInput.value;
  if(val) {
    searchCity(val);
    h1.innerHTML = `${val}`; 
  }       
}

let button = document.querySelector("#searchButton");
    button.addEventListener("click", search);
let unitNumber =  document.querySelector("#temperature")
document.querySelector("#celsius-button").addEventListener("click", function(event){
  event.preventDefault();
  unitNumber.innerHTML = temperature;
});
document.querySelector("#faranheit-button").addEventListener("click", function(event){
  event.preventDefault();
  unitNumber.innerHTML = Math.round((temperature * 9/5) + 32);
});

//forecast
function formatDay(timestamp) {
let date = new Date(timestamp * 1000);
let day = date.getDay();
let days = ["Sun", "Mon","Tue","Wed","Thu","Fri","Sat"];

return days[day];
}

function displayForecast(response){
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function(forecastDay, index){
    if (index < 5) {
    forecastHTML = forecastHTML + 
        `
          <div class="col-2">
            <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
            <img 
              src="https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
              class="iconForecast" 
              alt="" 
              width="70"
              />
            <p>
              <strong><span class="highTemp">${Math.round(forecastDay.temp.max)}°</span></strong>
              <span class="lowTemp"> | ${Math.round(forecastDay.temp.min)}°</span>
            </p>
          </div>
        `;
    }
  })
 
    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates){
  let apiKey = "d803ee58ce516713db5656619dac775a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
axios.get(apiUrl).then(displayForecast);
}

 function showTemperature(response) {
   temperature = Math.round(response.data.main.temp);
    document.querySelector("#cityHeading").innerHTML = response.data.name;
    document.querySelector("#feels-like").innerHTML = `Feels like: ${Math.round(response.data.main.temp)} ℃`;
    document.querySelector("#temperature").innerHTML = Math.round(response.data.main.temp);
    document.querySelector("#Humidity").innerHTML = `Humidity: ${Math.round(response.data.main.humidity)} %`;
    document.querySelector("#wind").innerHTML= `Wind: ${Math.round(response.data.wind.speed)} km/h`;
    document.querySelector("#dayForecast").innerHTML = response.data.weather[0].description;
//Weather Icon Element
    let iconElement = document.querySelector("#icon");
    iconElement.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    iconElement.setAttribute("alt", response.data.weather[0].description);
  
  getForecast(response.data.coord);
  }


function searchCity(city){
    let apiKey = "d803ee58ce516713db5656619dac775a";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;   
    
axios.get(apiUrl).then(showTemperature);
}

function handleSubmit(event){
  event.preventDefault();
  let city = document.querySelector("#cityInput").value;
  searchCity(city);
}

//Current location
function showPosition(Position){
let apiKey ="d803ee58ce516713db5656619dac775a";
let apiUrl =`https://api.openweathermap.org/data/2.5/weather?lat=${Position.coords.latitude}&lon=${Position.coords.longitude}&appid=${apiKey}&units=metric`;

axios.get(apiUrl).then(showTemperature);
}

function getCurrentLocation(event){
  event.preventDefault();
navigator.geolocation.getCurrentPosition(showPosition);
}

let pinButton = document.querySelector("#submitPin");
pinButton.addEventListener("click", getCurrentLocation);


