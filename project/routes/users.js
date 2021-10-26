// router는 데이터를 주고받는 곳이다

var express = require('express');
var router = express.Router();
var auth = require('../public/javascripts/auth');

//스키마
const User = require("../models/UserSchema");

//회원가입
router.post("/signup", async (req, res, next) => {
  console.log(req.body);
  User.find({ userid: req.body.userid })
      .exec() //promise 리턴, 비동기처리
      .then(user => {
          if (user.length >= 1) {
              res.send('<script type="text/javascript">alert("이미 존재하는 아이디입니다."); window.location="/signup"; </script>');
          } else {
              const user = new User(req.body);
              user
                  .save()
                  .then(result => {
                      console.log("result: ", result);
                      res.redirect("/");
                      //res.send('<script type="text/javascript">alert("회원가입 완료"); window.location="/signup"; </script>');
                      
                  })
                  .catch(err => {
                      console.log("error: ", err);
                  });
          }
      });
});

//로그인
router.post("/login", (req, res) => {
    //로그인을할때 아이디와 비밀번호를 받는다
    User.findOne({ userid: req.body.userid }, (err, user) => {
      if (err) {
      }
      else {
          if(user) {
            user
            .comparePassword(req.body.password)
            .then((isMatch) => {
              if (!isMatch) {
                //return res.send('<script type="text/javascript">alert("비밀번호가 다릅니다."); window.location="/"; </script>');
                return res.json({
                  loginSuccess: false,
                  message: "비밀번호가 다릅니다.",
                });
              }
            //비밀번호가 일치하면 토큰을 생성한다
            //jwt 토큰 생성하는 메소드 작성
            user
              .generateToken()
              .then((user) => {
                res
                  .cookie("x_auth", user.token)
                  .status(200).render("index", {'userid' : user.userid, 'username' : user.username, 'status':'login' })
                  // .status(200).redirect('./')
              })
              .catch((err) => {
                res.status(400).send(err);
              });
            })
            //.catch((err) => res.json({ loginSuccess: false }));
          }
          else {
            return res.json({
                loginSuccess: false,
                message: "존재하지 않는 아이디입니다.",
            });
          }
        
      }
      
    });
  
  });

router.get('/logout', auth, (req, res) => {
  //auth를 통해서 
  //_id 값을 이용해 완벽하게 일치시키기
  User.findOneAndUpdate({ _id: req.user._id },
    { token: "" }
    , (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})

module.exports = router;
