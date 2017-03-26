//?token=wIOD4rqg6hc1aS/bX781waLEycb//gOrxgLhcE9tRnmK7mT332ujuLnqwTFThwmaD8bNHv425Q4=&companyId=10026

define(["JQuery","BaseClass",'iselect','wp_datetimepicker',"layer","config",'select2','select2-zh-CN','jquery-validate','jquery-validate-zh-CN'], function($,BaseClass,ISelect,datetimepicker){
    //获取公共的基本类属性（可获取ip，端口之类）
    var cv = inherit(BaseClass.prototype);

    //用于记录全局的内容
    var globalData = {
        urlHead:cv.getLocalhostPort(),
        token:cv.getParameter().token,
        companyId:cv.getParameter().companyId,
        userId:67599,
        resumeId:0,
        name:'',
        mobile:''
    };

    //总初始化模块
    cv.init = function(step){
        this.createModal_init(); //创建页的初始化
    };

    //简历创建模态框初始化
    cv.createModal_init = function(){
        sourceConfigInit(globalData); //简历来源的数据和事件配置
        positionConfigInit(globalData,ISelect); //应聘职位输入框的配置
        eduSelectConfigInit(globalData); //最高学历下拉框配置
        dateConfigInit(globalData,datetimepicker); //日期插件配置
        morelinkConfigInit(globalData);//更多内容块的展开事件
        commonConfigInit(globalData); //一般表单元素配置
        validateConfig(cv,globalData); //校验配置

        //确认创建按钮点击回调
        $('#cv_createModal .modal-footer .create').off('click').on('click',function(e){
            //触发验证
            $('#cv_createForm').submit();
        });

        contentInit(); //所有内容的初始化
    };

    //监控模态框的显示
    $('#cv_createModal').off('shown.bs.modal').on('shown.bs.modal',function(){
        cv.init(1);//模态框内的配置
    });

    return cv;
});

//一般表单元素配置
function commonConfigInit(globalData){
    //校验字段在没创建的时候不用提示
    $('#cv_createForm [name="name"]').off('blur').on('blur',function(e){
        $('#cv_createForm .errorInfo').text('');
    });

    $('#cv_createForm [name="mobile"]').off('blur').on('blur',function(e){
        $('#cv_createForm .errorInfo').text('');
    });
}

//应聘职位输入框(div)的配置
function positionConfigInit(globalData,ISelect){
    //如果用到公共控件的话就删除后面的代码
    new ISelect({
        type:'job',
        select_id:'cv_createModalPosition',
        result_num_type: "single"
    });

    //获取焦点的时候可编辑隐藏默认提示，失去焦点的时候如果为空就补上默认提示
    /*$('#cv_createForm div[name="position"]').off('focus').on('focus',function(e){
        if($(this).text() == '请输入职位'){
            $(this).css('color',"#333").text('');
        }
    }).off('blur').on('blur',function(e){
        if($(this).text().replace(/\s+/g,"") == ''){
            $(this).css('color',"#999999").text('请输入职位');
        }
    });*/
}

//校验配置
function validateConfig(cv,globalData){
    $('#cv_createForm').validate({
        debug:false,//true可以开启调试模式，将只验证表单而不提交
        //触发表单提交验证通过后将会进入此回调，实际上提交需要通过回调内部的submit提交或者进行异步提交
        submitHandler:function(form){
            var data = {};
            var nameFlag = '';
            var $formEles = $('#cv_createForm [name]');
            for(var i = 0;i < $formEles.length;i++){
                //如果有重复的字段就跳下一个字段
                var $ele = $($formEles[i]);
                var key = $ele.attr('name');
                if(key == nameFlag){
                    continue;
                }
                nameFlag = key;

                //根据不同的元素获取不同结果
                if($ele.is('input')){
                    data[key] = $ele.val();
                }else if($ele.is('select')){
                    if($ele.is('[name="education"]')){
                        data[key] = $ele.val() == null ? '0':$ele.val();
                    }else{
                        data[key] = $ele.val();
                    }
                }else if($ele.is('div[name="position"]')){
                    var value = $ele.find('.select-val').text();
                    data[key] = value === '点击选择' ? null : value;
                }
            }

            console.log(data);

            $.ajax({
                url:globalData.urlHead + '/appcenter/resume/create.json',
                type:'post',
                dataType:'json',
                data:data,
                headers:{
                    token:globalData.token
                },
                success:function(res){
                    //console.log(res);
                    if(res.code == 1){
                        globalData.resumeId = res.data;
                        $('#cv_createModal').modal('hide');
                    }else{
                        layer.msg(res.message);
                        console.log('请求返回数据有误,错误码:' + res.message);
                    }
                }
            });
        },
        //配置每个表单元素name对应的规则
        rules:{
            name:'required',
            mobile:{
                required:true,
                rangelength:[11,11],
                number:true
            }
        },
        //配置每个表单元素的name对应的错误消息规则
        messages:{
            mobile:{
                rangelength:'手机号码必须是11位数'
            }
        },
        //可以自己重置错误消息的内容或者位置,error是一个JQ的label元素,element是jq表单元素
        errorPlacement: function(error, element) {
            element.next().html(error);
        }
    });
}

