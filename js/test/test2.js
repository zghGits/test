/**
 * Created by zhangys on 2016/11/7.
 */
define(["JQuery", "echarts", "BaseClass", "config"], function($, echarts, BaseClass){

    var test = inherit(BaseClass.prototype);

    test.init = function(){
        alert(this.getLocalhostPort());


    };

    return test;
});