$(document).ready(function () {
    var upload = $('.upload'),
        animation,
        pathPause = Snap.select('.play svg path').attr('d'),
        pathRepeat = 'M4.5,4.5 C6.4,2.6 9.6,2.6 11.5,4.5 C12.2,5.2 12.7,6.2 12.9,7.2 L14.9,6.9 C14.7,5.4 14,4.1 13,3.1 C10.3,0.4 5.9,0.4 3.1,3.1 L0.9,0.9 L0.2,7.3 L6.6,6.6 L4.5,4.5 Z';

    upload.find('nav a').click(function (e) {
        var btn = $(this);
        if (btn.hasClass('play')) {
            if (!btn.hasClass('active')) {
                morhp(pathRepeat);
                animation.pause();
            } else {
                morhp(pathPause);
                setTimeout(() => {
                    animation.resume();
                }, 600);
            }
            upload.toggleClass('paused');
            btn.toggleClass('active');
        }
        return false;
    });

    function completeAnimation() {
        upload.addClass('finished');
        upload.find('.text > strong > span').text('下载完成');
        upload.find('.percent span').animate({
            width: 20
        }, 400);
    }

    function fakeUpload(percentComplete) {
        animation = $({
            num: 0
        }).animate({
            num: 100
        }, {
            // duration: duration,
            easing: 'linear',
            step() {
                upload[0].style.setProperty('--percent', Math.floor(percentComplete));
                upload.find('[data-seconds]').text(Math.floor(100 - percentComplete));
                // console.log(percentComplete)
            },
            complete() {
                upload[0].style.setProperty('--percent', Math.floor(percentComplete));
                if (percentComplete === 100) completeAnimation();
            }
        });
    }

    function morhp(toPath) {
        $('.play svg').each(function () {
            var svg = $(this);
            Snap(svg.children('path')[0]).animate({
                d: toPath
            }, 400);
        });
    }

    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    upload.toggleClass('isMobile', isMobile);

    function ajaxdown(btn, filename, fileUrl) {

        btn.click(function () {
            $('#upload').fadeIn();
            var that = this;
            var page_url = fileUrl;
            var req = new XMLHttpRequest();
            req.open("get", page_url, true);
            //监听进度事件
            req.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    // var SurplusComplete = evt.total - (evt.loaded / evt.total);
                    // console.log(percentComplete * 100);
                    // $("#progressing").html((percentComplete * 100) + "%");
                    fakeUpload(percentComplete * 100);
                }

            }, false);
            req.responseType = "blob";
            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    if (typeof window.chrome !== 'undefined') {
                        // Chrome version
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(req.response);
                        link.download = filename;
                        link.click();
                        $('#upload').fadeOut(5000);
                    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                        // IE version
                        var blob = new Blob([req.response], {type: 'application/force-download'});
                        window.navigator.msSaveBlob(blob, filename);
                        $('#upload').fadeOut(5000);
                    } else {
                        // Firefox version
                        var file = new File([req.response], filename, {type: 'application/force-download'});
                        window.open(URL.createObjectURL(file));
                        $('#upload').fadeOut(5000);
                    }
                }
            };
            req.send();
        });
    }
    var downBtn = $('#downBtn');
    var filename = downBtn.data('filename');
    var fileUrl = downBtn.data('url');
    ajaxdown(downBtn, filename, fileUrl)
});
