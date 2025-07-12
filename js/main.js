const apiKey = "05d37a01de8843b0bdd114905251207";
const body = document.body;
const statusDiv = document.getElementById("status");
const forecastContainer = document.getElementById("forecastContainer");
const themeBtn = document.getElementById("toggleTheme");

themeBtn.addEventListener("click", () => {
  const isDark = body.classList.contains("dark-mode");
  body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode");

  themeBtn.textContent = isDark ? "🌓" : "🌞";
});

function getCurrentLocation() {
  if ("geolocation" in navigator) {
    statusDiv.innerText = "📡 Getting your location...";
    navigator.geolocation.getCurrentPosition(success, showError);
  } else {
    statusDiv.innerText = "❌ Geolocation not supported.";
  }
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  fetchWeather(`${lat},${lon}`);
}

function searchCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    statusDiv.innerText = "⚠️ Please enter a city.";
    return;
  }
  fetchWeather(city);
}

function showError() {
  statusDiv.innerText = "❌ Can't get location.";
}

function fetchWeather(query) {
  statusDiv.innerText = "🔄 Fetching weather data...";
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=3&aqi=no&alerts=no`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      statusDiv.innerHTML = `📍 <strong>${data.location.name}, ${data.location.country}</strong>`;
      displayForecast(data.forecast.forecastday);
    })
    .catch(() => {
      statusDiv.innerText = "⚠️ Error fetching weather.";
      forecastContainer.innerHTML = "";
    });
}

function displayForecast(forecastDays) {
  if (!forecastDays || forecastDays.length === 0) {
    forecastContainer.innerHTML = "<p class='text-center text-white'>🙅 No forecast available.</p>";
    return;
  }

  forecastContainer.innerHTML = forecastDays.map(day => {
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const fullDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const icon = day.day.condition.icon;

    return `
      <div class="forecast-card">
        <h5>${dayName}, ${fullDate}</h5>
        <img src="https:${icon}" alt="Weather Icon" class="weather-icon mb-2"/>
        <p><strong>${day.day.condition.text}</strong></p>
        <p>🌡️ Avg Temp: ${day.day.avgtemp_c}°C</p>
        <p>💧 Humidity: ${day.day.avghumidity}%</p>
      </div>
    `;
  }).join("");
}
