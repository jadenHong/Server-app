const express = require('express');
const router = express.Router();

const { getMovieByTitle } = require('./db/controller');

// 이건 익스프레스 모듈에서 나오는 함수인데 처음에 '/' 이부분이 서버 url 다음에 올 url path를 의미하고요
// 그다음 매개변수가 콜백함수인데 (req, res) 이부분은 (요청 응답) 이렇게 이해하시면되고 내가 브라우저나 다른곳에서 localhost:5050/ 을 요청했을때 이 함수가 실행이되는거에요
router.get('/test', (req, res) => {
    res.send('this is a test url');
});

// 첫째 파라미터는 주소 /getMoviesById/drama/ 이부분이 params 이다.
router.get('/getMoviesById/drama/:movie_id', (req, res) => {
    const { genre, year } = req.query;
    const movie_id = Number(req.params.movie_id);
    console.log(genre + ' ' + year);

    const foundMovie = movies.find(movie => movie.id === movie_id);

    if (foundMovie) {
        res.json(foundMovie);
    } else {
        res.send('No movie found')
    }
})

router.get('/movies/title/:name', async (req, res) => {
    const name = req.params.name;

    const result = await getMovieByTitle(name);
    res.json(result)
})

// 리액트 movie-app 에서 사용함
// movie.json 파일을 서버에 등록함.
router.get('/movie/findMovie', (req, res) => {
    res.json(data);
})

module.exports = router;















// 이렇게 :XXX 이건 url 경로에서 변수를 의미하는데요 예를들어서
// /movies/1 이렇게 하면 저 콜백함수 안에서는 req.params.id가 1 인것을 찾는다.
const movies = [
    { id: 1, title: "test" },
    { id: 2, title: "test2" },
    { id: 3, title: "test3" },
];
