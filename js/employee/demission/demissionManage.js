/**
 * Created by Sasha on 2016/12/13.
 */
define(["JQuery", "BaseClass", "layer","bootstrap","config"], function($,BaseClass,layer) {
	
	var demission = inherit(BaseClass.prototype);
	
	demission.init = function(){
		
		this.event();
		
	};
	
	demission.event = function(){
		/*待离职员工*/
		$.ajax({
			url:'http://172.25.50.30:8080/staff/query.json',
			type:'post',
			dataType:'json',
			data:{
				pageSize:8,
				pageNumber:1
			},
			async:true,
			success:function(pager) {
				/*alert('请求成功');*/
				//遍历读取到分页器对象，拼接HTML，追加到DOM树
				var html = '';
				$.each(pager.data.list, function (i, p) {
					html += '<tr class="text-center"><td class="name">' +
						p.name + '</td> <td class="entryDepartment">' +
						p.mobile + '</td><td class="report">' +
						p.bossName + '</td><td class="employeeType">' +
						p.postName + '</td><td class="effectiveTime">'
						+ p.entrantDateStr + '</td><td class="operate">'+ '<button class="LeaveDealWith" data-toggle="modal" data-target="#LeaveDealWith ">办理离职</button><button class="cancel">取消</button>'+
						'</td></tr>';
				});
				$('.table-toBeLeft tbody').html(html);
				$('.onJob-total-count').html(pager.data.totalCount + '人');
			}
			,
			error:function(){
				alert('请求失败');
			}
		});
		
		$.ajax({
			url:'http://172.25.50.30:9000/diMiss/tree.json',
			type:'post',
			dataType:'json',
			data:{
				pageSize:8,
				pageNumber:1
			},
			async:true,
			success:function(name) {
				/*alert('请求成功');*/
				$('#leave-name').focus(function () {
					$(this).val(name.orgName);
				})
			}
			,
			error:function(){
				alert('请求失败');
			}
		});
		
		
		/*已离职员工*/
		$.ajax({
			url:'http://172.25.50.30:9000/diMiss/leaved.json',
			type:'post',
			dataType:'json',
			async:true,
			success:function(leave) {
				/*alert('请求成功');*/
				//遍历读取到分页器对象，拼接HTML，追加到DOM树
				var html = '';
				$.each(leave.data.leftPersonVOList, function (i, p) {
					html += '<tr class="text-center"><td class="name"><input type="checkbox">' +
						p.name + '</td> <td class=" positionNow">' +
						p.workNumber + ' </td> <td class="entryDepartment">' +
						p.mobile + '</td><td class="report">' +
						p.departmentName + '</td><td class="employeeType">' +
						p.positionName + '</td><td class="phone">' +
						p.duration + '</td><td class="effectiveTime">'
						+ p.type + '</td><td class="operate">'+ p.leftDate+
						'</td> <td class="operate">'+ '<button class="separationCertificate" data-toggle="modal" data-target="#separationCertificate ">打印离职证明</button>'+
						'</td></tr>';
				});
				$('.table-haveLeft tbody').html(html);
				$('.haveLeft-total-count').html(leave.data.totalCount + '人');
			}
			,
			error:function(){
				alert('请求失败');
			}
		});
		
		$('form').on('submit',function (e) {
			e.preventDefault();
			
			var json = [];
			var data = {};
			/*console.log($(this).serializeArray());*/
			/*return ;*/
			$.each($(this).serializeArray(),function (k,v) {
				data[v.name] = v.value;
				json.push(data);
				data = {};
			});
			console.log(JSON.stringify(json));
			var url=null;
			data=JSON.stringify(json);
			$.ajax({
				url:'http://172.25.50.30:8080/staff/query.json',
				type:'post',
				dataType:'json',
				data:data,
				async:true,
				success:function(data){
					alert('请求成功');
				},
				error:function(){
					alert('请求失败');
				}
			});
		});
		
	}
	return demission;
	
})


/*日期格式化函数 yyyy-MM-dd*/
/*月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 例子：
 (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18 */
Date.prototype.format = Date.prototype.format || function(fmt)
	{
		var o = {
			"M+" : this.getMonth()+1,                 //月份
			"d+" : this.getDate(),                    //日
			"h+" : this.getHours(),                   //小时
			"m+" : this.getMinutes(),                 //分
			"s+" : this.getSeconds(),                 //秒
			"q+" : Math.floor((this.getMonth()+3)/3), //季度
			"S"  : this.getMilliseconds()             //毫秒
		};
		if(/(y+)/.test(fmt))
			fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("("+ k +")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		return fmt;
	}