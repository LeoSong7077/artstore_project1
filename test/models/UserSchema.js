const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const saltRounds = 10;

//const ObjectId = Schema.ObjectId
const schema = mongoose.Schema({
    userid: { type: String, required:true, maxlength: 50 },
    username: { type: String, required:true, maxlength: 50 },
    password: { type: String, required:true, minLength: 5 },
    token: {
      type: String,
    },
    tokenExp: {
      type: Number,
    }
});

//인증에 필요한 데이터 설정
schema.plugin(passportLocalMongoose, { usernameField: "username", passwordField:"password" });

//save 메소드가 실행되기전에 비밀번호를 암호화하는 로직을 짜야한다
schema.pre("save", function (next) { //next은 다음(save)으로 넘어가는 것을 뜻한다
    let user = this;
    //model 안의 password가 변환될때(생성도 변환이다)만 암호화
    if (user.isModified("password")) {
      bcrypt.genSalt(saltRounds, function (err, salt) { 
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) { 
          if (err) return next(err);
          user.password = hash; //user.password에 해시값을 넣고 다음 라우터로 보낸다.
          next();
        });
      });
    } else {
      next();
    }
});

//모델에 메서드 추가, 스키마에 함수 만들기
schema.methods.comparePassword = function (plainPassword) {
  //plainPassword를 암호화해서 현재 비밀번호화 비교
  return bcrypt
    .compare(plainPassword, this.password)
    .then((isMatch) => isMatch)
    .catch((err) => err);
};

schema.methods.generateToken = function () {
  // let user = this;
  const token = jwt.sign(this._id.toHexString(), "secretToken");
  this.token = token;
  return this.save()
    .then((user) => user)
    .catch((err) => err);
};

schema.statics.findByToken = function(token, cb){
  var user = this;
  // decode token
  jwt.verify(token, 'secretToken', function(err, decoded){
      // 유저 아이디를 이용하여 유저를 찾은 다음에
      // 클라이언트에서 가져온 token 과 db 의 token 이 일치하는 지 확인
      user.findOne({"_id" : decoded, "token" : token}, function(err, user){
          if(err) return cb(err);
          cb(null, user)
      })
  })
}

const User = mongoose.model("User", schema);

module.exports = User;

