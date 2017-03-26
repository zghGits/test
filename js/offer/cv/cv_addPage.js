//?token=wIOD4rqg6hc1aS/bX781waLEycb//gOrxgLhcE9tRnmK7mT332ujuLnqwTFThwmaD8bNHv425Q4=&rencaiId=54821&interviewId=10520919

var global_obj = {cv:null,data:null};

define(["JQuery","BaseClass",'iselect','wp_datetimepicker','cityPicker',"layer","config",'bootstrap', 'select2','select2-zh-CN','jquery-validate','jquery-validate-zh-CN'], function($,BaseClass,ISelect,dateTimePicker,cityPicker){
    //获取公共的基本类属性（可获取ip，端口之类）
    var cv = inherit(BaseClass.prototype);

    //用于记录全局的内容
    var globalData = {
        urlHead:cv.getLocalhostPort(),
        token:cv.getParameter().token,
        //companyId:cv.getParameter().companyId,
        userId:67599,
        resumeId:parseInt(cv.getParameter()['rencaiId']),
        interviewId:cv.getParameter()['interviewId'],
        operateRecordPageNum:1, //用于后面作为搜索的时候的分页标记
        editEntrance:{ //9个是否通过展开链接进入编辑的入口标识
            jobIntention:0,eduInfo:0,workExperience:0,employeeSkill:0,credentials:0,proExp:0,trainExp:0,
            selfAssessment:0,languageSkill:0
        }
    };

    global_obj.cv = cv;
    global_obj.data = globalData;

    //初始化
    cv.init = function(){
        this.commonInit();

        //专门针对简历详情的初始化
        cvDetailsPageInit(globalData,cv,ISelect,dateTimePicker,cityPicker);

        this.rightInit();

        //首次加载详情
        loadCvDataDetails(globalData,cv);
    };

    //通用的函数和原型改造
    cv.commonInit = function(){
        //日期格式化初始化
        Date.prototype.format = Date.prototype.format || function(fmt)
            {
                var o = {
                    "M+" : this.getMonth()+1,                 //月份
                    "d+" : this.getDate(),                    //日
                    "h+" : this.getHours(),                   //小时
                    "m+" : this.getMinutes(),                 //分
                    "s+" : this.getSeconds(),                 //秒
                    "q+" : Math.floor((this.getMonth()+3)/3), //季度
                    "S"  : this.getMilliseconds()             //毫秒
                };
                if(/(y+)/.test(fmt))
                    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
                for(var k in o)
                    if(new RegExp("("+ k +")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                return fmt;
            }

    }

    //右边区域的初始化
    cv.rightInit = function(){
        operateAreaInit(globalData,cv);
        talentLabelInit(globalData,cv);
        commentsInit(globalData,cv);
    };

    return cv;
});

//右边的备注评语区域初始化
function commentsInit(globalData,cv){
    //添加评语备注
    $('.cv-addPage .comments_div .add_link').off('click').on('click',function(){
        var $edit_box = $(this).closest('.comments_div').find('.addEdit_div');
        $edit_box.find('textarea').val('');
        $edit_box.show();
    });

    //保存
    $('.cv-addPage .comments_div .addEdit_div .save').off('click').on('click',function(){
        var type = $('.cv-addPage .comments_div .addEdit_div input[name="rencai-comment-type"]:checked').val();
        var text = $('.cv-addPage .comments_div .addEdit_div textarea').val();

        console.log(type,text);
        cv._ajax({
            url: '/appcenter/offer/resume/addComment.json',
            token: globalData.token,
            data: {
                resumeId:globalData.resumeId,
                type:type,
                comment:text
            },
            success: function(res){
                //console.log(res);
                if(res.code == 1){
                    var $comment_box = $('.cv-addPage .comments_div .commentsContainer');
                    var html = '<div class="item" data-id="'+res.data+'"><div class="text">'+text+'</div><span class="del">&times;</span></div>';
                    $comment_box.append(html);

                    $('.cv-addPage .comments_div .addEdit_div').hide();
                }else{
                    console.log('返回数据有误,错误码:' + res.message);
                }
            }
        });
    });

    //返回
    $('.cv-addPage .comments_div .addEdit_div .cancel').off('click').on('click',function(){
        var $ele = $(this).closest('.comments_div').find('.addEdit_div');
        $ele.hide();
    });

    //删除
    var str = '.cv-addPage .comments_div .commentsContainer .item .del';
    $(document).off('click',str).on('click',str,function(e){
        var id = $(this).parent().attr('data-id');
        $(this).parent().remove();

        cv._ajax({
            url: '/appcenter/resume/deleteComment.json',
            token: globalData.token,
            data: {
                resumeId:globalData.resumeId,
                commentId:id
            },
            success: function(res){
                //console.log(res);
                if(res.code == 1){

                }else{
                    console.log('返回数据有误,错误码:' + res.message);
                }
            }
        })
    });
}

//右边的人才标签区域初始化
function talentLabelInit(globalData,cv){
    $('.cv-addPage .talentLabel_div .add_link').off('click').on('click',function(){
        var $edit_box = $(this).closest('.talentLabel_div').find('.addEdit_div');
        $edit_box.find('input').val('');
        $edit_box.show();
    });

    //保存
    $('.cv-addPage .talentLabel_div .addEdit_div .save').off('click').on('click',function(){
        var $edit_box = $('.cv-addPage .talentLabel_div .addEdit_div');
        var $tag_box = $('.cv-addPage .talentLabel_div .labelContainer');
        var value = $edit_box.find('input').val();
        if(value.replace(/\s+/g,'') == ''){
            return;
        }

        cv._ajax({
            url: '/appcenter/resume/updateTags.json',
            token: globalData.token,
            data: {
                resumeId:globalData.resumeId,
                type:1,
                tag:value
            },
            success: function(res){
                //console.log(res);
                if(res.code == 1){
                    var html = '<div class="item"><span class="text">'+ value +'</span><span class="del">&times;</span></div>';
                    $tag_box.append(html);
                    $edit_box.hide();
                }else{
                    console.log('返回数据有误,错误码:' + res.message);
                }
            }
        });
    });

    //返回
    $('.cv-addPage .talentLabel_div .addEdit_div .cancel').off('click').on('click',function(){
        var $ele = $(this).closest('.talentLabel_div').find('.addEdit_div');
        $ele.find('input').val('');
        $ele.hide();
    });

    //删除
    var str = '.cv-addPage .talentLabel_div .labelContainer .item .del';
    $(document).off('click',str).on('click',str,function(){
        var value = $(this).prev().text();
        $(this).parent().remove();

        cv._ajax({
            url: '/appcenter/resume/updateTags.json',
            token: globalData.token,
            data: {
                resumeId:globalData.resumeId,
                type:2,
                tag:value
            },
            success: function(res){
                //console.log(res);
                if(res.code == 1){

                }else{
                    console.log('返回数据有误,错误码:' + res.message);
                }
            }
        });
    })
}

//右边的操作区域初始化
function operateAreaInit(globalData,cv){
    //简历详情
    $('.cv-addPage .right .cvDetails_link').off('click').on('click',function(){
        $('.cv-addPage .left div[class*="-page"]').hide();
        $('.cv-addPage .left .cvDetails-page').show();

        $('.cv-addPage .right > div:first-child a').css({
            'border-left':'',
            'color':'#333333'
        });

        $(this).css({
            'border-left':'2pt solid #70BF73',
            'color':'#6FC072'
        });
    });

    //面试记录
    $('.cv-addPage .right .interviewRecord_link').off('click').on('click',function(){
        $('.cv-addPage .left div[class*="-page"]').hide();
        $('.cv-addPage .left .interviewRecord-page').show();

        $('.cv-addPage .right > div:first-child a').css({
            'border-left':'',
            'color':'#333333'
        });

        $(this).css({
            'border-left':'2pt solid #70BF73',
            'color':'#6FC072'
        });

        //面试记录加载和配置
        interviewRecordConfigInit(globalData,cv);
    });

    //测评记录
    $('.cv-addPage .right .appraisal_link').off('click').on('click',function(){
        $('.cv-addPage .left div[class*="-page"]').hide();
        $('.cv-addPage .left .appraisalRecord-page').show();

        $('.cv-addPage .right > div:first-child a').css({
            'border-left':'',
            'color':'#333333'
        });

        $(this).css({
            'border-left':'2pt solid #70BF73',
            'color':'#6FC072'
        });

        //测评记录页面加载和配置
        appraisalConfigInit(globalData,cv);
    });

    //操作记录
    $('.cv-addPage .right .operateRecord_link').off('click').on('click',function(){
        $('.cv-addPage .left div[class*="-page"]').hide();
        $('.cv-addPage .left .operateRecord-page').show();

        $('.cv-addPage .right > div:first-child a').css({
            'border-left':'',
            'color':'#333333'
        });

        $(this).css({
            'border-left':'2pt solid #70BF73',
            'color':'#6FC072'
        });

        //加载操作记录以及相关配置
        operateRecordConfigInit(globalData,cv);
    });

    //初始化的时候触发一次简历详情链接
    $('.cv-addPage .right .cvDetails_link').trigger('click');
}

//面试记录加载和配置
function interviewRecordConfigInit(globalData,cv){
    var $container = $('.cv-addPage .interviewRecord-page');

    //如果不存在
    if(globalData.interviewId == null || globalData.interviewId == 'null'){
        $container.html('<div style="text-align: center;">暂无数据</div>');
        return;
    }

    cv._ajax({
        url:"/appcenter/resume/detail.json",
        token:globalData.token,
        data:{
            interviewId:globalData.interviewId
        },
        success:function(res){
            //console.log(res);
            if(res.code == 1){
                var list = res.data.recordList;
                var html = '';


                //如果没数据就写暂无
                if(list.length != 0){
                    html += '<div class="log">';

                    for(var i=0;i < list.length;i++){
                        var nodeName = list[i].nodeName;
                        var status = '';
                        var round = -1;
                        if(nodeName == 'start'){
                            status = '发出邀约';
                        }else{
                            switch(nodeName.split('|')[0]){
                                case "HRMakeResult":
                                    status = 'HR修改面试决议';
                                    break;
                                case 'HRFollow':
                                    status = 'HR面试跟进';
                                    break;
                                case 'Interview':
                                    status = '面试官反馈';
                                    break;
                            }

                            round = nodeName.split('|')[1];
                        }

                        html += '<div class="log_item" style="margin-left:-100px;margin-bottom: 50px;">' +
                            '<div class="date" style="display: inline-block;vertical-align:top;margin-right: 100px;">'+ new Date(list[i].time).format('yyyy-MM-dd') +'<br/>'+
                            new Date(list[i].time).format('hh:mm:ss')+'</div>' +
                            '<div class="content" style="display: inline-block">' +
                            '<p style="color:#70c3ee;">操作人&nbsp;'+ list[i].assignee +'</p>' +
                            '<p>'+status + (round == -1 ? '':('&nbsp;第'+ round +'轮')) + '&nbsp;<span style="color:#3DAB49">('+list[i].decision+')</span></p>' +
                            '<p>'+(list[i].comment != '' && list[i].comment != null ? list[i].comment : '') +'</p></div>' +
                            '</div>';
                    }

                    html += '</div>';
                }else{
                    html = '<div style="text-align: center;">暂无数据</div>';
                }

                $container.html(html);
            }else{
                console.log('请求返回数据有误,错误码:' + res.message);
            }
        }
    });
}

//测评记录页面加载和配置
function appraisalConfigInit(globalData,cv){
    cv._ajax({
        url:'/appcenter/offer/getTestLog.json',
        token:globalData.token,
        data:{
            rencaiId:globalData.resumeId
        },
        success:function(res){
            //console.log(res);
            if(res.code == 1){
                var data = res.data;
                var $tableBody = $('.cv-addPage .appraisalRecord-page table tbody');

                if(data.length === 0) {
                    $tableBody.html('<tr><td colspan="4">暂无数据</td></tr>');
                    return;
                }

                var html = '';
                for(var i=0;i < data.length;i++){
                    var dateStr = new Date(data[i].createTime).format('yyyy-MM-dd hh:mm');
                    var itemName = data[i].itemName;
                    var itemScore = data[i].itemScore;
                    var description = data[i].description;

                    html += '<tr><td>'+ dateStr +'</td><td>'+ itemName +'</td><td>'+ itemScore +'</td><td style="text-align: left">'+ description +'</td></tr>';
                }
                $tableBody.html(html);
            }else{
                console.log('请求返回数据有误,错误码:' + res.responseEntity.message);
            }
        }
    });
}

//操作记录页面的加载和配置
function operateRecordConfigInit(globalData,cv){
    cv._ajax({
        url:'/appcenter/offer/getOprLog.json',
        token:globalData.token,
        data:{
            rencaiId:globalData.resumeId,
            pageNo:1,
            type:$('.cv-addPage .search_operateType').val(),
            pageSize:10
        },
        success:function(res){
            //console.log(res);
            if(res.code == 1){
                var list = res.data.logs;
                var html = '';
                var $tableBody = $('.cv-addPage .operateRecord-page table tbody');

                if(list.length === 0){
                    $tableBody.html("<div>暂无记录</div>");
                    return;
                }

                //配置表格数据
                for(var i=0;i < list.length;i++){
                    var name = list[i].createUser;
                    var date = list[i].modifyDate;
                    var operateType = list[i].typeName;
                    var remark = list[i].log.remark;

                    html += '<tr><td>'+ name +'</td><td>'+ date +'</td><td>'+ operateType +'</td><td>'+ remark +'</td></tr>'
                }

                $tableBody.html(html);

                var $pagination = $('.cv-addPage .operateRecord-page .pagination');
                var str = '<li class="disabled prev"><a href="javascript:;">上一页</a></li>';
                var pageNum = res.data.totalPage < 6 ? res.data.totalPage : 5;
                for(var j=1;j <= pageNum;j++){
                    str += '<li class="item '+(j==1?'active':'')+'"><a href="javascript:;">'+j+'</a></li>';
                }
                str += '<li class="next '+(res.data.totalPage < 6 ? 'disabled':'')+'"><a href="javascript:;">下一页</a></li>';

                $pagination.html(str);

                //分页点击事件
                $(document).off('click','.cv-addPage .pagination li.item').on('click','.cv-addPage .pagination li.item',function(e){
                    $pagination.find('li.item').removeClass('active');
                    operateRecordLoad(globalData,cv,parseInt($(this).find('a').text()));
                    globalData.operateRecordPageNum = $(this).find('a').text(); //记录激活的项
                    $(this).addClass('active');
                });

                //上一页
                $(document).off('click','.cv-addPage .operateRecord-page .pagination li.prev').on('click','.cv-addPage .operateRecord-page .pagination li.prev',function(e){
                    if($(this).is('.disabled')){return;}

                    var nowLastNum = $(this).next().find('a').text() - 1;//通过前分页状态获取新分页的最后页数
                    $(this).siblings('li.item').remove(); //清空所有项准备重新配置

                    var str = '';
                    for(var j=(nowLastNum - 4);j <= nowLastNum;j++){
                        str += '<li class="item '+ (globalData.operateRecordPageNum == j ? "active":'') +'"><a href="javascript:;">'+j+'</a></li>';
                    }
                    $(this).after(str);

                    $pagination.find('li.next').removeClass('disabled');

                    //前页后页按钮的禁用判断
                    if(nowLastNum == 5){
                        $(this).addClass('disabled');
                    }
                });

                //下一页
                $(document).off('click','.cv-addPage .operateRecord-page .pagination li.next').on('click','.cv-addPage .operateRecord-page .pagination li.next',function(e){
                    if($(this).is('.disabled')){return;}

                    var nowFirstNum = parseInt($(this).prev().find('a').text()) + 1;
                    $(this).siblings('li.item').remove(); //清空所有项准备重新配置

                    //根据是否已经到达总页面判断新分页的数量
                    var pageNums = (nowFirstNum + 4 > res.data.totalPage) ? (res.data.totalPage):(nowFirstNum+4);
                    var str = '';
                    for(var j=nowFirstNum;j <= pageNums;j++){
                        str += '<li class="item '+ (globalData.operateRecordPageNum == j ? "active":'') +'"><a href="javascript:;">'+j+'</a></li>';
                    }
                    $(this).before(str);

                    $pagination.find('li.prev').removeClass('disabled');

                    //前页后页按钮的禁用判断
                    if(nowFirstNum + 4 > res.data.totalPage){
                        $(this).addClass('disabled');
                    }
                });

                //搜索项改变事件
                var $searchItem = $('.cv-addPage .operateRecord-page .search_operateType');
                $searchItem.off('change').on('change',function(e){
                    //console.log($(this).val());
                    operateRecordLoad(globalData,cv,1,true);
                });
            }else{
                console.log('请求返回数据有误!错误码:'+res.message);
            }
        }
    });
}

//分页加载数据(flag表示是否是通过搜索切换框重新加载的页面)
function operateRecordLoad(globalData,cv,pageNum,flag){
    //console.log(pageNum);
    cv._ajax({
        url:'/appcenter/offer/getOprLog.json',
        token:globalData.token,
        data:{
            rencaiId:globalData.resumeId,
            pageNo:pageNum,
            type:$('.cv-addPage .search_operateType').val(),
            pageSize:10
        },
        success:function(res){
            //console.log(res);
            if(res.code == 1){
                var $tableBody = $('.cv-addPage .operateRecord-page table tbody');

                //如果没有数据就显示‘暂无操作！’
                if(res.data.logs.length == 0){
                    //console.log(res.data.logs.length);
                    $tableBody.html('<tr><td colspan="4" style="text-align: center">暂无操作!</td></td>');
                }else{
                    var list = res.data.logs;
                    var html = '';

                    //配置表格数据
                    for(var i=0;i < list.length;i++){
                        var name = list[i].createUser;
                        var date = list[i].modifyDate;
                        var operateType = list[i].typeName;
                        var remark = list[i].log.remark;

                        html += '<tr><td>'+ name +'</td><td>'+ date +'</td><td>'+ operateType +'</td><td>'+ remark +'</td></tr>'
                    }
                    $tableBody.html(html);

                    //如果有切换搜索类型将重新加载分页条
                    if(flag == true){
                        var $pagination = $('.cv-addPage .operateRecord-page .pagination');
                        var str = '<li class="disabled prev"><a href="javascript:;">上一页</a></li>';
                        var pageNum = res.data.totalPage < 6 ? res.data.totalPage : 5;
                        for(var j=1;j <= pageNum;j++){
                            str += '<li class="item '+(j==1?'active':'')+'"><a href="javascript:;">'+j+'</a></li>';
                        }
                        str += '<li class="next '+(res.data.totalPage < 6 ? 'disabled':'')+'"><a href="javascript:;">下一页</a></li>';

                        $pagination.html(str);
                    }
                }
            }else{
                console.log('请求返回数据有误!错误码:'+res.message);
            }
        }
    });
}

//基本信息块配置
function cv_DetailsBaseInfoConfig(globalData,cv,ISelect,$edit_mode,cityPicker){
    //性别单选框事件绑定
    $edit_mode.find('span[name="sex"]').off('click').on('click',function(){
        $('span.radio-select[name="sex"]').removeClass('radio-select');
        $(this).addClass('radio-select');
    });

    //应聘职位配置
    new ISelect({
        type:'job',
        select_id:'cvd_position',
        result_num_type: "single"
    });

    //出生日期日期选择器配置
    var $datetimepicker = $edit_mode.find('[name="birthDate"]');
    $datetimepicker.datetimepicker('remove');
    $datetimepicker.datetimepicker({
        language: 'zh-CN',
        weekStart: 0,
        todayBtn: 0,
        startView: 2,
        minView:2,
        maxView:4,
        autoclose: 1,
        todayHighlight: 1,
        showMeridian: 0,
        format: 'yyyy-mm-dd'
    });

    //首次工作时间选择器配置
    var $datetimepicker1 = $edit_mode.find('.fstWorkDate');
    $datetimepicker1.datetimepicker('remove');
    $datetimepicker1.datetimepicker({
        language: 'zh-CN',
        weekStart: 0,
        todayBtn: 0,
        startView: 2,
        minView:2,
        maxView:4,
        autoclose: 1,
        endDate:new Date(),
        todayHighlight: 1,
        showMeridian: 0,
        format: 'yyyy-mm-dd'
    });
    $datetimepicker1.datetimepicker().on("changeDate", function(ev) {
        //联动工作年限
        var year = ev.date.getFullYear();
        var month = ev.date.getMonth()+1;
        var now = new Date();
        var nowYear = now.getFullYear();
        var nowMonth = now.getMonth()+1;
        var workMonth = 0;
        if(month <= nowMonth){
            workMonth = (nowMonth - month) + (nowYear - year)*12;
        }else{
            workMonth = 12 + nowMonth - month + (nowYear - year - 1)*12;
        }

        //var str = parseInt(workMonth / 12) + '年' + ((parseInt(workMonth % 12) == 0) ? '':(parseInt(workMonth % 12) + '个月'));
        var str = parseInt(workMonth / 12) + '年';
        $('.cvDetails-page .base-info [name="workYear"]').val(str);
        $('.cvDetails-page .base-info [name="workMonth"]').val(workMonth);
    });
    $datetimepicker1.off('click').on('click',function(){
        $datetimepicker1.datetimepicker('show');
    });

    //户籍地址选择器配置
    cityPicker.init({
        picker:'.cvDetails-page .wrap-box.base-info .residentAddress',
        width:190,
        height:30,
        position:'bottom',
        formName:'residentAddress'
    });

    //表单验证配置
    var $form = $('.cv-addPage .cvDetails-page .wrap-box.base-info form.edit-mode');
    $form.validate({
        debug:false,//true可以开启调试模式，将只验证表单而不提交
        //触发表单提交验证通过后将会进入此回调，实际上提交需要通过回调内部的submit提交或者进行异步提交
        submitHandler:function(form){
            //默认必须传type用于区别老接口，简历id
            var data = {resumeId:globalData.resumeId};
            var $eles = $form.find('[name]');
            for(var i = 0;i < $eles.length;i++){
                var $ele = $($eles[i]);
                if($ele.is('input') || $ele.is('textarea') || $ele.is('select')){
                    if($ele.val() != '' && $ele.val() != null && $ele.val() != undefined){
                        if($ele.is('[name="workYear"]')){
                            data[$ele.attr('name')] = $ele.val().slice(0,$ele.val().length - 1);
                        }else if($ele.is('[name="source"]')){
                            data[$ele.attr('name')] = $ele.val();

                            //如果是内推就加上内推人
                            if($ele.val() === '6'){
                                data.recommendName = $('[data-name="relatedUserId"]').find('option:last-child').text();
                                console.log($('[data-name="relatedUserId"]').find('option:last-child').text());
                            }
                        }else{
                            data[$ele.attr('name')] = $ele.val();
                        }
                    }
                }else if($ele.is('.sex.radio-select')){
                    if($ele.val() != '' && $ele.val() != null && $ele.val() != undefined){
                        data['sex'] = $ele.find('.content').text();
                    }
                }else if($ele.is('.position')){
                    if($ele.val() != '' && $ele.val() != null && $ele.val() != undefined){
                        data['position'] = $ele.attr('data-value');
                    }
                }
            }

            //console.log(data);

            //请求数据
            cv._ajax({
                url:'/appcenter/resume/update.json',
                data:data,
                token: globalData.token,
                success:function(res){
                    //console.log(res);
                    if(res.code == 1){
                        var $wrap_box = $('.cv-addPage .cvDetails-page .base-info');
                        var $content_box = $wrap_box.find('.content-box');
                        var $footer = $wrap_box.find('.footer');
                        var $unedit_mode = $content_box.find('.unEdit-mode');
                        var $edit_mode = $content_box.find('.edit-mode');

                        //转移数据到不可编辑区域
                        editMode2unEditMode($unedit_mode,$edit_mode,'base-info');

                        //隐藏编辑区域，显示非编辑区域
                        $unedit_mode.show();
                        $edit_mode.hide();

                        //编辑按钮显示,保存取消操作块隐藏
                        $footer.hide();
                        $wrap_box.find('.edit_link').show();

                        //清空表单元素
                        clearEditMode($wrap_box);
                    }else{
                        console.log('返回数据有误,错误码:' + res.message);
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

    //简历来源配置
    sourceConfigInit(globalData);
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
        async:false,
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
                var $select = $('.cvDetails-page .base-info select[name="source"]');
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
                            $('.cvDetails-page .base-info .customSource').removeClass('hidden');
                            break;
                        case '内推':
                            sourcePushConfigInit(globalData);//选择内推后配置内推人下拉框
                            $('.cvDetails-page .base-info .relatedUserContainer').removeClass('hidden');
                            break;
                    }

                    if(e.params.data.text != '其他自定义来源'){
                        $('.cvDetails-page .base-info .customSource').addClass('hidden');
                    }
                    if(e.params.data.text != '内推'){
                        $('.cvDetails-page .base-info .relatedUserContainer').addClass('hidden');
                        //不是内推的时候将字段置空
                        $('select[data-name="relatedUserId"]').val(null).trigger('change');
                        $('input[name="recommendName"]').val('');
                    }
                });

                //自定义来源确定按钮
                $('.cvDetails-page .base-info .customSource .ensure').off('click').on('click',function(e){
                    var value = $('.customSource input').val().replace(/\s+/g,"");
                    if(value == ''){
                        $('.cvDetails-page .base-info .customSource .customSourceError').css('color','red').text('输入不能为空');
                        setTimeout(function(){
                            $('.cvDetails-page .base-info .customSource .customSourceError').text('');
                        },3000);
                    }else{
                        $select.find('option[value="-1"]:first').before('<option value="-1">' + value + '</option>');
                        $select.val("-1").trigger("change");
                        $('.customSource input').val('');
                        $('.cvDetails-page .base-info .customSource').addClass('hidden');
                    }
                });

                //自定义按钮取消按钮
                $('.cvDetails-page .base-info .customSource .cancel').off('click').on('click',function(e){
                    $('.cvDetails-page .base-info .customSource').addClass('hidden');
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
    var $select = $('.cvDetails-page .base-info select[data-name="relatedUserId"]');
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

                    if(res.data.list === undefined){
                        return {results:[]};
                    }

                    var arr = [];
                    var list = res.data.list;
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
    });
}

//求职意向块配置
function jobIntentionConfig(globalData,cv,$edit_mode,dateTimePicker){
	//期望薪资的输入控制，不能输入字母
	$edit_mode.find('[name="expectedSalary"]').off('input').on('input',function(e){
		var value = $(this).val();
		if(!value.match(/^\d+$/)){
			$(this).val(value.slice(0,value.length-1));
		}
	});

    //最快到岗时间控件配置
    dateTimePicker.dateTimePickerBind({
        datePicker:'.cvDetails-page .job-intention .edit-mode .fastestEnterDate',
        dateInput:'.cvDetails-page .job-intention .edit-mode .fastestEnterDate',
        scrollContainer:'.cv-addPage .left > div'
    });
}

//学历信息块配置
function eduInfoConfig($unedit_mode,$edit_mode){
    //更多信息的添加链接
    $edit_mode.find('.operate-link').off('click').on('click',function(e){
        $(this).before('<div class="inner-box">' +
            '<div><label class="state">学校名称</label><br>' +
            '<input class="content" name="schoolName" type="text" placeholder="请输入"/></div>' +
            '<div><label class="state">就读时间</label><br>' +
            '<input class="content" name="enterDate" type="text" placeholder="请选择开始时间" readonly/>&nbsp;——&nbsp;' +
            '<input class="content" name="graduateDate" type="text" placeholder="请选择结束时间" readonly/></div><br><div><label class="state">所学专业</label><br>' +
            '<input class="content" name="major" type="text" placeholder="请输入"/></div>' +
            '<div><label class="state">学历</label><br>' +
            '<input class="content" name="degree" type="text" placeholder="请输入"/></div><div>' +
            '<label class="state">是否统招</label><br><select class="content" name="isFullTime">' +
            '<option value="1">是</option><option value="0">否</option></select></div>' +
            '<a class="del" href="javascript:;">删除</a></div>');

        //开始结束时间控件配置
        var $start = $(this).prev().find('[name="enterDate"]');
        $start.datetimepicker({
            language: 'zh-CN',
            weekStart: 0,
            todayBtn: 0,
            startView: 3,
            minView:3,
            maxView:4,
            autoclose: 1,
            todayHighlight: 1,
            showMeridian: 0,
            format: 'yyyy-mm'
        });
        $start.off('click').on('click',function(e){
            $start.datetimepicker('show');
        });

        var $end = $(this).prev().find('[name="graduateDate"]');
        $end.datetimepicker({
            language: 'zh-CN',
            weekStart: 0,
            todayBtn: 0,
            startView: 3,
            minView:3,
            maxView:4,
            autoclose: 1,
            todayHighlight: 1,
            showMeridian: 0,
            format: 'yyyy-mm'
        });
        $end.off('click').on('click',function(e){
            $end.datetimepicker('show');
        });
    });

    //删除
    var delLink = '.cv-addPage .cvDetails-page .edu-info .edit-mode .del';
    $(document).off('click',delLink).on('click',delLink,function(){
        $(this).parent().remove();
        checkEditItemNum($edit_mode);
    });
}

//工作经历配置
function workExpConfig($unedit_mode,$edit_mode){
    //更多信息的添加链接
    $edit_mode.find('.operate-link').off('click').on('click',function(e){
        $(this).before('<div class="inner-box"><div><label class="state">担任职位</label><br>' +
            '<input class="content" name="positionName" type="text" placeholder="请输入"/></div><div>' +
            '<label class="state">任职开始时间</label><br><input class="content" name="beginDate" type="text" placeholder="请选择开始时间" readonly/>' +
            '</div><div><label class="state">任职结束时间</label><br><input class="content" name="endDate" type="text" placeholder="请选择结束时间" readonly/>' +
            '</div><br><div><label class="state">公司名称</label><br><input class="content" name="companyName" type="text" placeholder="请输入"/>' +
            '</div><div><label class="state">工作地点</label><br><input class="content" name="workingLocation" type="text" placeholder="请输入"/>' +
            '</div><div><label class="state">所属行业</label><br><input class="content" name="tradesDesc" type="text" placeholder="请输入"/>' +
            '</div><br><div><label class="state">公司性质</label><br><input class="content" name="companyType" type="text" placeholder="请输入"/>' +
            '</div><div><label class="state">公司规模(人)</label><br><input class="content" name="companyLevel" type="text" placeholder="请输入"/>' +
            '</div><div><label class="state">薪资水平(元)</label><br><input class="content" name="salary" type="text" placeholder="请输入"/>' +
            '</div><br><div><label class="state">所在部门</label><br><input class="content" name="department" type="text" placeholder="请输入"/>' +
            '</div><div><label class="state">汇报对象</label><br><input class="content" name="leader" type="text" placeholder="请输入"/>' +
            '</div><div><label class="state">下属人数(人)</label><br><input class="content" name="subordinateCount" type="text" placeholder="请输入"/>' +
            '</div><br><div><label class="state">工作描述</label><br><textarea class="content" name="jobDesc" placeholder="请输入"></textarea>' +
            '</div><a class="del" href="javascript:;">删除</a></div>');

        //控制数字类输入的数字控制
        $edit_mode.find('[name="companyLevel"]').off('input').on('input',function(){
            var value = $(this).val();
            if(!value.match(/^\d+$/)){
                $(this).val(value.slice(0,value.length - 1));
            }
        });

        $edit_mode.find('[name="salary"]').off('input').on('input',function(){
            var value = $(this).val();
            if(!value.match(/^\d+$/)){
                $(this).val(value.slice(0,value.length - 1));
            }
        });

        $edit_mode.find('[name="subordinateCount"]').off('input').on('input',function(){
            var value = $(this).val();
            if(!value.match(/^\d+$/)){
                $(this).val(value.slice(0,value.length - 1));
            }
        });

        //开始结束时间控件配置
        var $start = $edit_mode.find('[name="beginDate"]');
        $start.datetimepicker({
            language: 'zh-CN',
            weekStart: 0,
            todayBtn: 0,
            startView: 3,
            minView:3,
            maxView:4,
            autoclose: 1,
            todayHighlight: 1,
            showMeridian: 0,
            format: 'yyyy-mm'
        });
        $start.off('click').on('click',function(e){
            $start.datetimepicker('show');
        });

        var $end = $edit_mode.find('[name="endDate"]');
        $end.datetimepicker({
            language: 'zh-CN',
            weekStart: 0,
            todayBtn: 0,
            startView: 3,
            minView:3,
            maxView:4,
            autoclose: 1,
            todayHighlight: 1,
            showMeridian: 0,
            format: 'yyyy-mm'
        });
        $end.off('click').on('click',function(e){
            $end.datetimepicker('show');
        });
    });

    //删除
    var delLink = '.cv-addPage .cvDetails-page .work-experience .edit-mode .del';
    $(document).off('click',delLink).on('click',delLink,function(){
        $(this).parent().remove();
        checkEditItemNum($edit_mode);
    });
}

//语言能力块的配置
function langSkillConfig($unedit_mode,$edit_mode){
    //更多信息的添加链接
    $edit_mode.find('.operate-link').off('click').on('click',function(e){
        $(this).before('<div class="inner-box"><div><label class="state">所学语言</label><br>' +
            '<input class="content" name="languageName" type="text" placeholder="请输入"/></div><div>' +
            '<label class="state">熟练程度</label><br><select class="content" name="proficiency">' +
            '<option value="良好">良好</option><option value="熟练">熟练</option></select></div><a class="del" href="javascript:;">删除</a>' +
            '</div>');
    });

    //删除
    var delLink = '.cv-addPage .cvDetails-page .language-skill .edit-mode .del';
    $(document).off('click',delLink).on('click',delLink,function(){
        $(this).parent().remove();
        checkEditItemNum($edit_mode);
    });
}

//资历证书块的配置
function credentialsConfig($unedit_mode,$edit_mode){
    //更多信息的添加链接
    $edit_mode.find('.operate-link').off('click').on('click',function(e){
        $(this).before('<div class="inner-box"><div><label class="state">证书名称</label><br>' +
            '<input class="content" name="certificateName" type="text" placeholder="请输入"/></div><div>' +
            '<label class="state">获得日期</label><br><input class="content" name="achieveDate" type="text" placeholder="请选择" readonly/>' +
            '</div><a class="del" href="javascript:;">删除</a></div>');

        //时间选择配置
        var $datePicker = $(this).prev().find('[name="achieveDate"]');
        $datePicker.datetimepicker({
            language: 'zh-CN',
            weekStart: 0,
            todayBtn: 0,
            startView: 2,
            minView:2,
            maxView:4,
            autoclose: 1,
            todayHighlight: 1,
            showMeridian: 0,
            format: 'yyyy-mm-dd'
        });
        $datePicker.off('click').on('click',function(e){
            $datePicker.datetimepicker('show');
        });
    });

    //删除
    var delLink = '.cv-addPage .cvDetails-page .credentials .edit-mode .del';
    $(document).off('click',delLink).on('click',delLink,function(){
        $(this).parent().remove();
        checkEditItemNum($edit_mode);
    });
}

//项目经历配置
function proExpConfig($unedit_mode,$edit_mode){
    //更多信息的添加链接
    $edit_mode.find('.operate-link').off('click').on('click',function(e){
        $(this).before('<div class="inner-box"><div><label class="state">项目名称</label><br>' +
            '<input class="content" name="projectName" type="text" placeholder="请输入"/></div><div>' +
            '<label class="state">开始时间</label><br><input class="content" name="beginDate" type="text" placeholder="请选择开始时间" readonly/>' +
            '</div><div><label class="state">结束时间</label><br><input class="content" name="endDate" type="text" placeholder="请选择开始时间" readonly/>' +
            '</div><br><div><label class="state">项目职务</label><br><input class="content" name="duty" type="text" placeholder="请输入"/>' +
            '</div><div><label class="state">工作描述</label><br><textarea class="content" name="projectDesc" type="text" placeholder="请输入"></textarea>' +
            '</div><a class="del" href="javascript:;">删除</a></div>');

        //时间选择配置
        var $start = $(this).prev().find('[name="beginDate"]');
        $start.datetimepicker({
            language: 'zh-CN',
            weekStart: 0,
            todayBtn: 0,
            startView: 3,
            minView:3,
            maxView:4,
            autoclose: 1,
            todayHighlight: 1,
            showMeridian: 0,
            format: 'yyyy-mm'
        });
        $start.off('click').on('click',function(e){
            $start.datetimepicker('show');
        });

        var $end = $(this).prev().find('[name="endDate"]');
        $end.datetimepicker({
            language: 'zh-CN',
            weekStart: 0,
            todayBtn: 0,
            startView: 3,
            minView:3,
            maxView:4,
            autoclose: 1,
            todayHighlight: 1,
            showMeridian: 0,
            format: 'yyyy-mm'
        });
        $end.off('click').on('click',function(e){
            $end.datetimepicker('show');
        });
    });

    //删除
    var delLink = '.cv-addPage .cvDetails-page .pro-exp .edit-mode .del';
    $(document).off('click',delLink).on('click',delLink,function(){
        $(this).parent().remove();
        checkEditItemNum($edit_mode);
    });
}

//培训经历块的配置
function trainExpConfig($unedit_mode,$edit_mode){
    //更多信息的添加链接
    $edit_mode.find('.operate-link').off('click').on('click',function(e){
        $(this).before('<div class="inner-box"><div><label class="state">培训机构</label><br>' +
            '<input class="content" name="orgName" type="text" placeholder="请输入"/></div><div>' +
            '<label class="state">开始时间</label><br><input class="content" name="beginDate" type="text" placeholder="请选择开始时间" readonly/>' +
            '</div><div><label class="state">结束时间</label><br><input class="content" name="endDate" type="text" placeholder="请选择开始时间" readonly/>' +
            '</div><br><div><label class="state">培训课程</label><br><input class="content" name="course" type="text" placeholder="请输入"/>' +
            '</div><div><label class="state">所获证书</label><br><input class="content" name="certificate" type="text" placeholder="请输入"/>' +
            '</div><br><div><label class="state">工作描述</label><br><textarea class="content" name="trainingDesc" type="text" placeholder="请输入"></textarea>' +
            '</div><a class="del" href="javascript:;">删除</a></div>');

        //时间选择配置
        var $start = $(this).prev().find('[name="beginDate"]');
        $start.datetimepicker({
            language: 'zh-CN',
            weekStart: 0,
            todayBtn: 0,
            startView: 3,
            minView:3,
            maxView:4,
            autoclose: 1,
            todayHighlight: 1,
            showMeridian: 0,
            format: 'yyyy-mm'
        });
        $start.off('click').on('click',function(e){
            $start.datetimepicker('show');
        });

        var $end = $(this).prev().find('[name="endDate"]');
        $end.datetimepicker({
            language: 'zh-CN',
            weekStart: 0,
            todayBtn: 0,
            startView: 3,
            minView:3,
            maxView:4,
            autoclose: 1,
            todayHighlight: 1,
            showMeridian: 0,
            format: 'yyyy-mm'
        });
        $end.off('click').on('click',function(e){
            $end.datetimepicker('show');
        });
    });

    //删除
    var delLink = '.cv-addPage .cvDetails-page .train-exp .edit-mode .del';
    $(document).off('click',delLink).on('click',delLink,function(){
        $(this).parent().remove();
        checkEditItemNum($edit_mode);
    });
}

//自我评价块的配置
function selfAssessmentConfig($unedit_mode,$edit_mode){
    //删除
    var delLink = '.cv-addPage .cvDetails-page .self-assessment .edit-mode .del';
    $(document).off('click',delLink).on('click',delLink,function(){
        $(this).closest('.wrap-box').hide();
        $('.self-assessment-link').css('display','inline-block');
    });
}

//技能专长块配置
function empSkillConfig($unedit_mode,$edit_mode){
    //添加
    $edit_mode.find('.operate-link').off('click').on('click',function(e){
        var $innerBox = $edit_mode.find('.inner-box');
        $innerBox.append('<div class="content item"><span contenteditable="true"></span>&nbsp;&nbsp;' +
            '<span class="del">&times;</span></div>');

        $innerBox.find('.item:last-child [contenteditable="true"]').trigger('focus');
    });

    //修改
    var itemStr = '.cv-addPage .cvDetails-page .employee-skill .edit-mode .item [contenteditable="true"]';
    $(document).off('blur',itemStr).on('blur',itemStr,function(e){
        if($(this).text().replace(/\s+/g,'') === ''){
            $(this).parent().remove();
        }
    });

    //删除
    var delLink = '.cv-addPage .cvDetails-page .employee-skill .edit-mode .del';
    $(document).off('click',delLink).on('click',delLink,function(){
        $(this).parent().remove();
        checkEditItemNum($edit_mode);
    });
}

//检测编辑块项目数没有的时候自动隐藏对应块并显示拓展块链接，
function checkEditItemNum($editBox){
    var $wrap = $editBox.closest('.wrap-box');

    //根据不同的外部容器判断编辑项个数
    if($wrap.is('.employee-skill')){
        var $items = $editBox.find('.inner-box .item');
        if($items.length === 0){
            $('.cvDetails-page .employee-skill').hide();
            $('.cvDetails-page .employee-skill-link').css('display','inline-block');
            setNullKey('employeeSkill');
        }
    }else if($wrap.is('.train-exp')){
        var $items = $editBox.find('.inner-box');
        if($items.length === 0){
            $('.cvDetails-page .train-exp').hide();
            $('.cvDetails-page .train-exp-link').css('display','inline-block');
            setNullKey('trainExperience');
        }
    }else if($wrap.is('.pro-exp')){
        var $items = $editBox.find('.inner-box');
        if($items.length === 0){
            $('.cvDetails-page .pro-exp').hide();
            $('.cvDetails-page .pro-exp-link').css('display','inline-block');
            setNullKey('projectExperience');
        }
    }else if($wrap.is('.credentials')){
        var $items = $editBox.find('.inner-box');
        if($items.length === 0){
            $('.cvDetails-page .credentials').hide();
            $('.cvDetails-page .credentials-link').css('display','inline-block');
            setNullKey('credentials');
        }
    }else if($wrap.is('.language-skill')){
        var $items = $editBox.find('.inner-box');
        if($items.length === 0){
            $('.cvDetails-page .language-skill').hide();
            $('.cvDetails-page .language-skill-link').css('display','inline-block');
            setNullKey('languageSkill');
        }
    }else if($wrap.is('.work-experience')){
        var $items = $editBox.find('.inner-box');
        if($items.length === 0){
            $('.cvDetails-page .work-experience').hide();
            $('.cvDetails-page .work-experience-link').css('display','inline-block');
            setNullKey('workExperience');
        }
    }else if($wrap.is('.edu-info')){
        var $items = $editBox.find('.inner-box');
        if($items.length === 0){
            $('.cvDetails-page .edu-info').hide();
            $('.cvDetails-page .edu-info-link').css('display','inline-block');
            setNullKey('educationInfo');
        }
    }
}

//置空属性
function setNullKey(key){
    var data = null;

    switch(key){
        case 'educationInfo':
            data = {resumeId:global_obj.data.resumeId,educationInfo:''};
            break;
        case 'workExperience':
            data = {resumeId:global_obj.data.resumeId,workExperience:''};
            break;
        case 'languageSkill':
            data = {resumeId:global_obj.data.resumeId,languageSkill:''};
            break;
        case 'credentials':
            data = {resumeId:global_obj.data.resumeId,credentials:''};
            break;
        case 'projectExperience':
            data = {resumeId:global_obj.data.resumeId,projectExperience:''};
            break;
        case 'trainExperience':
            data = {resumeId:global_obj.data.resumeId,trainExperience:''};
            break;
        case 'employeeSkill':
            data = {resumeId:global_obj.data.resumeId,employeeSkill:''};
            break;
    }

    global_obj.cv._ajax({
        url:'/appcenter/resume/update.json',
        data: data,
        token:global_obj.data.token,
        success:function(res){
            //console.log(res);
            if(res.code === "1" || res.code === 1){
                console.log('置空成功',res);
            }
        }
    });
}

//简历详情页面的初始化
function cvDetailsPageInit(globalData,cv,ISelect,dateTimePicker,cityPicker){
    //简历详情中的删除简历
    $('.cv-addPage .cvDetails-page > div:first-child .del').off('click').on('click',function(){
        //相对页面跳转
        location.href = './offerList.html?token=' + globalData.token;
    });

    //编辑简历信息
    $('.cv-addPage .cvDetails-page .wrap-box .edit_link').off('click').on('click',function(e){
        var $wrap_box = $(this).closest('.wrap-box');
        var $content_box = $wrap_box.find('.content-box');
        var $footer = $wrap_box.find('.footer');
        var $unedit_mode = $content_box.find('.unEdit-mode');
        var $edit_mode = $content_box.find('.edit-mode');

        //根据不同的信息块执行不同操作
        if($wrap_box.is('.base-info')){
            //简历基本信息功能配置初始化
            cv_DetailsBaseInfoConfig(globalData,cv,ISelect,$edit_mode,cityPicker);

            //根据对应的非编辑状态数据填充到编辑状态中对应的位置
            unEditMode2editMode($unedit_mode,$edit_mode,'base-info');
        }else if($wrap_box.is('.job-intention')){
        	jobIntentionConfig(globalData,cv,$edit_mode,dateTimePicker);

            //根据对应的非编辑状态数据填充到编辑状态中对应的位置
            unEditMode2editMode($unedit_mode,$edit_mode,'job-intention');
        }else if($wrap_box.is('.edu-info')){
            eduInfoConfig($unedit_mode,$edit_mode);
            unEditMode2editMode($unedit_mode,$edit_mode,'edu-info');
        }else if($wrap_box.is('.work-experience')){
            workExpConfig($unedit_mode,$edit_mode);
            unEditMode2editMode($unedit_mode,$edit_mode,'work-experience');
        }else if($wrap_box.is('.language-skill')){
            langSkillConfig($unedit_mode,$edit_mode);
            unEditMode2editMode($unedit_mode,$edit_mode,'language-skill');
        }else if($wrap_box.is('.employee-skill')){
            empSkillConfig($unedit_mode,$edit_mode);
            unEditMode2editMode($unedit_mode,$edit_mode,'employee-skill');
        }else if($wrap_box.is('.credentials')){
            credentialsConfig($unedit_mode,$edit_mode);
            unEditMode2editMode($unedit_mode,$edit_mode,'credentials');
        }else if($wrap_box.is('.pro-exp')){
            proExpConfig($unedit_mode,$edit_mode);
            unEditMode2editMode($unedit_mode,$edit_mode,'pro-exp');
        }else if($wrap_box.is('.train-exp')){
            trainExpConfig($unedit_mode,$edit_mode);
            unEditMode2editMode($unedit_mode,$edit_mode,'train-exp');
        }else if($wrap_box.is('.self-assessment')){
            selfAssessmentConfig($unedit_mode,$edit_mode);
            unEditMode2editMode($unedit_mode,$edit_mode,'self-assessment');
        }

        //隐藏非编辑区域，显示编辑区域
        $unedit_mode.hide();
        $edit_mode.show();

        //编辑按钮隐藏,保存取消操作块展示出来
        $(this).hide();
        $footer.show();
    });

    //取消编辑
    $('.cv-addPage .cvDetails-page .wrap-box .footer .cancel').off('click').on('click',function(e){
        //显示编辑按钮，隐藏编辑操作按钮，显示展示块，隐藏编辑块,清空所有内容
        var $wrap = $(this).closest('.wrap-box');
        var $editBox = $wrap.find('.edit-mode');
        $(this).parent().hide();
        $wrap.find('.edit_link').show();
        $wrap.find('.unEdit-mode').show();
        $editBox.hide();

        //清空表单元素
        clearEditMode($wrap);

        //控制点击取消的时候的编辑块是否入口从展开链接进入的

        if($wrap.is('.job-intention')){
            if(globalData.editEntrance.jobIntention === 1){
                $(this).closest('.wrap-box').hide();
                $('.job-intention-link').css('display','inline-block');
                globalData.editEntrance.jobIntention = 0;
            }
        }else if($wrap.is('.edu-info')){
            if(globalData.editEntrance.eduInfo === 1){
                $(this).closest('.wrap-box').hide();
                $('.edu-info-link').css('display','inline-block');
                globalData.editEntrance.eduInfo = 0;
            }
        }else if($wrap.is('.work-experience')){
            if(globalData.editEntrance.workExperience === 1){
                $(this).closest('.wrap-box').hide();
                $('.work-experience-link').css('display','inline-block');
                globalData.editEntrance.workExperience = 0;
            }
        }else if($wrap.is('.employee-skill')){
            if(globalData.editEntrance.employeeSkill === 1){
                $(this).closest('.wrap-box').hide();
                $('.employee-skill-link').css('display','inline-block');
                globalData.editEntrance.employeeSkill = 0;
            }
        }else if($wrap.is('.language-skill')){
            if(globalData.editEntrance.languageSkill === 1){
                $(this).closest('.wrap-box').hide();
                $('.language-skill-link').css('display','inline-block');
                globalData.editEntrance.languageSkill = 0;
            }
        }else if($wrap.is('.credentials')){
            if(globalData.editEntrance.credentials === 1){
                $(this).closest('.wrap-box').hide();
                $('.credentials-link').css('display','inline-block');
                globalData.editEntrance.credentials = 0;
            }
        }else if($wrap.is('.pro-exp')){
            if(globalData.editEntrance.proExp === 1){
                $(this).closest('.wrap-box').hide();
                $('.pro-exp-link').css('display','inline-block');
                globalData.editEntrance.proExp = 0;
            }
        }else if($wrap.is('.train-exp')){
            if(globalData.editEntrance.trainExp === 1){
                $(this).closest('.wrap-box').hide();
                $('.train-exp-link').css('display','inline-block');
                globalData.editEntrance.trainExp = 0;
            }
        }else if($wrap.is('.self-assessment')){
            if(globalData.editEntrance.selfAssessment === 1){
                $(this).closest('.wrap-box').hide();
                $('.self-assessment-link').css('display','inline-block');
                globalData.editEntrance.selfAssessment = 0;
            }
        }
    });

    //保存编辑
    $('.cv-addPage .cvDetails-page .wrap-box .footer .save').off('click').on('click',function(e){
        //将编辑框中的输入内容移植到展示框中对应字段,进行ajax请求对简历信息进行保存
        var $wrap_box = $(this).closest('.wrap-box');
        var $content_box = $wrap_box.find('.content-box');
        var $footer = $wrap_box.find('.footer');
        var $unedit_mode = $content_box.find('.unEdit-mode');
        var $edit_mode = $content_box.find('.edit-mode');

        //根据不同内容块做不同处理
        if($wrap_box.is('.base-info')){
            var $form = $('.cv-addPage .cvDetails-page .base-info form.edit-mode');
            $form.submit();
        }else{
            if($wrap_box.is('.job-intention')){
                var data = {resumeId:globalData.resumeId};

                var intention = {};

                var $eles = $wrap_box.find('.edit-mode [name]');
                for(var i = 0;i < $eles.length;i++){
                    var $ele = $($eles[i]);
                    if($ele.is('input') || $ele.is('textarea') || $ele.is('select')){
                        intention[$ele.attr('name')] = $ele.val();
                    }
                }
                data.intention = JSON.stringify(intention);

                //console.log(data);

                //请求数据
                cv._ajax({
                    url:'/appcenter/resume/update.json',
                    data:data,
                    token: globalData.token,
                    success:function(res){
                        if(res.code == 1){
                            console.log('求职意向请求成功',res);
                        }else{
                            console.log('返回数据有误,错误码:' + res.message);
                        }
                    }
                });

                editMode2unEditMode($unedit_mode,$edit_mode,'job-intention');

                globalData.editEntrance.jobIntention = 0;
            }else if($wrap_box.is('.edu-info')){
                var data = {resumeId:globalData.resumeId};
                var educationInfo = [];
                var $boxs = $edit_mode.find('.inner-box');
                for(var i = 0;i < $boxs.length;i++){
                    //对每一块中的信息块进行数据转移
                    var $editEles = $($boxs[i]).find('[name]');
                    var obj = {};

                    for(var j = 0;j < $editEles.length;j++){
                        var $eele = $($editEles[j]);
                        if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                            obj[$eele.attr('name')] = $eele.val();
                        }
                    }

                    educationInfo.push(obj);
                }

                data.educationInfo = JSON.stringify(educationInfo);

                //console.log(data);

                //请求数据
                cv._ajax({
                    url:'/appcenter/resume/update.json',
                    data:data,
                    token: globalData.token,
                    success:function(res){
                        //console.log(res);
                        if(res.code == 1){

                        }else{
                            console.log('返回数据有误,错误码:' + res.message);
                        }
                    }
                });

                editMode2unEditMode($unedit_mode,$edit_mode,'edu-info');

                globalData.editEntrance.eduInfo = 0;
            }else if($wrap_box.is('.work-experience')){
                var data = {resumeId:globalData.resumeId};
                var workExperience = [];
                var $boxs = $edit_mode.find('.inner-box');
                for(var i = 0;i < $boxs.length;i++){
                    //对每一块中的信息块进行数据转移
                    var $editEles = $($boxs[i]).find('[name]');
                    var obj = {};

                    for(var j = 0;j < $editEles.length;j++){
                        var $eele = $($editEles[j]);
                        if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                            obj[$eele.attr('name')] = $eele.val();
                        }
                    }

                    workExperience.push(obj);
                }

                data.workExperience = JSON.stringify(workExperience);

                console.log(data);

                //请求数据
                cv._ajax({
                    url:'/appcenter/resume/update.json',
                    data:data,
                    token: globalData.token,
                    success:function(res){
                        //console.log(res);
                        if(res.code == 1){
                            console.log('工作经历保存成功',res);
                        }else{
                            console.log('返回数据有误,错误码:' + res.message);
                        }
                    }
                });

                editMode2unEditMode($unedit_mode,$edit_mode,'work-experience');

                globalData.editEntrance.workExperience = 0;
            }else if($wrap_box.is('.language-skill')){
                var data = {resumeId:globalData.resumeId};
                var languageSkill = [];
                var $boxs = $edit_mode.find('.inner-box');
                for(var i = 0;i < $boxs.length;i++){
                    //对每一块中的信息块进行数据转移
                    var $editEles = $($boxs[i]).find('[name]');
                    var obj = {};

                    for(var j = 0;j < $editEles.length;j++){
                        var $eele = $($editEles[j]);
                        if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                            obj[$eele.attr('name')] = $eele.val();
                        }
                    }

                    languageSkill.push(obj);
                }

                data.languageSkill = JSON.stringify(languageSkill);

                //console.log(data);

                //请求数据
                cv._ajax({
                    url:'/appcenter/resume/update.json',
                    data:data,
                    token: globalData.token,
                    success:function(res){
                        //console.log(res);
                        if(res.code == 1){

                        }else{
                            console.log('返回数据有误,错误码:' + res.message);
                        }
                    }
                });

                editMode2unEditMode($unedit_mode,$edit_mode,'language-skill');

                globalData.editEntrance.languageSkill = 0;
            }else if($wrap_box.is('.credentials')){
                var data = {resumeId:globalData.resumeId};
                var credentials = [];
                var $boxs = $edit_mode.find('.inner-box');
                for(var i = 0;i < $boxs.length;i++){
                    //对每一块中的信息块进行数据转移
                    var $editEles = $($boxs[i]).find('[name]');
                    var obj = {};

                    for(var j = 0;j < $editEles.length;j++){
                        var $eele = $($editEles[j]);
                        if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                            obj[$eele.attr('name')] = $eele.val();
                        }
                    }

                    credentials.push(obj);
                }

                data.credentials = JSON.stringify(credentials);

                //console.log(data);

                //请求数据
                cv._ajax({
                    url:'/appcenter/resume/update.json',
                    data:data,
                    token: globalData.token,
                    success:function(res){
                        //console.log(res);
                        if(res.code == 1){

                        }else{
                            console.log('返回数据有误,错误码:' + res.message);
                        }
                    }
                });

                editMode2unEditMode($unedit_mode,$edit_mode,'credentials');

                globalData.editEntrance.credentials = 0;
            }else if($wrap_box.is('.pro-exp')){
                var data = {resumeId:globalData.resumeId};
                var projectExperience = [];
                var $boxs = $edit_mode.find('.inner-box');
                for(var i = 0;i < $boxs.length;i++){
                    //对每一块中的信息块进行数据转移
                    var $editEles = $($boxs[i]).find('[name]');
                    var obj = {};

                    for(var j = 0;j < $editEles.length;j++){
                        var $eele = $($editEles[j]);
                        if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                            obj[$eele.attr('name')] = $eele.val();
                        }
                    }

                    projectExperience.push(obj);
                }

                data.projectExperience = JSON.stringify(projectExperience);

                //console.log(data);

                //请求数据
                cv._ajax({
                    url:'/appcenter/resume/update.json',
                    data:data,
                    token: globalData.token,
                    success:function(res){
                        //console.log(res);
                        if(res.code == 1){

                        }else{
                            console.log('返回数据有误,错误码:' + res.message);
                        }
                    }
                });

                editMode2unEditMode($unedit_mode,$edit_mode,'pro-exp');

                globalData.editEntrance.proExp = 0;
            }else if($wrap_box.is('.train-exp')){
                var data = {resumeId:globalData.resumeId};
                var trainExperience = [];
                var $boxs = $edit_mode.find('.inner-box');
                for(var i = 0;i < $boxs.length;i++){
                    //对每一块中的信息块进行数据转移
                    var $editEles = $($boxs[i]).find('[name]');
                    var obj = {};

                    for(var j = 0;j < $editEles.length;j++){
                        var $eele = $($editEles[j]);
                        if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                            obj[$eele.attr('name')] = $eele.val();
                        }
                    }

                    trainExperience.push(obj);
                }

                data.trainExperience = JSON.stringify(trainExperience);

                //console.log(data);

                //请求数据
                cv._ajax({
                    url:'/appcenter/resume/update.json',
                    data:data,
                    token: globalData.token,
                    success:function(res){
                        //console.log(res);
                        if(res.code == 1){

                        }else{
                            console.log('返回数据有误,错误码:' + res.message);
                        }
                    }
                });

                editMode2unEditMode($unedit_mode,$edit_mode,'train-exp');

                globalData.editEntrance.trainExp = 0;
            }else if($wrap_box.is('.employee-skill')){
                var data = {resumeId:globalData.resumeId};
                var employeeSkill = [];
                var $eles = $edit_mode.find('.inner-box .item');
                for(var i = 0;i < $eles.length;i++){
                    var value = $($eles[i]).find('[contenteditable="true"]').text();
                    if(value !== ''){
                        employeeSkill.push(value);
                    }
                }
                data.employeeSkill = employeeSkill.join(',');

                //console.log(data);

                //请求数据
                cv._ajax({
                    url:'/appcenter/resume/update.json',
                    data:data,
                    token: globalData.token,
                    success:function(res){
                        //console.log(res);
                        if(res.code == 1){
                            editMode2unEditMode($unedit_mode,$edit_mode,'employee-skill');
                            globalData.editEntrance.employeeSkill = 0;
                        }else{
                            console.log('返回数据有误,错误码:' + res.message);
                        }
                    }
                });
            }else if($wrap_box.is('.self-assessment')){
                var data = {
                    resumeId:globalData.resumeId,
                    selfAssessment:$edit_mode.find('[name="selfAssessment"]').val()
                };

                //console.log(data);

                //请求数据
                cv._ajax({
                    url:'/appcenter/resume/update.json',
                    data:data,
                    token: globalData.token,
                    success:function(res){
                        //console.log(res);
                        if(res.code == 1){

                        }else{
                            console.log('返回数据有误,错误码:' + res.message);
                        }
                    }
                });

                editMode2unEditMode($unedit_mode,$edit_mode,'self-assessment');

                globalData.editEntrance.selfAssessment = 0;
            }

            //隐藏编辑区域，显示非编辑区域
            $unedit_mode.show();
            $edit_mode.hide();

            //编辑按钮显示,保存取消操作块隐藏
            $footer.hide();
            $wrap_box.find('.edit_link').show();

            //清空表单元素
            clearEditMode($wrap_box);
        }
    });
}

