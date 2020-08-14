/* npm init -y : create package.json file. */
/* npm i -D nodemon : 파일에 변경사항있으면 자동으로 서버 재시작된다. package.json 에 "dev": "nodemon index.js", 요렇게 추가해주면됨*/
console.log('Hong developer ^__^');

// 익스프레스 모듈 불러오기
const express = require('express');

/* npm install cors 로 설치 */
const cors = require('cors');

// 익스프레스 앱 시작
const app = express();

const routes = require('./routes');

// 내서버가 듣고있을 포트넘버 아무거나 상관없음
// 포트는 보통 80이 http 443이 https
const SERVER_PORT = 5050;
/* 이것의 사용 순서가 매우 중요하다 이것이 불린다음 사용된 endpoint 들은 모두 적용이되고 이전에 사용된 것들은 적용이 안된다. */
app.use(cors());

// use(): 미들웨어, 구조 내에서 중간 처리를 위한 함수(함수들의 꾸러미가 모듈) express 프레임워크에서 사용할 수 있는 중간 처리 목적의 소프트웨어 : 기본적인 express 구조 내에서 처리 목적으로 사용 express 프레임워크에서 사용할 수 있는 중간 처리 목적의 소프트웨어 : 기본적인 express 구조 내에서 처리 목적으로 사용, 미들웨어 함수 생명주기 : request - response 응답을 주기로 종료 ,미들웨어 함수 우선순위 : 먼저 로드되는 미들웨어 함수가 먼저 실행됨(코드 순서 중요)


app.use('/api', routes); // /api로 시작하는 경로 전부다 routes 컴포넌트로 넘겨준다. 예를들어 요청시에 http://localhost:5050/api/ 이렇게 시작되는건 전부 routes 컴포넌트에서 처리가 된다. 만약 route.get('/test', handler)가 있으면 요청을 할때 http://localhost:5050/api/test 이렇게 해야한다.

const path = require('path');

// 이건 public 폴더 안에 들어갈 css나 js파일들이 혹시 있으면 그것들도 같이 호스팅하기위해 스태틱 파일 경로를 정해주는거고여
// __dirname 은 노드에서 존재하는 변수 현재 실행되고 있는 경로를 보여준다.
console.log(`__dirname: ${__dirname}`);

const publiePath = path.resolve(__dirname, 'public');

app.use(express.static(publiePath));
// 지금 이서버를돌리면 locallhost에서 돌아갑니다.
// 그래서 서버에 접속을하려면 http://localhost:5050 이게 접속주소가 되는거고요
app.listen(SERVER_PORT, () => {
    console.log(`Server is listening to ${SERVER_PORT}`);
});

// app.get('/hellowReact', (req, res) => {
//     // 여기서는 / 이게 홈페이지니까 홈페이지 접속하면 그냥 인덱스 렌더링하게 해주는거에요
//     res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
// });
