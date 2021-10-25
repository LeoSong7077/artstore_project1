# :clipboard: artstore_web_practice
### :pushpin: 프로젝트 소개 
  > 1. 회원가입, 로그인, 로그아웃
  > 2. 게시판 구현
  > 3. 동영상
  
* 설치한 npm 패키지  
  ```
  npm init
  npm install -g express
  npm install -g express-generator

  express <프로젝트 이름> --view=ejs

  npm install ejs
  npm install morgan
  npm install mongodb
  npm install mongoose
  
  npm install bcrypt
  npm install express-jwt
  npm install express-session
  npm install connect-mongo
  npm install jsonwebtoken
  npm install passport
  npm install passport-local
  npm install passport-local-mongoose
  
  ```
* 환경
  ```
  CDN 사용을 위해 인터넷 연결 필요 : jQuery
  ```
* 실행  
  ```
  명령프롬프트 실행
  cd [프로젝트 폴더 주소]
  npm start
  웹브라우저에서 http://localhost:3000/ 주소로 실행
  ```
* 폴더구조  

        ▶bin
        ▽models
            UserSchema.js
        ▶node_modules
        ▽public
            ▶images
            ▽javascripts
                    auth.js
                    connectDB.js
                    signup.js
            ▶stylesheets
        ▽routes
            index.js
            users.js
        ▽views
            error.ejs
            index.ejs
            login.ejs
            signup.ejs
        app.js
        package-lock.json
        package.json


</br>

### :pushpin: 살펴보기  
* <홈페이지 동작>

## ▶ 회원가입


1. 아이디, 이름, 비밀번호 입력 
2. 유효성 검사

        클라이언트	- 비밀번호 길이가 짧습니다.
		서버		- 이미 존재하는 아이디 입니다.
3. 회원정보 저장 Router

		(1) .exec()는 비동기를 시작시킴(Promise 리턴)
		(2) 스키마객체(User)에 받아온 데이터(req.body)를 넣고 객체를 생성해준다.
			: const user = new User(req.body);
		(3) user.save() : 스키마와 일치하는 this로 저장된 데이터들을 DB에 저장

4. DB 저장전 미들웨어 schema.pre 메소드 안에 암호화코드 작성

		(1) save()메소드 실행시 호출되는 미들웨어고 next( )후에 다시 save( )로 넘어가 DB 저장
		(2) bcrypt.genSalt(saltRounds, function(err, salt) { ... }) 
			: salt를 생성한다.
		(3) bcrypt.hash(user.password, salt, function (err, hash) { ... }) 
			: hash값을 생성해 암호화를 한다
		(4) user.password = hash;
			: 암호화한 코드를 저장
		(5) next( )를 사용해 마무리		

<br>

## ▶ 로그인, 로그아웃


1. 아이디, 비밀번호 입력

2. 유효성 검사 	

        서버	- 아이디가 존재하지 않습니다.
               - 비밀번호가 일치하지 않습니다.

3. 로그인 요청 Router

		(1) 일치하는 userid를 User.findOne로 검색
		(2) 일치되는 user가 있으면 comparePassword(req.body.password)를 사용해
		(3) user의 비밀번호와 request된 비밀번호가 일치되는지 확인
		(4) 비밀번호가 일치되면 스키마 메소드 getnerateToken()을 사용해 토큰을 생성해 낸다.
			generateToken( ) 내부: 
				jwt.sign( )을 이용해 토큰 생성
				this.token = token
                저장 후 this.save()가 포함되어 있기 때문에 생성된 토큰을 저장(DB 저장)	
		(5) 클라이언트 cookie에 x_auth이름으로 user.token 저장

4. 로그아웃 요청 Router

		라우터에서 auth(콜백함수)를 선행시키기
			(1) req.cookies.x_auth로 부터 클라이언트 쿠키 정보를 받아온다
				    : req.cookies.x_auth는 클라이언트에서 언제나 받아올 수 있는 것
			(2) User.findByToken 메소드를 사용해 DB 내부에 클라이언트 쿠키와 일치하는 토큰이 있는지 검색
			(3) req.token = token;
			    req.user = user; 선언 후
			(4) next()를 통해서 데이터를 담아 라우터의 두번째 콜백에 데이터를 전달

		User.findOndAndUpdate이용해서 데이터를 검색후 업데이트
			(1) 받아온 req.user을 이용해 일치하는 _id 값을 DB에 검색
			(2) 검색후 일치하는 데이터가 있으면 그 값의 token값을 ""로 바꾼다


<br>

## ▶ configuration 코드
``` javascript
[app.js]
app.use(session({
    secret:"TKRvOIJs=HyqrvagQ#&!f!%V]Ww/4KiVs$s,<<MX", //임의의 문자
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({mongoUrl: 'mongodb://localhost:27017/artstore'}),
    //cookie:{maxAge:(3.6e+6)*24}
}));
app.use(passport.initialize());
app.use(passport.session());


[UserSchema.js]
//인증에 필요한 데이터 설정
schema.plugin(passportLocalMongoose, { usernameField: "username", passwordField:"password" }); 
```


<br>

### :pushpin: 진행 방향
* passport는 무엇을 하는것이고 어떤 과정으로 작동 되는 것인가? => 관련 유튜브 시청 필요

  클라이언트가 서버에 요청할 자격이 있는지 인증할 때에 passport 미들웨어를 사용

  Strategy란 말 그대로, Passport 미들웨어에서 사용하는 인증 전략입니다.