//清空可编辑区域表单元素的处理
function clearEditMode($wrap) {
    //根据不同信息块做不同的清空处理
    if($wrap.is('.base-info')){
        var $formEles = $wrap.find('.edit-mode [name]');
        for(var i=0;i < $formEles.length;i++){
            var $ele = $($formEles[i]);
            if($ele.is('input') || $ele.is('textarea')){
                $ele.val('');
            }
        }
    }
}

//将非编辑数据转到可编辑数据
function unEditMode2editMode($unedit_mode,$edit_mode,wrapStyle){
    switch(wrapStyle){
        case 'employee-skill':
            var $items = $unedit_mode.find('ul .item');
            $edit_mode.find('.inner-box .item').remove();
            for(var i = 0;i < $items.length;i++){
                var value = $($items[i]).text();
                if(value !== ''){
                    $edit_mode.find('.inner-box').append('<div class="content item"><span contenteditable="true">' + value + '</span>&nbsp;&nbsp;' +
                    '<span class="del">&times;</span></div>');
                }
            }

            break;
        case 'self-assessment':
            var $uele = $unedit_mode.find('[name="selfAssessment"]');
            var $ele = $edit_mode.find('[name="selfAssessment"]');
            var value = $uele.text();
            $ele.val(value == '暂无' ? '' : value);

            break;
        case 'train-exp':
            $edit_mode.find('.inner-box').remove();

            //因为此处内部可以添加多个信息块，所以需要先判断有多少块
            var $boxs = $unedit_mode.find('.inner-box');
            for(var i = 0;i < $boxs.length;i++){
                //对每一块中的信息块进行数据转移
                var $unEditEles = $($boxs[i]).find('[name]');
                //每发现一个信息块就模拟点击一次添加链接
                $edit_mode.find('.operate-link').trigger('click');
                var $info_box = $edit_mode.find('.operate-link').prev();
                for(var j = 0;j < $unEditEles.length;j++){
                    var $uele = $($unEditEles[j]);
                    var $eele = $info_box.find('[name="'+$uele.attr('name')+'"]');
                    if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                        if($eele.is('[name="beginDate"]') || $eele.is('[name="endDate"]')){
                            var value = $uele.text();
                            $eele.val(value == '暂无' ? '':value.replace('/','-'));
                        }else{
                            $eele.val($uele.text() == '暂无' ? '' : $uele.text());
                        }
                    }
                }
            }

            break;
        case 'pro-exp':
            $edit_mode.find('.inner-box').remove();

            //因为此处内部可以添加多个信息块，所以需要先判断有多少块
            var $boxs = $unedit_mode.find('.inner-box');
            for(var i = 0;i < $boxs.length;i++){
                //对每一块中的信息块进行数据转移
                var $unEditEles = $($boxs[i]).find('[name]');
                //每发现一个信息块就模拟点击一次添加链接
                $edit_mode.find('.operate-link').trigger('click');
                var $info_box = $edit_mode.find('.operate-link').prev();
                for(var j = 0;j < $unEditEles.length;j++){
                    var $uele = $($unEditEles[j]);
                    var $eele = $info_box.find('[name="'+$uele.attr('name')+'"]');
                    if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                        if($eele.is('[name="beginDate"]') || $eele.is('[name="endDate"]')){
                            var value = $uele.text();
                            $eele.val(value == '暂无' ? '':value.replace('/','-'));
                        }else{
                            $eele.val($uele.text() == '暂无' ? '' : $uele.text());
                        }
                    }
                }
            }

            break;
        case 'credentials':
            $edit_mode.find('.inner-box').remove();

            //因为此处内部可以添加多个信息块，所以需要先判断有多少块
            var $boxs = $unedit_mode.find('ul li');
            for(var i = 0;i < $boxs.length;i++){
                //对每一块中的信息块进行数据转移
                var $unEditEles = $($boxs[i]).find('[name]');
                //每发现一个信息块就模拟点击一次添加链接
                $edit_mode.find('.operate-link').trigger('click');
                var $info_box = $edit_mode.find('.operate-link').prev();
                for(var j = 0;j < $unEditEles.length;j++){
                    var $uele = $($unEditEles[j]);
                    var $eele = $info_box.find('[name="'+$uele.attr('name')+'"]');
                    if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                        var value = $uele.text();
                        $eele.val(value === '暂无' ? "" : value);
                    }
                }
            }

            break;
        case 'language-skill':
            $edit_mode.find('.inner-box').remove();

            //因为此处内部可以添加多个信息块，所以需要先判断有多少块
            var $boxs = $unedit_mode.find('ul li');
            for(var i = 0;i < $boxs.length;i++){
                //对每一块中的信息块进行数据转移
                var $unEditEles = $($boxs[i]).find('[name]');
                //每发现一个信息块就模拟点击一次添加链接
                $edit_mode.find('.operate-link').trigger('click');
                var $info_box = $edit_mode.find('.operate-link').prev();
                for(var j = 0;j < $unEditEles.length;j++){
                    var $uele = $($unEditEles[j]);
                    var $eele = $info_box.find('[name="'+$uele.attr('name')+'"]');
                    if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                        var value = $uele.text();
                        $eele.val(value);
                    }
                }
            }

            break;
        case 'work-experience':
            $edit_mode.find('.inner-box').remove();

            //因为此处内部可以添加多个信息块，所以需要先判断有多少块
            var $boxs = $unedit_mode.find('.inner-box');
            for(var i = 0;i < $boxs.length;i++){
                //对每一块中的信息块进行数据转移
                var $unEditEles = $($boxs[i]).find('[name]');
                //每发现一个信息块就模拟点击一次添加链接
                $edit_mode.find('.operate-link').trigger('click');
                var $info_box = $edit_mode.find('.operate-link').prev();
                for(var j = 0;j < $unEditEles.length;j++){
                    var $uele = $($unEditEles[j]);
                    var $eele = $info_box.find('[name="'+$uele.attr('name')+'"]');
                    if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                        if($eele.is('[name="beginDate"]') || $eele.is('[name="endDate"]')){
                            var value = $uele.text();
                            $eele.val(value == '暂无' ? '':value.replace('/','-'));
                        }else if($eele.is('[name="companyLevel"]') || $eele.is('[name="salary"]')){
                            var value = $uele.text();
                            if(value === '暂无'){
                                $eele.val('暂无');
                            }else{
                                if(value.indexOf('暂无') !== -1){
                                    $eele.val('');
                                    return;
                                }

                                if($eele.attr('name') === 'companyLevel'){
                                    $eele.val(value.slice(0,value.length - 1));
                                }else{
                                    $eele.val(value.slice(0,value.length - 3));
                                }
                            }
                        }else{
                            $eele.val($uele.text() == '暂无' ? '' : $uele.text());
                        }
                    }
                }
            }

            break;
        case 'edu-info':
            $edit_mode.find('.inner-box').remove();

            //因为此处内部可以添加多个信息块，所以需要先判断有多少块
            var $boxs = $unedit_mode.find('.inner-box');
            for(var i = 0;i < $boxs.length;i++){
                //对每一块中的信息块进行数据转移
                var $unEditEles = $($boxs[i]).find('[name]');
                //每发现一个信息块就模拟点击一次添加链接
                $edit_mode.find('.operate-link').trigger('click');
                var $info_box = $edit_mode.find('.operate-link').prev();
                for(var j = 0;j < $unEditEles.length;j++){
                    var $uele = $($unEditEles[j]);
                    var $eele = $info_box.find('[name="'+$uele.attr('name')+'"]');
                    if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                        if($eele.is('[name="enterDate"]') || $eele.is('[name="graduateDate"]')){
                            var value = $uele.text();
                            $eele.val(value == '暂无' ? '':value.replace('/','-'));
                        }else if($eele.is('[name="isFullTime"]')){
                            if($uele.text() === '统招'){
                                $eele.val(1);
                            }else{
                                $eele.val(0);
                            }
                        }else{
                            $eele.val($uele.text() == '暂无' ? '' : $uele.text());
                        }
                    }
                }
            }

            break;
        case 'job-intention':
            //查找所有基本信息表单元素,并依次将非编辑页的信息加载到编辑页的元素中
            var $unEditEles = $unedit_mode.find('[name]');

            for(var i = 0;i < $unEditEles.length;i++){
                var $uele = $($unEditEles[i]);
                var $eele = $edit_mode.find('[name="'+$uele.attr('name')+'"]');

                if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                    if($eele.is('select')){
                        $eele.val($uele.text() === '暂无' ? '全职' : $uele.text());
                    }else{
                        $eele.val($uele.text() === '暂无' ? '' : $uele.text());
                    }
                }
            }

            break;
        case 'base-info':
            //清空错误信息
            $edit_mode.find('.error-info').text('');

            //查找所有基本信息表单元素,并依次将非编辑页的信息加载到编辑页的元素中
            var $unEditEles = $unedit_mode.find('[name]');

            for(var i = 0;i < $unEditEles.length;i++){
                var $uele = $($unEditEles[i]);
                var $eele = $edit_mode.find('[name="'+$uele.attr('name')+'"]');

                if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                    //如果是最高学历select需要转成对应的value
                    if($eele.is('[name="education"]')){
                        var obj = {'请选择':'0','初中':"2",'高中':"3",'中技':"4",'中专':"5",'大专':"6",'本科':"7",'硕士':"8",'博士':'9','其它':'1'};
                        var value = $uele.text();
                        if(value === '暂无'){
                            value = '请选择';
                        }

                        $eele.val(obj[value]);
                    }else if($eele.is('[name="birthDate"]')){
                        //如果是生日需要转换中文为 '-'
                        var text = $uele.text();
                        var newText = '';
                        for(var j = 0;j < text.length;j++){
                            if(text[j].match(/[^\u4e00-\u9fa5]/)){
                                newText += text[j];
                            }else{
                                newText += '-'
                            }
                        }

                        if(text == '暂无'){
                            $eele.val('');
                        }else {
                            $eele.val(newText.slice(0, newText.length - 1));
                        }
                    }else if($eele.is('[name="currentAddress"]')){
                        if($uele.text() === '暂无'){
                            $eele.val('');
                        }else{
                            $eele.val($uele.text().slice(2));
                        }

                    }else if($eele.is('[name="workYear"]')){
                        var value = $uele.text();
                        if(value === '暂无'){
                            $eele.val('');
                        }else{
                            var year = Number(value.slice(0,1));
                            $eele.val(year + '年');
                            $eele.next().val(year * 12);

                            //联动首次工作时间
                            var now = new Date();
                            var newYear = now.getFullYear() - year;
                            now.setFullYear(newYear);
                            $edit_mode.find('.fstWorkDate').val(now.format('yyyy-MM-dd'));
                        }
                    }else if($eele.is('[name="source"]')){
                        var value = $eele.find('option:contains("'+$uele.text()+'")').attr('value');
                        if(value === undefined){
                            value = null;
                        }
                        $eele.val(value).trigger('change');
                    }else if($eele.is('[name="marriageStatus"]') || $eele.is('[name="politicalType"]')){
                        var value = $uele.text();
                        if(value === '暂无'){
                            if($eele.is('[name="marriageStatus"]')){
                                $eele.val('已婚');
                            }else{
                                $eele.val('群众');
                            }
                        }else{
                            $eele.val(value);
                        }
                    }else{
                        $eele.val($uele.text() === '暂无' ? '' : $uele.text());
                    }
                }else if($eele.is('.sex')){
                    //如果是性别
                    $eele.removeClass('radio-select');
                    if($uele.text() === '男'){
                        $eele.eq(1).addClass('radio-select');
                    }else if($uele.text() === '女'){
                        $eele.eq(0).addClass('radio-select');
                    }else{

                    }
                }else if($eele.is('[name="position"]')){
                    //如果是应聘职位
                    var value = $uele.text();
                    $eele.attr('data-value',value === '暂无'? '' : value);
                    $eele.find('.select-val').text(value === '暂无'? '请选择' : value);
                }
            }
            break;
    }
}

