/**
 * Created by xs on 2016/12/13.
 */
require.config({
    baseUrl : "/appcenter_web/js",
    paths : {
        "JQuery" : "lib/jquery.min",
        "bootstrap" : "lib/bootstrap.min",
        "contractManage" : "employee/contractManage/contractManage",
        "layer" : "lib/layer.min",
        "BaseClass" : "BaseClass",
        "config" : "config",
        'select2':'lib/select2/select2.min',
        'select2-zh-CN':"lib/select2/zh-CN",
        'bs-datetimepicker':'lib/bs-datetimepicker/bootstrap-datetimepicker',
        'bs-datetimepicker-zh-CN':'lib/bs-datetimepicker/bootstrap-datetimepicker.zh-CN',
        'jquery-validate':'lib/validate/jquery.validate.min',
        'jquery-validate-zh-CN':'lib/validate/messages_zh.min'
    },
    shim:{
        "JQuery" :{
            exports : "$"
        },
        "bootstrap": {
            deps: ["JQuery"]
        },
        "layer": {
            deps: ["JQuery"],
            exports : "layer"
        },
        "select2":{
            deps: ['JQuery']
        },
        'select2-zh-CN':{
            deps: ['select2']
        },
        'bs-datetimepicker':{
            deps: ['JQuery']
        },
        'bs-datetimepicker-zh-CN':{
            deps: ['bs-datetimepicker']
        },
        'jquery-validate':{
            deps: ['JQuery']
        },
        "jquery-validate-zh-CN":{
            deps: ['JQuery']
        }
    }
});


require(["JQuery","contractManage"], function($, contractManage){
    $(function(){
        contractManage.init();
    });
});
