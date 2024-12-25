import { xpCol } from '../JSCommon/manage.mjs';

let apiW = { key: '', base: "https://api.openweathermap.org/data/2.5/" };
xpCol().then(x => {apiW.key = x;});

/**
 * Get weather information for a given city and country.
 * @param {string} city - City name.
 * @param {string} country - Country code.
 * @returns {boolean} - Returns true if there is bad weather (Thunderstorm, Fog, or Rain), false otherwise.
 */
export async function getWeather(city, country) {
    // work on better error handling.
    try {
        const response = await fetch(`${apiW.base}weather?q=${city},${country}&appid=${apiW.key}&units=metric`);
        const data = await response.json(); // Only call this once

        if (data && data.weather) {
            return data.weather.some(condition => 
                condition.main === 'Thunderstorm' || condition.main === 'Fog' || condition.main === 'Rain'); //so... apparently in winter, everyhing is <1000 visibility :\
        }

        return false;
    } catch (error) {
        console.log(`Network error or other unexpected issue occurred: ${error}`);
        return false;
    }
}