//将编辑数据转到不可编辑数据
function editMode2unEditMode($unedit_mode,$edit_mode,wrapStyle){
    switch(wrapStyle){
        case 'employee-skill':
            var $eles = $edit_mode.find('.inner-box .item');
            $unedit_mode.find('ul .item').remove();
            for(var i = 0;i < $eles.length;i++){
                var value = $($eles[i]).find('[contenteditable="true"]').text();
                if(value !== ''){
                    $unedit_mode.find('ul').append('<li class="content item">'+ value +'</li>');
                }
            }

            break;
        case 'self-assessment':
            var value = $edit_mode.find('[name="selfAssessment"]').val();
            $unedit_mode.find('[name="selfAssessment"]').text(value === '' ? '暂无' : value);
            break;
        case 'train-exp':
            var $boxs = $edit_mode.find('.inner-box');
            $unedit_mode.find('.inner-box').remove();
            for(var i = 0;i < $boxs.length;i++){
                //对每一块中的信息块进行数据转移
                var $editEles = $($boxs[i]).find('[name]');

                //在非编辑模式下添加一个新块
                $unedit_mode.append('<div class="inner-box"><div><span class="state" name="beginDate">2014/03</span>' +
                    '&nbsp;——&nbsp;<span class="state" name="endDate">2015/06</span></div><div>' +
                    '<span class="content" name="orgName">北大青鸟</span><span class="middle-dot">&sdot;</span>' +
                    '<span class="content" name="course">java</span><span class="middle-dot">&sdot;</span>' +
                    '<span class="content" name="certificate">高级工程师</span><br>' +
                    '<p class="state" name="trainingDesc">负责公司团队项目的测试工作,以功能测试为主。阿里外包项目 阿里内外入职体检系统税友外包项目 河北税务品目管理系统远梦优店多一圈微商平台...</p> ' +
                    '</div></div>');

                var $info_box = $unedit_mode.find('.inner-box:last-child');
                for(var j = 0;j < $editEles.length;j++){
                    var $eele = $($editEles[j]);
                    var $uele = $info_box.find('[name="'+$eele.attr('name')+'"]');
                    if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                        if($eele.is('[name="beginDate"]') || $eele.is('[name="endDate"]')){
                            if($eele.val() !== ''){
                                $uele.text($eele.val().replace('-','/'));
                            }else{
                                $uele.text('暂无');
                            }
                        }else{
                            $uele.text($eele.val() == '' ? '暂无' : $eele.val());
                        }
                    }
                }
            }

            break;
        case 'pro-exp':
            var $boxs = $edit_mode.find('.inner-box');
            $unedit_mode.find('.inner-box').remove();
            for(var i = 0;i < $boxs.length;i++){
                //对每一块中的信息块进行数据转移
                var $editEles = $($boxs[i]).find('[name]');

                //在非编辑模式下添加一个新块
                $unedit_mode.append('<div class="inner-box"><div><span class="state" name="beginDate">2014/03</span>&nbsp;——&nbsp;' +
                    '<span class="state" name="endDate">2015/06</span></div><div><span class="content" name="projectName">贪吃蛇</span>' +
                    '<span class="middle-dot">&sdot;</span><span class="content" name="duty">java开发工程师</span><br>' +
                    '<p class="state" name="projectDesc">负责公司团队项目的测试工作,以功能测试为主。阿里外包项目 阿里内外入职体检系统税友外包项目 河北税务品目管理系统远梦优店多一圈微商平台...</p>' +
                    '</div></div>');

                var $info_box = $unedit_mode.find('.inner-box:last-child');
                for(var j = 0;j < $editEles.length;j++){
                    var $eele = $($editEles[j]);
                    var $uele = $info_box.find('[name="'+$eele.attr('name')+'"]');
                    if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                        if($eele.is('[name="beginDate"]') || $eele.is('[name="endDate"]')){
                            if($eele.val() !== ''){
                                $uele.text($eele.val().replace('-','/'));
                            }else{
                                $uele.text('暂无');
                            }
                        }else{
                            $uele.text($eele.val() == '' ? '暂无' : $eele.val());
                        }
                    }
                }
            }

            break;
        case 'credentials':
            var $boxs = $edit_mode.find('.inner-box');
            $unedit_mode.find('ul li').remove();
            for(var i = 0;i < $boxs.length;i++){
                //对每一块中的信息块进行数据转移
                var $editEles = $($boxs[i]).find('[name]');

                //在非编辑模式下添加一个新块
                $unedit_mode.find('ul').append('<li class="content" name="certificateName">' +
                    '<span class="content" name="certificateName"></span>' +
                    '<span class="content" name="achieveDate" style="display: none"></span>' +
                    '</li>');

                var $info_box = $unedit_mode.find('ul li:last-child');
                for(var j = 0;j < $editEles.length;j++){
                    var $eele = $($editEles[j]);
                    var $uele = $info_box.find('[name="'+$eele.attr('name')+'"]');
                    if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                        $uele.text($eele.val() == '' ? '暂无' : $eele.val());
                    }
                }
            }

            break;
        case 'language-skill':
            var $boxs = $edit_mode.find('.inner-box');
            $unedit_mode.find('ul li').remove();
            for(var i = 0;i < $boxs.length;i++){
                //对每一块中的信息块进行数据转移
                var $editEles = $($boxs[i]).find('[name]');

                //在非编辑模式下添加一个新块
                $unedit_mode.find('ul').append('<li><span class="state" name="languageName">英语</span>' +
                    '<span class="content" name="proficiency">良好</span></li>');

                var $info_box = $unedit_mode.find('ul li:last-child');
                for(var j = 0;j < $editEles.length;j++){
                    var $eele = $($editEles[j]);
                    var $uele = $info_box.find('[name="'+$eele.attr('name')+'"]');
                    if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                        $uele.text($eele.val() == '' ? '暂无' : $eele.val());
                    }
                }
            }

            break;
        case 'work-experience':
            var $boxs = $edit_mode.find('.inner-box');
            $unedit_mode.find('.inner-box').remove();
            for(var i = 0;i < $boxs.length;i++){
                //对每一块中的信息块进行数据转移
                var $editEles = $($boxs[i]).find('[name]');

                //在非编辑模式下添加一个新块
                $unedit_mode.append('<div class="inner-box"><div><span class="state" name="beginDate">2014/03</span>' +
                    '&nbsp;——&nbsp;<span class="state" name="endDate">2015/06</span></div><div>' +
                    '<span class="content" name="companyName">搜才网</span><span class="middle-dot">&sdot;</span>' +
                    '<span class="content" name="positionName">运营</span><br><span class="state" name="tradesDesc">互联网/电子商务</span>' +
                    '<span class="middle-dot">&sdot;</span><span class="state" name="companyType">外商独资</span><span class="middle-dot">&sdot;</span>' +
                    '<span class="state" name="companyLevel">500人</span><span class="middle-dot">&sdot;</span><span class="state" name="department">产品部</span><br>' +
                    '<span class="state" name="workingLocation">北京</span><span class="middle-dot">&sdot;</span><span class="state" name="salary">10000元</span>' +
                    '<p class="state" name="jobDesc">负责公司团队项目的测试工作,以功能测试为主。阿里外包项目 阿里内外入职体检系统税友外包项目 河北税务品目管理系统远梦优店多一圈微商平台...</p>' +
                    '</div></div>');

                var $info_box = $unedit_mode.find('.inner-box:last-child');
                for(var j = 0;j < $editEles.length;j++){
                    var $eele = $($editEles[j]);
                    var $uele = $info_box.find('[name="'+$eele.attr('name')+'"]');
                    if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                        if($eele.is('[name="beginDate"]') || $eele.is('[name="endDate"]')){
                            if($eele.val() !== ''){
                                $uele.text($eele.val().replace('-','/'));
                            }else{
                                $uele.text('暂无');
                            }
                        }else if($eele.is('[name="companyLevel"]') || $eele.is('[name="salary"]')){
                            if($eele.attr('name') === 'companyLevel'){
                                if($eele.val() == ''){
                                    $uele.text('null人');
                                }else{
                                    $uele.text($eele.val() + '人');
                                }
                            }else{
                                if($eele.val() == ''){
                                    $uele.text('null元/月');
                                }else{
                                    $uele.text($eele.val() + '元/月');
                                }
                            }
                        }else{
                            $uele.text($eele.val() == '' ? '暂无' : $eele.val());
                        }
                    }
                }
            }

            break;
        case 'edu-info':
            var $boxs = $edit_mode.find('.inner-box');
            $unedit_mode.find('.inner-box').remove();
            for(var i = 0;i < $boxs.length;i++){
                //对每一块中的信息块进行数据转移
                var $editEles = $($boxs[i]).find('[name]');

                //在非编辑模式下添加一个新块
                $unedit_mode.append('<div class="inner-box"><div><span class="state" name="enterDate">2014/03</span>' +
                    '&nbsp;——&nbsp;<span class="state" name="graduateDate">2015/06</span></div><div>' +
                    '<span class="content" name="schoolName">中央财经大学</span><br>' +
                    '<span class="state" name="major">国际经济与贸易</span><span class="middle-dot">&sdot;</span>' +
                    '<span class="state" name="degree">本科</span><span class="middle-dot">&sdot;</span>' +
                    '<span class="state" name="isFullTime">统招</span></div></div>');

                var $info_box = $unedit_mode.find('.inner-box:last-child');
                for(var j = 0;j < $editEles.length;j++){
                    var $eele = $($editEles[j]);
                    var $uele = $info_box.find('[name="'+$eele.attr('name')+'"]');
                    if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                        if($eele.is('[name="enterDate"]') || $eele.is('[name="graduateDate"]')){
                            if($eele.val() !== ''){
                                $uele.text($eele.val().replace('-','/'));
                            }else{
                                $uele.text('暂无');
                            }
                        }else if($eele.is('[name="isFullTime"]')){
                            if($eele.val() === '1'){
                                $uele.text('统招');
                            }else{
                                $uele.text('非统招');
                            }
                        }else{
                            $uele.text($eele.val() == '' ? '暂无' : $eele.val());
                        }
                    }
                }
            }

            break;
        case 'job-intention':
            var $editEles = $edit_mode.find('[name]');
            for(var i=0;i < $editEles.length;i++){
                var $eele = $($editEles[i]);
                var $uele = $unedit_mode.find('[name="'+$eele.attr('name')+'"]');

                if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                    $uele.text($eele.val() == '' ? '暂无' : $eele.val());
                }
            }

            break;
        case 'base-info':
            var $editEles = $edit_mode.find('[name]');
            for(var i=0;i < $editEles.length;i++){
                var $eele = $($editEles[i]);
                var $uele = $unedit_mode.find('[name="'+$eele.attr('name')+'"]');

                if($eele.is('input') || $eele.is('textarea') || $eele.is('select')){
                    if($eele.is('[name="birthDate"]')){
                        //如果是生日需要转换文本
                        if($eele.val() == ''){
                            $uele.text('暂无');
                        }else{
                            $uele.text(getDateByStrDate($eele.val()).format('yyyy年MM月dd日'));
                        }
                    }else if($eele.is('[name="education"]')){
                        var text = $eele.find('option[value="' + $eele.val() + '"]').text();
                        $uele.text(text === '请选择' ? '暂无' : text);
                    }else if($eele.is('[name="workYear"]')){
                        $uele.text($eele.val() + '工作经验');
                    }else if($eele.is('[name="currentAddress"]')){
                        $uele.text('现居' + $eele.val());
                    }else if($eele.is('select[name="source"]')){
                        $uele.text($eele.find('option[value="'+$eele.val()+'"]').text());
                    }else{
                        $uele.text($eele.val() == '' ? '暂无' : $eele.val());
                    }
                }else{
                    if($eele.is('[name="position"]')){
                        //如果是应聘职位要选择控件返回的数据
                        $uele.text($eele.attr('data-value'));
                    }else if($eele.is('[name="sex"]')){
                        //如果是性别,需要从自定义样式转换到文本上
                        for(var j=0;j < $eele.length;j++){
                            var $ele = $($eele[j]);
                            if($ele.is('.radio-select')){
                                $uele.text($ele.find('span').text());
                            }
                        }
                    }
                }
            }

            break;
    }
}

