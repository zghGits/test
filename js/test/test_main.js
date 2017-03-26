/**
 * Created by zhangys on 2016/11/7.
 */
require.config({
    baseUrl : "/web/appcenter_other/js",
    paths : {
        "echarts" : "echarts.common.min",
        "JQuery" : "jquery.min",
        "test" : "test/test",
        "BaseClass" : "BaseClass",
        "config" : "config"
    },
    shim:{
        "JQuery" :{
            exports : "$"
        },
        "echarts" :{
            exports : "echarts"
        }
    }
});

require(["test"], function(Test){
    new Test();
});
