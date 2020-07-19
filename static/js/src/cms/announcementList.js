function Announcement() {
}


Announcement.prototype.run = function () {
    var self = this;
    self.listenDeleteEvent();
};

Announcement.prototype.listenDeleteEvent = function () {
    var deleteBtn = $(".delete-btn");
    deleteBtn.click(function (event) {
        event.preventDefault();
        var btn = $(this);
        var announcement_id = btn.attr('data-announcement-id');
        xfzalert.alertConfirm({
            'title': '您确定要删除这个公告吗？',
            'confirmCallback': function () {
                xfzajax.post({
                    'url': '/cms/delete_announcement/',
                    'data': {
                        'announcement_id': announcement_id
                    },
                    'success': function (result) {
                        if (result['code'] === 200) {
                            window.location.reload();
                        }
                    }
                });
            }
        });
    });
};


$(function () {
    var announcement = new Announcement();
    announcement.run();

});