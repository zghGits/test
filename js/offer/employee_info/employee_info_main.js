/**
 * Created by zhangys on 2016/11/7.
 */
require.config({
    baseUrl : "/appcenter_web/js",
    paths : {
        "JQuery" : "lib/jquery.min",
        "bootstrap" : "lib/bootstrap.min",
        "config" : "config",
        "layer" : "lib/layer.min",
        "employee_info" : "offer/employee_info/employee_info",
        "BaseClass" : "BaseClass"
    },
    shim:{
        "JQuery" :{
            exports : "$"
        },
        "bootstrap" : {
        	deps : ["JQuery"]
        },
        "layer" :{
            deps : ["JQuery"],
            exports : "layer"
        },
    }
});

require(["employee_info"], function(employee_info){
    employee_info.init();
});
