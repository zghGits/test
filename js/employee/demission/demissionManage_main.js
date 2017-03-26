/**
 * Created by Sasha on 2016/12/13.
 */
require.config({
	baseUrl : "/appcenter_web/js",
	paths : {
		"JQuery" : "lib/jquery.min",
		"bootstrap" : "lib/bootstrap.min",
		"demissionManage" : "employee/demission/demissionManage",
		"layer" : "lib/layer.min",
		"BaseClass" : "BaseClass",
		"config" : "config"
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
			exports: "layer"
		}
	}
});

require(["JQuery","demissionManage"], function($, demission){
	$(function(){
		demission.init();
	});
});