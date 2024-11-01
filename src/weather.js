const apiKey = 'de4e0df714b74d6c8ee181500242410';


async function getWeatherByCity(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`);
        if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
        
        const data = await response.json();
        displayCurrentWeather(data);
        displayForecast(data.forecast.forecastday);
        suggestActivities(data.current.condition.text.toLowerCase());
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Failed to load weather data. Try again later.");
    }
}

// Display current weather details
function displayCurrentWeather(data) {
    const { location, current } = data;
    const weatherDetails = `
        <p><strong>Location:</strong> ${location.name}, ${location.region}, ${location.country}</p>
        <p><strong>Local Time:</strong> ${location.localtime}</p>
        <p><strong>Temperature:</strong> ${current.temp_c}°C</p>
        <p><strong>Condition:</strong> ${current.condition.text}</p>
        <p><strong>Wind Speed:</strong> ${current.wind_kph} kph</p>
        <p><strong>Humidity:</strong> ${current.humidity}%</p>
        <p><strong>Chance of Rain:</strong> ${current.precip_mm > 0 ? "Yes" : "No"}</p>
        <p><strong>Chance of Snow:</strong> ${current.condition.text.toLowerCase().includes('snow') ? "Yes" : "No"}</p>
    `;
    document.getElementById('weather-details').innerHTML = weatherDetails;
}

function suggestActivities(condition) {
    const activitySuggestions = {
    sunny: ["Hiking", "Soccer", "Cycling", "Picnic", "Beach Volleyball"],
    cloudy: ["Jogging", "Outdoor Yoga", "Park Visit", "Nature Walk"],
    rainy: ["Indoor Swimming", "Yoga", "Gym Workout", "Reading", "Visit a Museum"],
    thunderstorm: ["Indoor Bowling", "Board Games", "Watch Movies", "Visit a Library"],
    snowy: ["Skiing", "Snowboarding", "Ice Skating", "Build a Snowman", "Indoor Games"],
    windy: ["Kite Flying", "Paragliding", "Surfing (if near coast)", "Sailing", "Flying Drones"],
    clear: ["Stargazing", "Photography", "Picnic", "Leisurely Hike", "Cycling", "Outdoor Yoga"],
    foggy: ["Photography", "Short Walk", "Museum Visit", "Cafe Relaxation"],
    mist: ["Nature Walk", "Visit a Greenhouse", "Photography", "Short Hike"],
    haze: ["Indoor Swimming", "Shopping Mall Walk", "Visit an Aquarium", "Indoor Sports"],
    blizzard: ["Reading", "Watch Movies", "Baking", "Board Games", "Indoor Exercise"],
    sandstorm: ["Indoor Rock Climbing", "Board Games", "Binge-Watch Series", "Art and Crafts"],
    smoke: ["Visit an Art Gallery", "Indoor Swimming", "Bookstore Visit", "Yoga"],
    overcast: ["Photography", "Walking in the Park", "Jogging", "Visit an Indoor Market"],
    drizzle: ["Reading at a Cafe", "Indoor Gym", "Visit a Museum", "Board Games"],
    sleet: ["Ice Skating", "Bowling", "Hot Chocolate at a Cafe", "Reading Indoors"],
    hot: ["Beach Day", "Swimming", "Water Park", "Indoor Ice Skating"],
    cold: ["Ice Skating", "Museum Visit", "Hot Chocolate at a Cafe", "Indoor Climbing"] 
    };

    // Find matching activity suggestions or fallback
    const suggestions = activitySuggestions[condition] || ["No specific suggestions; choose any preferred activity!"];

    // Display suggestions in the HTML element
    document.getElementById('activity-suggestions').innerHTML = suggestions
        .map(activity => `<li>${activity}</li>`)
        .join('');
}

// Display 5-day forecast
function displayForecast(forecastDays) {
    const forecastCards = forecastDays.map(day => `
        <div class="forecast-card">
            <p class="forecast-date">${new Date(day.date).toDateString()}</p>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
            <p class="forecast-temp">${day.day.maxtemp_c}° / ${day.day.mintemp_c}°</p>
            <p class="forecast-condition">${day.day.condition.text}</p>
        </div>
    `).join('');
    document.getElementById('forecast-cards').innerHTML = forecastCards;
}

// Event listener
document.getElementById('locationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = document.getElementById('cityInput').value.trim();
    if (city) getWeatherByCity(city);
    else alert("Please enter a city name.");
});
