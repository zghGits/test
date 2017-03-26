/**
 * Created by Sasha on 2016/11/22.
 */

require.config({
	baseUrl : "../../js",
	paths : {
		"JQuery" : "lib/jquery.min",
		"bootstrap" : "lib/bootstrap.min",
		"offerList" : "offer/offerList/offerList",
		"layer" : "lib/layer.min",
		"BaseClass" : "BaseClass",
		"config" : "config",
		'select2':'lib/select2/select2.min',
		'select2-zh-CN':"lib/select2/zh-CN",
		'bs-datetimepicker':'lib/bs-datetimepicker/bootstrap-datetimepicker',
		'bs-datetimepicker-zh-CN':'lib/bs-datetimepicker/bootstrap-datetimepicker.zh-CN',
		'jquery-validate':'lib/validate/jquery.validate.min',
		'jquery-validate-zh-CN':'lib/validate/messages_zh.min',
		"simditor" : "lib/Simdtor/simditor",
		"s_module" : "lib/Simdtor/module",
		"preview" : "offer/preview",
		"iselect" : "offer/iselect",
		"cv_createModal" : "offer/cv/cv_createModal",
		'wp_datetimepicker':'common/wp_datetimepicker'
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
		},
		'iselect':{
			deps:['JQuery']
		},
		"s_module" : {
			deps : ["JQuery"]
		},
		"simditor" : {
			deps : ["s_module", "JQuery"],
			exports : "Simditor"
		}
	}
});

require(["JQuery","offerList",'offer/cv/cv_createModal'], function($, offerList, cv){
	$(function(){
		offerList.init();
		
		/*新增候选人简历点击事件*/
		$('.candidateList').on('click','.createResume',function(event){
			$('#cv_createModal').modal('show');
		});
	});
});