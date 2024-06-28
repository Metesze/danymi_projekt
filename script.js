document.addEventListener("DOMContentLoaded", function() {
    var map = L.map('mapid').setView([51.505, -0.09], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('click', function(e) {
        var lat = e.latlng.lat;
        var lon = e.latlng.lng;
        fetchWeather(lat, lon);
    });

    function fetchWeather(lat, lon) {
        const apiKey = '7922f393cd276c8ebd48b78122533b24';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    alert(`Weather in ${data.name}: ${data.weather[0].description}, Temperature: ${data.main.temp}°C`);
                } else {
                    alert('Weather data not available. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                alert('Could not fetch weather data. Please try again.');
            });
    }

    var homeLink = document.getElementById("homeLink");
    var weatherLink = document.getElementById("weatherLink");
    var weatherForm = document.getElementById("weatherForm");

    homeLink.addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("mapid").style.display = "block";
        weatherForm.style.display = "none";
    });

    weatherLink.addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("mapid").style.display = "none";
        weatherForm.style.display = "block";
    });

    var cityForm = document.getElementById("cityForm");
    cityForm.addEventListener("submit", function(event) {
        event.preventDefault();
        var cityName = document.getElementById("cityInput").value;
        if (cityName.trim() !== "") {
            fetchWeatherByCity(cityName);
        } else {
            alert("Please enter a city name.");
        }
    });

    function fetchWeatherByCity(cityName) {
        const apiKey = '7922f393cd276c8ebd48b78122533b24';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    alert(`Weather in ${data.name}: ${data.weather[0].description}, Temperature: ${data.main.temp}°C`);
                    fetchWeatherForecast(cityName);
                } else {
                    alert('Weather data not available. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                alert('Could not fetch weather data. Please try again.');
            });
    }

    function fetchWeatherForecast(cityName) {
        const apiKey = '7922f393cd276c8ebd48b78122533b24';
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.cod === "200") {
                    displayWeatherForecast(data);
                } else {
                    alert('Forecast data not available. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching forecast data:', error);
                alert('Could not fetch forecast data. Please try again.');
            });
    }

    function displayWeatherForecast(data) {
        const weatherResults = document.getElementById("weatherResults");
        weatherResults.innerHTML = '';

        
        for (let i = 0; i < data.list.length; i += 8) { 
            const forecast = data.list[i];
            const date = new Date(forecast.dt * 1000).toLocaleDateString();
            const description = forecast.weather[0].description;
            const temp = forecast.main.temp;

            const forecastBlock = document.createElement('div');
            forecastBlock.className = 'weather-forecast';
            forecastBlock.innerHTML = `
                <h3>${date}</h3>
                <p>${description}</p>
                <p>Temperature: ${temp}°C</p>
            `;

            weatherResults.appendChild(forecastBlock);
        }
    }
});
