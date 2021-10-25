1. express-generator 사용

 npm init
 npm install cookie-parser --save
 npm install morgan --save
 npm install ejs --save

express-session,express-mysql-session은 세션을설정과 관리를 위한 모듈이다.(로그인을 하면 그 로그인이 어떻게 

유지 될건지, 로그아웃을하면 세션을 어떻게 버릴건지 에대한)

DB에 password가 저런 방식으로 노출되어있으면 보안에 굉장히 좋지 않기때문에 
bcrypt등을 통해 암호를 암호화하고 복호화는 불가능한 방식으로 저장한다.