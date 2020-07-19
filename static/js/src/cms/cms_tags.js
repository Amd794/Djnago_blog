/******************************** Part 01 初始化开始**********************************/
//定义全局变量--数组
var newText = new Array();
var selectedText = new Array();
var existedText = new Array();

$(function () {


    $(".show-labelitem").on("click", function () {
        $(this).hide();
        $(".hide-labelitem").show();
        $("#labelItem").show();
    });

    $(".hide-labelitem").on("click", function () {
        $(this).hide();
        $(".show-labelitem").show();
        $("#labelItem").hide();
    });


    $("input[name='imagelabels']").val('');      //已经选择的标签ID
    $("input[name='newtext']").val('');          //新建的标签文本，要存入数据库的
    $("input[name='selectedtext']").val('');
    $("input[name='existedtext']").val('');


//给标签库里的标签添加点击事件
    $(".label-item").on("click", "li", function () {

        var id = $(this).attr("data");
        var text = $(this).children("span:nth-child(2)").html();
        if ($(this).hasClass("selected")) {
            return false;
        }
        if (addLabel(id, text)) {                  //添加，并要把标签库里相应的标签设置为已选择
            $(this).addClass("selected");
        }

    });
//初始化4
    resetExistedText();


})

/********************************初始化结束**********************************/


/******************************************** Part 02 设置数组和input**********************************************************/

function resetDataValue() {
    /******1*****直接从最上面生成**/
    val = '';
    for (var i = 0; i < $(".label-selected").children("li").length; i++) {
        var data = $(".label-selected").children("li").eq(i).attr("data");
        if (data != "0") {              //只存储通过标签库添加的 ID，新增的自定义标签 data 为 0   *********
            val += data + ',';
        }
    }
    $("input[name='imagelabels']").val(val);
}

//2、3、4：数据同时存到 数组 和 input。数组：方便检索；input：方便观察     数组和文字，顺序一致

function addNewText(labelName) {
    /*****2+***文字，数组 各自增****/
    valtext = $("input[name='newtext']").val();
    ;
    valtext += labelName + ',';
    $("input[name='newtext']").val(valtext);
    newText.push(labelName);
}

function removeNewText(labelName) {
    /******2-***数组————>文字****/
    valtext = '';
    var index = newText.indexOf(labelName);
    if (index !== -1) {
        newText.splice(index, 1);
    }
    for (i = 0; i < newText.length; i++) {
        valtext += newText[i] + ',';
    }
    $("input[name='newtext']").val(valtext);

}


function resetSelectedText() {
    /******3**根据 最上面 生成单独的数组和文字*****/
    selectedText = [];   //首先要清空
    valtext = '';
    for (i = 0; i < $(".label-selected").children("li").length; i++) {
        var text = $(".label-selected").children("li").eq(i).text();
        selectedText[i] = text;
        valtext += selectedText[i] + ',';
    }
    $("input[name='selectedtext']").val(valtext);

}


function resetExistedText() {
    /******4**根据 标签库列表 生成单独的数组和文字*****/
    existedText = [];   //首先要清空
    valtext = '';
    for (i = 0; i < $(".label-item").children("li").length; i++) {
        var text = $(".label-item").children("li").eq(i).children("span:nth-child(2)").html();
        existedText[i] = text;
        valtext += existedText[i] + ',';
    }
    $("input[name='existedtext']").val(valtext);

}


/*********************************************设置数组和input结束*******************************************************/


/******************************************* Part 03 添加****************************************/
//添加自定义标签
$("#label-self").on("click", function () {      // 3情况：重复、标签库、新增

    var labelName = $("#labelName").val();
    if (labelName != null && labelName != "") {

        var indexOfselected = selectedText.indexOf(labelName);
        var indexOfexisted = existedText.indexOf(labelName);


        if (indexOfselected !== -1)     //已经存在于已选择，不添加
        {
            tips("标签已存在！");
            return;
        } else if (indexOfexisted !== -1) //已经存在于标签库，添加，并要把标签库里相应的标签设置为已选择
        {
            var li = $(".label-item").children("li").eq(indexOfexisted);
            var id = li.attr("data");
            if (addLabel(id, labelName)) {
                li.addClass("selected");
            }
            return;
        } else {
            if (addLabel(0, labelName))   //新添加的标签，添加，并2+
            {
                addNewText(labelName);
            }
        }
    } else {
        tips("请填写标签名！");
    }

});


//添加标签到最上面
function addLabel(id, text) {
    var num = 8;              //标签最多个数
    if ($(".label-selected").children("li").length >= num) {
        tips("最多可以选择" + num + "个哦");
        return false;
    }

    var labelHTML = getappendHTML(id, text);
    $(".label-selected").append(labelHTML);

    //新增，刷新 1、3
    resetDataValue();
    resetSelectedText();

    return true;
}


/************************************************ Part 04 删除************************************/
//删除已选标签
$(".label-selected").on("click", "li .delete", function () {
    var id = $(this).parent().attr("data");
    var text = $(this).parent().text();
    //删除最上面
    $(this).parent().remove();

    //刷新 1、3
    resetDataValue();
    resetSelectedText();


    if (id == 0) {             //删除的是新增标签  2-
        removeNewText(text);
    } else {                    //删除的是标签库里的标签  移除class
        $(".label-item").find("li[data='" + id + "']").removeClass("selected");
    }

});


/***************************************** Part 05 提交*******************************************/
function submit() {
    var labelID = $("input[name='imagelabels']").val();
    var newtext = $("input[name='newtext']").val();     //保存到数据库
    alert(labelID);
    alert(newtext);
}

/************************************************************************************/
function getappendHTML(id, text) {
    return "<li data='" + id + "''>" + text + "<div class='delete'></div></li>";
}

function tips(content) {
    layer.open({
        type: 1,
        offset: 'auto', //具体配置参考：offset参数项
        title: '提示',
        content: '<div style="padding: 20px 80px;">' + content + '</div>',
        btn: '确定',
        btnAlign: 'c', //按钮居中
        yes: layer.closeAll()
    });
}