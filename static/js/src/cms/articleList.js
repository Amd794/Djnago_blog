
function CMSArticleList() {

}

CMSArticleList.prototype.initDatePicker = function () {
    var startPicker = $("#start-picker");
    var endPicker = $("#end-picker");

    var todayDate = new Date();
    var todayStr = todayDate.getFullYear() + '/' + (todayDate.getMonth()+1) + '/' + todayDate.getDate();
    var options = {
        'showButtonPanel': true,
        'format': 'yyyy/mm/dd',
        'startDate': '2017/6/1',
        'endDate': todayStr,
        'language': 'zh-CN',
        'todayBtn': 'linked',
        'todayHighlight': true,
        'clearBtn': true,
        'autoclose': true
    };
    startPicker.datepicker(options);
    endPicker.datepicker(options);
};

CMSArticleList.prototype.listenDeleteEvent = function () {
    var deleteBtns = $(".delete-btn");
    deleteBtns.click(function () {
        var btn = $(this);
        var article_id = btn.attr('data-article-id');
        console.log(article_id);
        xfzalert.alertConfirm({
            'text': '您是否要删除这篇文章吗？',
            'confirmCallback': function () {
                xfzajax.post({
                    'url': '/cms/delete_article/',
                    'data': {
                        'article_id': article_id
                    },
                    'success': function (result) {
                        if(result['code'] === 200){
                            window.location = window.location.href;
                            // window.location.reload()
                        }
                    }
                });
            }
        });
    });
};


CMSArticleList.prototype.run = function () {
    this.initDatePicker();
    this.listenDeleteEvent();
};

$(function () {
    var articleList = new CMSArticleList();
    articleList.run();
});