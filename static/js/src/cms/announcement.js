function Announcement() {
}


Announcement.prototype.run = function () {
    var self = this;
    self.initUEditor();
    self.listenSubmitEvent();
};

Announcement.prototype.initUEditor = function () {
    window.ue = UE.getEditor('editor', {
        'initialFrameHeight': 400,
        'serverUrl': '/ueditor/upload/'
    });
};


Announcement.prototype.listenSubmitEvent = function () {
    var submitBtn = $("#submit-btn");
    submitBtn.click(function (event) {
        event.preventDefault();
        var btn = $(this);
        var pk = btn.attr('data-announcement-id');
        var content = window.ue.getContent();
        var url = '';
        if (pk) {
            url = '/cms/edit_announcement/';
        } else {
            url = '/cms/add_announcement/';
        }

        xfzajax.post({
            'url': url,
            'data': {
                'content': content,
                'pk': pk
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    xfzalert.alertSuccess('成功！', function () {
                        window.history.go(-1);
                        window.location.href = document.referrer;
                    });
                }
            }
        });
    });
};


$(function () {
    var announcement = new Announcement();
    announcement.run();

});