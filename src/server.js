const express = require("express");
const request = require("request");
const path = require("path");
const axios = require("axios");
const mysql = require('mysql');
const { count } = require("console");
require('dotenv').config();

const api_key = process.env.API_KEY;
const time_key_api = process.env.TIME_KEY_API;
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

app.listen(3000, () => console.log("Server started on port 3000"))

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'worldmap_db',
    insecureAuth: true
  });
connection.connect((err) => {
if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
}
console.log('Connected as id ' + connection.threadId);
});

async function getCountryData(countryName) {
    var countryCapital;
    var countryRegion;
    var lat;
    var long;
    var countryUrl = `https://restcountries.com/v3.1/name/${countryName}`;
    try {
        const countryResponse = await axios.get(countryUrl);
        const countryData = countryResponse.data;

        if (countryData && countryData[0]) {
            countryCapital = countryData[0].capital ? countryData[0].capital: 'Capital not found';
        } else {
            throw new Error('Country not found');
        }
        if (countryData && countryData[0]) {
            countryRegion=  countryData[0].region ? countryData[0].region : 'Region not found';
            if(countryRegion == "Americas")
            {
                countryRegion= "America"
            }
        } else {
            throw new Error('Region not found');
        }
        if (countryData && countryData[0]) {
            if(countryData[0].capitalInfo!={} && countryData[0].capitalInfo.latlng)
            {
                lat = countryData[0].capitalInfo.latlng[0] || "Lat not found";
                long = countryData[0].capitalInfo.latlng[1] || "Long not found";
            }
            else if (Object.keys(countryData[0].capitalInfo).length === 0 && countryData[0].latlng){
                lat = countryData[0].latlng[0] || "Lat not found";
                long = countryData[0].latlng[1] || "Long not found";
            }
            else{
                throw new Error('Lat/Long not found');
            }
        }
        return {countryCapital, countryRegion, lat, long};
    } catch (error) {
        console.error('Error fetching country data from API:', error);
        throw new Error('Internal Server Error');
    }
}

async function getCityWeatherData(city) {
    var temp;
    var weatherDesc;
    var icon;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
    try {
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data;

        if (weatherData && weatherData.main) {
            temp = weatherData.main.temp;
        } else {
            throw new Error('Temperature not found');
        }

        if (weatherData && weatherData.weather) {
            icon = weatherData.weather[0].icon;

        } else {
            throw new Error('Icon not found');
        }

        if (weatherData && weatherData.weather) {
            weatherDesc= weatherData.weather[0].description;
        } else {
            throw new Error('Weather description not found');
        }
        return {temp, icon, weatherDesc};
        
    } catch (error) {
        console.error('Error fetching weather data from API:', error);
        throw new Error('Internal Server Error');
    }
}

async function getCityTimezone(lat, long) {
    const timeUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&format=json&apiKey=${time_key_api}`;

    try {
        const timeResponse = await axios.get(timeUrl);
        const timeData = timeResponse.data;

        if (timeData && timeData.results && timeData.results[0]) {
            const timezone = timeData.results[0].timezone;
            return timezone ? timezone.name || 'Timezone not found' : 'Timezone not found';
        } else {
            throw new Error('Timezone not found');
        }
    } catch (error) {
        console.error('Error fetching time data from API:', error);
        throw new Error('Internal Server Error');
    }
}


async function getCityTime(timezone) {
    const timeUrl = `http://worldtimeapi.org/api/timezone/${timezone}`;
    try {
        const timeResponse = await axios.get(timeUrl);
        const timeData = timeResponse.data;

        if (timeData && timeData.datetime) {
            const datetimeString = timeData.datetime;
            const weekDay = timeData.day_of_week;
            const [datePart, timePartWithOffset] = datetimeString.split('T');
            const [timePart] = timePartWithOffset.split('+');
            const [year, month, day] = datePart.split('-');
            const [hours, minutes, seconds] = timePart.split(':');
            const date = `${year}-${month}-${day}`;
            return {date, hours, minutes, weekDay };
            
        } else {
            throw new Error('Time data not found in response');
        }
    } catch (error) {
        console.error('Error fetching time data from API:', error);
        throw new Error('Internal Server Error');
    }
}
/*
const getPopulationData = async (countryName, lat, long) => {
    const query = `
      SELECT ci.population
      FROM cities ci
      JOIN countries c ON ci.country_id = c.id
      WHERE c.country = ? AND ci.city = ?
    `;

    return new Promise((resolve, reject) => {
        connection.query(query, [countryName, cityName], (error, results) => {
            if (error) return reject(error);

            if (results.length > 0) {
                resolve("~"+results[0].population+" people");
            } else {
                resolve("City not found");
            }
        });
    });
};
*/
const getPopulationData = async (countryName, cityName, lat, long) => {
    if(countryName=="United States of America"){
        const query = `
        SELECT ci.population, c.id
        FROM cities ci
        JOIN countries c ON ci.country_id = c.id
        WHERE c.country = ? AND ABS(ci.latitude - ?) <= 0.05 AND ABS(ci.longitude - ?) <= 0.05
        `;

        return new Promise((resolve, reject) => {
            connection.query(query, [countryName, lat, long], (error, results) => {
                if (error) {
                    console.error("Database query error:", error);
                    return reject("An error occurred while fetching data.");
                }

                if (results.length > 0) {
                    console.log(results[0]);
                    resolve(`~${results[0].population} people - Possibly metropolitan area`);
                } else {
                    resolve("City not found");
                }
            });
        });
    }
    
    else{

        const query = `
        SELECT ci.population
        FROM cities ci
        JOIN countries c ON ci.country_id = c.id
        WHERE c.country = ? AND ci.city = ?
      `;
  
        return new Promise((resolve, reject) => {
            connection.query(query, [countryName, cityName], (error, results) => {
                if (error) return reject(error);
    
                if (results.length > 0) {
                    resolve("~"+results[0].population+" people");
                } else {
                    resolve("City not found");
                }
            });
        });
    }
    
};


app.post('/country', async (req, res) => {
    const countryName = req.body.name;

    try {
        //console.log("api info being retrieved...");
        const {countryCapital, countryRegion, lat, long} = await getCountryData(countryName);
        const timezone = await getCityTimezone(lat, long);
        const {date, hours, minutes, weekDay} = await getCityTime(timezone);
        const  {temp, icon, weatherDesc} = await getCityWeatherData(countryCapital[0]);
        //console.log("api info aquired...");
        console.log(lat, long);
        const pop = await getPopulationData(countryName, countryCapital[0],lat, long);
        res.json({countryCapital, date, hours, minutes, weekDay, temp, icon, weatherDesc, pop});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});
