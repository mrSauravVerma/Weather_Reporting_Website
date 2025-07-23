let currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
let forecastWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
let apiKey = "8e9b8ae1b4e404c6fa759657ff494dec";

const searchInput = document.getElementById("search-city");
const searchButton = document.getElementById("get-weather");
const weatherInfo = document.querySelector(".main-weather .info h1");
const weatherDescription = document.querySelector(".main-weather .info p");
const details = document.querySelector(".main-weather .details");
const weatherIcon = document.querySelector(".main-weather .icon img");
const weekDays = document.querySelectorAll(".weekly-forecast .day");
const cityName = document.querySelector(".city_name h1");

weekDays[6].style.display = "none";
weekDays[5].style.display = "none"; 

async function fetchWeather(city) {
    try {
        // Current weather
        const currentRes = await fetch(`${currentWeatherURL}${city}&appid=${apiKey}`);
        if (!currentRes.ok) throw new Error("City not found");
        const currentData = await currentRes.json();

        // Current weather UI update
        weatherInfo.textContent = `${currentData.main.temp}°C`;
        weatherDescription.textContent = currentData.weather[0].description;
        details.innerHTML = `
            <p>Feels Like: ${currentData.main.feels_like}°C</p>
            <p>Humidity: ${currentData.main.humidity}%</p>
            <p>Wind Speed: ${currentData.wind.speed} m/s</p>
            <p>Visibility: ${currentData.visibility / 1000} km</p>
        `;
        let currentIcon = currentData.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${currentIcon}@2x.png`;

        // Forecast weather
        const forecastRes = await fetch(`${forecastWeatherURL}${city}&appid=${apiKey}`);
        const forecastData = await forecastRes.json();

        // Group forecasts by day
        const dailyForecasts = {};
        forecastData.list.forEach(item => {
            const date = item.dt_txt.split(" ")[0];
            if (!dailyForecasts[date]) dailyForecasts[date] = [];
            dailyForecasts[date].push(item);
        });
        const nextFiveDaysKeys = Object.keys(dailyForecasts).slice(0, 5);
        weekDays.forEach((dayDiv, index) => {
            if (nextFiveDaysKeys[index]) {
                const dateKey = nextFiveDaysKeys[index];
                const dayForecasts = dailyForecasts[dateKey];

                let tempMax = -Infinity;
                let tempMin = Infinity;
                let icon = dayForecasts[0].weather[0].icon;
                let desc = dayForecasts[0].weather[0].description;

                dayForecasts.forEach(entry => {
                    if (entry.main.temp_max > tempMax) tempMax = entry.main.temp_max;
                    if (entry.main.temp_min < tempMin) tempMin = entry.main.temp_min;
                });

                const date = new Date(dateKey);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                dayDiv.style.display = "";
                dayDiv.querySelector("h3").textContent = dayName;
                dayDiv.querySelector("img").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                dayDiv.querySelector("img").alt = desc;
                dayDiv.querySelector("p").textContent = `High: ${Math.round(tempMax)}° Low: ${Math.round(tempMin)}°`;
            } else {
                dayDiv.style.display = "none"; 
            }
        });

    } catch (error) {
        alert(error.message);
    }
}

searchButton.addEventListener("click", () => {
    const city = searchInput.value.trim();
    cityName.textContent = `Weather in ${city}` ;
    if (city) {
        fetchWeather(city);
    } else {
        alert("Please enter a city name");
    }
});
searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const city = searchInput.value.trim();
        cityName.textContent = `Weather in ${city}`;
        if (city) {
            fetchWeather(city);
        } else {
            alert("Please enter a city name");
        }
    }
});