function Auth() {
    var self = this;
    self.maskWrapper = $('.mask-wrapper');  // 拿到模态对话框
    self.scollWrapper = $('.scroll-wrapper');
    self.smsCaptcha = $('.sms-captcha-btn');
    self.emailCaptcha = $('.email-captcha-btn');

}

Auth.prototype.run = function () {
    var self = this;
    self.ListenSigninEvent();
};


// 获取登录页面的数据
Auth.prototype.ListenSigninEvent = function () {
    var self = this;
    var telephoneInput = $('input[name="username"]');
    var passwordInput = $('input[name="password"]');
    var rememberInput = $('input[name="remember"]');

    var submitBtn = $('.submit-btn');

    submitBtn.click(function () {
        var telephone = telephoneInput.val();
        var password = passwordInput.val();
        var remember = rememberInput.prop('checked');

        xfzajax.post({
            'url': '/blogauth/login/',
            'data': {
                'telephone': telephone,
                'password': password,
                'remember': remember ? 1 : 0
            },
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();  // 刷新浏览器
                }
            }
        });
    })
};


$(function () {
    var auth = new Auth();
    auth.run();

});

