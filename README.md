


## 📃 **_고민접기, 당신의 고민을 접어드립니다._**
![thumbnail-01](https://user-images.githubusercontent.com/112849712/207773647-0f8d2c2a-51b9-4d98-a10b-76f5da19fb33.jpg)

>“**오늘 뭐 먹지…?” “이럴 땐 어떻게 해야 하는 걸까…”**<br/>
>너무 사소하거나 너무 무거워서 남들에게 쉽게 꺼낼 수 없었던 고민이 있으신가요?<br/>
>저희 고민접기는 여러분들의 크고 작은 다양한 고민을 접을 수 있도록 도와주는 커뮤니티입니다.<br/>
><br/>
>**[:iphone: 고민접기 링크](https://gomin.site)**<br/>

<br/>

## 💡 **_주요 기능_**
-   매일 색다른 행운 편지
-   골라주기 게시글 작성 후 투표하기
-   답해주기 게시글 작성하고 다른 유저들의 의견 받기
-   대화하고 싶은 유저와 1:1 쪽지하기
-   미션 완료 후 귀여운 종이접기  휙득하기
-   미션 완료에 따른 등급 상승
<br/>

## 🛠️ **_프로젝트 아키텍처_**
![image](https://user-images.githubusercontent.com/112886992/207830402-6c6de0dd-ba40-4c88-bd6c-c59e3a6924a1.png)

<br/>

## 🛠️ **_ERD_**
![image](https://user-images.githubusercontent.com/98438390/207852089-0c4d2979-3b84-4b2d-9545-7d69685963c6.png)
클릭시 확대됩니다

<br/>

## ⚙️ **_기술 스택_**

**Backend**<br /><br />
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black">
<img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">
<img src="https://img.shields.io/badge/Let's Encrypt-003A70?style=for-the-badge&logo=Let's Encrypt&logoColor=white">
<img src="https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=PM2&logoColor=white">
<br />
<br />
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
<img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white">
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white">
<img src="https://img.shields.io/badge/Mongoose-871618?style=for-the-badge&logo=Mongoose&logoColor=white">
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white">
<br />
<br />
<img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=for-the-badge&logo=Amazon EC2&logoColor=white">
<img src="https://img.shields.io/badge/Amazon S3-569A31?style=for-the-badge&logo=Amazon S3&logoColor=white">
<img src="https://img.shields.io/badge/AWS Lambda-FF9900?style=for-the-badge&logo=AWS Lambda&logoColor=white">
<br />
<br />
<img src="https://img.shields.io/badge/JSON Web Tokens-000000?style=for-the-badge&logo=JSON Web Tokens&logoColor=white">
<img src="https://img.shields.io/badge/FCM-FFCA28?style=for-the-badge&logo=Firebase&logoColor=white">
<img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white">
<img src="https://img.shields.io/badge/GitHub Actions-2088FF?style=for-the-badge&logo=GitHub Actions&logoColor=white">
<img src="https://img.shields.io/badge/CodeDeploy-212599?style=for-the-badge&logo=CodeDeploy&logoColor=white">
<br/>

## 🔩 **_기술적 의사 결정_**
|사용기술|선정이유|
|------|---|
|MySQL|데이터간의 관계를 형성하고 참조 무결성을 유지하기 위해 MySQL을 메인DB로 작업했습니다.|
|MongoDB|신고 데이터의 경우 유연한 스키마 구조가 필요했고 확장성과 작업 효율을 높이기 위해 부분적으로 MongoDB를 도입하였습니다.|
|Redis|RefreshToken과 알람데이터등 휘발성이 있는 데이터를 효율적으로 관리하기 위해 Redis를 사용했습니다. <br/>memcached와 비교했을때 다양한 데이터 타입을 지원한다는 점과 특정 시점에 데이터를 디스크에 저장할 수 있다는 점에서 Redis를 선택했습니다.|
|socket.io|브라우저마다 지원하지 않는 경우가 있는 웹소켓과 달리 socket.io는 대부분의 브라우저에서 지원합니다. socket.io가 webSocket보다 연결 신뢰성이 높고 room기능을 제공하여 채팅기능을 구현하기에 적합했습니다.|
|FCM|푸쉬 알람 기능을 도입하여 사용자 경험을 향상시키고, 활발한 서비스 이용을 유도하였습니다. FCM을 사용하여 백그라운드와 포그라운드 환경에서 알림을 받도록 적용하였습니다.|
|Lambda|multer를 사용하여 업로드한 이미지를 리사이징하는 용도로 사용되었습니다. 서버에서 리사이즈를 진행 할 수 있었지만 리사이징이 될 때 서버 리소스를 많이 사용하고 다른 응답을 받지 못하게되는 상황이 있어 서버리스 함수인 람다를 선정하였습니다.|



<br/>

## ⚠️ **_트러블 슈팅_**
**<details><summary>리워드 페이지 속도 개선</summary>**
문제: 리워드 페이지의 서버 응답이 평균 2초 후반대가 걸림 <br />
원인파악: 코드를 주석해가며 찾은 결과 DB에서 유저활동 기록을 가져오는데 2초대가 걸림.<br />
필요한 데이터만 가져오기 위해 attribute속성을 사용해 속도를 개선하였지만 유저의 활동기록이 쌓일 수록 데이터를 가져오는데 많은 시간이 소요됨
유저 활동기록 테이블을 따로 만들어 유저의 활동기록이 있을때 마다 데이터를 업데이트시킴.
리워드 페이지 요청시 서버의 불필요한 Join이 없어지고 이미 업데이트된 유저의 활동기록을 가져와 속도를 개선할 수 있었음.
<br />
![image](https://user-images.githubusercontent.com/98438390/207874893-f092cf62-f1ce-4c00-98fe-550fa2932fb6.png)
<br />
![image](https://user-images.githubusercontent.com/98438390/207877852-0ec4412f-bcb3-4019-b594-911582597915.png)




</details>

**<details><summary>스케줄 초기화 문제</summary>**

*Write here!*

</details>

**<details><summary>Safari 브라우저의 쿠키 전송 이슈</summary>**

Safari 브라우저의 ITP에 의해 교차 도메인의 쿠키를 차단하여 쿠키를 전송할 수 없는 문제가 발생 했습니다.<br/>
이를 해결하기 위해 서버와 클라이언트의 도메인을 동일 출처로 맞춰야 했지만 도메인을 변경하지 않고 토큰전달 방식을 바꾸는 것으로 문제를 해결하였습니다.<br/>
토큰을 바디로 발급하는 것으로 Safari의 토큰전달 문제를 해결하였지만, 토큰 재발급시 서버에서 다음 미들웨어를 응답할 수 없는 문제가 발생했습니다.<br/>
기존의 방식은 토큰을 재발급 하여  쿠키에 토큰을 싣고 다음 미들웨어를 호출해 기존의 요청을 처리하였으나<br/>
토큰을 바디로 보내게 되면서 미들웨어에서 이중으로 응답할 수 없는 문제가 발생했습니다.<br/>
이를 해결하기 위해<br/>
프론트에서 Interceptor를 적용하여 서버에서 주는 재발급 토큰을 감지하고 재발급 받은 토큰을 헤더에 실어 서버에 재요청 하는 방식으로 문제를 해결하였습니다.

</details>
<br/>

## ‼️ **_유저 피드백 개선_**
### **총 피드백 78개 중, 유효 피드백 58개, 반영 피드백 46개**
- 인트로 페이지 이미지 리사이징 및 서버인증  미들웨어 개선을 통한 서비스 속도 향상
- Intro에서 슬라이드 버튼과 스킵 버튼을 추가하여 편의성을 증대
- 골라주기 항목 타이틀의 가독성을 높이고 본인이 선택한 항목 표기
- 받아올 데이터가 없어서 빈 화면일 때 단순 텍스트가 아닌 이미지를 넣어서 완성도 향상
<br/>

## 📸 **_고민 접기의 팀원_**
|역할|이름|Github|
|------|---|---|
|FE🍀|홍정표|[Github](https://github.com/Jeongpyo-Hong)|
|FE|정도은|[Github](https://github.com/do-eun)|
|BE🍀|이승표|[Github](https://github.com/leeSP22)|
|BE|이준|[Github](https://github.com/Leejun2022)|
|BE|손민성|[Github](https://github.com/Tarel-Github)|
|DE|이현서|디자이너|
