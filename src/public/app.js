const svgMap = document.getElementById('mapSVG');
const paths = svgMap.querySelectorAll('path');

const countryName = document.getElementById('country');
const capitalName = document.getElementById('capital');
const capitalTime = document.getElementById('time');
const capitalDate = document.getElementById('date');
const weather_Desc = document.getElementById('weather-desc');
const weatherIcon = document.getElementById('weather-icon');
const cityTemp = document.getElementById('temp');
const population = document.getElementById('pop');
const loadingIndicator = document.getElementById('loading');
loadingIndicator.style.display = 'none';

function fetchCountryData(name) {
    // Show loading indicator
    loadingIndicator.style.display = 'block';

    // Hide the rest of the content
    document.querySelector('.hidden-content').style.display = 'none';

    countryName.textContent = name;
    if (name == "United States") {
        name = "United States of America";
    }

    // Send the country name to the server
    fetch('/country', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
    })
    .then(response => {
        // Check if the response is ok
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const { countryCapital, date, hours, minutes, weekDay, temp, icon, weatherDesc, pop } = data;
        if (name == "United States of America") {
            name = "United States";
        }
        countryName.textContent = `${name}, ${countryCapital}`;
        capitalName.textContent = `${countryCapital}`;
        capitalTime.textContent = `${getTime(hours, minutes)}`;
        capitalDate.textContent = `${formatDate(date, weekDay)}`;
        weather_Desc.textContent = `${weatherDesc}`;
        weatherIcon.src = `${getIcon(icon)}`;
        cityTemp.textContent = `${getCelsius(temp)}`;
        population.textContent = `${pop}`;
        loadingIndicator.style.display = 'none';

        // Show the rest of the content
        document.querySelector('.hidden-content').style.display = 'block';
    })
    .catch(error => {
        capitalName.textContent = 'aaa';
        capitalTime.textContent = 'Failed to load time';
    });
}

paths.forEach(country => {
    country.addEventListener("click", function(event) {
        let name = country.getAttribute('name');
        if (name === null || name.trim() === '') {
            name = country.getAttribute('class');
        }
        fetchCountryData(name);
    });
});

window.onload = function() {
    fetchCountryData('Canada');
};

function getIcon(icon){
    switch (icon) {
        case "01d":
            document.getElementById('weatherBG').style.color = "#076a0c";
            document.getElementById('weatherBG').style.backgroundImage = "url('gifs/sun.gif')";
            return "images/sun.png";
        case "01n":
            document.getElementById('weatherBG').style.color = "#fce6ff";
            document.getElementById('weatherBG').style.backgroundImage = "url('gifs/moon.gif')";
            return "images/moon.png";
        case "02d":
            document.getElementById('weatherBG').style.color = "#fce6ff";
            document.getElementById('weatherBG').style.backgroundImage = "url('gifs/cloudSun.gif')";
            return "images/cloudSun.png";
        case "02n":
            document.getElementById('weatherBG').style.color = "#fce6ff";
            document.getElementById('weatherBG').style.backgroundImage = "url('gifs/cloudMoon.gif')";
            return "images/cloudMoon.png";
        case "03d" || "03n":
            //?
            document.getElementById('weatherBG').style.color = "#fce6ff";
            document.getElementById('weatherBG').style.backgroundImage = "url('gifs/cloud.gif')";
            return "images/cloud.png";
        case "04d" || "04n":
            document.getElementById('weatherBG').style.color = "#fce6ff";
            document.getElementById('weatherBG').style.backgroundImage = "url('gifs/brokenClouds.gif')";
            return "images/brokenClouds.png";
        case "09d" || "09n":
            document.getElementById('weatherBG').style.color = "#fce6ff";
            document.getElementById('weatherBG').style.backgroundImage = "url('gifs/rain.gif')";
            return "images/rain.png";
        case "10d":
            document.getElementById('weatherBG').style.color = "#fce6ff";
            document.getElementById('weatherBG').style.backgroundImage = "url('gifs/sunRain.gif')";
            return "images/sunRain.png";
        case "10n":
            document.getElementById('weatherBG').style.color = "#fce6ff";
            document.getElementById('weatherBG').style.backgroundImage = "url('gifs/moonRain.gif')";
            return "images/moonRain.png";
        case "11d" || "11n":
            document.getElementById('weatherBG').style.color = "#fce6ff";
            document.getElementById('weatherBG').style.backgroundImage = "url('gifs/storm.gif')";
            return "images/storm.png";
        case "13d" || "13n":
            document.getElementById('weatherBG').style.color = "#262f5d";
            document.getElementById('weatherBG').style.backgroundImage = "url('gifs/snow.gif')";
            return "images/snow.png";
        case "50d" || "50n":
            document.getElementById('weatherBG').style.color = "#0a7174";
            document.getElementById('weatherBG').style.backgroundImage = "url('gifs/mist.gif')";
            return "images/mist.png";
        default:
            document.getElementById('weatherBG').style.color = "#fce6ff";
            document.getElementById('weatherBG').style.backgroundImage = "url('gifs/unavailable.gif')";
            return "images/unavailable.png";
    }
}

