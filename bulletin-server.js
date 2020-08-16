console.log('Hong\'s server');

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); // hash 로 salting 해서 password를 암호화하여 저장하기 위한 API 호출

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'ap28xm59',
    database: 'bulletin_practice',
    waitForConnections: true,
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

// *********** Delete clicked data from Database ************

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

// **************************************************************


// ************************** Sign In ***************************
// express 에서 res.json() 한개이상쓰면 에러가 난다 그래서 무조건 res.json()이 두개이상이면 return 을 해줘야한다.
// 서버측에서 동기로 진행을 하면 hashing 시간이 오래걸려서 퍼포먼스 이슈가 발생할 가능성이 크다. 그래서 비동기방식을 사용하는게 효과적이다. 즉 collback or promise.
app.post('/movie/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return next(new Error('Invalid request body'));
    }

    const passwordHash = await getPasswordHashByUsername(username);
    console.log(passwordHash)
    if (!passwordHash) {
        return res.json({ msg: 'Username does not exist', state: 405 });
    }

    const isAuthenticated = await bcrypt.compare(password, passwordHash);
    isAuthenticated ? res.json({ msg: "Loged in successfully", state: 200 }) : res.json({ msg: "Password is not correct", state: 404 });

});

const getPasswordHashByUsername = async (username) => {
    const QUERY = "SELECT password FROM loginDB where username = ?";
    const [rows] = await promisePool.query(QUERY, username);
    return rows.length == 0 ? 0 : rows[0].password;
}


// **************************************************************



// ************************** Sign Up ***************************

app.post('/movie/signup', async (req, res, next) => { // next 를 주게 되면 그 다음 미들웨어로 넘어간다.그래서 에러를 핸들링해줄수 있음.
    const body = req.body;
    console.log(body.password);
    const saltRounds = 10; //hash 의 알고리즘이 공개되어있기때문에 취약하다 그래서 salt를 사용하는데 salt는 패스워드마다 생성되는 랜덤값이다. 예를 들어 같은 1234라도 salt가 결합되면 다양한 해시값이 생성된다. 10은 default값이고 이 숫자가 높아지면 높아질수록 (시간을 길게 줄수록) 더 복잡한 해시값을 얻는다.(즉 해시값을 좀 더 복잡하게 암호화 할 수 있음.)
    const username = body.username;
    const password = body.password;
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        const usernameAlreadyExists = await usernameDoesExist(username);
        if (!usernameAlreadyExists) {
            const result = await storeUserInfo(username, hash);
            res.json({
                result: result,
                status: 200
            });
        } else {
            res.json({
                msg: "username is overlapped",
                status: 405
            }); //스트링으로 전송하기 때문에 프론트단에서 fetch후에 response.json() 이 아니라 respose.text()를 해주거나 res.json("username is overlapped") 로 표기해줘야한다!!
        }
    } catch (error) {
        next(new Error(error.message));
    }
});

const usernameDoesExist = async (username) => {
    const QUERY = 'SELECT username FROM loginDB where username = ?';
    const [rows] = await promisePool.query(QUERY, username);
    return rows.length > 0
}

app.use((err, req, res, next) => {
    //위에 함수에 매칭 안되거나 next()로 걸러진게 여기로 다옴
    if (err) {
        // 여기서 err 잡지 않고 에러만 핸들링하는 메들웨어로 보내주는 이유는 플젝이 커지고 코드가 많아질 경우 유지보수를위해!
        // res.status(500).send(err.message)
        next();
    } else {
        res.status(404).send('route not found');
    }
});

app.use((err, req, res, next) => {
    // 여긴 에러만 핸들링
    res.status(500).send(err.message);
})

const storeUserInfo = async (username, password) => {
    const QUERY = 'INSERT INTO loginDB(username, password, date) VALUES (?,?,current_timestamp())';
    const [rows] = await promisePool.query(QUERY, [username, password]);
    return rows;
}

// **************************************************************