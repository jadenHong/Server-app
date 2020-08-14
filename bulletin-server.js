console.log('Hong\'s server');

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'ap28xm59',
    database: 'bulletin_practice',
    watiForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const promisePool = pool.promise();

const app = express();
const SERVER_PORT = 7777;
app.use(express.json());
app.use(cors());
app.listen(SERVER_PORT, () => {
    console.log(`Server is listening to ${SERVER_PORT}`);
});

// *********** Save data to Database ************
app.post('/movie/board/', async (req, res) => {
    const body = req.body;
    console.log(body);
    try {
        const result = await createData(body);
        res.json(result);
    } catch (error) {
        throw error;
    }
});

const createData = async (body) => {
    const QUERY = `INSERT INTO mflixboard(title,description,created) VALUES(?,?,now())`;
    const [rows] = await promisePool.query(QUERY, [body.title, body.desc]);
}
//*************************************************** */



// *********** Get all data from Database ************
app.get('/movie/list', async (req, res) => {
    try {
        const result = await getData();
        res.json(result);
    } catch (error) {
        throw error;
    }
});

const getData = async () => {
    const QUERY = `SELECT * FROM mflixboard`;
    const [rows] = await promisePool.query(QUERY);
    return rows;
}

// *********** Get clicked data from Database ************

app.get('/movie/clickedData/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await getClickedData(id);
        res.json(result);
    } catch (error) {
        throw error;
    }
});

const getClickedData = async (id) => {
    const QUERY = `SELECT * FROM mflixboard WHERE id=?`;
    const [rows] = await promisePool.query(QUERY, id);
    return rows[0];// 어차피 하나만 불러오기 때문에 상관없고 [{},{},{}]이런식으로 배열로 받아온다 그래서 첫번째만 받으면 되므로 이렇게 받아주는게 프론트단에서 깔끔하다
}

// *********** Update clicked data from Database ************
app.post('/movie/updateData/', async (req, res) => {
    const body = req.body;
    console.log(body);
    try {
        const result = await updateData(body);
        res.json(result);
    } catch (error) {
        throw error;
    }
});

const updateData = async (bodyInfo) => {
    const QUERY = `UPDATE mflixboard SET title=? , description=? WHERE id=?`;
    const [rows] = await promisePool.query(QUERY, [bodyInfo.title, bodyInfo.description, bodyInfo.id]);
    return rows;
}
// ***************************************************************

// *********** Update clicked data from Database ************

app.get('/movie/deleteData/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await deleteData(id);
        res.json(result);
    } catch (error) {
        throw error;
    }
});

const deleteData = async (id) => {
    const QUERY = `DELETE FROM mflixboard WHERE id=?`;
    const [rows] = await promisePool.query(QUERY, id);
    return rows;
}

// ************************************************************

// ******************** Search Data ***************************

app.get('/movie/search/:title', async (req, res) => {
    const title = req.params.title;
    console.log(title)
    try {
        const result = await getDataByTitle(title);
        res.json(result);
    } catch (error) {
        throw error;
    }
});

const getDataByTitle = async (title) => {
    const QUERY = `SELECT * FROM mflixboard WHERE title LIKE ?`;
    const [rows] = await promisePool.query(QUERY, `%${title}%`);
    return rows;
}

// ************************************************************