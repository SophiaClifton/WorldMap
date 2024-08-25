const svgMap = document.getElementById('mapSVG');
const paths = svgMap.querySelectorAll('path');

const countryName = document.getElementById('country');
const capitalName = document.getElementById('capital');
const capitalTime = document.getElementById('time');
const capitalDate = document.getElementById('date');
const weather_Desc = document.getElementById('weather-desc');
const weatherIcon = document.getElementById('weather-icon');
const cityTemp = document.getElementById('temp');
const loadingIndicator = document.getElementById('loading');
loadingIndicator.style.display = 'none';

paths.forEach(country =>{
    country.addEventListener("click", function(event){

        let name = country.getAttribute('name'); 
        if (name === null || name.trim() === '') {
            name = country.getAttribute('class');  
        }

        // Show loading indicator
        loadingIndicator.style.display = 'block';

        // Hide the rest of the content
        document.querySelector('.hidden-content').style.display = 'none';

        countryName.textContent= name;
        if(name == "United States"){
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
            const {countryCapital, date, hours, minutes, weekDay, temp, icon, weatherDesc} = data;
            if(name == "United States of America"){
                name = "United States";
            }
            countryName.textContent = `${name}, ${countryCapital}`;
            capitalName.textContent = `${countryCapital}`;
            capitalTime.textContent = `${getTime(hours,minutes)}`;
            capitalDate.textContent = `${formatDate(date, weekDay)}`;
            weather_Desc.textContent = `${weatherDesc}`;
            weatherIcon.src = `${getIcon(icon)}`;
            cityTemp.textContent = `${getCelsius(temp)}°C`;

            loadingIndicator.style.display = 'none';

            // Show the rest of the content
            document.querySelector('.hidden-content').style.display = 'block';

        })
        .catch(error => {
            console.error('Error:', error);
            capitalName.textContent = 'Failed to load capital';
            capitalTime.textContent = 'Failed to load time';
        });
    });
});

function getIcon(icon){
    switch (icon) {
        case "01d":
            return "images/sun.png";
        case "01n":
            return "images/moon.png";
        case "02d":
            return "images/cloudSun.png";
        case "02n":
            return "images/cloudMoon.png";
        case "03d" || "03n":
            return "images/cloud.png";
        case "04d" || "04n":
            return "images/brokenClouds.png";
        case "09d" || "09n":
            return "images/rain.png";
        case "10d":
            return "images/sunRain.png";
        case "10n":
            return "images/moonRain.png";
        case "11d" || "11n":
            return "images/storm.png";
        case "13d" || "13n":
            return "images/snow.png";
        case "50d" || "50n":
            return "images/mist.png";
        default:
            return "images/mist.png";
    }
}

function getCelsius(temp){
    const celsius = Number(temp)-273.15;
    return Math.round(celsius * 10) / 10;
}

function getTime(hours, minutes){
    var hours_12=hours%12;
    var time;
    if(hours>12){
        time = "pm";
    }
    else if (hours == 12){
        time = "pm";
        hours_12 = 12;
    }
    else{
        time = "am";
    }
    
    return `${hours_12}:${minutes}${time}`;
}

function formatDate(date, weekDay) {
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

    // update the transform property to move the element
    wrapper.style.transform = `translate(${initialTransformX + deltaX}px, ${initialTransformY + deltaY}px)`;
}

header.addEventListener("mousedown", (event) => {
    // Get the current transform values
    const style = window.getComputedStyle(wrapper);
    const matrix = new DOMMatrix(style.transform);
    initialTransformX = matrix.m41 || 0;
    initialTransformY = matrix.m42 || 0;

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
