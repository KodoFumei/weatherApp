/* OpenWeatherMap API key */
const openWeatherApiKey = '1513ad7dda3701e74da16492d21c2d9c';
/* Get input element for city name */
const cityInput = document.getElementById('cityInput');
/* Get element to display weather results */
const weatherResults = document.getElementById('weatherResults');
/* Add event listeners dynamically after the DOM content is loaded */
document.addEventListener('DOMContentLoaded', () => {
    /* Attach event listeners to buttons once the document is fully loaded */
    document.getElementById('buttonToday').addEventListener('click', fetchTodayWeather);
    document.getElementById('buttonWeek').addEventListener('click', fetchWeeklyWeather);
});

/* Function to fetch today's weather */
function fetchTodayWeather() {
    /* Get the city name from the input */
    const cityName = cityInput.value;
    /* Construct the API URL for current weather */
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${openWeatherApiKey}`;
    /* Call the fetchWeather function with the API URL */
    fetchWeather(apiUrl);
}

/* Function to fetch weekly weather forecast */
function fetchWeeklyWeather() {
    /* Get the city name from the input */
    const cityName = cityInput.value;
    /* Construct the API URL for weekly forecast */
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${openWeatherApiKey}`;
    /* Call the fetchWeather function with the API URL and indicate it's a weekly forecast */
    fetchWeather(apiUrl, true);
}

/* Function to fetch weather data from the API */
function fetchWeather(apiUrl, isWeeklyForecast = false) {
    /* Make a fetch request to the OpenWeatherMap API */
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                /* If the response is not okay, throw an error */
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            /* Parse the response as JSON and return it */
            return response.json();
        })
        .then(data => {
            /* If it's a weekly forecast, group the forecast data by day and display it */
            if (isWeeklyForecast) {
                const dailyForecast = groupForecastByDay(data.list);
                displayWeeklyWeather(dailyForecast);
            } else {
                /* If it's today's weather, display it */
                displayTodayWeather(data);
            }

            /* Clear the input field after displaying weather data */
            cityInput.value = '';
        })
        .catch(error => {
            /* Log and display an error message if there is an issue fetching data */
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        });
}

/* Function to display today's weather */
function displayTodayWeather(data) {
    /* Extract relevant data from the API response */
    const temperature = formatTemperature(data.main.temp);
    const weatherDescription = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherIconCode = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${weatherIconCode}.png`;

    /* Update the HTML content to display today's weather */
    weatherResults.innerHTML = ` 
        <h3>Today in ${cityInput.value} <img src="${iconUrl}" alt="Weather Icon"></h3>
        <p>${weatherDescription}</p>
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
}

/* Function to display weekly weather forecast */
function displayWeeklyWeather(dailyForecast) {
    /* Initialize the HTML content for the weekly forecast */
    let forecastHtml = `<h3> Next 6 Days in ${cityInput.value}</h3><div class="weekly-forecast">`;

    /* Loop through each day in the forecast data */
    for (const date in dailyForecast) {
        const entry = dailyForecast[date];
        const temperature = formatTemperature(entry.main.temp);
        const weatherDescription = entry.weather[0].description;

        /* Add HTML content for each day to the forecastHtml */
        forecastHtml += `
            <span class="daily-forecast">
                <p class="date">${date}</p>
                <p class="description">${weatherDescription}</p>
                <p class="temperature">Temperature: ${temperature}°C</p>
            </span>
        `;
    }

    /* Update the HTML content to display the weekly forecast */
    weatherResults.innerHTML = forecastHtml;
}

/* Function to group forecast data by day */
function groupForecastByDay(forecast) {
    /* Use reduce to group forecast entries by day */
    return forecast.reduce((acc, entry) => {
        const date = entry.dt_txt.split(' ')[0];
        if (!acc[date]) {
            acc[date] = entry;
        }
        return acc;
    }, {});
}

/* Function to convert temperature from Kelvin to Celsius */
function formatTemperature(tempKelvin) {
    const tempCelsius = tempKelvin - 273.15;
    return tempCelsius.toFixed(2);
}
