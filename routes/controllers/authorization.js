


const jwt = require('jsonwebtoken');
const YOUR_SECRET_KEY = process.env.SECRET_KEY;
require('dotenv').config();
console.log('verify 하러 들어옴')

const verifyToken = (req, res, next) => {
    try {
        console.log(req.cookies)
        console.log('프론트에서 받은 token ' + req.body.token);
        const clientToken = req.body.token;
        console.log('clientToken' + clientToken);
        const decoded = jwt.verify(clientToken, YOUR_SECRET_KEY);
        console.log('decoded: ' + decoded)
        if (decoded) {
            res.json({ verify: true, msg: 'token is verified', decoded: decoded, state: 200 })
            next();
        } else {
            res.status(400).json({ verify: false, msg: 'unauthorized', decoded: {}, state: 400 });
        }
    } catch (err) {
        res.status(401).json({ verify: false, msg: 'token expired', decoded: {}, state: 401 });
    }
};
exports.verifyToken = verifyToken;
