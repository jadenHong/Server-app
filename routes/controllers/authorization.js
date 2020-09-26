


const jwt = require('jsonwebtoken');
const YOUR_SECRET_KEY = process.env.SECRET_KEY;
require('dotenv').config();
console.log('verify 하러 들어옴')

const verifyToken = (req, res, next) => {
    try {
        console.log(req.cookies)
        console.log(req.body.token);
        const clientToken = req.cookies.user;
        console.log('clientToken' + clientToken);
        const decoded = jwt.verify(clientToken, YOUR_SECRET_KEY);
        if (decoded) {
            res.locals.userId = decoded.user_id;
            next();
        } else {
            res.status(401).json({ error: 'unauthorized' });
        }
    } catch (err) {
        res.status(401).json({ error: 'token expired' });
    }
};
exports.verifyToken = verifyToken;
