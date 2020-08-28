const express = require('express');
const router = express.Router();

router.get('/getPlatinum', (req, res) => {
    res.send('getPlatinum server');
})

module.exports = router;