function Article() {
    this.progressGroup = $("#progress-group");
}

Article.prototype.initUEditor = function () {
    window.ue = UE.getEditor('editor', {
        'initialFrameHeight': 400,
        'serverUrl': '/ueditor/upload/'
    });
};

Article.prototype.listenUploadFielEvent = function () {
    var uploadBtn = $('#thumbnail-btn');
    uploadBtn.change(function () {
        var file = uploadBtn[0].files[0];
        var formData = new FormData();
        formData.append('file', file);
        xfzajax.post({
            'url': '/cms/upload_file/',
            'data': formData,
            'processData': false,
            'contentType': false,
            'success': function (result) {
                if (result['code'] === 200) {
                    var url = result['data']['url'];
                    var thumbnailInput = $("#thumbnail-form");
                    thumbnailInput.val(url);
                }
            }
        });
    });
};

Article.prototype.listenQiniuUploadFileEvent = function () {
    var self = this;
    var uploadBtn = $('#thumbnail-btn');
    uploadBtn.change(function () {
        var file = this.files[0];
        console.log(file);
        xfzajax.get({
            'url': '/cms/qntoken/',
            'success': function (result) {
                if (result['code'] === 200) {
                    var token = result['data']['token'];
                    // a.b.jpg = ['a','b','jpg']
                    // 198888888 + . + jpg = 1988888.jpg
                    var key = (new Date()).getTime() + '.' + file.name.split('.')[1];
                    var putExtra = {
                        fname: key,
                        params: {},
                        mimeType: ['image/png', 'image/jpeg', 'image/gif', 'video/x-ms-wmv']
                    };
                    var config = {
                        useCdnDomain: true,
                        retryCount: 6,
                        region: qiniu.region.z2
                    };
                    var observable = qiniu.upload(file, key, token, putExtra, config);
                    observable.subscribe({
                        'next': self.handleFileUploadProgress,
                        'error': self.handleFileUploadError,
                        'complete': self.handleFileUploadComplete
                    });
                }
            }
        });
    });
};

Article.prototype.handleFileUploadProgress = function (response) {
    var total = response.total;
    var percent = total.percent;
    var percentText = percent.toFixed(0) + '%';
    // 24.0909，89.000....
    var progressGroup = Article.progressGroup;
    progressGroup.show();
    var progressBar = $(".progress-bar");
    progressBar.css({"width": percentText});
    progressBar.text(percentText);
};

Article.prototype.handleFileUploadError = function (error) {
    window.messageBox.showError(error.message);
    var progressGroup = $("#progress-group");
    progressGroup.hide();
    console.log(error.message);
};

Article.prototype.handleFileUploadComplete = function (response) {
    console.log(response);
    var progressGroup = $("#progress-group");
    progressGroup.hide();

    var domain = 'https://image.amd794.com/';
    var filename = response.key;
    var url = domain + filename;
    var thumbnailInput = $("input[name='picture']");
    thumbnailInput.val(url);
};

Article.prototype.listenSubmitEvent = function () {
    var submitBtn = $("#submit-btn");
    submitBtn.click(function (event) {
        event.preventDefault();
        var btn = $(this);
        var pk = btn.attr('data-article-id');

        var title = $("input[name='title']").val();
        var category = $("select[name='category']").val();
        var tag = $("input[name='imagelabels']").val();  // 没有修改过为空
        var digest = $("input[name='digest']").val();
        var picture = $("input[name='picture']").val();
        var content = window.ue.getContent();

        if(tag===''){
            tag = false
        }


        var url = '';
        if (pk) {
            url = '/cms/edit_article/';
        } else {
            url = '/cms/write_article/';
        }

        xfzajax.post({
            'url': url,
            'data': {
                'title': title,
                'category': category,
                'digest': digest,
                'picture': picture,
                'tag': tag,
                'content': content,
                'pk': pk
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    xfzalert.alertSuccess('恭喜！文章发表成功！', function () {
                        window.location.reload();
                    });
                }
            }
        });
    });
};

Article.prototype.run = function () {
    var self = this;
    self.initUEditor();
    self.listenQiniuUploadFileEvent();
    self.listenSubmitEvent();
    // self.listenUploadFielEvent();
};


$(function () {
    var article = new Article();
    article.run();

    Article.progressGroup = $('#progress-group');
});