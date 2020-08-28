const express = require('express');
const router = express.Router();
const axios = require('axios');

const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
app.use(express.json());

const {
    RIOT_TOKEN
} = process.env;




const options = {

    target: `https://kr.api.riotgames.com`,
    changeOrigin: true,
    headers: {
        'X-Riot-Token': RIOT_TOKEN,
    },
    router: req => {
        const { division, region, tierPage } = req.query;
        console.log(tierPage, region)
        return region ? `https://${region}.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/${division}?page=${tierPage}&${RIOT_TOKEN}` : `https://kr.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/${division}?page=${tierPage}&${RIOT_TOKEN}`;
    }

}
const lolProxy = createProxyMiddleware(options);


router.use('/data', lolProxy);


router.use('/test', () => {
    console.log('test');
})


// router.get('/', async (req, res) => {
//     console.log(req.params.page);
//     console.log('들어옴')
//     // const response = await axios.get('https://kr.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/I?page=1')
//     // const data = await response.json();
//     // console.log(data);

//     console.log('challenger server');
//     // res.send('getChallenger server');
// })

module.exports = router;