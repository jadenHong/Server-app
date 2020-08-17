
const express = require('express');
const cors = require('cors');

const app = express();

const data = require('../data-json/movies.json');

const SERVER_PORT = 6060;
app.use(cors());

app.listen(SERVER_PORT, () => {
    console.log(`Server is listening to ${SERVER_PORT}`)
})

app.get('/movie/findMoviesByTitle/:title', (req, res) => {
    const title = req.params.title;
    // console.log(title)
    const matchedData = title.length > 0 && data.movies.filter((movie) => movie.title.includes(title));
    console.log(title.length);
    matchedData ? res.json(matchedData) : res.status(404).send('No movie founded');
    console.log(matchedData);

})

app.get('/movie/findMoviesByYear/:year', (req, res) => {
    const year = Number(req.params.year);

    const matchedData = data.movies.filter((movie) => movie.year === year);
    console.log(matchedData);
    matchedData ? res.json(matchedData) : res.status(404).send('No movie founded');
})

app.get('/movie/findMovie', (req, res) => {
    res.json(data.movies);
})


app.get('/movie/findMoviesByGenre/:genre', (req, res) => {
    const genre = req.params.genre;
    console.log(genre);
    const matchedData = data.movies.filter(movie => movie.genres.map(g => g.toLowerCase().trim()).includes(genre))
    console.log(matchedData);

    matchedData ? res.json(matchedData) : res.status(404).send('No movie founded');
})