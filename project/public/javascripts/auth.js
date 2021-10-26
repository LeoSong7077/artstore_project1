const User = require('../../models/UserSchema');

//미들웨어. next()를 통해 다음 실행으로 넘어간다.
let auth = (req, res, next) => {
    //클라이언트에 저장된 토큰을 가져온다
    let token = req.cookies.x_auth;

    // 토큰을 복호화 한 후 유저를 찾는다
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth : false, err : true})

        req.token = token;
        req.user = user;
        next();
    })

    // 유저가 있으면 인증 success
    // 유저가 없으면 인증 fail 
}

module.exports = auth;