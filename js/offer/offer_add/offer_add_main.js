/**
 * Created by zhangys on 2016/11/7.
 */
require.config({
    baseUrl : "/appcenter_web/js",
    paths : {
        "echarts" : "lib/echarts.common.min",
        "JQuery" : "lib/jquery.min",
        "config" : "config",
        "layer" : "lib/layer.min",
        "offer_add" : "offer/offer_add/offer_add",
        "bootstrap" : "lib/bootstrap.min",
        "BaseClass" : "BaseClass",
        "simditor" : "lib/Simdtor/simditor",
        "s_module" : "lib/Simdtor/module",
        "preview" : "offer/preview",
        "iselect" : "offer/iselect",
        'select2':'lib/select2/select2.min',
		'select2-zh-CN':"lib/select2/zh-CN",
        "datetimepicker" : 'lib/bs-datetimepicker/bootstrap-datetimepicker',
        "datetimepicker_zh-CN" :'lib/bs-datetimepicker/bootstrap-datetimepicker.zh-CN',
        'welfare_config' :"offer/welfare_config"
    },
    shim:{
        "JQuery" :{
            exports : "$"
        },
        "layer" :{
            deps : ["JQuery"],
            exports : "layer"
        },
        "s_module" : {
            deps : ["JQuery"]
        },
        "simditor" : {
            deps : ["s_module", "JQuery"],
            exports : "Simditor"
        },
    	"select2":{
			deps: ['JQuery']
		},
		'select2-zh-CN':{
			deps: ['select2']
		},
        "bootstrap" : {
        	deps : ["JQuery"]
        },
        "datetimepicker" : {
        	deps : ["JQuery"]
        },
        "datetimepicker_zh-CN":{
        	deps : ["datetimepicker"]
        }
    }
});

require(["offer_add"], function(offer_add){
    offer_add.init();
});
