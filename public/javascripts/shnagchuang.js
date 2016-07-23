// var express = require('express')
// var fs = require('fs')
// var router = express.Router()

$(function () {
    





    $("#imgCtrl").click(function () {
        $("#selectFile").click()
    })
    $("#selectFile").html5Uploader({
    name: "Filedata",
    postUrl: "/comms/file/uploadfile", ////图片上传的post提交地址
    onSuccess: function (msg) { /////上传成功后的回调函数
        console.log(msg);
        try {
            var url = JSON.parse(msg.currentTarget.response).url;
            $("#imgCtrl").attr("src", url); ////指定img控件的src属性
            $("#iAvatar").val(url); /////服务器端接收时需要获取的标签
        }
        catch (e) {
            console.log(e);
        }
    }
})
})