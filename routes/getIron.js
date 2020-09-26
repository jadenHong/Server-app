const express = require('express');
const router = express.Router();

router.get('/getIron', (req, res) => {
    res.send('getIron server');
})

module.exports = router;