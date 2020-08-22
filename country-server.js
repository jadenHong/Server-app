const express = require('express');
const cors = require('cors');
const countryData = require('./data-json/country.json');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const SERVER_PORT = 7778;
app.use(express.json());
app.use(cors());
app.listen(SERVER_PORT, () => {
    console.log(`Server is listening to ${SERVER_PORT}`);
});

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'ap28xm59',
    database: 'bulletin_practice',

});

const promisePool = pool.promise();

app.get('/country/', async (req, res) => {

    res.json(countryData);
});

// ***************** login section ******************
app.post('/login/', async (req, res) => {
    const { username, password } = req.body;
    // username or password 를 주지 않고 login 했을 경우
    if (!username || !password) {
        return res.send('No user information');
    }
    const passwordHash = await getPasswordHashByUsername(username);

    // DB 에 해당하는 정보가 없을 경우
    if (!passwordHash) {
        return res.json({ msg: 'Username does not exist', state: 405 });
    }
    const isAuthenticated = await bcrypt.compare(password, passwordHash);
    return isAuthenticated ? res.json({ msg: 'Logged in successfully', state: 200 }) : res.json({ msg: 'Password is not correct', state: 404 });
});

const getPasswordHashByUsername = async (username) => {
    const QUERY = "SELECT password FROM loginDB WHERE username = ?";
    const [rows] = await promisePool.query(QUERY, username);
    return rows.length === 0 ? 0 : rows[0].password;
}

// ***************** sign up section ******************
app.post('/signup/', async (req, res, next) => {
    const { username, password } = req.body;
    console.log(username, password);
    const saltRounds = 10;
    try {
        const hash = await bcrypt.hash(password, saltRounds);

        const usernameAlreadyExists = await usernameDoesExist(username);
        if (!usernameAlreadyExists) {
            console.log('good');
            const result = await storeUserInfo(username, hash);
            return res.json({
                msg: 'Congratulations ! You Signed up successfully',
                state: 200,
            });
        } else {
            return res.json({
                msg: 'Usename is overlapped',
                state: 405
            })
        }
    } catch (error) {
        next(new Error(error.message));
    }
});

const usernameDoesExist = async (username) => {
    const QUERY = 'SELECT username FROM loginDB WHERE username = ?';
    const [rows] = await promisePool.query(QUERY, username);
    return rows.length > 0;
};

const storeUserInfo = async (username, hash) => {
    const QUERY = 'INSERT INTO loginDB(username, password, date) VALUES (?,?,current_timestamp())';
    const [rows] = await promisePool.query(QUERY, [username, hash]);
    return rows;
}


// ***************** drop out membership ******************
app.post('/cancel', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({
            msg: 'Please fill out blanks',
            state: 405,
        });
    }
    const usernameDoesExist = await getUserName(username);
    console.log(usernameDoesExist);
    if (!usernameDoesExist) {
        return res.json({
            msg: 'User does not exist',
            state: 406,
        });
    }
    const passwordHash = await getUserNameByPassword(username);
    if (passwordHash) {
        const isAuthenticated = await bcrypt.compare(password, passwordHash);
        isAuthenticated ?
            await deleteUser(username) :
            res.json({
                msg: 'Password does not correct',
                state: 407,
            })
    }


})

const getUserName = async (username) => {
    const QUERY = 'SELECT username FROM loginDB WHERE username = ?';
    const [rows] = await promisePool.query(QUERY, username);
    return rows.length == 0 ? 0 : rows[0].username;
}

const getUserNameByPassword = async (username) => {
    const QUERY = 'SELECT password FROM loginDB where username = ?';
    const [rows] = await promisePool.query(QUERY, username);
    return rows.length == 0 ? 0 : rows[0].password;
}

const deleteUser = async (username) => {
    const QUERY = 'DELETE FROM loginDB WHERE username = ?';
    const [rows] = await promisePool.query(QUERY, username);
    console.log(rows);
}




// *********** Save data to Database ************
app.post('/country/board/', async (req, res) => {
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
    return rows;
}
//****************************************************/


// *********** Get all data from Database ************
app.get('/country/list', async (req, res) => {
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

app.get('/country/clickedData/:id', async (req, res) => {
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
app.post('/country/updateData/', async (req, res) => {
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

// *********** Delete clicked data from Database ************

app.get('/country/deleteData/:id', async (req, res) => {
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