require.config({
    baseUrl : "/appcenter_web/js",
    paths : {
        "JQuery" : "lib/jquery.min",
        "BaseClass" : "BaseClass",
        "config" : "config",
        "bootstrap":"lib/bootstrap.min",
        'select2':'lib/select2/select2.min',
        'select2-zh-CN':"lib/select2/zh-CN",
        'layer':'lib/layer.min',
        'bs-datetimepicker':'lib/bs-datetimepicker/bootstrap-datetimepicker',
        'bs-datetimepicker-zh-CN':'lib/bs-datetimepicker/bootstrap-datetimepicker.zh-CN',
        "cv_addPage" : "offer/cv/cv_addPage",
        'jquery-validate':'lib/validate/jquery.validate.min',
        'jquery-validate-zh-CN':'lib/validate/messages_zh.min',
        'cityPicker':'common/wp_cityPicker'
    },
    shim:{
        "JQuery" :{
            exports : "$"
        },
        "bootstrap": {
            deps: ['JQuery']
        },
        "select2":{
            deps: ['JQuery']
        },
        'select2-zh-CN':{
            deps: ['select2']
        },
        'layer':{
            deps: ['JQuery'],
            exports:'layer'
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
        },
        'cityPicker':{
            deps: ['JQuery']
        }
    }
});

require(['JQuery',"cv_addPage"], function($,cv){
    $(function(){
        cv.init();
    });
});