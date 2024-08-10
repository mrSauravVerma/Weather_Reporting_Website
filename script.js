async function getWeather() {
    const city = document.getElementById('city').value;
    const apiKey = 'e7342aba866d2ea7a09154a2d6fbea1b'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === '404') {
            document.getElementById('weather-info').innerHTML = `<p>City not found.</p>`;
        } else {
            const weather = `
                <p>City: ${data.name}</p>
                <p>Temperature: ${data.main.temp} °C</p>
                <p>Weather: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
            `;
            document.getElementById('weather-info').innerHTML = weather;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather-info').innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
    }
}