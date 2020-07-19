function ArticleTag() {

}

ArticleTag.prototype.run = function () {
    var self = this;
    self.listenAddTagEvent();
    self.listenEditTagEvent();
    self.listenDeleteTagEvent();
};

ArticleTag.prototype.listenAddTagEvent = function () {
    var addBtn = $('#add-btn');
    addBtn.click(function () {
        xfzalert.alertOneInput({
            'title': '添加文章标签',
            'placeholder': '请输入文章标签',
            'confirmCallback': function (inpuValue) {
                xfzajax.post({
                    'url': '/cms/add_article_tag/',
                    'data': {
                        'name': inpuValue
                    },
                    'success': function (result) {
                        if (result['code'] === 200) {
                            console.log(result);
                            window.location.reload();
                        } else {
                            xfzalert.close();
                        }
                    }
                });
            }
        });
    });
};

ArticleTag.prototype.listenEditTagEvent = function () {
    var self = this;
    var editBtn = $(".edit-btn");
    editBtn.click(function () {
        var currentBtn = $(this);
        var tr = currentBtn.parent().parent();
        var pk = tr.attr('data-pk');
        var name = tr.attr('data-name');
        xfzalert.alertOneInput({
            'title': '修改标签名称',
            'placeholder': '请输入新的标签名称',
            'value': name,
            'confirmCallback': function (inputValue) {
                xfzajax.post({
                    'url': '/cms/edit_article_tag/',
                    'data': {
                        'pk': pk,
                        'name': inputValue
                    },
                    'success': function (result) {
                        if (result['code'] === 200) {
                            window.location.reload();
                        } else {
                            xfzalert.close();
                        }
                    }
                });
            }
        });
    });
};

ArticleTag.prototype.listenDeleteTagEvent = function () {
    var deleteBtn = $(".delete-btn");
    deleteBtn.click(function () {
        var currentBtn = $(this);
        var tr = currentBtn.parent().parent();
        var pk = tr.attr('data-pk');
        xfzalert.alertConfirm({
            'title': '您确定要删除这个标签吗？',
            'confirmCallback': function () {
                xfzajax.post({
                    'url': '/cms/delete_article_tag/',
                    'data': {
                        'pk': pk
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
    var tag = new ArticleTag();
    tag.run();
});