//更多内容块的展开事件
function morelinkConfigInit(){
    var $ele = $('#cv_createForm .more_link');
    $ele.off('click').on('click',function(){
        $(this).addClass('hidden');
        $('#cv_createForm .more_container').removeClass('hidden');
    });

    //初始化隐藏更多的内容区域显示链接
    $ele.removeClass('hidden');
    $('#cv_createForm .more_container').addClass('hidden');
}

//简历创建页面的内容初始化
function contentInit(){
    var $inputs = $('#cv_createForm input');
    var $selects = $('#cv_createForm select');

    //初始化所有的input元素
    for(var i = 0;i < $inputs.length;i++){
        var $ele = $($inputs[i]);
        if($ele.attr('type') == 'radio'){
            $ele.val('女');
        }else if($ele.attr('type') == 'text'){
            $ele.val('');
        }
    }

    //初始化所有的select元素
    for(var j = 0;j < $selects.length;j++){
        if($($selects[i]).next().is('.select2')){
            $($selects[i]).val(null).trigger('change');
        }
    }

    //错误信息内容的初始化
    $('#cv_createForm .errorInfo').html('');
}

//最高学历下拉框select2配置
function eduSelectConfigInit(){
    var $ele = $('#cv_createForm select[name="education"]');
    $ele.select2({
        data:[
            {id:0,text:'请选择'},
            {id:2,text:'初中'},
            {id:3,text:'高中'},
            {id:4,text:'中技'},
            {id:5,text:'中专'},
            {id:6,text:'大专'},
            {id:7,text:'本科'},
            {id:8,text:'硕士'},
            {id:9,text:'博士'},
            {id:1,text:'其它'}
        ],
        placeholder:'请选择',
        minimumResultsForSearch: Infinity
    });
    //重写下拉框样式
    $ele.next().find('.select2-selection.select2-selection--single').css('border','none');
    $ele.next().find('.select2-selection__arrow').hide();
    $ele.val(null).trigger('change');
}

//所有日期插件初始化配置
function dateConfigInit(globalData,datetimepicker){
    birthDateConfigInit();
    enterTimeDateConfigInit(globalData,datetimepicker);
}

//生日日期选择插件初始化配置
function birthDateConfigInit(){
    var $ele = $('#cv_createForm input[name="birthDate"]');
    $ele.datetimepicker({
        autoclose:true,
        startView:2,
        minView:2,
        maxView:3,
        todayHighlight:true,
        language:'zh-CN',
        format:'yyyy-mm-dd'
    });

    $ele.off('click').on('click',function(e){
        $ele.datetimepicker('show');
    });
}

//最快到岗时间日期选择插件初始化配置
function enterTimeDateConfigInit(globalData,datetimepicker){
    /*datetimepicker.dateTimePickerBind({
        datePicker:'#cv_createForm .enterTime',
        dateInput:'#cv_createForm .enterTime',
        position:'top'
    });*/

    var $ele = $('#cv_createForm input[name="enterTime"]');
    $ele.datetimepicker({
        autoclose:true,
        startView:2,
        minView:2,
        maxView:3,
        todayHighlight:true,
        language:'zh-CN',
        format:'yyyy-mm-dd',
        pickerPosition:'top-right'
    });

    $ele.off('click').on('click',function(e){
        $ele.datetimepicker('show');
    });
}

