/**
 * Created by Sasha on 2016/11/18.
 */

define(["JQuery", "BaseClass", "layer", "preview","wp_datetimepicker","config"], function($,BaseClass,layer,preview,dateTimePicker) {
	
	$.fn.modal.Constructor.prototype.enforceFocus = function () { };  //取消模态框强制获取焦点
	var offerList = inherit(BaseClass.prototype);
	
	var imgSrc = '../../images/'
	
	offerList.init = function(){
		//添加最大化最小化图标
		$(".offerManagement .offer_Btns").append('<div class="winPageBtn">' +
			'<div class="minpage winnodrag"></div>' +
			'<div class="maxpage winnodrag"></div>' +
			'<div class="closepage winnodrag"></div>' +
			'<div class="clear"></div>' +
			'</div>');
		
		this.event();
	};
	
	offerList.event = function(){
		
		createCandidateList(1);   //初始化页面加载候选人列表
		
		/*鼠标悬停显示操作栏数据*/
		$('.offerPanels').on('mouseover mouseout','table tbody tr', function(event){
			if(event.type=='mouseover'){
				$(this).children('.operateTd').children().css('visibility', 'visible');
			}else if(event.type=='mouseout'){
				$(this).children('.operateTd').children().css('visibility', 'hidden');
			}
		});
		
		/*点击列表tab切换面板对应表格内容*/
		$('.offerTabList >li:not(#creatNewOffer)').click(function () {
			$(this).addClass('active').siblings().removeClass('active');
			$('.' + $(this).attr('id')).css('display', 'block').siblings().css('display', 'none');
			switch($(this).attr('id')){
				case 'candidateList':
					createCandidateList(1);   //候选人列表
					break;
				case 'waitingList':
					createWaitingList(1);    //待发offer列表
					break;
				case 'sentList':
					createSentList(1);       //已发offer列表
					break;
				case 'templateList':
					createTemplateList(1);   //offer模板列表
					break;
			}
		});
		
		/*加载候选人列表详情*/
		function createCandidateList(pageNo,keyword){
			if(!keyword){
				$('#searchCandidateList').val('');
			}
			var param = {
				url:'/appcenter/offer/getOfferManagerList.json',
				data:{
					keyword:(keyword)?keyword:'',
					pageNo:pageNo,
					tab:0,
					pageSize:20
				},
				token: offerList.getParameter().token,
				success:function(res){
					if(res.code == 1){
						var data = res.data.offerManagerList;
						if(res.data.count==0){
							$('.candidateList tbody').html('<tr><td colspan="5">没有找到相关数据！</td></tr>');
						}else {
							if(pageNo==1){
								$('.candidateList tbody').html('');
								$('.waitingList .scroll_Div').scrollTop(0);
							}
							var totalPage = Math.ceil(res.data.count/param.data.pageSize);
							sessionStorage.setItem('totalPage', totalPage);
							sessionStorage.setItem('pageNo', param.data.pageNo);
							sessionStorage.setItem('keyword', param.data.keyword);
							$.each(data, function (index, value) {
								var tr = $(document.createElement("tr"));
								tr.attr("id", value["id"]);
								var detailObj ={"rencaiId":value["rencaiId"],"interviewId":value["interviewId"],"name":value["name"],
												"mobile":value["mobile"],"email":value["email"],"companyId":value["companyId"]};
								tr.data("detail",detailObj);
								var html ='',
									testStatusStr = ['未发送', '未完成测评', '查看报告'],
									updateTime = new Date(value['lastModified']).format("yyyy-MM-dd");
								html += '<td class="getResume"><div><span>' + value["name"] + '</span></div>';
								html += '<div><span>' + ((value["applyPosition"] != null && value["applyPosition"] !='null'&& value["applyPosition"] != '')? value["applyPosition"] : "职位暂无") + '</span>';
								if (value["type"] == "全职") {
									html += '<span class="fullTime">' + value["type"] + '</span></div></td>';
								} else {
									html += '<span>' + value["type"] + '</span></div></td>';
								}
								html += '<td class="operateTd"><span class="createOffer"><img src="'+imgSrc+'icon_chuangjianof.svg"/></span>';
								html += '<span class="dropCandidate"><img src="'+imgSrc+'icon_fangqiluyong.svg"/></span></td>';
								if (value['interviewId'] == 'null' || value['interviewId'] == '' || value['interviewId'] == null) {
									html += '<td><span class="non-clickable">暂无记录</span></td>';
								} else {
									html += '<td><span class="interviewRecord">查看详情</span></td>';
								}
								if (value['testStatus'] == 2) {
									html += '<td><span class="testLog">' + testStatusStr[value["testStatus"]] + '</span></td>';
								} else {
									html += '<td><span class="non-clickable">' + testStatusStr[value["testStatus"]] + '</span></td>';
								}
								html += '<td><span  class="non-clickable">' + updateTime + '</span></td>';
								tr.html(html);
								$('.candidateList tbody').append(tr);
							});
						}
					}else{
						layer.msg(res.message);
					}
				}
			}
			offerList._ajax(param);
		};
		
		/*加载待发offer列表详情*/
		function createWaitingList(pageNo,keyword){
			if(!keyword){
				$('#searchWaitingList').val('');
			}
			var param = {
				url:'/appcenter/offer/getOfferManagerList.json',
				data:{
					keyword:(keyword)?keyword:'',
					pageNo:pageNo,
					tab:1,
					pageSize:20
				},
				token: offerList.getParameter().token,
				success:function(res){
					if(res.code == 1){
						var data = res.data.offerManagerList;
						if(res.data.count==0){
							$('.waitingList tbody').html('<tr><td colspan="6">没有找到相关数据！</td></tr>');
						}else {
							if(pageNo==1){
								$('.waitingList .scroll_Div').scrollTop(0);
								$('.waitingList tbody').html('');
							}
							$('.waitingList table th .selectAll').removeClass('checked_y');
							var totalPage = Math.ceil(res.data.count/param.data.pageSize);
							sessionStorage.setItem('totalPage', totalPage);
							sessionStorage.setItem('pageNo', param.data.pageNo);
							sessionStorage.setItem('keyword', param.data.keyword);
							$.each(data, function(index, value){
								var tr = $(document.createElement("tr"));
								tr.attr("id", value["id"]);
								var detailObj ={"offerId":value["offerId"],"companyId":value["companyId"],"name":value["name"],"rencaiId":value["rencaiId"],"userId":value["userId"],
									"interviewId":value["interviewId"],"mobile":value["mobile"],"email":value["email"],"processId":value["processId"]};
								detailObj.isAuditStatus = value["status"]=="暂未发送"?false:true;  //false表示草稿状态offer，true表示审批中状态offer
								tr.data("detail",detailObj);
								var html ='',
									testStatusStr = ['未发送','未完成测评','查看报告'],
									auditAssignees = [],   //当前审批人数组
									auditAssigneeStr = '',
									currentIndex = null; //当前审批人在整个审批流程中的索引号
								/*迭代处理审批人审批状态流*/
								if(value['auditStatus']!=null){
									auditAssignees = value['auditStatus'].split('<<');
								}
								for(var i=0; i<auditAssignees.length; i++){
									if(auditAssignees[i].indexOf('current') != -1){
										currentIndex = i;
									}
									if(currentIndex==null){
										auditAssigneeStr += '<span class="passAudit">'+auditAssignees[i]+'</span>';
									}else if(currentIndex == i){
										
										auditAssigneeStr += auditAssignees[i].replace('current',(value["status"]=='审批不通过'?'failAudit':''));
									}else{
										auditAssigneeStr += '<span>'+auditAssignees[i]+'</span>';
									}
								}
								if(value["status"]=='审批中'){
									html += '<td><span class="offer_checkbox non-clickable"></span></td>';
								}else{
									html += '<td><span class="offer_checkbox"></span></td>';
								}
								html += '<td class="getResume"><div><span>'+value["name"]+'</span></div>';
								if(value["type"]=="全职"){
									html += '<div><span>'+value["applyPosition"]+'</span><span class="fullTime">'+value["type"]+'</span></div></td>';
								}else{
									html += '<div><span>'+value["applyPosition"]+'</span><span>'+value["type"]+'</span></div></td>';
								}
								html += '<td class="operateTd">';
								if(value["status"]=='审批中'){
									html += '<span class="non-clickable"><img src="'+imgSrc+'icon_fasong_12.svg"/></span>';
								}else{
									html += '<span class="sendOffer"><img src="'+imgSrc+'icon_fasong.svg"/></span>';
								}
								html += '<span class="editOffer"><img src="'+imgSrc+'icon_chongmingming.svg"/></span>';
								html += '<span class="downloadOffer"><img src="'+imgSrc+'icon－xiazai－hov.svg"/></span>';
								html += '<span class="dropCandidate"><img src="'+imgSrc+'icon_fangqiluyong.svg"/></span></td>';
								if(value['interviewId']=='null' || value['interviewId']=='' || value['interviewId']==null){
									html += '<td><span class="non-clickable">暂无记录</span></td>';
								}else{
									html += '<td><span class="interviewRecord">查看详情</span></td>';
								}
								if(value['testStatus']==2){
									html += '<td><span class="testLog">'+testStatusStr[value["testStatus"]]+'</span></td>';
								}else{
									html += '<td><span class="non-clickable">'+testStatusStr[value["testStatus"]]+'</span></td>';
								}
								if(value["status"]=='审批中' || value["status"]=='审批不合格'){
									html += '<td class="auditStatus"><div><span>'+value["status"]+'</span></div>';
									html += '<div>'+ auditAssigneeStr +'</div></td>';
								}else if(value["status"]=='撤销'){
									html += '<td><span>审批已撤销</span></td>';
								}else{
									html += '<td><span style="font-size:28px">-</span></td>';
								}
								tr.html(html);
								$('.waitingList tbody').append(tr);
							});
						}
					}else{
						layer.msg(res.message);
					}
				}
			}
			offerList._ajax(param);
		};
		
		/*加载已发offer列表详情*/
		function createSentList(pageNo,keyword,status){
			if(!keyword){
				$('#searchSentList').val('');
			}
			if(!status || status==''){
				$('.sentListToolBar button#allStatus').addClass('selectedStatus').siblings().removeClass('selectedStatus');
			}
			var param = {
				url:'/appcenter/offer/getOfferManagerList.json',
				data:{
					keyword:(keyword)?keyword:'',
					pageNo:pageNo,
					tab:2,
					pageSize:20,
					status:(status)?status:''
				},
				token: offerList.getParameter().token,
				success:function(res){
					if(res.code == 1){
						var data = res.data.offerManagerList;
						if(res.data.count==0){
							$('.sentList tbody').html('<tr><td colspan="6">没有找到相关数据！</td></tr>');
						}else {
							if(pageNo==1){
								$('.sentList .scroll_Div').scrollTop(0);
								$('.sentList tbody').html('');
							}
							var totalPage = Math.ceil(res.data.count/param.data.pageSize);
							sessionStorage.setItem('totalPage', totalPage);
							sessionStorage.setItem('pageNo', param.data.pageNo);
							sessionStorage.setItem('keyword', param.data.keyword);
							sessionStorage.setItem('status', param.data.status);
							$.each(data, function(index, value) {
								var tr = $(document.createElement("tr"));
								tr.attr("id", value["id"]);
								var detailObj ={"offerId":value["offerId"],"rencaiId":value["rencaiId"],"interviewId":value["interviewId"],"name":value["name"],
									"mobile":value["mobile"],"email":value["email"],"companyId":value["companyId"]};
								tr.data("detail",detailObj);
								var html ='',
									registerTime = new Date(value['registerTime']).format("yyyy-MM-dd"),
									sendTime = new Date(value['sendTime']).format("yyyy-MM-dd"),
									isSendForm = ['未发送', '已发送', '已回执', '发送失败'];
								html += '<td class="getResume"><div><span>' + value["name"] + '</span></div>';
								if (value["type"] == "全职") {
									html += '<div><span>' + value["applyPosition"] + '</span><span class="fullTime">' + value["type"] + '</span></div></td>';
								} else {
									html += '<div><span>' + value["applyPosition"] + '</span><span>' + value["type"] + '</span></div></td>';
								}
								html += '<td class="operateTd"><span class="reviewOffer"><img src="'+imgSrc+'icon－chakan－hov.svg"/></span>';
								if (value["status"] == '被放鸽子' || value["status"] == '已入职') {
									html += '<span class="non-clickable"><img src="'+imgSrc+'icon_bianji_def.svg"/></span>';
								} else {
									html += '<span class="amendOffer"><img src="'+imgSrc+'icon_bianji.svg"/></span>';
								}
								html += '<span class="downloadOffer"><img src="'+imgSrc+'icon－xiazai－hov.svg"/></span>';
								if (value["status"] == '被放鸽子' || value["status"] == '已入职') {
									html += '<span class="non-clickable"><img src="'+imgSrc+'icon－fanggezi－def.svg"/></span></td>';
								} else {
									html += '<span class="offerRejected"><img src="'+imgSrc+'icon－fanggezi－hov.svg"/></span></td>';
								}
								if (value['registerTime'] <= new Date()) {
									html += '<td><span class="overdue non-clickable">' + registerTime + '</span></td>';
								} else {
									html += '<td><span  class="non-clickable">' + registerTime + '</span></td>';
								}
								html += '<td><span class="non-clickable">' + sendTime + '</span></td>';
								if (value['status'] == '已发offer') {
									html += '<td><span class="toBeHired non-clickable">待入职</span></td>';
								} else {
									html += '<td><span class="non-clickable">' + value['status'] + '</span></td>';
								}
								if(value['isSendForm']==2){
								    html += '<td><span class="reg_receipt">'+ '已回执' +'</span></td></tr>';
								 }else{
									html += '<td><span class="non-clickable">' + isSendForm[(value['isSendForm']) ? (value['isSendForm']) : 0] + '</span></td></tr>';
								}
								tr.html(html);
								$('.sentList tbody').append(tr);
							});
						}
					}else{
						layer.msg(res.message);
					}
				}
			}
			offerList._ajax(param);
		};
		
		/*加载offer模板列表详情*/
		function createTemplateList(pageNo){
			var param = {
				url:'/appcenter/offerTemplate/list.json',
				data:{
					pageNo: pageNo,
					pageSize: 99
				},
				token: offerList.getParameter().token,
				success:function(res){
					if(res.code == 1){
						var html ='',
							data = res.data.list;
						sessionStorage.setItem('totalPage', res.data.totalPage);
						sessionStorage.setItem('pageNo', param.data.pageNo);
						$.each(data, function(index, value){
							html += '<li id="'+value["id"]+'" class="col-xs-4 col-md-3"><div>';
							html += '<div class="template_title"><span>'+value["title"]+'</span></div>';
							html += '<div class="template_img"><img src="'+imgSrc+'offer/offerModel.png"/></div>';
							html += '<div class="template_cover"><div><span class="temp_edit">编辑模板</span></div>';
							html += '<div class="temp_operate"><div class="view"><img src="'+imgSrc+'icon－chakan－hov.svg"/></div><div class="v_line"></div>';
							html += '<div class="rename"><img src="'+imgSrc+'icon－bianji－chongmingmin－bianji－default.svg"/></div><div class="v_line"></div>';
							html += '<div class="export"><img src="'+imgSrc+'icon－shuchu－daochu－hoved.svg"/></div><div class="v_line"></div>';
							html += '<div class="copy"><img src="'+imgSrc+'icon－fuzhi－hoved.svg"/></div><div class="v_line"></div>';
							html += '<div class="delete"><img src="'+imgSrc+'icon－shanchu－hoved.svg"/></div></div></div></div></li>';
						});
						if(pageNo==1){
							html += '<li class="col-xs-4 col-md-3 newTemplate"><div><img id="createNewTemplate" src="'+imgSrc+'offer/createTemplate.png"/></div></li>'; //新建模板标签
							$('.templateList').scrollTop(0);
							$('.templateList >ul').html(html);
						}else if(html!=''){
							$('.templateList >ul >li.newTemplate').before(html);
						}
					}else{
						layer.msg(res.message);
					}
				}
			}
			offerList._ajax(param);
		};
		
		/*候选人列表部分滚动加载*/
		$('.candidateList .scroll_Div').scroll(function(){
			var scrollTop = $(this).scrollTop(),
				wrapHeight = $(this).height(),
				tableHeight = $('.candidateList .contentTable').height();
			if(scrollTop + wrapHeight >= tableHeight){
				var totalPage = parseInt(sessionStorage.getItem('totalPage'));
				var pageNo = parseInt(sessionStorage.getItem('pageNo'))+1;
				var keyword = sessionStorage.getItem('keyword');
				if( totalPage < pageNo){
					return;
				}else{
					createCandidateList(pageNo,keyword);
				}
			}
		})
		
		/*待发offer列表部分滚动加载*/
		$('.waitingList .scroll_Div').scroll(function(){
			var scrollTop = $(this).scrollTop(),
				wrapHeight = $(this).height(),
				tableHeight = $('.waitingList .contentTable').height();
			if(scrollTop + wrapHeight >= tableHeight){
				var totalPage = parseInt(sessionStorage.getItem('totalPage'));
				var pageNo = parseInt(sessionStorage.getItem('pageNo'))+1;
				var keyword = sessionStorage.getItem('keyword');
				/*console.log(totalPage +' '+pageNo)*/
				if( totalPage < pageNo){
					return;
				}else{
					createWaitingList(pageNo,keyword);
				}
			}
		})
		
		/*已发offer列表部分滚动加载*/
		$('.sentList .scroll_Div').scroll(function(){
			var scrollTop = $(this).scrollTop(),
				wrapHeight = $(this).height(),
				tableHeight = $('.sentList .contentTable').height();
			if(scrollTop + wrapHeight >= tableHeight){
				var totalPage = parseInt(sessionStorage.getItem('totalPage'));
				var pageNo = parseInt(sessionStorage.getItem('pageNo'))+1;
				var keyword = sessionStorage.getItem('keyword');
				var status = sessionStorage.getItem('status');
				/*console.log(totalPage +' '+pageNo +' '+status);*/
				if( totalPage < pageNo){
					return;
				}else {
					createSentList(pageNo, keyword, status);
				}
			}
		})
		
		/*offer模板列表部分滚动加载*/
		$('.offerPanels .templateList').scroll(function(){
			var scrollTop = $(this).scrollTop(),
				wrapHeight = $(this).height(),
				tableHeight = $('.templateList >ul').height();
			if(scrollTop + wrapHeight >= tableHeight){
				var totalPage = parseInt(sessionStorage.getItem('totalPage'));
				var pageNo = parseInt(sessionStorage.getItem('pageNo'))+1;
				/*console.log(totalPage +' '+pageNo)*/
				if( totalPage < pageNo){
					return;
				}else {
					createTemplateList(pageNo);
				}
			}
		})
		
		/*操作图标文本提示*/
		$('.offerPanels tbody ').on('mouseover mouseout','td.operateTd>span:not(".non-clickable")', function(event){
			if(event.type=='mouseover'){
				var _msg = $(this).attr('class'),
					msg_data = {
						'createOffer': '创建offer', 'dropCandidate': '放弃录用', 'editOffer': '编辑', 'sendOffer': '发送offer',
						'downloadOffer': '下载', 'reviewOffer': '查看', 'amendOffer': '修改报到时间', 'offerRejected': '被放鸽子'
					},
					leftPx = $(this).position().left,
					topPx = $(this).position().top + 130;
				$('.hintMsg >span').text(msg_data[_msg]);
				$('.hintMsg').css({
					"display": "block",
					"left": leftPx,
					"top": topPx
				});
			}else if(event.type=='mouseout'){
				$('.hintMsg').css('display', 'none');
			}
		});
		
		/*候选人列表搜索事件*/
		$("#searchCandidateList").keyup(function(event){
			if(event.keyCode == 13){
				var keyword = $('#searchCandidateList').val();
				createCandidateList(1,keyword);
			}
		});
		
		/*候选人列表创建新offer*/
		$('.candidateList').on('click', '.createOffer', function () {
			var offerDataObj ={};
			offerDataObj.offerManagerId = $(this).parents('tr').attr('id');
			offerDataObj.employeeName = $(this).parents('tr').data('detail').name;
			offerDataObj.employeeMobile = $(this).parents('tr').data('detail').mobile;
			offerDataObj.employeeEmail = $(this).parents('tr').data('detail').email;
			offerDataObj.resumeId = $(this).parents('tr').data('detail').rencaiId;
			var offerData = JSON.stringify(offerDataObj);
			sessionStorage.setItem('offerData',offerData);
			location.href = './offer_add.html?token=' + offerList.getParameter().token;
		});
		
		/*待发offer列表搜索事件*/
		$("#searchWaitingList").keyup(function(event){
			if(event.keyCode == 13){
				var keyword = $('#searchWaitingList').val();
				createWaitingList(1,keyword);
			}
		});
		
		/*待发offer列表复选框全选-取消全选*/
		$('.waitingList').on('click', '.selectAll', function () {
			$(this).toggleClass('checked_y')
			if($(this).hasClass('checked_y')){
				$('.waitingList .offer_checkbox:not(".non-clickable")').addClass('checked_y');
			}else{
				$('.waitingList .offer_checkbox').removeClass('checked_y');
			}
		});
		
		/*待发offer子列表复选框选中-取消选中*/
		$('.waitingList').on('click', '.offer_checkbox:not(".non-clickable")', function () {
			$(this).toggleClass('checked_y')
			if($(this).hasClass('checked_y')){
				var list = $(".waitingList .offer_checkbox");
				for(var i=0; i<list.length; i++){
					if(!list.eq(i).hasClass('checked_y')){
						$('.waitingList .selectAll').removeClass('checked_y');
						return;
					}
				}
				$('.waitingList .selectAll').addClass('checked_y');
			}else{
				$('.waitingList .selectAll').removeClass('checked_y');
			}
		});
		
		/*待发offer线下发送后标记为已发offer*/
		$('.waitingList').off('click', '#markAsSent').on('click', '#markAsSent', function () {
			var obj = $('.waitingList .offer_checkbox.checked_y');
			if(obj.length<1){
				layer.msg('请至少选择一条记录！',{time:1500})
			}else{
				layer.confirm('<h5 style="color: #546576;">您选中了'+obj.length+'个offer</h5><h5 style="color: #546576;">确定已经发送给相应的候选人？</h5>',
					{'title':false},
					function () {
						var offerId = [];
						for(var i=0; i<obj.length; i++){
							offerId.push(obj.eq(i).parents('tr').data('detail').offerId);
						}
						var offerIdStr = offerId.join(',');
						var param = {
							url:'/appcenter/offer/isAlreadySend.json',
							data:{
								offerid:offerIdStr
							},
							token: offerList.getParameter().token,
							success:function(res) {
								if (res.code == 1) {
									layer.msg('操作成功！')
									createWaitingList(1);
								} else {
									layer.msg(res.message);
								}
							}
						}
						offerList._ajax(param);
					},
					function () {
						layer.closeAll();
					}
				)
			}
			
		});
		
		/*待发offer列表编辑offer*/
		$('.waitingList').on('click', '.editOffer', function () {
			var offerDataObj ={};
			offerDataObj.offerManagerId = $(this).parents('tr').attr('id');
			offerDataObj.employeeName = $(this).parents('tr').data('detail').name;
			offerDataObj.employeeMobile = $(this).parents('tr').data('detail').mobile;
			offerDataObj.employeeEmail = $(this).parents('tr').data('detail').email;
			offerDataObj.resumeId =  $(this).parents('tr').data('detail').rencaiId;
			offerDataObj.isAuditStatus = $(this).parents('tr').data('detail').isAuditStatus; //false表示草稿offer编辑，true表示审批中编辑
			var offerId = $(this).parents('tr').data('detail').offerId,
				companyId = $(this).parents('tr').data('detail').companyId;
			offerDataObj.offerId = offerId;
			var param = {
				url:'/appcenter/offer/queryOfferById.json',
				data:{
					offerId:offerId,
					companyId:companyId
				},
				token: offerList.getParameter().token,
				success:function(res) {
					if(res.code==1){
						for(var key in res.data){
							if(res.data[key]!==null && res.data[key]!=''){
								offerDataObj[key] = res.data[key];
							}
							if(key == 'entryDate'){
								offerDataObj[key] = new Date(res.data[key]).format("yyyy-MM-dd hh:mm");
							}
						}
						var offerData = JSON.stringify(offerDataObj);
						sessionStorage.setItem('offerData',offerData);
						location.href = './offer_add.html?token=' + offerList.getParameter().token;
					}else{
						layer.msg(res.message);
					}
				}
			}
			offerList._ajax(param);
		});
		
		/*待发offer审批状态弹窗*/
		$('.waitingList').on('click', '.auditStatus', function () {
			var processId = $(this).parents('tr').data('detail').processId,
				offerId = $(this).parents('tr').data('detail').offerId,
				userId = $(this).parents('tr').data('detail').userId;
			/*获取审批模态框数据*/
			var param = {
				url:'/appcenter/offer/queryApprovalInfo.json',
				data:{
					processId:processId
				},
				token: offerList.getParameter().token,
				success:function(res) {
					if (res.code == 1) {
						/*//测试用数据
						var res = { "code": "1",
									"message": "成功",
									"data": {
										"auditPeople": "10841-徐岩,10842-陈亮,10843-理想,10844-王一鸣",
										"offerRecordList": [
											{
												"id": 1001,
												"assignee": "李四",
												"assigneeId": 3073,
												"decision": "发放offer",
												"comment": null
											},
											{
												"id": 1002,
												"assignee": "徐岩",
												"assigneeId": 10841,
												"decision": "同意",
												"comment": "哎哟，不错"
											},
											{
												"id": 3073,
												"assignee": "陈亮",
												"assigneeId": 10842,
												"decision": "拒绝",
												"comment": "no no no no"
											}
										]
									}
								};*/
						$('#auditStatusModal').modal('show');
						var auditNameHtml = '',
							auditCommentHtml = '',
							auditPeople = res.data.auditPeople.split('|'),
							auditRecord = res.data.offerRecordList;
						for(var i=0; i<auditPeople.length; i++){
							var id = auditPeople[i].split('-')[0],      //获取审批人id
								name = auditPeople[i].split('-')[1],    //获取审批人名字
								status = 'in_process',
								comment = '',
								subName = offerList.subName(name),   //获取审批人名字后两位
								checkCh = offerList.checkCh(name);   //获取审批人名字后两位;
							for(var j=0; j<auditRecord.length; j++){
								if (id == auditRecord[j].assigneeId){
									if(auditRecord[j].decision=='同意'){
										status = 'passed';
									}else if(auditRecord[j].decision=='拒绝'){
										status = 'rejected';
									}
									comment = auditRecord[j].comment?auditRecord[j].comment:'';
								}
							}
							auditNameHtml += '<div><span class="auditName '+status+' contact_bg_'+checkCh+'" title="'+name+'">'+ subName +'</span>';
							if(status=='passed'){
								auditNameHtml += '<span class="passLable">√</span></div>';
							}else if(status=='rejected'){
								auditNameHtml += '<span class="rejectLable">x</span></div>';
							}else{
								auditNameHtml += '</div>';
							}
							if(i < auditPeople.length-1){
								auditNameHtml += '<span class="h_line"></span>';
							}
							auditCommentHtml += '<span class="auditComment">'+ comment +'</span>';
						}
						$('#auditStatusModal .auditNameDiv').html(auditNameHtml);
						$('#auditStatusModal .auditCommentDiv').html(auditCommentHtml);
					} else {
						layer.msg(res.message);
					}
				}
			}
			offerList._ajax(param);
			/*撤销审批 - 需传processId和userId - 模态框加载完成之后*/
			$('#auditStatusModal').on('shown.bs.modal',function(){
				$('#auditStatusModal .btn').off('click').on('click',function(){
					layer.prompt({
						formType: 2,
						value: '',
						title: '撤销审批理由',
						area: ['300px', '80px']
					}, function(value, index, elem){
						var param = {
							url:'/appcenter/offer/repealApprovalInfo.json',
							data:{
								processId:processId,
								offerid:offerId,
								userId:userId,
								comment:value,
								decision:'撤销审批'
							},
							token: offerList.getParameter().token,
							success:function(res) {
								if(res.code==1){
									$('#auditStatusModal').modal('hide');
									layer.msg('撤销审批成功',{time:1500});
									createWaitingList(1);
								}else{
									layer.msg(res.message);
								}
							}
						}
						offerList._ajax(param);
						layer.close(index);
					});
				})
			});
		});
		
		/*审批状态模态框关闭时清空数据*/
		$(document).on('hidden.bs.modal','#auditStatusModal',function(e) {
			$('#auditStatusModal .auditNameDiv').html('');
			$('#auditStatusModal .auditCommentDiv').html('');
		});
		
		/*待发offer预览offer*/
		$('.waitingList').on('click', '.sendOffer', function () {
			var offerId = $(this).parents('tr').data('detail').offerId,
				companyId = $(this).parents('tr').data('detail').companyId;
			var offerDataObj ={};
			offerDataObj.id = offerId;
			offerDataObj.offerManagerId = $(this).parents('tr').attr('id');
			offerDataObj.employeeName = $(this).parents('tr').data('detail').name;
			offerDataObj.employeeMobile = $(this).parents('tr').data('detail').mobile;
			offerDataObj.employeeEmail = $(this).parents('tr').data('detail').email;
			offerDataObj.resumeId =  $(this).parents('tr').data('detail').rencaiId;
			offerDataObj.sendOffer = 1;
			var param = {
				url:'/appcenter/offer/queryOfferById.json',
				data:{
					offerId:offerId,
					companyId:companyId
				},
				token: offerList.getParameter().token,
				success:function(res) {
					if(res.code==1){
						for(var key in res.data){
							if(res.data[key]!==null && res.data[key]!=''){
								offerDataObj[key] = res.data[key];
							}
							if(key == 'entryDate'){
								offerDataObj[key] = new Date(res.data[key]).format("yyyy-MM-dd hh:mm");
							}
							if(key=='sendEmail'||key=='sendSms'||key=='notifyEmployee'||key=='notifyHr'||key=='notifyOrg'||key=='needAudit'){
								offerDataObj[key] = res.data[key]?res.data[key]:0;
							}
						}
						preview.template_view(offerDataObj,'preview',1);
						/*offer预览后发送*/
						$('#preview').off('shown.bs.modal').on('shown.bs.modal',function(){
							$('#preview .btn-success').on('click',function(){
								var param = {
									url:'/appcenter/offer/updateOffer.json',
									data: offerDataObj,
									token: offerList.getParameter().token,
									success:function(res) {
										if (res.code == 1) {
											createWaitingList(1);
											$('#preview').modal('hide');
										} else {
											layer.msg('发送失败');
										}
									}
								}
								offerList._ajax(param);
							})
						});
					}else{
						layer.msg(res.message);
					}
				}
			}
			offerList._ajax(param);
		});
		
		/*查看面试记录弹窗*/
		$('.offerPanels').on('click','.interviewRecord',function(){
			var interviewId = $(this).parents('tr').data('detail').interviewId;
			var param = {
				url:'/appcenter/offer/getInterviewDetail.json',
				data:{
					interviewId:interviewId,
				},
				token: offerList.getParameter().token,
				success:function(res) {
					if (res.code == 1) {
						$('#interviewRecModal').modal('show');
						$('#interviewRecModal .modal-title').text(res.data.name+'的面试记录');
						/*先判断面试有多少轮，每增一轮面试增加一条面试记录*/
						var html = '';
						for(var i=res.data.round; i>=0; i--){
							html += '<div class="round_'+i+'"><div class="interviewTime"></div>';
							html += '<div class="interviewDetail"><div class="interviewTitle"></div>';
							html += '<div class="interviewContent"></div></div></div>';
						}
						$('#interviewRecModal .modal-body').html(html);
						/*逐个解析每一条面试记录*/
						var data = res.data.recordList;
						$.each(data,function(index, value){
							var nodeNameArr = value['nodeName'].split('|'),
								nodeName = nodeNameArr[0],
								round = null,
								updatedTime = new Date(value["updatedTime"]).format("yyyy-MM-dd");
							if(nodeNameArr[1]){
								round = nodeNameArr[1];
							}else{
								round = 0;   //发出邀约round为0
							}
							if(nodeNameArr[0]=='HRMakeResult'){
								var resultHtml ='<span>第'+ round +'轮：'+ value["decision"] +'</span><span>应聘职位：测试</span>'
									+'<span>操作人：'+ value["assignee"] +'</span>';
								$('.round_'+round+' .interviewTime').text(updatedTime);
								$('.round_'+round+' .interviewTitle').append(resultHtml);
							}else if(nodeNameArr[0]=='HRFollow' || nodeNameArr[0]=='Interview' ){
								var followHtml = '<div><span>'+ value["assignee"] +':['+ value["decision"]+']'
									+ updatedTime +'</span><span>'+value["comment"]+'</span></div>';
								$('.round_'+round+' .interviewContent').append(followHtml);
							}else if(nodeNameArr[0]=='start'){
								var startHtml ='<span>'+ value["decision"] +'</span><span>应聘职位：测试</span>'
									+'<span>操作人：'+ value["assignee"] +'</span>';
								$('.round_'+round+' .interviewTime').text(updatedTime);
								$('.round_'+round+' .interviewTitle').append(startHtml);
								$('.round_'+round+' .interviewContent').append('<div><span>'+value["comment"]+'</span></div>');
							}
						})
						
					} else {
						layer.msg(res.message);
					}
				}
			}
			offerList._ajax(param);
		})
		
		/*查看测评记录弹窗*/
		$('.offerPanels').on('click','.testLog',function(){
			var rencaiId = $(this).parents('tr').data('detail').rencaiId,
				name =  $(this).parents('tr').data('detail').name;
			var param = {
				url:'/appcenter/offer/getTestLog.json',
				data:{
					rencaiId:rencaiId
				},
				token: offerList.getParameter().token,
				success:function(res) {
					if (res.code == 1) {
						$('#testLogModal').modal('show');
						$('#testLogModal .modal-title').text(name+'的测评记录');
						var html ='';
						$.each(res.data,function (index,value) {
							html += '<tr><td id="'+value["id"]+'">'+new Date(value["createTime"]).format("yyyy-MM-dd")+'</td>';
							html += '<td>'+ value["itemName"] +'</td>';
							html += '<td>'+ value["itemScore"] +'</td>';
							html += '<td>'+ value["description"] +'</td></tr>';
						})
						$('#testLogModal table tbody').html(html);
					} else {
						layer.msg(res.message);
					}
				}
			}
			offerList._ajax(param);
		})
		
		/*已发offer列表搜索事件*/
		$("#searchSentList").keyup(function(event){
			if(event.keyCode == 13){
				var statusArg = {"allStatus":"","offeredStatus":"待入职","employedStatus":"已入职","offRejectedStatus":"被放鸽子"},
					keyword = $('#searchSentList').val(),
					status = statusArg[$('.sentListToolBar button.selectedStatus').attr('id')];
				createSentList(1,keyword,status);
			}
		});
		
		/*已发offer修改报到时间弹窗*/
		$('.sentList').on('click','.amendOffer',function(){
			$('#hiredateEditModal').modal('show');
			/*初始化时间*/
			function registTimeConfigInit(){
				dateTimePicker.dateTimePickerBind({
					datePicker:'#hiredateEditModal .setRegistTime',
					dateInput:'#hiredateEditModal .setRegistTime'
				});
			};
			registTimeConfigInit();
			var offerId = $(this).parents('tr').data('detail').offerId;
			$('#hiredateEditModal').off('shown.bs.modal').on('shown.bs.modal',function(){
				/*修改复选框样式更改*/
				$('#hiredateEditModal .notify_checkbox').off('click').on('click',function(){
						$(this).toggleClass('checked_y');
				})
				/*提交修改报到时间*/
				$('#hiredateEditModal .btn-success').off('click').on('click',function(){
					var registerTime = $('.setRegistTime').val(),
						hrReminder = $('.notifyHr').hasClass('checked_y')?1:0,
						employeeReminder = $('.notifyOrg').hasClass('checked_y')?1:0,
						candidateReminder = $('.notifyCandidate').hasClass('checked_y')?1:0;
					if(registerTime==null || registerTime ==''){
						layer.msg('请选择新的报到时间',{time:1500});
						return;
					}
					var param = {
						url:'/appcenter/offer/updateOfferTime.json',
						data:{
							offerId:offerId,
							registerTime:registerTime,
							hrReminder:hrReminder,
							employeeReminder:employeeReminder,
							candidateReminder:candidateReminder
						},
						token: offerList.getParameter().token,
						success:function(res) {
							if (res.code == 1) {
								layer.msg('修改报到时间成功',{time:1500});
								$('#hiredateEditModal').modal('hide');
								createSentList(1);
							} else {
								layer.msg(res.message);
							}
						}
					}
					offerList._ajax(param);
				});
			})
		});
		
		/*修改时间模态框关闭时清空数据*/
		$(document).on('hidden.bs.modal','#hiredateEditModal',function(e) {
			$('#hiredateEditModal .setRegistTime').val('');
			$('#hiredateEditModal .notify_checkbox').eq(0).addClass('checked_y');
			$('#hiredateEditModal .notify_checkbox').eq(1).removeClass('checked_y');
			$('#hiredateEditModal .notify_checkbox').eq(2).removeClass('checked_y');
		});
		
		/*已发offer查看offer详情*/
		$('.sentList').on('click','.reviewOffer',function(event){
			var offerId = $(this).parents('tr').data('detail').offerId,
				companyId = $(this).parents('tr').data('detail').companyId;
			var offerDataObj ={};
			offerDataObj.offerId = offerId;
			offerDataObj.offerManagerId = $(this).parents('tr').attr('id');
			offerDataObj.employeeName = $(this).parents('tr').data('detail').name;
			offerDataObj.employeeMobile = $(this).parents('tr').data('detail').mobile;
			offerDataObj.employeeEmail = $(this).parents('tr').data('detail').email;
			offerDataObj.resumeId =  $(this).parents('tr').data('detail').rencaiId;
			var param = {
				url:'/appcenter/offer/queryOfferById.json',
				data:{
					offerId:offerId,
					companyId:companyId
				},
				token: offerList.getParameter().token,
				success:function(res) {
					if(res.code==1){
						for(var key in res.data){
							if(res.data[key]!==null && res.data[key]!=''){
								offerDataObj[key] = res.data[key];
							}
							if(key == 'entryDate'){
								offerDataObj[key] = new Date(res.data[key]).format("yyyy-MM-dd hh:mm");
							}
						}
						preview.template_view(offerDataObj,'preview');
					}else{
						layer.msg(res.message);
					}
				}
			}
			offerList._ajax(param);
		})
		
		/*待发+已发offer下载*/
		$('.offerPanels').on('click','.downloadOffer',function(event){
			var offerId = $(this).parents('tr').data('detail').offerId;
			window.location = offerList.getLocalhostPort()+'/appcenter/offer/downloadSentOffer?token='+offerList.getParameter().token+'&offerId='+offerId;
			console.log(window.location);
		})
		
		/*已发offer被放鸽子*/
		$('.sentList').on('click','.offerRejected',function(event){
			var id = $(this).parents('tr').attr('id');
			layer.confirm('<h4>确认修改状态为被放鸽子？</h4>',
				{title: false},
				function() {
					var param = {
						url:'/appcenter/offer/close.json',
						data:{
							id:id,
							status:1,
							sendReject:false
						},
						token: offerList.getParameter().token,
						success:function(res) {
							if (res.code == 1) {
								layer.msg('状态修改成功');
								createSentList(1);
							} else {
								layer.msg(res.message);
							}
						}
					}
					offerList._ajax(param);
				},
				function() {
					layer.closeAll();
				}
			);
		})
		
		/*已发offer状态筛选*/
		$('.sentList').on('click','.sentListToolBar button',function(){
			$(this).addClass('selectedStatus').siblings().removeClass('selectedStatus');
			var statusArg = {"allStatus":"","offeredStatus":"待入职","employedStatus":"已入职","offRejectedStatus":"被放鸽子"},
				keyword = $('#searchSentList').val(),
				status = statusArg[$(this).attr('id')];
			createSentList(1,keyword,status);
		})
		
		/*offer模板编辑遮罩层显示*/
		$('.templateList').on('mouseover mouseout','>ul >li >div', function(event){
			if(event.type=='mouseover'){
				$(this).children('.template_cover').css('display', 'block');
			}else if(event.type=='mouseout'){
				$(this).children('.template_cover').css('display', 'none');
			}
		});
		
		/*offer模板操作按钮提示框显示*/
		$('.templateList').on('mouseover mouseout','.temp_operate>div:not(".v_line")', function(event){
			if(event.type=='mouseover'){
				var _msg = $(this).attr('class'),
					msg_data = {'view': '查看', 'rename': '重命名', 'export': '导出', 'copy': '复制', 'delete': '删除'},
					leftPx = event.clientX - 30 + 'px';
					topPx = event.clientY - 50 + 'px';
				$('.hintMsg >span').text(msg_data[_msg]);
				$('.hintMsg').css({
					"display": "block",
					"left": leftPx,
					"top": topPx
				});
			}else if(event.type=='mouseout'){
				$('.hintMsg').css('display', 'none');
			}
		});
		
		/*offer模板删除*/
		$('.templateList').on('click','.temp_operate .delete',function(){
			var templateId = $(this).parents('li').attr('id'),
				templateObj = $(this).parents('li');
			layer.confirm('<h4>是否确认删除该模板？</h4>',
				{'title':false},
				function () {
					var param = {
						url:'/appcenter/offerTemplate/delete.json',
						data:{
							templateId:templateId
						},
						token: offerList.getParameter().token,
						success:function(res) {
							if (res.code == 1) {
								templateObj.remove();
								// createTemplateList(1);
								layer.msg('该模板已删除');
							} else {
								layer.msg(res.message);
							}
						}
					}
					offerList._ajax(param);
				},
				function () {
					layer.closeAll();
				}
			)
		});
		
		/*offer模板复制*/
		$('.templateList').on('click','.temp_operate .copy',function(){
			var templateId = $(this).parents('li').attr('id');
			$('#nameTemplateModal').modal('show');
			$('#nameTemplateModal').off('shown.bs.modal').on('shown.bs.modal',function (e) {
				$('input[name="temp_title"]').focus().val('');
				$('#nameTemplateModal .btn-success').off('click').on('click',function(){
					var param = {
						url:'/appcenter/offerTemplate/copy.json',
						data:{
							templateId:templateId,
							title:$('input[name="temp_title"]').val()
						},
						token: offerList.getParameter().token,
						success:function(res) {
							if (res.code == 1) {
								createTemplateList(1);
								$('#nameTemplateModal').modal('hide');
							} else {
								layer.msg(res.message,{time:1500});
							}
						}
					}
					offerList._ajax(param);
				})
			});
		});
		
		/*offer模板导出*/
		$('.templateList').on('click','.temp_operate .export',function(){
			var templateId = $(this).parents('li').attr('id');
			window.location = offerList.getLocalhostPort()+'/appcenter/offerTemplate/export?token='+offerList.getParameter().token+'&templateId='+templateId;
		});
		
		/*offer模板重命名*/
		$('.templateList').on('click','.temp_operate .rename',function(){
			var templateId = $(this).parents('li').attr('id'),
				tempTitleObj = $(this).parents('li').find('.template_title').children(),
				originalTitle = tempTitleObj.text();
			$('#nameTemplateModal').modal('show');
			$('#nameTemplateModal').off('shown.bs.modal').on('shown.bs.modal',function (e) {
				$('input[name="temp_title"]').focus().val(originalTitle);
				$('#nameTemplateModal .btn-success').off('click').on('click',function(){
					var param = {
						url:'/appcenter/offerTemplate/rename.json',
						data:{
							templateId:templateId,
							title:$('input[name="temp_title"]').val()
						},
						token: offerList.getParameter().token,
						success:function(res) {
							if (res.code == 1) {
								$('#nameTemplateModal').modal('hide');
								tempTitleObj.text(param.data.title);
							} else {
								layer.msg(res.message,{time:1500});
							}
						}
					}
					offerList._ajax(param);
				})
			});
		});
		
		/*offer模板查看*/
		$('.templateList').on('click', '.temp_operate .view', function () {
			var templateId = $(this).parents('li').attr('id');
			var param = {
				url: '/appcenter/offerTemplate/detail.json',
				data: {
					templateId: templateId,
				},
				token: offerList.getParameter().token,
				success: function (res) {
					if (res.code == 1) {
						preview.template_view(res.data,'preview');
					} else {
						layer.msg(res.message);
					}
				}
			}
			offerList._ajax(param);
		});
		
		/*offer模板编辑*/
		$('.templateList').on('click', '.temp_edit', function () {
			var templateId = $(this).parents('li').attr('id');
			var param = {
				url: '/appcenter/offerTemplate/detail.json',
				data: {
					templateId: templateId,
				},
				token: offerList.getParameter().token,
				success: function (res) {
					if (res.code == 1) {
						res.data.templateId = res.data.id;
						delete res.data.id;
						var tempDetail = JSON.stringify(res.data);
						sessionStorage.setItem('tempDetail',tempDetail);
						location.href = './new_offer_templet.html?token=' + param.token;
					} else {
						layer.msg(res.message);
					}
				}
			}
			offerList._ajax(param);
		});
		
		/*offer模板新建*/
		$('.templateList').on('click','#createNewTemplate',function(){
			$('#nameTemplateModal').modal('show');
			$('#nameTemplateModal').off('shown.bs.modal').on('shown.bs.modal',function (e) {
				$('input[name="temp_title"]').focus().val('');
				$('#nameTemplateModal .btn-success').off('click').on('click',function(){
					var param = {
						url:'/appcenter/offerTemplate/create.json',
						data:{
							title:$('input[name="temp_title"]').val()
						},
						token: offerList.getParameter().token,
						success:function(res) {
							if (res.code == 1) {
								createTemplateList(1);
								$('#nameTemplateModal').modal('hide');
							} else {
								layer.msg(res.message,{time:1500});
							}
						}
					}
					offerList._ajax(param);
				})
			});
		});
				
		/*offer放弃录用*/
		$('.offerPanels').on('click','.dropCandidate',function(e){
			var id = $(this).parents('tr').attr('id'),
				trObj = $(this).parents('tr');
			layer.confirm('<h4>确定放弃录用？</h4>放弃录用后，该候选人将重新回到人才库！',
				{title: false},
				function() {
					var param = {
						url:'/appcenter/offer/close.json',
						data:{
							id:id,
							status:11,
							sendReject:null
						},
						token: offerList.getParameter().token,
						success:function(res) {
							if (res.code == 1) {
								layer.msg('放弃录用成功',{time:1500});
								trObj.remove();
								// createCandidateList(1);
								// createWaitingList(1);
							} else {
								layer.msg(res.message);
							}
						}
					}
					layer.confirm('<h4>是否发送拒信？</h4>可在补发拒信中再次发送',
						{title: false},
						function(){
							param.data.sendReject = true;
							offerList._ajax(param);
						},
						function(){
							param.data.sendReject = false;
							offerList._ajax(param);
						}
					);
				},
				function() {
					layer.closeAll();
				}
			);
		})
		
		/*创建offer - 没有候选人*/
		$('#creatNewOffer').on('click',function(){
			sessionStorage.removeItem('offerData');
			location.href = './offer_add.html?token=' + offerList.getParameter().token;
		})
		
		/*导入候选人简历 - 简历存放位置接口*/
		$('.offerPanels').on('click','.importResume', function(e){
			var param = {
				url:'/appcenter/offer/daoru.do',
				data: {
					cateId:0,
					cateType:1
				},
				async: false,
				token: offerList.getParameter().token,
				success:function(res) {
					if (res.code == 1) {
						var folderName = res.data.folderName;
						$('#importResumeModal .folderName').text(folderName);
						$('#importResumeModal input[name="cateId"]').val(res.data.cateId);
						$('#importResumeModal input[name="cateType"]').val(res.data.cateType);
						$('#importResumeModal').modal('show');
					} else {
						layer.msg(res.message);
					}
				}
			}
			offerList._ajax(param);
		})
		
		/*选择简历文件*/
		$('#importResumeModal').off('click','#pickFile').on('click','#pickFile', function(e){
			$('#fileInput').click();
			$('#fileInput').on('change',function(){
				$('#importResumeModal .showFileName').html('<span>您已选择文件：'+$('#fileInput').val()+'</span>');
			})
		});
		
		/*导入候选人简历 - 简历解析接口*/
		$('#importResumeModal').on('click','.btn-success', function(e){
			if($('#fileInput').val()==''||$('#fileInput').val()==null){
				layer.msg('请选择文件',{time:1500});
			}
			$('#importResumeModal input[name="key"]').val(new Date().getTime());
			var formData = new FormData($('#fileForm')[0]);
			$.ajax({
				url: offerList.getLocalhostPort() + '/appcenter/resume/importResume',
				type: "post",
				dataType: 'json',
				data: formData,
				headers:{
					token:'bdk20VAk5eg1aS/bX781waLEycb//gOrxgLhcE9tRnmK7mT332ujuMPYchkDDJUmbnefKn96d+g='
				},
				processData: false,
				contentType: false,
				beforeSend: function(){
					layer.load(2);
				},
				complete: function(){
					layer.closeAll('loading');
				},
				success: function(res) {
					if(res.code == 1) {
						layer.msg(res.data.fileNames.length+'份简历解析成功！');
						$('#importResumeModal').modal('hide');
						createCandidateList(1);
					} else {
						layer.msg(res.message);
					}
				},
				error: function(err) {
					layer.msg(err);
					console.log(err);
				}
			})
		})
		
		/*导入简历模态框关闭时清空数据*/
		$(document).on('hidden.bs.modal','#importResumeModal',function(e) {
			$('#importResumeModal .folderName').text('');
			$('#importResumeModal #fileInput').val('');
			$('#importResumeModal .showFileName').html('');
		});
		
		/*点击候选人跳转简历详情*/
		$(document).on('click','.offerPanels .getResume',function () {
			var companyId = $(this).parents('tr').data('detail').companyId,
				rencaiId = $(this).parents('tr').data('detail').rencaiId,
				interviewId = $(this).parents('tr').data('detail').interviewId;
			location.href =  './cv.html?token=' + offerList.getParameter().token+'&rencaiId='+rencaiId+'&interviewId='+interviewId+'&companyId='+companyId;
		})
		
		/*点击offer管理跳转回offer管理*/
		$(document).on('click','#gotoOffer', function(){
			location.href =  './offerList.html?token=' + offerList.getParameter().token;
		});
		
	}
	return offerList;
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
