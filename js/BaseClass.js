/**
 * Created by zhangys on 2016/11/7.
 * 基础父类
 */
define(["JQuery", "layer"], function($, layer){

    function BaseClass(opt){
        if(this === window)return;

        for(var i in opt){
            if(this[i] !== undefined){
                this[i] = opt[i];
            }
        }

        this.init();
    }

    $.extend(BaseClass.prototype, {
        constructor: BaseClass,

        //获取域名+端口
        getLocalhostPort: function() {
            var localhostPort = '';
            if(global_config.PORT == '' || global_config.PORT == null) {
                localhostPort = global_config.URL;
            } else {
                localhostPort = global_config.URL + ':' + global_config.PORT
            }
            return localhostPort;
        },

        //获取首页参数
        getParameter: function() {
            var parameterString = window.location.search;
            var parameterList = parameterString.split('&');
            parameterList[0] = parameterList[0].substring(parameterList[0].indexOf('?')+1,parameterList[0].length)
            var temp_key = null;
            var result_obj = {};

            for(var i = 0 ; i < parameterList.length ; i++){
                temp_key = parameterList[i].substring(0,parameterList[i].indexOf('='));
                result_obj[temp_key] = parameterList[i].substring(parameterList[i].indexOf('=')+1,parameterList[i].length);
            }
            return result_obj;

        },

        //填充表单输入
        fill_input: function(data){
            for(var key in data){
                $("#"+key).val(data[key]);
            }
        },

        //保存至缓存中
        insert_cache: function(key, value){
            var staff_obj = localStorage.getItem("staff_cache");
            if(staff_obj){
                staff_obj[key] = value;
            }else{
                staff_obj = {};
                staff_obj[key] = value;
            }
            localStorage.setItem("staff_cache", staff_obj)
        },

        //ajax公共方法
        _ajax: function(param){
            $.ajax({
                type: 'POST',
                url: this.getLocalhostPort() + param.url,
                dataType: "json",
                data: param.data,
                headers:{
                    token: param.token
                },
                beforeSend: function(){
                    layer.load(2);
                },
                complete: function(){
                    layer.closeAll('loading');
                },
                success: param.success,
                error: function(err) {
                    layer.msg(err.message);
                }
            });
        },

        checkCh:function (username) {
            var ch = username.charAt(username.length - 1);

            var uni = ch.charCodeAt(0);
            //如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数
            if (uni > 40869 || uni < 19968)
            {
                if (uni >= 0 && uni <= 128) {
                    ch = ch.toUpperCase();
                }
                return ch; //dealWithOthers(ch);
            }

            //检查是否是多音字,是按多音字处理,不是就直接在strChineseFirstPY字符串中找对应的首字母
            var py = (oMultiDiff[uni] ? oMultiDiff[uni] : (strChineseFirstPY.charAt(uni - 19968)));

            if (py.length > 1)
                py = py.charAt(0);

            var charCode = py.charCodeAt(0);
            if (charCode >= 0 && charCode <= 128) {
                py = py.toUpperCase();
            }

            return py;


        },

        /**
         * 取名字的最后两位
         *  */
        subName: function (name_) {
            if (name_ && name_.length >= 3) {
                return name_.substring(name_.length - 2)
            } else {
                return name_;
            }
        },

        //传入汉字，返回头像HTML代码
        get_head_html: function(emp_name,type){
            var _this = this;
            var subName = _this.subName(emp_name);
            var py_code = _this.checkCh(subName);
            if(type===0){
            	  var html_str = '<span class="head-img-normal contact_bg_'+py_code+'">'+subName+'</span>';
            }else{
            	  var html_str = '<div class="select-val_i head-img-normal contact_bg_'+py_code+'" >'+subName+'</div><div class="employeename">'+emp_name+'</div>';
            }
          
            return html_str;
        }
    });

    return BaseClass;

});