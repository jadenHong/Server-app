const express = require('express');
const cors = require('cors');
const countryData = require('./data-json/country.json');

const app = express();
const SERVER_PORT = 7778;
app.use(express.json());
app.use(cors());
app.listen(SERVER_PORT, () => {
    console.log(`Server is listening to ${SERVER_PORT}`);
});

app.get('/country/', async (req, res) => {

    res.json(countryData);
})