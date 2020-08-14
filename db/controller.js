//node db/controller <-  실행 명령어

// get the client
const mysql = require('mysql2');

const data = require('../movies.json');

// create the connection to database
const pool = mysql.createPool({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'ap28xm59',
    database: 'react_connect',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


// pool.getConnection((err, conn) => {
//     if (err) throw err;
//     console.log('connected')
// })

const poolPromise = pool.promise();





const getMovieByTitle = async (title) => {
    console.log(title)
    // 이게 prepared query 라는건데 문서에 나와있어여
    const QUERY = 'SELECT * FROM movies WHERE title = ?';
    const [rows, fields] = await poolPromise.query(query, title);
    console.log(rows, fields)
    return rows;
}

module.exports = {
    getMovieByTitle
}

// export const getMoviesByGenre = async () => { } */












/* const processInsertData = async () => {
    const queries = [];
    let INSERT_QUERY = 'INSERT INTO movies (title, year, rating, runtime, genres, summary, img) VALUES';
    const fields = data.movies.map(movie => ({ title: movie.title, year: movie.year, rating: movie.rating, runtime: movie.runtime, genres: movie.genres.join(','), summary: movie.summary, img: movie.background_image }));
    for (const field of fields) {
        const query = `${INSERT_QUERY} ('${escape(field.title)}', ${field.year}, ${field.rating}, ${field.runtime}, '${field.genres}', '${escape(field.summary)}', '${escape(field.img)}')`
        const [rows, _] = await poolPromise.query(query);
        console.log(rows);
    }

    // const [rows, _] = await poolPromise.query(queries.join(';'));
    // console.log(rows);
} */