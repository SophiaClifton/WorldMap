const svgMap = document.getElementById('mapSVG');
const paths = svgMap.querySelectorAll('path');

const countryName = document.getElementById('country');
const capitalName = document.getElementById('capital');
const capitalTime = document.getElementById('time');

paths.forEach(country =>{
    country.addEventListener("mouseover", function(event){

        let name = country.getAttribute('name'); 
        if (name === null || name.trim() === '') {
            name = country.getAttribute('class');  
        }
        countryName.textContent= name;

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
            return response.json(); // Parse JSON response
        })
        .then(data => {
            const { countryCapital, date, hours, minutes} = data;

            countryName.textContent = `${name}, ${countryCapital}`;
            capitalName.textContent = `${countryCapital}`;
            capitalTime.textContent = `${hours}:${minutes}`;
        })
        .catch(error => {
            console.error('Error:', error);
            capitalName.textContent = 'Failed to load capital';
            capitalTime.textContent = 'Failed to load time';
        });
    });
});




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










// when click on country, open new window of the country, can browse weather of the country's cities