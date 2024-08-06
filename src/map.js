const svgMap = document.getElementById('mapSVG');
const paths = svgMap.querySelectorAll('path');

paths.forEach(country =>{
    country.addEventListener("mouseover", function(event){

        let name = country.getAttribute('name'); 
        if (name === null || name.trim() === '') {
            name = country.getAttribute('class');  
        }

        console.log(name);
    });
});