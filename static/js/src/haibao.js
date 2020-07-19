function Haibao() {
    this.canvas = document.getElementById("myCanvas");   //获取canvas节点
}

Haibao.prototype.generateQr = function (url) {  // 生成二维码
    var qr_canvans = $('#divOne').qrcode(url).hide();
    var qr_images = qr_canvans.find('canvas').get(0);
    qr_img = qr_images.toDataURL('image/jpg');
    return qr_img;
};

Haibao.prototype.imageToCanvas = function (canvas, url1, url2, code) { //传入canvas节点 背景图url1  头像url2 二维码code
    var ctx = canvas.getContext("2d");
    var img1 = new Image();
    img1.src = url1;                     //前面的不解释了，生成个图片
    img1.onload = function () {
        ctx.drawImage(img1, 0, 0);              //当图片加载完成后 赋到画布上 从0 0 开始。
        var img2 = new Image();
        img2.src = url2;
        img2.onload = function () {
            ctx.save();                            //保存当前画布状态
            ctx.arc(175, 84, 44, 0, 2 * Math.PI);    //剪切操作 将正方形的头像切成圆的
            // 从画布上裁剪出这个圆形
            ctx.clip();                             //进行裁剪
            ctx.drawImage(img2, 131, 40, 88, 88);   //放入img2 在330 90坐标处     大小 88
            ctx.restore();                           //释放画布状态
            ctx.font = "28px Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = '#FFFFFF';               //前面是设置文字 属性设为居中
            ctx.fillText("AMD794", 175, 180);     //文字 这里是写死的 实际中多传个参数就ok
            ctx.font = "14px Arial";
            ctx.fillText("扫一扫下方二维码查看文章内容", 175, 210);     //文字 这里是写死的 实际中多传个参数就ok
            ctx.fillText("来自AMD794的博客", 280, 420);     //文字 这里是写死的 实际中多传个参数就ok
            var img3 = new Image();
            img3.src = code;
            img3.onload = function () {
                ctx.drawImage(img3, 100, 240, 150, 150);      //同理加图像
                // console.log(imgCode.getAttribute('src'))
                var image = new Image();
                image.crossOrigin = "*";
                image.src = canvas.toDataURL("image/png");            //canvas转化为img
                imgCode = image;//将图片转为base64
            }
        }
    };
    return imgCode.getAttribute('src')
};

Haibao.prototype.convertCanvasToImage = function () {
    var image = new Image();
    image.crossOrigin = "*";
    image.src = this.canvas.toDataURL("image/png");            //canvas转化为img
    return image;
};

Haibao.prototype.main = function (bgUrl, coverUrl) {
    var qr_img = this.generateQr(window.location.href);
    return this.imageToCanvas(this.canvas, bgUrl, coverUrl, qr_img);

};

//下载base64图片
function download(base64ImgUrl) {
    var imgData = base64ImgUrl;
    this.downloadFile('文章分享.png', imgData);
}


//下载
function downloadFile(fileName, content) {
    var aLink = document.createElement('a');
    var blob = this.base64ToBlob(content); //new Blob([content]);

    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);

    // aLink.dispatchEvent(evt);
    //aLink.click()
    aLink.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));//兼容火狐
}


//base64转blob
function base64ToBlob(code) {
    var parts = code.split(';base64,');
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {type: contentType});
}

