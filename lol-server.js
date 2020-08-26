// npm i dotenv 명령어로 dotenv 설치. 환경변수를 위한 .env 파일을 따로 만들어서 호출하게 해주는 API이다. 모든 중요한 정보 (비밀번호, 키 등등)들은 환경변수에 저장을하고 그것을 불러와야하며 환경변수 파일 .env 는 gitignore에 추가를 해서 commit을 방지해야한다 무조건!!!

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const data = require('./data-json/lol-champs.json');
// 서버에서 바로 데이터를 받을 수 없어서 proxy-middleware 사용함
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(express.json());
app.use(cors());

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
app.get('/champs', (req, res) => {
    const champs = data.data;
    console.log('champs');
    res.json(champs);
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
