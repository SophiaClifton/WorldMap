const express = require("express");
const request = require("request");
const path = require("path");
const axios = require("axios");
require('dotenv').config();

const api_key = process.env.API_KEY;
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

app.listen(3000, () => console.log("Server started on port 3000"))

async function getCountryCapital(countryName) {
    try {
        const countryResponse = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
        const countryData = countryResponse.data;

        if (countryData && countryData[0]) {
            return countryData[0].capital ? countryData[0].capital[0] : 'Capital not found';
        } else {
            throw new Error('Country not found');
        }
    } catch (error) {
        console.error('Error fetching country data from API:', error);
        throw new Error('Internal Server Error');
    }
}

async function getCountryRegion(countryName) {
    try {
        const countryResponse = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
        const countryData = countryResponse.data;

        if (countryData && countryData[0]) {
            let region=  countryData[0].region ? countryData[0].region : 'Region not found';
            if(region == "Americas")
                {
                    region= "America"
                }
            console.log("REGION:", region);
            return region;
        } else {
            throw new Error('Region not found');
        }
    } catch (error) {
        console.error('Error fetching region data from API:', error);
        throw new Error('Internal Server Error');
    }
}

async function getCityTemperature(city) {

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    try {
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data;

        if (weatherData && weatherData.main) {
            return weatherData.main.temp;
        } else {
            throw new Error('Temperature not found');
        }
    } catch (error) {
        console.error('Error fetching weather data from API:', error);
        throw new Error('Internal Server Error');
    }
}

async function getWeatherIcon(city) {

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    try {
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data;

        if (weatherData && weatherData.weather) {
            console.log("icon:", weatherData.weather[0].icon)
            const icon = weatherData.weather[0].icon;
            return `https://openweathermap.org/img/wn/${icon}@2x.png`;

        } else {
            throw new Error('Temperature not found');
        }
    } catch (error) {
        console.error('Error fetching weather data from API:', error);
        throw new Error('Internal Server Error');
    }
}

async function getCityWeather(city) {

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    try {
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data;

        if (weatherData && weatherData.weather) {
            console.log("desc:", weatherData.weather[0].description)
            return weatherData.weather[0].description;
        } else {
            throw new Error('Temperature not found');
        }
    } catch (error) {
        console.error('Error fetching weather data from API:', error);
        throw new Error('Internal Server Error');
    }
}

async function getCityTime(city, region) {
    const timeUrl = `http://worldtimeapi.org/api/timezone/${region}/${city}.json`;

    try {
        const timeResponse = await axios.get(timeUrl);
        const timeData = timeResponse.data;

        if (timeData && timeData.datetime) {
            console.log("desc:", timeData.datetime)
            return timeData.datetime;//parse it first
        } else {
            throw new Error('Time not found');
        }
    } catch (error) {
        console.error('Error fetching time data from API:', error);
        throw new Error('Internal Server Error');
    }
}

app.post('/country', async (req, res) => {
    const countryName = req.body.name;
    console.log('Received country name:', countryName);

    try {
        const region = await getCountryRegion(countryName);
        const capital = await getCountryCapital(countryName);
        //get region
        //const temp = await getCityTemperature(capital);
        //const weather = await getCityWeather(capital);
        //const icon = await getWeatherIcon(capital);
        //console.log("icon is:",icon);

        //console.log(temp);
        //console.log(weather);

        res.json({ capital });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
