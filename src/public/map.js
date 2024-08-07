const svgMap = document.getElementById('mapSVG');
const paths = svgMap.querySelectorAll('path');

paths.forEach(country =>{
    country.addEventListener("mouseover", function(event){

        let name = country.getAttribute('name'); 
        if (name === null || name.trim() === '') {
            name = country.getAttribute('class');  
        }

        console.log(name);
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
            console.log('Server response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});