//点击简历详情之后的数据加载
function loadCvDataDetails(globalData,cv){
    var $baseInfoUneditMode = $('.cv-addPage .cvDetails-page .wrap-box.base-info .unEdit-mode');

    cv._ajax({
        url: '/appcenter/resume/detail.json',
        data: {
            resumeId:globalData.resumeId
        },
        token: globalData.token,
        success: function(res){
            console.log(res);
            if(res.code == 1){
                var data = res.data;
                var $cvDetails = $('.cv-addPage .cvDetails-page');
                var $expandWrap = $cvDetails.find('.expand-wrap');

                //初始化加载的时候不存在的块需要隐藏并且给个展开链接
                if(data.intention === undefined || data.intention === ''){
                    $cvDetails.find('.job-intention').hide();
                    $expandWrap.find('.job-intention-link').css('display','inline-block');
                }

                if(data.educationInfo === undefined || data.educationInfo === ''){
                    $cvDetails.find('.edu-info').hide();
                    $expandWrap.find('.edu-info-link').css('display','inline-block');
                }

                if(data.workExperience === undefined || data.workExperience === ''){
                    $cvDetails.find('.work-experience').hide();
                    $expandWrap.find('.work-experience-link').css('display','inline-block');
                }

                if(data.employeeSkill === undefined || data.employeeSkill === ''){
                    $cvDetails.find('.employee-skill').hide();
                    $expandWrap.find('.employee-skill-link').css('display','inline-block');
                }

                if(data.languageSkill === undefined || data.languageSkill === ''){
                    $cvDetails.find('.language-skill').hide();
                    $expandWrap.find('.language-skill-link').css('display','inline-block');
                }

                if(data.credentials === undefined || data.credentials === ''){
                    $cvDetails.find('.credentials').hide();
                    $expandWrap.find('.credentials-link').css('display','inline-block');
                }

                if(data.projectExperience === undefined || data.projectExperience === ''){
                    $cvDetails.find('.pro-exp').hide();
                    $expandWrap.find('.pro-exp-link').css('display','inline-block');
                }

                if(data.trainExperience === undefined || data.trainExperience === ''){
                    $cvDetails.find('.train-exp').hide();
                    $expandWrap.find('.train-exp-link').css('display','inline-block');
                }

                if(data.selfAssessment === undefined || data.selfAssessment === ''){
                    $cvDetails.find('.self-assessment').hide();
                    $expandWrap.find('.self-assessment-link').css('display','inline-block');
                }

                //遍历基本信息块中其它字段
                var $baseInfoEles = $cvDetails.find('.base-info .unEdit-mode [name]');
                for(var i = 0;i < $baseInfoEles.length;i++){
                    var $ele = $($baseInfoEles[i]);
                    var nameAttr = $ele.attr('name');

                    if(data[nameAttr] === undefined || data[nameAttr].replace(/\s+/g,'') === ''){
                        $ele.text('暂无');
                    }
                }

                //将已经存在的数据信息初始化到详情中
	            $.each(data,function(key,value){
                    switch(key){
                        case 'tags':
                            var $tag_box = $('.cv-addPage .talentLabel_div .labelContainer');
                            var tags = res.data.tags;
                            var arr = tags.split('#@');
                            arr.shift();
                            arr.pop();
                            for(var i = 0;i < arr.length;i++){
                                var html = '<div class="item"><span class="text">'+ arr[i] +'</span><span class="del">&times;</span></div>';
                                $tag_box.append(html);
                            }

                            break;
                        case 'comments':
                            var comments = res.data.comments;

                            //初始化加载备注评语
                            for(var i in comments){
                                var id = comments[i].id;
                                var type = comments[i].type;
                                var text = comments[i].remark;

                                var $comment_box = $('.cv-addPage .comments_div .commentsContainer');
                                var html = '<div class="item" data-id="'+id+'"><div class="text">'+text+'</div><span class="del">&times;</span></div>';
                                $comment_box.append(html);
                            }
                            break;
                        case 'politicalType':
                            var value = res.data.residentAddress;
                            $baseInfoUneditMode.find('[name="politicalType"]').text(value);

                            break;
                        case 'nationality':
                            var value = res.data.residentAddress;
                            $baseInfoUneditMode.find('[name="nationality"]').text(value);

                            break;
                        case 'currentAddress':
                            var value = res.data.residentAddress;
                            $baseInfoUneditMode.find('[name="currentAddress"]').text('现居' + value);

                            break;
                        case 'residentAddress':
                            var value = res.data.residentAddress;
                            $baseInfoUneditMode.find('[name="residentAddress"]').text(value);

                            break;
                        case 'marriageStatus':
                            var value = res.data.marriageStatus;
                            $baseInfoUneditMode.find('[name="marriageStatus"]').text(value);

                            break;
                        case 'idCard':
                            var value = res.data.idCard;
                            $baseInfoUneditMode.find('[name="idCard"]').text(value);

                            break;
                        case 'name':
                            var value = res.data.name;
                            $baseInfoUneditMode.find('[name="name"]').text(value);
                            $('.cv-addPage .cvDetails-page .cv_title').text(value + '的简历');
                            break;
                        case 'education':
                            var value = res.data.education;
                            $baseInfoUneditMode.find('[name="education"]').text(value == '请选择' ? '暂无' : value);
                            break;
                        case 'sex':
                            var value = res.data.sex;
                            $baseInfoUneditMode.find('[name="sex"]').text(value);
                            break;
                        case 'mobile':
                            var value = res.data.mobile;
                            $baseInfoUneditMode.find('[name="mobile"]').text(value);
                            break;
                        case 'birthDate':
                            var value = res.data.birthDate;
                            if(value === '' || value === undefined){
                                //如果没有此字段的话就
                                $baseInfoUneditMode.find('[name="birthDate"]').text('暂无');
                            }else {
                                $baseInfoUneditMode.find('[name="birthDate"]').text(getDateByStrDate(value).format('yyyy年MM月dd日'));
                            }
                            break;
                        case 'workYear':
                            var value = Number(res.data.workYear);
                            $baseInfoUneditMode.find('[name="workYear"]').text(value + '年工作经验');
                            break;
                        case 'position':
                            var value = res.data.position;
                            if(value === '' || value === undefined){
                                value = '暂无';
                            }

                            $baseInfoUneditMode.find('[name="position"]').text(value);
                            break;
                        case 'email':
                            var value = res.data.email;
                            if(value === '' || value === undefined){
                                value = '暂无';
                            }

                            $baseInfoUneditMode.find('[name="email"]').text(value);
                            break;
                        case 'enterTime':
                            var value = Number(res.data.enterTime);
                            var enterDate = new Date(value).format('yyyy-MM-dd');
                            break;
                        case 'source':
                            var value = res.data.source;
                            $baseInfoUneditMode.find('[name="source"]').text(value);
                            break;
                        case 'selfAssessment':
                            var value = res.data.selfAssessment;
                            if(value !== undefined && value !== ''){
                                $('.self-assessment-link').hide();
                                $cvDetails.find('.self-assessment').show();
                                $cvDetails.find('.self-assessment .unEdit-mode [name="selfAssessment"]').text(value);
                            }

                            break;
                        case 'intention':
                            //求职意向
                            var data = res.data.intention;
                            var $unedit_mode = $cvDetails.find('.job-intention .unEdit-mode');
                            var $eles = $unedit_mode.find('[name]');

                            for(var k in data){
                                if(data.hasOwnProperty(k)){
                                    var $uele = $unedit_mode.find('[name="'+k+'"]');
                                    $uele.text(data[k] === '' ? '暂无' : data[k]);
                                }
                            }

                            break;
                        case 'educationInfo':
                            //学历信息
                            var data = res.data.educationInfo;

                            if(data !== undefined && data.length !== 0){
                                $cvDetails.find('.edu-info .unEdit-mode .inner-box').remove();

                                for(var i=0;i<data.length;i++){
                                    var $unedit_mode = $cvDetails.find('.edu-info .unEdit-mode');

                                    //在非编辑模式下添加一个新块
                                    $unedit_mode.append('<div class="inner-box"><div><span class="state" name="enterDate">2014/03</span>' +
                                        '&nbsp;——&nbsp;<span class="state" name="graduateDate">2015/06</span></div><div>' +
                                        '<span class="content" name="schoolName">中央财经大学</span><br>' +
                                        '<span class="state" name="major">国际经济与贸易</span><span class="middle-dot">&sdot;</span>' +
                                        '<span class="state" name="degree">本科</span><span class="middle-dot">&sdot;</span>' +
                                        '<span class="state" name="isFullTime">统招</span></div></div>');

                                    var $info_box = $unedit_mode.find('.inner-box:last-child');
                                    var aData = data[i];
                                    for(var k in aData){
                                        if(aData.hasOwnProperty(k)){
                                            var $uele = $info_box.find(' [name="'+k+'"]');

                                            if(k === 'isFullTime'){
                                                $uele.text(aData[k] == 1 ? '统招':'非统招');
                                            }else{
                                                $uele.text(aData[k] == '' ? '暂无' : aData[k]);
                                            }
                                        }
                                    }
                                }
                            }

                            break;
                        case 'credentials':
                            //资格证书
                            var data = res.data.credentials;

                            if(data !== undefined && data.length !== 0){
                                $cvDetails.find('.credentials .unEdit-mode ul').html('');

                                for(var i=0;i<data.length;i++){
                                    var $unedit_mode = $cvDetails.find('.credentials .unEdit-mode');

                                    //在非编辑模式下添加一个新块
                                    $unedit_mode.find('ul').append('<li class="content" name="certificateName">' +
                                        '<span class="content" name="certificateName">全国计算机等级二级</span>' +
                                        '<span class="content" name="achieveDate" style="display: none">2016-12-01</span>' +
                                        '</li>');

                                    var $info_box = $unedit_mode.find('ul li:last-child');
                                    var aData = data[i];
                                    for(var k in aData){
                                        if(aData.hasOwnProperty(k)){
                                            var $uele = $info_box.find(' [name="'+k+'"]');
                                            $uele.text(aData[k] == '' ? '暂无' : aData[k]);
                                        }
                                    }
                                }
                            }

                            break;
                        case 'trainExperience':
                            //培训经历
                            var data = res.data.trainExperience;

                            if(data !== undefined && data.length !== 0){
                                $cvDetails.find('.train-exp .unEdit-mode .inner-box').remove();

                                for(var i=0;i<data.length;i++){
                                    var $unedit_mode = $cvDetails.find('.train-exp .unEdit-mode');

                                    //在非编辑模式下添加一个新块
                                    $unedit_mode.append('<div class="inner-box"><div><span class="state" name="beginDate">2014/03</span>' +
                                        '&nbsp;——&nbsp;<span class="state" name="endDate">2015/06</span></div><div>' +
                                        '<span class="content" name="orgName">北大青鸟</span><span class="middle-dot">&sdot;</span>' +
                                        '<span class="content" name="course">java</span><span class="middle-dot">&sdot;</span>' +
                                        '<span class="content" name="certificate">高级工程师</span><br>' +
                                        '<p class="state" name="trainingDesc">负责公司团队项目的测试工作,以功能测试为主。阿里外包项目 阿里内外入职体检系统税友外包项目 河北税务品目管理系统远梦优店多一圈微商平台...</p> ' +
                                        '</div></div>');

                                    var $info_box = $unedit_mode.find('.inner-box:last-child');
                                    var aData = data[i];
                                    for(var k in aData){
                                        if(aData.hasOwnProperty(k)){
                                            var $uele = $info_box.find('[name="'+k+'"]');
                                            $uele.text(aData[k] === '' ? '暂无' : aData[k]);
                                        }
                                    }
                                }
                            }

                            break;
                        case 'employeeSkill':
                            //技能专长
                            var data = res.data.employeeSkill;
                            if(data === '' || data === undefined){
                                $cvDetails.find('.employee-skill').hide();
                                $cvDetails.find('.employee-skill-link').css('display','inline-block');
                                return;
                            }

                            data = data.split(',');

                            if(data !== undefined && data.length !== 0){
                                $cvDetails.find('.employee-skill .unEdit-mode ul').html('');

                                for(var i=0;i<data.length;i++){
                                    var $unedit_mode = $cvDetails.find('.employee-skill .unEdit-mode');
                                    $unedit_mode.find('ul').append('<li class="content item">'+ data[i] +'</li>');
                                }
                            }

                            break;
                        case 'workExperience':
                            //工作经历
                            var data = res.data.workExperience;

                            if(data === '' || data === undefined){
                                $cvDetails.find('.work-experience').hide();
                                $cvDetails.find('.work-experience-link').css('display','inline-block');
                                return;
                            }

                            if(data !== undefined && data.length !== 0){
                                $cvDetails.find('.work-experience .unEdit-mode .inner-box').remove();

                                for(var i=0;i<data.length;i++){
                                    var $unedit_mode = $cvDetails.find('.work-experience .unEdit-mode');

                                    //在非编辑模式下添加一个新块
                                    $unedit_mode.append('<div class="inner-box"><div><span class="state" name="beginDate">2014/03</span>' +
                                        '&nbsp;——&nbsp;<span class="state" name="endDate">2015/06</span></div><div>' +
                                        '<span class="content" name="companyName">搜才网</span><span class="middle-dot">&sdot;</span>' +
                                        '<span class="content" name="positionName">运营</span><br><span class="state" name="tradesDesc">互联网/电子商务</span>' +
                                        '<span class="middle-dot">&sdot;</span><span class="state" name="companyType">外商独资</span><span class="middle-dot">&sdot;</span>' +
                                        '<span class="state" name="companyLevel">500人</span><span class="middle-dot">&sdot;</span><span class="state" name="department">产品部</span><br>' +
                                        '<span class="state" name="workingLocation">北京</span><span class="middle-dot">&sdot;</span><span class="state" name="salary">10000元</span>' +
                                        '<p class="state" name="jobDesc">负责公司团队项目的测试工作,以功能测试为主。阿里外包项目 阿里内外入职体检系统税友外包项目 河北税务品目管理系统远梦优店多一圈微商平台...</p>' +
                                        '</div></div>');

                                    var $info_box = $unedit_mode.find('.inner-box:last-child');
                                    var aData = data[i];
                                    for(var k in aData){
                                        if(aData.hasOwnProperty(k)){
                                            var $uele = $info_box.find('[name="'+k+'"]');
                                            $uele.text(aData[k] === '' ? '暂无' : aData[k]);
                                        }
                                    }
                                }
                            }

                            break;
                        case 'projectExperience':
                            //项目经验
                            var data = res.data.projectExperience;

                            if(data === '' || data === undefined){
                                $cvDetails.find('.pro-exp').hide();
                                $cvDetails.find('.pro-exp-link').css('display','inline-block');
                                return;
                            }

                            if(data !== undefined && data.length !== 0){
                                $cvDetails.find('.pro-exp .unEdit-mode .inner-box').remove();

                                for(var i=0;i<data.length;i++){
                                    var $unedit_mode = $cvDetails.find('.pro-exp .unEdit-mode');

                                    //在非编辑模式下添加一个新块
                                    $unedit_mode.append('<div class="inner-box"><div><span class="state" name="beginDate">2014/03</span>&nbsp;——&nbsp;' +
                                        '<span class="state" name="endDate">2015/06</span></div><div><span class="content" name="projectName">贪吃蛇</span>' +
                                        '<span class="middle-dot">&sdot;</span><span class="content" name="duty">java开发工程师</span><br>' +
                                        '<p class="state" name="projectDesc">负责公司团队项目的测试工作,以功能测试为主。阿里外包项目 阿里内外入职体检系统税友外包项目 河北税务品目管理系统远梦优店多一圈微商平台...</p>' +
                                        '</div></div>');

                                    var $info_box = $unedit_mode.find('.inner-box:last-child');
                                    var aData = data[i];
                                    for(var k in aData){
                                        if(aData.hasOwnProperty(k)){
                                            var $uele = $info_box.find('[name="'+k+'"]');
                                            $uele.text(aData[k] === '' ? '暂无' : aData[k]);
                                        }
                                    }
                                }
                            }

                            break;
                        case 'languageSkill':
                            //语言能力
                            var data = res.data.languageSkill;
                            if(data === '' || data === undefined){
                                $cvDetails.find('.language-skill').hide();
                                $cvDetails.find('.language-skill-link').css('display','inline-block');
                                return;
                            }

                            if(data !== undefined && data.length !== 0){
                                $cvDetails.find('.language-skill .unEdit-mode ul').html('');

                                for(var i=0;i<data.length;i++){
                                    var $unedit_mode = $cvDetails.find('.language-skill .unEdit-mode');

                                    //在非编辑模式下添加一个新块
                                    $unedit_mode.find('ul').append('<li><span class="state" name="languageName">英语</span>' +
                                        '<span class="content" name="proficiency">良好</span></li>');

                                    var $info_box = $unedit_mode.find('ul li:last-child');
                                    var aData = data[i];
                                    for(var k in aData){
                                        if(aData.hasOwnProperty(k)){
                                            var $uele = $info_box.find('[name="'+k+'"]');
                                            $uele.text(aData[k] === '' ? '暂无' : aData[k]);
                                        }
                                    }
                                }
                            }

                            break;
                    }
                });

                //配置拓展链接按钮的事件
                $expandWrap.find('.job-intention-link').off('click').on('click',function(e){
                    //设置进入编辑的入口状态
                    globalData.editEntrance.jobIntention = 1;

                    //隐藏本身显示信息块
                    $expandWrap.before($cvDetails.find('.job-intention').show());
                    $(this).hide();

                    $cvDetails.find('.job-intention .edit_link').trigger('click');

                    var $eles = $cvDetails.find('.job-intention .edit-mode [name]');
                    for(var i = 0;i < $eles.length;i++){
                        var $ele = $($eles[i]);
                        var name = $ele.attr('name');

                        if($ele.is('select')){
                            $ele.val('全职');
                        }else{
                            $ele.val('');
                        }
                    }
                });
                $expandWrap.find('.edu-info-link').off('click').on('click',function(e){
                    globalData.editEntrance.eduInfo = 1;

                    //隐藏本身显示信息块
                    $expandWrap.before($cvDetails.find('.edu-info').show());
                    $(this).hide();

                    $cvDetails.find('.edu-info .edit_link').trigger('click');

                    var $eles = $cvDetails.find('.edu-info .edit-mode [name]');
                    for(var i = 0;i < $eles.length;i++){
                        var $ele = $($eles[i]);
                        var name = $ele.attr('name');

                        if($ele.is('select')){
                            $ele.val(1);
                        }else{
                            $ele.val('');
                        }
                    }
                });
                $expandWrap.find('.work-experience-link').off('click').on('click',function(e){
                    //设置对应入口状态为拓展链接进入置1
                    globalData.editEntrance.workExperience = 1;

                    //隐藏本身显示信息块
                    $expandWrap.before($cvDetails.find('.work-experience').show());
                    $(this).hide();

                    $cvDetails.find('.work-experience .edit_link').trigger('click');
                    $cvDetails.find('.work-experience .edit-mode .inner-box').remove();
                    $cvDetails.find('.work-experience .edit-mode .operate-link').trigger('click');
                });
                $expandWrap.find('.employee-skill-link').off('click').on('click',function(e){
                    globalData.editEntrance.employeeSkill = 1;

                    //隐藏本身显示信息块
                    $expandWrap.before($cvDetails.find('.employee-skill').show());
                    $(this).hide();

                    $cvDetails.find('.employee-skill .edit_link').trigger('click');
                    $cvDetails.find('.employee-skill .edit-mode .inner-box').html('');
                });
                $expandWrap.find('.language-skill-link').off('click').on('click',function(e){
                    globalData.editEntrance.languageSkill = 1;

                    //隐藏本身显示信息块
                    $expandWrap.before($cvDetails.find('.language-skill').show());
                    $(this).hide();

                    $cvDetails.find('.language-skill .edit_link').trigger('click');
                    $cvDetails.find('.language-skill .edit-mode .inner-box').remove();
                    $cvDetails.find('.language-skill .edit-mode .operate-link').trigger('click');
                });
                $expandWrap.find('.credentials-link').off('click').on('click',function(e){
                    globalData.editEntrance.credentials = 1;

                    $expandWrap.before($cvDetails.find('.credentials').show());
                    $(this).hide();

                    $cvDetails.find('.credentials .edit_link').trigger('click');
                    $cvDetails.find('.credentials .edit-mode .inner-box').remove();
                    $cvDetails.find('.credentials .edit-mode .operate-link').trigger('click');
                });
                $expandWrap.find('.pro-exp-link').off('click').on('click',function(e){
                    globalData.editEntrance.proExp = 1;

                    $expandWrap.before($cvDetails.find('.pro-exp').show());
                    $(this).hide();

                    $cvDetails.find('.pro-exp .edit_link').trigger('click');
                    $cvDetails.find('.pro-exp .edit-mode .inner-box').remove();
                    $cvDetails.find('.pro-exp .edit-mode .operate-link').trigger('click');
                });
                $expandWrap.find('.train-exp-link').off('click').on('click',function(e){
                    globalData.editEntrance.trainExp = 1;

                    $expandWrap.before($cvDetails.find('.train-exp').show());
                    $(this).hide();

                    $cvDetails.find('.train-exp .edit_link').trigger('click');
                    $cvDetails.find('.train-exp .edit-mode .inner-box').remove();
                    $cvDetails.find('.train-exp .edit-mode .operate-link').trigger('click');
                });
                $expandWrap.find('.self-assessment-link').off('click').on('click',function(e){
                    globalData.editEntrance.selfAssessment = 1;

                    $expandWrap.before($cvDetails.find('.self-assessment').show());
                    $(this).hide();

                    $cvDetails.find('.self-assessment .edit_link').trigger('click');
                    $cvDetails.find('.self-assessment .edit-mode [name="selfAssessment"]').val('');
                });
            }else{
                console.log('返回数据有误,错误码:' + res.message);
            }
        }
    });
}


/*------------------ 工具函数 ---------------------*/

//字符串转日期
function getDateByStrDate(strDate) {
    //切割年月日与时分秒称为数组
    var s = strDate.split(" ");
    var s1 = s[0].split("-");

    if(s[1] == undefined || s[1] == null || s[1] == ''){
        return new Date(s1[0], s1[1] - 1, s1[2]);
    }else{
        var s2 = s[1].split(":");
        if (s2.length == 2) {
            s2.push("00");
        }
        return new Date(s1[0], s1[1] - 1, s1[2], s2[0], s2[1], s2[2]);
    }
};