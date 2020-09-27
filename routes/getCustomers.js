
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const router = express.Router();

// 프론트에서 credential: 'include' 로 했을 때 origin 오류가 난다 ('Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.) 그래서 이렇게 서버측에서 보낼때 허용을 해줘야 한다.(http://expressjs.com/en/resources/middleware/cors.html 참고)

var corsOptions = {
    origin: 'http://localhost:3000',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    allowedHeaders: 'Content-Type, Authorization'
}

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
// app.use(cors());
app.use(express.json());
const usersController = require('./controllers/users.controllers');
const verifyUser = require('./controllers/authorization');

router.post('/login', cors(corsOptions), usersController.createToken);
router.post('/signup', usersController.createNewUser);
router.post('/verify', cors(corsOptions), verifyUser.verifyToken);
router.get('/getCookie', usersController.getCookie)

module.exports = router;