function getCelsius(temp){
    if(temp != undefined){
        console.log(temp);
        const celsius = Number(temp)-273.15;
        return Math.round(celsius * 10) / 10+"°C";
    }
    else{
        return "NA"
    }
}

function getTime(hours, minutes) {
    try {
        if(hours == undefined || minutes == undefined){throw error;}
        let hours_12 = hours % 12;
        hours_12 = hours_12 ? hours_12 : 12; 
        let time = hours >= 12 ? "pm" : "am";
        let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours_12}:${formattedMinutes}${time}`;
    } catch (error) {
        return `Failed to load time`;
    }
}


function formatDate(date, weekDay) {
    try{
        // Example input: '2024-08-16'
        const dateArr = date.split("-");
        const year = dateArr[0];
        const monthNumber = dateArr[1];
        const day = Number(dateArr[2]);
    
        const month = getAbbreviatedMonth(monthNumber);
        const week_day = getAbbreviatedDay(weekDay);
        
        const dateString = `${week_day}, ${day} ${month} ${year}`;
        return dateString;
    }
    catch(error){
        return "Date failed to load";
    }
  }

function getAbbreviatedMonth(monthNumber) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const index = parseInt(monthNumber, 10) - 1;
    return index >= 0 && index < months.length ? months[index] : 'Invalid month';
  }

function getAbbreviatedDay(weekDay) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const index = parseInt(weekDay, 10);
    return index >= 0 && index < days.length ? days[index] : 'Invalid day';
  }


const wrapper = document.querySelector(".wrapper");
const header = wrapper.querySelector("header");

let isDragging = false;
let startX, startY;
let initialTransformX = 0, initialTransformY = 0;

function onDrag(event) {
    if (!isDragging) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    // Update the transform property to move the element
    wrapper.style.left = `${initialX + deltaX}px`;
    wrapper.style.top = `${initialY + deltaY}px`;
}

header.addEventListener("mousedown", (event) => {

    const rect = wrapper.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;

    startX = event.clientX;
    startY = event.clientY;

    isDragging = true;
    header.classList.add("active");
    document.addEventListener("mousemove", onDrag);
});

document.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
        header.classList.remove("active");
        document.removeEventListener("mousemove", onDrag);
    }
});

let mode = 1;

function toggleDarkMode() {
    mode = (mode + 1) % 2; // Corrected increment and modulo operation
    if (mode == 1) {
        document.getElementById('darkModeToggle').querySelector('img').src = "images/day.png";
    } else {
        document.getElementById('darkModeToggle').querySelector('img').src = "images/night.png"; 
    }
    document.body.classList.toggle('dark-mode');
}