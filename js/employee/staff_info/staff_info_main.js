require.config({
	baseUrl:'/appcenter_web/js',
	paths:{
		'jquery':'lib/jquery.min',
		"bootstrap":"lib/bootstrap.min",
		"bootstrap-table":"lib/bootstrap-table",
		"layer" : "lib/layer.min",
		"staff_info":"employee/staff_info/staff_info",
		"wangEditor":"lib/wangEditor.min",
		"bootstrap-datetimepicker":"lib/bootstrap-datetimepicker.min"
	},
	shim:{
		"jquery":{
			exports:"$"
		},
		"bootstrap":{
			deps:['jquery']
		},
		"bootstrap-table":{
			deps:["jquery","bootstrap"]
		},
		"layer":{
			exports:"layer",
			deps:["jquery"]
		},
		"wangEditor":{
			deps:['jquery']
		},
		"bootstrap-datetimepicker":{
			deps:['jquery','bootstrap']
		}
	}
});
//tab标签的事件
require(['jquery','staff_info','bootstrap','bootstrap-table'],function($,cont){
	/*页面全局事件*/
	//滚动条滚动时，tab标签的滚动处理事件
	cont.deal.info_deal();
	//点击tab标签时页面处理
	cont.deal.click_deal();


	/*富文本编辑器*/
	cont.edit.wEdit();

	/*日期插件*/
	cont.date.datetime();

	/*基本信息中的事件*/
	//基本信息中点击下拉事件
	cont.base_event.details();
	//编辑员工基本信息ii
	cont.base_event.staff_edit();
	//使得员工信息有编辑状态变为原始状态
	cont.base_event.staff_close();
	//显示或隐藏详细的信息
	cont.base_event.staff_hos();


	/*家庭情况中的事件*/
	//家庭情况每行鼠标移动上去显示删除的图标
	cont.home_background.jtqk_del();
	//新增家庭renyuan
	cont.home_background.staff_addFam();
	//删除家庭人员
	cont.home_background.staff_delFam();



	/*工作经历中的所有事件*/
	//新增或编辑工作经历
	cont.work_experience.AddorEdit();


	/*资格证书所有事件*/
	//添加资格证书
	cont.qualifications.right();
	//编辑资格证书
	cont.qualifications.editRight();


	/*学历信息*/
	//添加学历信息
	cont.education.experience();
	//编辑学历信息
	cont.education.edit_experience();


	/*兴趣、爱好*/
	//新添加或修改
	cont.interest.intest_con();


	/*成长轨迹*/
	cont.growUp.truning();
});

