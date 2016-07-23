$(function () {
    $.validator.setDefaults({
        errorElement: 'span',
        errorClass: 'help-block',
        ////结合bootstrap实现效果
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            element.parent('div').append(error);
        }
    })
})


     $.validator.addMethod("isMobile", function(value, element) {
    var length = value.length;
    var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写您的手机号码");


$(function () {
  
    // 在键盘按下并释放及提交后验证提交表单
    $("#form").validate({

        rules: {

            name: {
                required:true,
                minlength:2
            },
            birthday: {
                required: true,
                minlength: 8
            },
          age : {
                required: true,
                maxlength:2 
              

            },
            mobile:{
                isMobile:true,
        required:true,
         minlength:11
            }
  
            },
        
        messages: {

            name: {
                required: "请输入用户名",
                minlength: "用户名必需由最少两个字母组成"
            },
            birthday: {
                required: "请输入出生日期",
                minlength: "请填入正确的出生日期"
            },
           age: {
                required: "请输入年龄",
                minlength: "请输入正确年龄",
              
            },
            mobile:{
                required:"电话号码不得为空",
                minlength:"电话号码不得小于11位"
            }
           
        }
       
        
        }) 
     
})