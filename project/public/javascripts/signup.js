//회원가입 유효성 검사
function checkAll() {
    if (!checkPassword(form.password.value)) {
        alert('비밀번호 길이가 짧습니다.(문자 5개 이상)')
        return false;
    }
    //alert('회원가입 완료')
    return true;
}

function checkPassword(password) {
    if (password.length >= 5)
        return true;
    return false;
}