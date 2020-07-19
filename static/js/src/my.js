$(document).ready(function () {
    jinrishici.load(function (result) {
        // 自己的处理逻辑
        // console.log(result);
        var data = {'origin': result.data.origin};
        var shici = $('#jinrishici');
        shici.text(result.data.content);
        shici.on('click', function () {
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                shadeClose: true,
                skin: 'layer_shici',
                content: template('song', data)
            });
        });

    });

    // 波浪
    var marqueeScroll = function (id1, id2, id3, timer) {
        var $parent = $("#" + id1);
        var $goal = $("#" + id2);
        var $closegoal = $("#" + id3);
        $closegoal.html($goal.html());

        function Marquee() {
            if (parseInt($parent.scrollLeft()) - $closegoal.width() >= 0) {
                $parent.scrollLeft(parseInt($parent.scrollLeft()) - $goal.width());
            } else {
                $parent.scrollLeft($parent.scrollLeft() + 1);
            }
        }

        setInterval(Marquee, timer);
    };
    var marqueeScroll1 = new marqueeScroll("marquee-box", "wave-list-box1", "wave-list-box2", 20);
    var marqueeScroll2 = new marqueeScroll("marquee-box3", "wave-list-box4", "wave-list-box5", 40);


    // 换肤
    var skin_list = document.querySelectorAll('.skin-list a');
    for (var i = 0; i < skin_list.length; i++) {
        skin_list[i].onclick = function () {
            setActiveStyleSheet(this.id);
        }
    }


    // 通知公告
    var tongzhis = document.querySelectorAll('#mulitline li');
    for (var i = 0; i < tongzhis.length; i++) {
        tongzhis[i].onclick = function () {
            var content = this.innerHTML;
            //示范一个公告层
            layer.open({
                type: 1,
                title: '公告',
                closeBtn: 2,
                area: '450px;',
                id: 'LAY_layuipro',//设定一个id，防止重复弹出
                shade: .5, //不显示遮罩
                btnAlign: 'c',
                moveType: 1, //拖拽模式，0或者1
                content: content
            });
            $('#LAY_layuipro').css({
                'padding': '20px',
                'color': '#666',
                'font-weight': '300',
                'line-height': '22px',
            })


        }
        ;
    }


    $("section").addClass("mysection");
//动画加载
    $("body").show();

    $(".jiazai").remove();
    $(".top-left ,.homeh4,.mysection").css({"animation": "fuzuo 1s", "-webkit-animation": "fuzuo 1s"});
    $(".swiper-container,.myaside").css({"-webkit-animation": "suoxiao 0.8s", "animation": "suoxiao 0.8s"});
    $(".myheader").css({"-webkit-animation": "fushang 0.5s", "animation": "fushang 0.5s"});
    $(".skin-btn").css({"-webkit-animation": "zuo2 0.5s", "-webkit-animation": "zuo2 0.5s"});

    var sidelen = $(".animation-div").length;
    var arclen = $(".arclist ul>li").length;
    for (var s = 0; s <= sidelen; s++) {

        $(".animation-div").eq(s).css({
            "-webkit-animation-name": "fuxiasuo",
            "-webkit-animation-duration": s / 7 + 1 + "s",
            "animation-name": "fuxiasuo",
            "animation-duration": s / 7 + 1 + "s"
        });
    }
    for (var a = 0; a <= arclen; a++) {

        $(".arclist ul>li").eq(a).css({
            "-webkit-animation-name": "fuzuo",
            "-webkit-animation-duration": a / 8 + 1 + "s",
            "animation-name": "fuzuo",
            "animation-duration": a / 8 + 1 + "s"
        });
    }

    var pcli = $(".mynav >ul >li");
    var pclien = pcli.length;
    var pcliinde = pcli.index();

    for (var j = 0; j <= pclien; j++) {

        pcli.eq(j).css({
            "-webkit-animation-name": "fushang",
            "-webkit-animation-duration": j / 6 + 0.5 + "s",
            "animation-name": "fushang",
            "animation-duration": j / 6 + 0.5 + "s"
        });
    }

//当前连接高亮

    $('nav li a').each(function () {
        if ($($(this))[0].href == String(window.location))
            $(this).parent("li").addClass('nav-active');
    });

//菜单下拉


    $(".mob-drop").click(function () {
        $(".mob-dropmenu").slideToggle();

    });

