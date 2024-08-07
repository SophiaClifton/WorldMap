const express = require("express");
const request = require("request");
const path = require("path");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

app.listen(3000, () => console.log("Server started on port 3000"))

app.post('/country', async (req, res) => {
    const countryName = req.body.name;
    console.log('Received country name:', countryName);

    let url = `https://restcountries.com/v3.1/name/${countryName}`;
    
    try {
        const response = await axios.get(url);
        const countryData = response.data;

        if (countryData && countryData[0]) {
            const capital = countryData[0].capital ? countryData[0].capital[0] : 'Capital not found';
            res.json({ capital });
        } else {
            res.status(404).json({ error: 'Country not found' });
        }

    } catch (error) {
        console.error('Error fetching data from API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    //call to weather?

});