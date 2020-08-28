const express = require('express');
const router = express.Router();

router.get('/getDiamond', (req, res) => {
    res.send('getDiamond server');
})

module.exports = router;