//手机菜单下拉


    var mb = $(".mobile-nav");
    var mli = $(".mob-ulnav>li");
    var mlen = mli.length;
    var mindex = mli.index();
    var parent = mb.parent();


    if (document.documentElement.clientWidth <= 640) {
        // 隐藏公告
        // parent.children('.web-xiaoxi').attr('style', "display: none;");
        // logo 错位修正
        parent.children('.logo').attr('style', "background-size: 130px;background-position-y: -9px;background-position-x: -22px;width: 100px;");
        parent.children('.logo').children('a').attr('style', "line-height: 53px; padding-left: 40px;font-size: 16px;");
        // 诗句
        $('.blog-logo').attr('style', 'height: 180px;');
        $('.amd794-bloger').attr('style', 'font-size: 12px;');
        // welcome to my blog
        $('.amd794-name').attr('style', 'font-size: 28px;');
        $('.leave').remove();
        $('.cjzs').remove();
        $('.yd-box').remove();
    }


    mb.find(".el-lines").click(function () {
        $(this).hide();
        $(this).next("i").show();
        for (var m = 0; m <= mlen; m++) {

            mli.eq(m).css({
                "-webkit-animation-name": "zuo",
                "-webkit-animation-duration": m / 10 + 0.5 + "s",
                "animation-name": "zuo",
                "animation-duration": m / 10 + 0.5 + "s"
            });
        }
        $(".mob-menu").show().css({"-webkit-animation": "zuo 0.8s", "animation": "zuo 0.8s"})
    });


    mb.find(".el-remove").click(function () {
        $(this).hide();
        $(this).prev("i").show();
        for (var m = 0; m <= mlen; m++) {

            mli.eq(m).css({
                "-webkit-animation-name": "fuzuo",
                "-webkit-animation-duration": m / 10 + 0.5 + "s",
                "animation-name": "fuzuo",
                "animation-duration": m / 10 + 0.5 + "s"
            });
        }
        $(".mob-menu").css({"-webkit-animation": "zuo3 0.8s", "animation": "zuo3 0.8s"});
        setTimeout(function () {
            $(".mob-menu").hide();
        }, 500);
    });


//相册动画

//滑动效果
    $(".drop").mouseenter(function () {

        $(".drop-nav").css({"-webkit-animation": "zuo1 0.8s", "animation": "zuo1 0.8s"}).show();

    });


    $(".drop").mouseleave(function () {
        $(".drop-nav").css({"-webkit-animation": "zuo2 0.8s", "animation": "zuo2 0.8s"});
        setTimeout(function () {
            $(".drop-nav").hide();
        }, 500);

    });

//TAB切换
    $(".mytab a").click(function () {
        var index = $(this).index();
        $(this).addClass("tab-active").siblings().removeClass("tab-active");
        $(this).parents(".mytab").find("ul").eq(index).show().siblings('ul').hide();

    });
//滚动
//文字滚动
    $(function () {

        var _wrap = $('.mulitline');//定义滚动区域
        var _interval = 3000;//定义滚动间隙时间
        var _moving;//需要清除的动画
        _wrap.hover(function () {
            clearInterval(_moving);//当鼠标在滚动区域中时,停止滚动
        }, function () {
            _moving = setInterval(function () {
                var _field = _wrap.find('li:first');//此变量不可放置于函数起始处，li:first取值是变化的
                var _h = _field.height();//取得每次滚动高度
                _field.animate({marginTop: -_h + 'px'}, 500, function () {//通过取负margin值，隐藏第一行
                    _field.css('marginTop', 0).appendTo(_wrap);//隐藏后，将该行的margin值置零，并插入到最后，实现无缝滚动
                })
            }, _interval)//滚动间隔时间取决于_interval
        }).trigger('mouseleave');//函数载入时，模拟执行mouseleave，即自动滚动
        if ($(".mulitline li").length <= 1)//小于等于1条时，不滚动
        {
            clearInterval(_moving);

        }

    });


//邮箱弹窗
    $(".mail-btn").click(function (e) {

        $(".mail-dy").show();
        $(".side-bdfx").hide();
        $(document).one("click", function () {

            $(".side-bdfx").hide();
            $(".mail-dy").hide();

        });
        e.stopPropagation();
    });
//返回顶部
    $(function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() >= 220) {
                $('#toTop').stop().fadeIn();
                $('.container-inner').stop().fadeOut();
                // $('.container-inner').css('display', 'none');
                $('header').css('margin-top', '0');

            } else {
                $('#toTop').stop().fadeOut();
                $('.container-inner').stop().fadeIn();
                // $('.container-inner').css('display', 'block');
                $('header').css('margin-top', '180px');
            }
        });

        $('#toTop').click(function () {
            $('body,html').animate({scrollTop: 0}, 800);
        });
    });
//表单下拉
    $(".form-btn a").click(function () {
        $(".form-zd").slideToggle();
    });
// 弹出海报
    $('.haibao').click(function () {
        var _Haibao = new Haibao();
        haibao_img = _Haibao.main("/static/images/haibaobg.jpg", '/static/images/haibaotx.jpg');
        layer.open({
            type: 1,
            title: false,
            closeBtn: 2,
            btn: ['保存并分享'],  //可以无限个按钮
            btn1: function (index, layero) {
                download(haibao_img);
            },
            shade: 0.8,
            skin: 'layui-layer-dir',
            area: 'auto',
            resize: true,
            resizing: function (layero) {
                console.log('正在拉伸');
            },
            maxHeight: $(window).height() - 300,
            moveType: 1, //拖拽模式，0或者1
            content: '<img src="' + haibao_img + '" alt="">',
        });
    });

