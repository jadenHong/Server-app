const express = require('express');
const router = express.Router();

router.get('/getBronze', (req, res) => {
    res.send('getBronze server');
})

module.exports = router;