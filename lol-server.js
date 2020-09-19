// npm i dotenv 명령어로 dotenv 설치. 환경변수를 위한 .env 파일을 따로 만들어서 호출하게 해주는 API이다. 모든 중요한 정보 (비밀번호, 키 등등)들은 환경변수에 저장을하고 그것을 불러와야하며 환경변수 파일 .env 는 gitignore에 추가를 해서 commit을 방지해야한다 무조건!!!

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const champsData = require('./data-json/lol-champs.json');
const spellsData = require('./data-json/spells.json');
const runesData = require('./data-json/runes.json');
// 서버에서 바로 데이터를 받을 수 없어서 proxy-middleware 사용함

const { createProxyMiddleware } = require('http-proxy-middleware');



const app = express();
const challenger = require('./router/getChallenger');
const grandmaster = require('./router/getGrandmaster');
const master = require('./router/getMaster');
const diamond = require('./router/getDiamond');
const platinum = require('./router/getPlatinum');
const gold = require('./router/getGold');
const silver = require('./router/getSilver');
const bronze = require('./router/getBronze');
const iron = require('./router/getIron');


app.use(cors());

app.use('/CHALLENGER', challenger);
app.use('/GRANDMASTER', grandmaster);
app.use('/MASTER', master);
app.use('/DIAMOND', diamond);


app.use(express.json());


const {
    SERVER_PORT,
    RIOT_TOKEN
} = process.env;

const options = {
    target: 'https://kr.api.riotgames.com/',
    headers: {
        'X-Riot-Token': RIOT_TOKEN,
    },
    changeOrigin: true,
    router: req => {
        const { region } = req.query;
        return region ? `https://${region}.api.riotgames.com` : `https://kr.api.riotgames.com`;
    }
}
const lolProxy = createProxyMiddleware(options);

// 이부분이 호출이 되면 요청을 여기서 받고 응답을 해주고 '땡' 한다. 즉 끝. 그 다음건 읽지 않음.
// 챔피언 정보 json 파일에서 받아온다.
app.get('/champs', (req, res) => {
    const champs = champsData.data;
    console.log('champs 정보 받으러 들어옴');
    res.json(champs);
})

// 스펠 정보 json 파일에서 받아온다.
app.get('/spells', (req, res) => {
    const spells = spellsData.data;
    console.log('spells 정보 받으러 들어옴');
    res.json(spells);
})

// 룬 정보 json 파일에서 받아온다.
app.get('/runes', (req, res) => {
    console.log('rune 정보 받으러 들어옴');
    const runes = runesData;
    // console.log(runes);
    res.json(runes);
})

app.use('/', lolProxy, (req, res) => {
    console.log(req.headers)
    console.log('hi');
    console.log(req.params.id);
});


app.listen(SERVER_PORT, () => {
    console.log(`Server is listening to ${SERVER_PORT}`);
    console.log(`RIOT_TOKEN=${RIOT_TOKEN}`)
});