//弹出分享层
    $(".fx-btn").click(function (e) {
        $(".arc-bdfx").show();
        $(document).one("click", function () {

            $(".arc-bdfx").hide();

        });
        e.stopPropagation();
    });
    $(".side-fx").click(function (e) {
        $(".side-bdfx").show();
        $(".mail-dy").hide();
        $(document).one("click", function () {

            $(".side-bdfx").hide();
            $(".mail-dy").hide();

        });
        e.stopPropagation();

    });
    $(".el-remove").click(function () {
        $(".arc-bdfx").hide();
        $(".mail-dy").hide();
        $(".side-bdfx").hide();


    });

//图片查看器
    $(".mail-dy").click(function (e) {
        e.stopPropagation();
    });


    var images = document.querySelector('#article-content');
    if (images != null) {
        $(function () {
            var viewer = new Viewer(images);
        });
    }

})
;
//END Document ready

//JS区域

// 语音朗读

function splitstr(str, count) {
    var arr = [];
    for (var i = 0, len = str.length / count; i < len; i++) {
        var subStr = str.substr(0, count);
        arr.push(subStr);
        str = str.replace(subStr, "");
    }
    return arr;
}

function match_chinese(str) {
    var pattern = /[`~!@#$^&*()=|{}':;' ,\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？]/g;
    return str.replace(pattern, "");
}

function playPause() {
    var text = $('.content-cc').text();
    var str = match_chinese(text);
    var arr = splitstr(str, 500);
    var music = document.getElementById('langdu');
    var music_btn = document.getElementById('music_btn01');

    if (music.paused) {
        music.play();
        music_btn.src = '//image.amd794.com/zanting.png'; //播放图片
        var aud = document.getElementById("langdu");
        aud.addEventListener("ended", function () {
            aud.src = "//tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(arr[0]);
            aud.play();
            aud.addEventListener("ended", function () {
                aud.currentTime = 0;
                aud.pause();
                aud.src = "//tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=开始为你朗读文章";
                music_btn.src = '//image.amd794.com/bofang.png'; //暂停图片
            }, false);
        }, false);
    } else {
        music.pause();
        music_btn.src = '//image.amd794.com/bofang.png'; //暂停图片
    }
}


$(function () {
    var article = $('.content-cc');
    var show_article_box = $('.show-article-box');
    var anchorContent = $('#AnchorContent');
    show_article_box.on('click', function () {
        anchorContent.find('li').on('click', function () {
            $(this).find('a').css('color', '#328bff');
            $(this).siblings().find('a').css('color', '#777');
        });
        layer.open({
            type: 1,
            title: '目录(可拖拽)',
            closeBtn: 2,
            shade: 0,
            skin: 'layui-layer-dir',
            area: 'auto',
            offset: ['200px', '0'],
            resize: true,
            resizing: function (layero) {
                console.log('正在拉伸');
            },
            maxHeight: $(window).height() - 300,
            moveType: 1, //拖拽模式，0或者1
            content: anchorContent,
            cancel: function (index, layero) {
                if (confirm('确定要关闭么, 关闭后将不再弹出')) { //只有当点击confirm框的确定时，该层才会关闭
                    layer.close(index)
                }
                return false;
            }
        });
    });

    // 自动目录
    $(".post-content").find("h2,h3").each(function (i, item) {
        var tag = $(item).get(0).localName;
        $(item).attr("id", "wow" + i);
        $("#AnchorContent").append('<li><a class="new' + tag + ' anchor-link"  href="#wow' + i + '">' + $(this).text() + '</a></li>');
        $(".newh2").css("margin-left", 0);
        $(".newh3").css("margin-left", 20);
        $(".newh4").css("margin-left", 40);
        $(".newh5").css("margin-left", 60);
        $(".newh6").css("margin-left", 80);
    });
    $("#AnchorContentToggle").click(function () {
        var text = $(this).html();
        if (text === "目录[-]") {
            $(this).html("目录[+]");
            $(this).attr({"title": "展开"});
        } else {
            $(this).html("目录[-]");
            $(this).attr({"title": "收起"});
        }
        $("#AnchorContent").toggle();
    });
    // 文章内容折叠
    article.readmore({
        speed: 75,
        collapsedHeight: 600,
        lessLink: false,
        // moreLink: '<a href="#" style="text-align: center">↓↓阅读全文↓↓</a>',
        moreLink: show_article_box
    });
    //  统计阅读时间

    article.readingTime({
        readingTimeAsNumber: true,
        readingTimeTarget: '.ydTime'
        // wordCountTarget: '.words',
    });

});

