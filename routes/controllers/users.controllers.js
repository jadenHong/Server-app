const { User } = require('../getCustomers');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
require('dotenv').config();

const YOUR_SECRET_KEY = process.env.SECRET_KEY;
const mysql = require('mysql2');
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



exports.createToken = async (req, res, next) => {
    try {
        console.log(req.body);
        const { username, password } = req.body;
        const getPasswordHashByUsername = async (username) => {
            const QUERY = "SELECT password FROM loginDB where username =?";
            const [rows] = await promisePool.query(QUERY, username);
            return rows.length == 0 ? 0 : rows[0].password;
        }

        const passwordHash = await getPasswordHashByUsername(username);
        console.log(passwordHash);
        if (passwordHash.length) {
            const token = jwt.sign({
                user_id: username
            }, YOUR_SECRET_KEY, {
                expiresIn: '1h'
            });

            res.cookie('user', token, { httpOnly: true, secure: true })
            res.status(200).json({
                result: 'Success',
                token: token,
            });
            console.log(token);
        } else {
            res.status(400).json({ error: 'invalid user' });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }

}


exports.createNewUser = async function (req, res, next) {
    try {
        const user = await new User(req.body).save();
        res.status(200).json({
            result: 'ok',
            user: user
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