//简历来源的数据和事件配置
function sourceConfigInit(globalData){
    //来源的固定选项
    var data = [{
        id:1,
        text:'前程无忧'
    },{
        id:2,
        text:'智联招聘'
    },{
        id:3,
        text:'中华英才'
    },{
        id:4,
        text:'拉钩网'
    },{
        id:5,
        text:'猎聘网'
    },{
        id:6,
        text:'内推'
    },{
        id:7,
        text:'微信'
    },{
        id:8,
        text:'搜才网'
    }];

    //来源的其它项请求
    $.ajax({
        url:globalData.urlHead + '/appcenter/resume/sourceList.json',
        dataType:'json',
        type:'post',
        //data:{companyId:globalData.companyId},
        headers:{
            token:globalData.token
        },
        success:function(res){
            //console.log(res);
            if(res.code == 1){
                //从后台获取的其它来源
                var list = res.data;
                for(var i = 0;i < list.length;i++){
                    data.push({
                        id:list[i].id,
                        text:list[i].name
                    });
                }

                //最后添加一个自定义选项
                data.push({
                    id:-1,
                    text:'其他自定义来源'
                });

                //配置插件
                var $select = $('#cv_createForm select[name="source"]');
                $select.select2({
                    data:data,
                    placeholder:'请选择简历来源',
                    language: "zh-CN"
                });
                $select.val(null).trigger('change');

                //选择项事件触发情况
                $select.off('select2:select').on('select2:select',function(e){
                    switch(e.params.data.text){
                        case '其他自定义来源':
                            $select.val(null).trigger('change');
                            $('#cv_createModal .customSource').removeClass('hidden');
                            break;
                        case '内推':
                            sourcePushConfigInit(globalData);//选择内推后配置内推人下拉框
                            $('#cv_createModal .relatedUserContainer').removeClass('hidden');
                            break;
                    }

                    if(e.params.data.text != '其他自定义来源'){
                        $('#cv_createModal .customSource').addClass('hidden');
                    }
                    if(e.params.data.text != '内推'){
                        $('#cv_createModal .relatedUserContainer').addClass('hidden');
                        //不是内推的时候将字段置空
                        $('select[data-name="relatedUserId"]').val(null).trigger('change');
                        $('input[name="recommendName"]').val('');
                    }
                });

                //自定义来源确定按钮
                $('#cv_createModal .customSource .ensure').off('click').on('click',function(e){
                    var value = $('.customSource input').val().replace(/\s+/g,"");
                    if(value == ''){
                        $('#cv_createModal .customSource .customSourceError').css('color','red').text('输入不能为空');
                        setTimeout(function(){
                            $('#cv_createModal .customSource .customSourceError').text('');
                        },3000);
                    }else{
                        $select.find('option[value="-1"]:first').before('<option value="-1">' + value + '</option>');
                        $select.val("-1").trigger("change");
                        $('.customSource input').val('');
                        $('#cv_createModal .customSource').addClass('hidden');
                    }
                });

                //自定义按钮取消按钮
                $('#cv_createModal .customSource .cancel').off('click').on('click',function(e){
                    $('#cv_createModal .customSource').addClass('hidden');
                    $('.customSource input').val('');
                });
            }else{
                console.log('请求返回有误,错误码:' + res.message);
            }
        },
        error:function(){
            console.log('请求出错!');
        }
    });
}

//简历来源中的内推人下拉框配置初始化
function sourcePushConfigInit(globalData){
    var $select = $('#cv_createModal select[data-name="relatedUserId"]');
    $select.select2({
        placeholder:'请输入内推人名',
        minimumInputLength:1,//至少输入的触发请求后台的字符数
        language: "zh-CN",
        ajax: {
            url:globalData.urlHead + "/appcenter/employee/list.json",
            dataType: 'json',
            type: 'POST',
            delay: 250,
            data: function (params) {
                return {
                    keyword:params.term.trim(),
                    pageNo: (params.page || 1),
                    searchAll:1
                };
            },
            headers:{
                token:globalData.token
            },
            processResults: function (res, params) {
                //console.log(res);
                if(res.code == 1){
                    params.page = params.page || 1;

                    var arr = [];
                    var list = res.data.list;
	                
	                if(list === undefined){
		                return;
	                }
	                
                    for(var i=0;i < list.length;i++){
                        arr.push({
                            id:list[i].id,
                            text:list[i].name
                        });
                    }

                    return {
                        results: arr,
                        pagination: {
                            //通过当前页和每页显示的数量总和小于总项目数就允许更多加载
                            more: (params.page * res.data.pageSize) < res.data.totalCount
                        }
                    };
                }else{
                    console.log('请求返回数据有误,错误码:' + res.message);
                }
            },
            cache: true
        }
    }).val(null).trigger('change');
}