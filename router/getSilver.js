const express = require('express');
const router = express.Router();

router.get('/getSilver', (req, res) => {
    res.send('getSilver server');
})

module.exports = router;