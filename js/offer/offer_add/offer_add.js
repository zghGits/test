/**
 * Created by zhangys on 2016/11/
 */
define(["JQuery", "BaseClass", "layer", "simditor", "iselect","preview" ,"welfare_config" ,"config", "s_module",'datetimepicker', 'datetimepicker_zh-CN','select2', 'select2-zh-CN'], function($, BaseClass, layer, Simditor, iselect,preview,welfare_config){

	var offer_add = inherit(BaseClass.prototype);
	var _pageId = "#newTempletContent";
	var ajaxUrl='/appcenter/offer/save.json'  //用于区分新建和修改 默认新建
	/*初始化offer对象*/
	offerObj={offerManagerId:'',employeeName:'',employeeMobile:'',employeeEmail:'',greetMessage:'',orgId:'',orgName:'',positionId:'',positionName:'',positionLevel:'',leaderId:'',leaderName:'',probationPeriodLength:'0',probationPeriodSalary:'0',salary:0,welfare:'',entryDate:'',entryAddress:'',contactName:'',contactPhone:'',entryRoute:'',material:'',sendRegForm:1,sendEmail:1,emailType:1,emailCcReceivers:'',sendSms:1,smsContent:'',notifyEmployee:0,notifyHr:0,notifyOrg:0,needAudit:0,auditUserIds:'',auditUserInfo:'',attachIds:'',emailContent:'',resumeId:'',memo:'',sendOffer:0}
  	offer_add.init = function() {
		var tempDetail = JSON.parse(sessionStorage.getItem('offerData'));
		if(tempDetail===null){
			tempDetail={}
		}else{
			$(_pageId + ' .user_info input[name="userName"]').val(tempDetail.employeeName)
			$(_pageId + ' .user_info input[name="userName"]').attr('id',tempDetail.offerManagerId)
			$(_pageId + ' .user_info input[name="telPhone"]').val(tempDetail.employeeMobile)
			$(_pageId + ' .user_info input[name="email"]').val(tempDetail.employeeEmail)
		}
		
		/*当offer状态为审批状态时 offer数据不能修改*/
		if(tempDetail.isAuditStatus===true){
			var onlytop = $(_pageId + ' .rule').offset().top+240;
			$(_pageId + ' .shade').css('height',onlytop);
			$("body").animate({scrollTop:onlytop},100)
			$(_pageId + ' .saveCommitted').css('display','none');
		}
	
		/* 当offerId存在时，即为更新offer*/
		if(tempDetail.offerId != '' && tempDetail.offerId != null){
			offerObj.id=tempDetail.offerId;
			ajaxUrl = '/appcenter/offer/updateOffer.json';
			$('.templet_top .offer_title').text('更新offer')
		}
	
		
		/*初始化恭贺信富文本*/
			var greetMessage = new Simditor({
				textarea: $('#greetMessage'),
				tabIndent: true,
				placeholder: '你想说些什么呢？'
			});
			
			/*初始化报道所需材料富文本*/
			var material_textarea = new Simditor({
				textarea: $('#material_textarea'),
				tabIndent: true,
				placeholder: '请输入报道所需材料'
			});
		
		
		var _init = function(){
			/*初始化日期控件*/
			var initData = function() {
				$(_pageId + ' .form_datetime').datetimepicker({
					minView: "hour",
					language: 'zh-CN',
					format: 'yyyy-mm-dd hh:ii',
					todayBtn: 1,
					autoclose: 1,
					startDate: new Date
				})
			}
			initData();
			
			
			/*初始化下拉列表*/   /*注：必须先初始化列表再初始化模板数据*/
			new iselect({
				type: 'department',
				result_num_type: "single",
				select_id: 'orgId'
			});
			new iselect({
				type: 'job',
				result_num_type: "single",
				select_id: 'positionId'
			});
			new iselect({
				type: 'Presentation',
				result_num_type: "single",
				select_id: 'leaderId'
			});
			new iselect({
				type: 'contacts',
				result_num_type: "single",
				select_id: 'contactName'
			});
			
			new iselect({
				type: 'Approver',
				result_num_type: "complex",
				select_id: 'emailCcReceivers'
			});
			
			new iselect({
				type: 'cc',
				result_num_type: "complex",
				select_id: 'auditUserInfo'
			});	
			
			$(_pageId + ' select[name="probationPeriodLength"]').select2({
				data: [{
					id: 1,
					text: '一个月'
				}, {
					id: 2,
					text: '二个月'
				}, {
					id: 3,
					text: '三个月'
				}, {
					id: 6,
					text: '半年'
				}, {
					id: 12,
					text: '一年'
				}],
			    placeholder:'点击选择',
			    language: "zh-CN",
				minimumResultsForSearch: -1
			});
			$(_pageId + ' select[name="probationPeriodLength"]').val(null).trigger("change");
			$(_pageId + ' select[name="probationPeriodLength"]').val("点击选择").trigger("change");


			$(_pageId + ' select[name="positionLevel"]').select2({
				data: [{
					id: 1,
					text: '初级'
				}, {
					id: 2,
					text: '中级'
				}, {
					id: 3,
					text: '高级'
				},],
			    placeholder:'点击选择',
			    language: "zh-CN",
				minimumResultsForSearch: -1
			});
			$(_pageId + ' select[name="positionLevel"]').val(null).trigger("change");
			$(_pageId + ' select[name="positionLevel"]').val("点击选择").trigger("change");
			
			
			$(_pageId + ' select[name="email_type"]').select2({
				data: [{
					id: 1,
					text: 'IMAP'
				}, {
					id: 2,
					text: 'SMTP'
				}],
			    language: "zh-CN",
				minimumResultsForSearch: -1
			});
			
			$(_pageId + ' select[name="is_password"]').select2({
				data: [{
					id: 1,
					text: '是'
				}, {
					id: 2,
					text: '否'
				}],
			    placeholder:'点击选择',
			    language: "zh-CN",
				minimumResultsForSearch: -1
			});
			
			/*获取offer模板*/
			var templetList = [];
			var param = {
				url: '/appcenter/offerTemplate/list.json',
				data: {pageSize:999},
				token: offer_add.getParameter().token,
				success: function(json) {
					if(json.code == 1) {
						var _list =json.data.list;
						for(var i=0;i<_list.length;i++){
							templetList[i]={'id':_list[i].id ,'text':_list[i].title};
						}
						$(_pageId + ' select[name="templet_type"]').select2({
							data: templetList,
						    placeholder:'点击选择',
						    language: "zh-CN",
							minimumResultsForSearch: -1
						});
						$(_pageId + ' select[name="templet_type"]').val(null).trigger("change");
						$(_pageId + ' select[name="templet_type"]').val("点击选择").trigger("change");
					} else {
						layer.msg(json.message);
					}
				}
			}
			offer_add._ajax(param);	
		
		/*初始化模板数据*/
		var templet_info = function(){
			for(var k in tempDetail){
					if(tempDetail[k] !=='' && tempDetail[k] !=='0'){
						if($(_pageId + ' [name='+k+']').length>0){		
							if($(_pageId + ' [name='+k+']').get(0).tagName=='SELECT'){
								if(k == 'probationPeriodLength') {
									$(_pageId + ' select[name="probationPeriodLength"]').select2('val',tempDetail[k].toString())									
								} else {
									if(tempDetail[k]==='初级'){
										$(_pageId + ' select[name="positionLevel"]').select2('val','1')
									}else if(tempDetail[k]==='中级'){
										$(_pageId + ' select[name="positionLevel"]').select2('val','2')
									}else{
										$(_pageId + ' select[name="positionLevel"]').select2('val','3')
									}
								}
								
							}else if($(_pageId + ' [name='+k+']').get(0).tagName=='TEXTAREA'){
								if(k=='material'){
									material_textarea.setValue(tempDetail[k]);
								}else{
									greetMessage.setValue(tempDetail[k]);
								}
							}else if($(_pageId + ' [name='+k+']').get(0).tagName=='INPUT'){
								$(_pageId + ' [name='+k+']').val(tempDetail[k]);
							}else if($(_pageId + ' [name='+k+']').get(0).tagName=='DIV'){
								if(k === 'welfare'){
									var _list = tempDetail[k].split(',')
									var _html='';
									for(var j = 0; j < _list.length; j++) {
										_html += '<div class="fuli_option_i"><div>'+_list[j]+'</div><div></div></div>'
									}
									$(_pageId + ' [name='+k+']').eq(0).append(_html)
								}else if(k==='attachList'){ //  附件查询 
									var _list = tempDetail[k];
									var _html='';	
									for(var i=0; i<_list.length;i++){
										/*获取附件标*/
										var imageIcon = getImage_icon(_list[i].name);
										if(imageIcon==='rs'){
											imageIcon = _list[i].url;
										}
										_html +='<div class="boon_option_i" name="attachIds" data-id='+ _list[i].id +' data-url='+_list[i].url+' ><div class="boon_option_img"><img src="'+imageIcon+'"></div><div class="boon_option_info"><div class="info_name">'+_list[i].name+'</div><div class="info_delete del">删除</div><div class="info_time">'+ _list[i].creatTime +'</div></div><div class="boon_option_info"><div class="info_size recol">'+ _list[i].size +'</div><div class="info_root">来自 HR</div></div></div>'
									}
									/*调用附件查询接口*/
									$(_pageId + ' [name='+k+']').append(_html)
								}else{
									/*判断是否是是公用组件标签*/
									if(k=='orgName' || k=='positionName' || k=='leaderName' || k=='contactName'){
										if(k=='orgName'){
											$(_pageId + ' [name='+k+']').attr('data-id',tempDetail.orgId);
										}
										if(k=='positionName'){
											$(_pageId + ' [name='+k+']').attr('data-id',tempDetail.positionId);
										}
										if(k=='leaderName'){
											$(_pageId + ' [name='+k+']').attr('data-id',tempDetail.leaderId);
										}
										$(_pageId + ' [name='+k+']').attr('data-value',tempDetail[k]);
										$(_pageId + ' [name='+k+']').find('.select-val').eq(0).text(tempDetail[k]);
									}else{
										$(_pageId + ' [name='+k+']').text(tempDetail[k]);
									}
									
								}
							}
							if($(_pageId + ' [name='+k+']').parent().find('.n_check').length>0){
								$(_pageId + ' [name='+k+']').eq(0).parent().children('.letbl').removeClass('n_check')
								$(_pageId + ' [name='+k+']').eq(0).parent().children('.letbl').addClass('y_check')
							}
						}
					}
				}
		}
		templet_info();
	}
		
		_init();
		
		
		/*获取附件小图标*/
		function getImage_icon(fileName){
			var list = fileName.split('.');
			var imgIcon = "";
			switch(list[list.length-1]) {
				case "txt":
					imgIcon = './../images/icon－txt.svg';
					break;
				case "rar":
					imgIcon = './../images/icon－rar.svg';
					break;
				case "zip":
					imgIcon = './../images/icon－zip.svg';
					break;
				case "doc":
				case "docx":
					imgIcon = './../images/icon－word.svg';
					break;
				case "ppt":
				case "pptx":
					imgIcon = './../images/icon－ppt.svg';
					break;
				case "xls":
				case "xlsx":
					imgIcon = './../images/icon－excle.svg';
					break;
				case "pdf":
					imgIcon = './../images/icon－pdf.svg';
					break;
				case "gif":
				case "img":
				case "jpeg":
				case "jpg":
				case "png":
					imgIcon = 'rs';
					break;
				default:
					imgIcon = './../images/icon－weizhiwenjian0.svg';
					break;
			}
			return imgIcon;
		}
		
		
		/*模板附件删除*/
		$(document).delegate('.boon_option_i .del','click',function(e){
			//获取删除的文件li元素
				var $fileli = $(this).parent().parent();
				$fileli.remove();
				$.ajax({
					type: "post",
					url: '/appcenter/employeeAttachment/delete.json',
					dataType: 'json',
					headers:{
	                    token:offer_add.getParameter().token,
            	    },
					data: {
						attachId: $fileli.attr('data-id')
					},
					beforeSend: function(){
	                    layer.load(2);
	                },
	                complete: function(){
	                    layer.closeAll('loading');
	                },
					success: function(data) {
						if(data.code == 1) {
							console.log("请求删除文件成功!");
							
						} else {
							console.log('请求删除文件返回数据有误,错误码:' + data.message);
						}
					},
					error: function() {
						console.log("请求删除文件出错!");
					}
				});
		});
		
		/*复选框切换事件*/
		$(_pageId + " .letbl").on('click', function() {
			if($(this).hasClass('y_check')) {
				$(this).removeClass('y_check')
				$(this).addClass('n_check')
				var _this = ''
				if($(this).parent().find('input').length > 0) {
					_this = $(this).parent().children('input').attr("name");
				} else if($(this).parent().find('textarea').length > 0) {
					_this = $(this).parent().children('textarea').attr("name");
				} else if($(this).parent().find('select').length > 0) {
					_this = $(this).parent().children('select').attr("name");
				} else {
					_this = $(this).parent().children('div').attr("name");
				}
				delete tempDetail[_this]
			} else if($(this).hasClass('n_check')) {
				$(this).removeClass('n_check')
				$(this).addClass('y_check')
				var _this = ''
				if($(this).parent().find('input').length > 0) {
					_this = $(this).parent().children('input').attr("name");
				} else if($(this).parent().find('textarea').length > 0) {
					_this = $(this).parent().children('textarea').attr("name");
				} else if($(this).parent().find('select').length > 0) {
					_this = $(this).parent().children('select').attr("name");
				} else {
					_this = $(this).parent().children('div').attr("name");
				}
				tempDetail[_this] = '';
			}
		})

		

		



		function update_templet() {
			/*修改offer*/
			var u_check = $('.u_check');
			var y_check = $('.y_check');
			var u_check = $.merge(u_check, y_check);
			var _this = '';
			/*获取富文本的值*/
			tempDetail.material = material_textarea.getValue();
			tempDetail.greetMessage = greetMessage.getValue();
			tempDetail.employeeEmail = $(_pageId +' .user_info input[name="email"]').val()
			tempDetail.employeeName = $(_pageId +' .user_info input[name="userName"]').val()
			tempDetail.employeeMobile = $(_pageId +' .user_info input[name="telPhone"]').val()
			for(var i = 0; i<u_check.length;i++) {
				if(u_check.eq(i).parent().find("input").length > 0 && u_check.eq(i).next().next().attr("name")!= 'attachList') { //此处代码没设计好，待优化
					_this = u_check.eq(i).parent().children('input');
					var _key = _this.attr('name');
					tempDetail[_key] = _this.val()
				} else if(u_check.eq(i).parent().find('select').length > 0) {
					_this = u_check.eq(i).parent().find('.select2_div').children('select');
					var _key = _this.attr('name');
					tempDetail[_key] = _this.val()
				} else {
					var _this = u_check.eq(i).next().next();
					if(_this.attr('name') == 'welfare' || _this.attr('name') == 'attachList') {
						if(_this.attr('name') == 'welfare') {
							var num = $('.fuli_option .fuli_option_i');
							var welfare = ''
							for(var j = 0; j < num.length; j++) {
								if(j == 0) {
									welfare += num.eq(j).children(':first').html();
								} else {
									welfare += ',' + num.eq(j).children(':first').html();
								}
							}
							tempDetail.welfare = welfare
						} else {
							var num = $('.boon_option .boon_option_i');
							var attachIds = ''
							var attachNames = '' 
							for(var j = 0; j < num.length; j++) {
								if(j == 0) {
									attachIds += num.eq(j).attr('data-id');
									attachNames += num.eq(j).children().eq(1).children().eq(0).text();
								} else {
									attachIds += ',' +num.eq(j).attr('data-id');
									attachNames += ',' +num.eq(j).children().eq(1).children().eq(0).text();
								}
							}
							tempDetail.attachIds = attachIds;
							tempDetail.attachNames = attachNames;
						}
					} else {
						var _this = u_check.eq(i).next().next().next();
						if(_this.attr("id")) {
							var _key = _this.attr("id");
							var _val = _this.attr("data-id");
							tempDetail[_key] = _val;

						}
						if(_this.attr("name")) {
							var _key = _this.attr("name");
							var _val = _this.attr("data-value");
								tempDetail[_key] = _val;
						}
					}
				}
			}
			delete tempDetail.undefined;
		}

		$('.fileUpload').on('click', function() {
			allTypeUpload('.boon_option', '.fileUpload')
		})

		/*文件上传*/
		var allTypeUpload = function(outerselector, uploadselector) {
			//配置内部的html结构
			if($(outerselector).find('.wp_fileContainer')) {
				$(outerselector + ' .wp_fileContainer').remove()

			}
			$(outerselector).append('<div class="wp_fileContainer">' +
				'<form class="file_form" enctype="multipart/form-data" style="display: none;">' +
				'<input class="file_inp" type="file" name="file" accept="*/*" multiple="multiple">' +
				'</form>');

			//如果上传按钮在外部则可通过外部触发文件选择器
			$(document).off("click", uploadselector).on("click", uploadselector, function() {
				/* 从外部触发内部的input元素  */
				$(outerselector + " .file_inp").trigger('click');
			});

			//监听文件元素的值的改变
			$(outerselector).off("change", ".file_inp").on("change", ".file_inp", function() {
				//获取input元素的文件列表并遍历
				var files = this.files;
				for(var i = 0, f; f = files[i]; i++) {
					//实例化文件读取对象
					var reader = new FileReader();
					//读取文件数据
					reader.readAsDataURL(f);
					//监听文件读取对象的读取过程
					reader.onload = (function(file) {
						return function() {
							//获取文件名
							var filename = file.name;
							//获取文件扩展名
							var extname = filename.substr(filename.lastIndexOf(".") + 1);
							//用于存要展示的文件预览图链接
							var imgSrc = "";
							switch(extname) {
								case "txt":
									imgSrc = './../images/icon－txt.svg';
									break;
								case "rar":
									imgSrc = './../images/icon－rar.svg';
									break;
								case "zip":
									imgSrc = './../images/icon－zip.svg';
									break;
								case "doc":
								case "docx":
									imgSrc = './../images/icon－word.svg';
									break;
								case "ppt":
								case "pptx":
									imgSrc = './../images/icon－ppt.svg';
									break;
								case "xls":
								case "xlsx":
									imgSrc = './../images/icon－excle.svg';
									break;
								case "pdf":
									imgSrc = './../images/icon－pdf.svg';
									break;
								case "gif":
								case "img":
								case "jpeg":
								case "jpg":
								case "png":
									imgSrc = this.result;
									break;
								default:
									imgSrc = './../images/icon－weizhiwenjian0.svg';
									break;
							}

							//处理文件大小单位的转换
							var filesize = file.size;
							filesize = (filesize > 1024 * 1024) ? (Math.round(filesize / 1024 / 1024 * 100) / 100 + "M") : ((filesize > 1024) ? (Math.round(filesize / 1024 * 100) / 100 + "KB") : (filesize + "B"));

							//上传时间记录
							var now = new Date();
							var year = now.getFullYear();
							var month = (now.getMonth() + 1) > 9 ? (now.getMonth() + 1) : ('0' + (now.getMonth() + 1));
							var day = (now.getDate()) > 9 ? (now.getDate()) : ('0' + (now.getDate()));
							var hour = (now.getHours()) > 9 ? (now.getHours()) : ('0' + (now.getHours()));
							var minute = (now.getMinutes()) > 9 ? (now.getMinutes()) : ('0' + (now.getMinutes()));
							var sec = (now.getSeconds()) > 9 ? (now.getSeconds()) : ('0' + (now.getSeconds()));
							var createdate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + sec;

							//追加文件
							var html = '<div class="boon_option_i" name="attachIds"><div class="boon_option_img"><img src="' + imgSrc + '"/></div><div class="boon_option_info"><div class="info_name">' + filename + '</div><div class="info_delete del" >删除</div><div class="info_time">' + createdate + '</div></div><div class="boon_option_info"><div class="info_size recol">' + filesize + '</div><div class="info_root">来自 HR</div></div></div>';
							$(outerselector).prepend(html);

							//获取当前添加的文件
							var $curfileli = $(outerselector + " .boon_option_i").eq(0);

							//创建formData数据用于发送文件
							var formData = new FormData();
							formData.append('file',file);
							$.ajax({
								url: 'appcenter/employeeAttachment/upload.json',
								type: "post",
								dataType: 'json',
								data: formData,
								headers:{
				                    token:offer_add.getParameter().token,
				                },
								processData: false,
								contentType: false,
								beforeSend: function(){
				                    layer.load(2);
				                },
				                complete: function(){
				                    layer.closeAll('loading');
				                },
								xhr: function() {
									//获取xmlhttprequest对象
									var xhr = $.ajaxSettings.xhr();
									//检查upload属性是否存在
									if(xhr.upload) {
										//监听xhr请求状态
										xhr.upload.onload = function() {
											console.log("文件准备完成,即将上传!");
										}

										//监听文件上传进度
										xhr.upload.onprogress = function(e) {
											//如果兼容
											if(e.lengthComputable) {
												//处理上传进度并渲染到页面进度条上
												var percent = e.loaded / e.total * 100 + '%';
												var progress = $curfileli.children(".center").children('.progress_outer').children('.progress_inner');
												progress.css("width", percent);
												if(percent == "100%") {
													var error = progress.parent().next();
													error.text("上传成功!").css("color", "green");
												}
											}
										}
									}

									//xhr对象返回给jQuery使用
									return xhr;
								},
								success: function(data) {
									if(data.code == 1) {
										console.log("文件上传请求成功");
										$curfileli.attr({
											'data-id': data.data.attachId,
											'data-url': data.data.url
										});
									} else {
										console.log("文件上传返回数据有误,错误码：" + data.message);
									}
								},
								error: function(XmlHttpRequest, textStatus, errorThrown) {
									console.log("文件上传请求出错!!");
									//获取错误信息展示元素
									var error = $curfileli.children(".center").children('.progress_outer').next();
									error.text("上传失败!").css("color", "red");
								}
							});
						}
					})(f);
				}
			})
		}

		/*模板校验*/
		function templep_validate(validateList) {
			for(var i = 0; i < validateList.length; i++) {
				if(validateList.eq(i).parent().find('select').length > 0 || validateList.eq(i).parent().find('input').length > 0) {
					if(validateList.eq(i).next().val() == '' || validateList.eq(i).next().val() == '点击选择') {
						layer.msg('亲！ ' + validateList.eq(i).prev().text() + '还没填写哦！');
						return false;
					}
				} else {
					if(validateList.eq(i).next().attr('data-value') == '') {
						layer.msg('亲！ ' + validateList.eq(i).prev().text() + '还没填写哦！');
						return false;
					}
				}

			}
			return true;
		}
		
		
		/*offer预览*/
		$('.newTempletContent .preview').on('click', function() {
			update_templet();
			preview.template_view(tempDetail, 'preview');
		});

		/*预览后发送*/
		$('.newTempletContent .submetInfo').on('click', function() {
			var validateList = $(_pageId + " .itemck")
			if(!templep_validate(validateList)) return;
			update_templet();
			preview.template_view(tempDetail, 'preview',1);
		});
		
		
		/*发送offer*/
		$('#preview ').delegate(' .btn-success' ,'click', function() {
			getHrInfo();
			getInnerHtml();
			tempDetail.sendOffer=1;
			var emailContent=$('#preview').html();
			tempDetail.emailContent='<div class="modal fade in" id="preview" tabindex="-1" style="padding-right: 17px;border:1px solid #eeeeee;margin:50px 0px 50px 50px; width: 600px;font-family: MicrosoftYaHei;color: #172434;letter-spacing: 1px;line-height: 24px;">'+emailContent+'</div>';
			for(var k in tempDetail){
				if(offerObj[k]!=null || offerObj[k]!=undefined){
					offerObj[k] = tempDetail[k];
				}
			}
			if(offerObj.emailType===2){
				if(!getEmailConfig()){
					return;
				};
			}
			var param = {
				url: ajaxUrl,
				data: offerObj,
				token: offer_add.getParameter().token,
				success: function(json) {
					if(json.code == 1) {
					} else {
						layer.msg('发送失败！');
					}
				}
			}
			offer_add._ajax(param);
		});
		
		/*获取预览静态页面*/
		function getInnerHtml(){
			$('#preview .close').css('display','none');
			$('#preview .modal-footer').css('display','none');
			$('#preview .modal-body').css('overflow','')
			$('#preview .modal-body').css('height','')
		}
		
		/*添加福利*/
		$(_pageId + ' .add_welfare').on('click',function(){
			welfare_config.init("walfare_config");
		})
		
		$('#walfare_config ').delegate('.btn-success','click',function(){
			var list = $('#walfare_config .check_walfare .check_walfare_i');
			var _html='';
			for(var i=0; i < list.length ; i++){
				_html += '<div class="fuli_option_i"><div>'+list.eq(i).children("div").eq(0).text()+'</div><div></div></div>'
			}
			$(_pageId + ' .fuli_option').html(_html);
			$('#walfare_config ').modal('hide');
			$('#walfare_config div').unbind(); //移除所有绑定事件
		})
		
		
		/*邮箱类型选择事件*/
		$(_pageId + ' .transmit_mode .email').on('click',function(){
			$(this).parent().parent().find('.y_select').eq(0).addClass('n_select');
			$(this).parent().parent().find('.y_select').eq(0).removeClass('y_select');
			$(this).removeClass('n_select')
			$(this).addClass('y_select')
		})
		
		
		
		/*选择模板*/
		$(_pageId +' .templetDIv select[name="templet_type"]').on('change',function(){
			if($(this).val()!='' && $(this).val()!=null){
				var param = {
				url: '/appcenter/offerTemplate/detail.json',
				data: {
					templateId:$(this).val()
				},
				token: offer_add.getParameter().token,
				success: function(json) {
					if(json.code == 1) {
						$(_pageId + ' .in_every').css('display','none');
						$(_pageId + ' .in_every').parent().parent().css('display','none');
						/*调用模板对象*/
						for(var k in json.data){
							var _k = '#'+k;
							tempDetail[k]=json.data[k]
							if($(_pageId).find(_k).length>0 ){
								$(_k).parent('.in_every').css('display','block')
								$(_k).parent('.in_every').parent().parent().css('display','block')
								if(k =='positionLevel' || k =='probationPeriodLength'){
									$(_k).parent().parent('.in_every').css('display','block')				
								}
							}
						}
						templet_info();
					} else {
						layer.msg(json.message);
					}
				}
			}
			offer_add._ajax(param);
			}
		})
		
		/*初始化模板数据*/
		var templet_info = function(){				
			for(var k in tempDetail){
				if(tempDetail[k] !=='' && tempDetail[k] !=='0'){
					if($(_pageId + ' [name='+k+']').length>0){		
						if($(_pageId + ' [name='+k+']').get(0).tagName=='SELECT'){
							if(k == 'probationPeriodLength') {
								$(_pageId + ' select[name="probationPeriodLength"]').select2('val',tempDetail[k].toString())
																		
							} else {
								if(tempDetail[k]==='初级'){
									$(_pageId + ' select[name="positionLevel"]').select2('val','1')
								}else if(tempDetail[k]==='中级'){
									$(_pageId + ' select[name="positionLevel"]').select2('val','2')
								}else{
									$(_pageId + ' select[name="positionLevel"]').select2('val','3')
								}
								$(_pageId + ' [name=' + k + ']').eq(0).parent().parent().children('.letbl').removeClass('n_check')
								$(_pageId + ' [name=' + k + ']').eq(0).parent().parent().children('.letbl').addClass('y_check')
							}
						}else if($(_pageId + ' [name='+k+']').get(0).tagName=='TEXTAREA'){
							if(k=='material'){
								material_textarea.setValue(tempDetail[k]);
							}else{
								greetMessage.setValue(tempDetail[k]);
							}
						}else if($(_pageId + ' [name='+k+']').get(0).tagName=='INPUT'){
							$(_pageId + ' [name='+k+']').val(tempDetail[k]);
						}else if($(_pageId + ' [name='+k+']').get(0).tagName=='DIV'){
							if(k === 'welfare'){
								var _list = tempDetail[k].split(',')
								var _html='';
								for(var j = 0; j < _list.length; j++) {
									_html += '<div class="fuli_option_i"><div>'+_list[j]+'</div><div></div></div>'
								}
								$(_pageId + ' [name='+k+']').eq(0).append(_html)
							}else if(k==='attachList'){ //  附件查询 
								var _list = tempDetail[k];
								var _html='';	
								for(var i=0; i<_list.length;i++){
									/*获取附件标*/
									var imageIcon = getImage_icon(_list[i].name);
									if(imageIcon==='rs'){
										imageIcon = _list[i].url;
									}
									_html +='<div class="boon_option_i" name="attachIds" data-id='+ _list[i].id +' data-url='+_list[i].url+' ><div class="boon_option_img"><img src="'+imageIcon+'"></div><div class="boon_option_info"><div class="info_name">'+_list[i].name+'</div><div class="info_delete del">删除</div><div class="info_time">'+ _list[i].creatTime +'</div></div><div class="boon_option_info"><div class="info_size recol">'+ _list[i].size +'</div><div class="info_root">来自 HR</div></div></div>'
								}
								/*调用附件查询接口*/
								$(_pageId + ' [name='+k+']').append(_html)
							}else{
								/*判断是否是是公用组件标签*/
								if(k=='orgName' || k=='positionName' || k=='leaderName' || k=='contactName'){
									if(k=='orgName'){
										$(_pageId + ' [name='+k+']').attr('data-id',tempDetail.orgId);
									}
									if(k=='positionName'){
										$(_pageId + ' [name='+k+']').attr('data-id',tempDetail.positionId);
									}
									if(k=='leaderName'){
										$(_pageId + ' [name='+k+']').attr('data-id',tempDetail.leaderId);
									}
									$(_pageId + ' [name='+k+']').attr('data-value',tempDetail[k]);
									$(_pageId + ' [name='+k+']').find('.select-val').eq(0).text(tempDetail[k]);
								}else{
									$(_pageId + ' [name='+k+']').text(tempDetail[k]);
								}
							}
						}
						if($(_pageId + ' [name='+k+']').parent().find('.n_check').length>0){
							$(_pageId + ' [name='+k+']').eq(0).parent().children('.letbl').removeClass('n_check')
							$(_pageId + ' [name='+k+']').eq(0).parent().children('.letbl').addClass('y_check')
						}
					}
				}
			}
		}
		
		/*另存模板*/
		$(_pageId +' .saveTemplet').on('click',function(){
			$('#tempeltName').modal({
				backdrop: 'static',
				show: true
			});
		})
		
		/*另存模板确认事件*/
		$('#tempeltName .btn-success').on('click',function(){
			tempDetail.title= $('#tempeltName input[name="tempeltName"]').val();
			saveTempelt();
		})
		$('#tempeltName .btn-default').on('click',function(){
			$('#tempeltName').modal('hide')
		})
		
		function saveTempelt(){
			obj={
				title:'',
				greetMessage:'',
				orgId:'',
				orgName:'',
				positionId:'',
				positionName:'',
				positionLevel:'',
				leaderId:'',
				leaderName:'',
				probationPriodLngth:'',
				probationPriodSalary:'',
				salary:'',
				welfare:'',
				entryDate:'',
				entryAddress:'',
				contactName:'',
				contactPhone:'',
				entryRoute:'',
				material:'',
				sendRegForm:'',
				sendEmail:'',
				emailType:'',
				emailCcReceivers:'',
				sendSms:'1',
				smsContent:'',
				notifyEmployee:'',
				notifyHr:'',
				notifyOrg:'',
				needAudit:'',
				auditUserId:'',
				auditUserName:'',
				memo:'',	
			}
			/*弹出模板命名模态框*/
			
			for(var k in tempDetail){
				if(obj[k]!=null || obj[k]!=undefined){
					obj[k] = tempDetail[k];
				}
			}
			
			var param = {
				url: '/appcenter/offerTemplate/save.json',
				data: obj,
				token: offer_add.getParameter().token,
				success: function(json) {
					if(json.code == 1) {
					$('#tempeltName ').modal('hide');
					} else {
						layer.msg(json.message);
					}
				}
			}
			offer_add._ajax(param);
		}
		$('#tempeltName input').on('click',function(){
			$('#tempeltName input[name="tempeltName"]').css('background','#f5f5f5')
		})
		$('#tempeltName input').on('blur',function(){
			$('#tempeltName input[name="tempeltName"]').css('background','white')
		})
		
		$(_pageId + ' .saveCommitted').on('click',function(){
			update_templet();	
			saveCommitted(offerObj);
		})
		
		/*抄送人,审批人 鼠标事件*/
		$(_pageId).on('mouseover mouseout',' .select-val_i', function(event){
			if(event.type=='mouseover'){
				var _left = $(this).position().left-5;
				$(this).next().css('left',_left);
				$(this).next().css('display','block');
			}else if(event.type=='mouseout'){
				$(this).next().css('display','none');
			}
		});
		
		/*获取hr填写信息*/
		function getHrInfo(){
			if(tempDetail.resumeId===null ){
				tempDetail.resumeId=''
			}
			if(tempDetail.offerManagerId===null ){
				tempDetail.offerManagerId=''
			}
			/*获取邮箱发送类型*/
			if($(_pageId + ' .transmit_mode .email').eq(0).hasClass('y_select')){
				tempDetail.emailType = 2;
			}else{
				tempDetail.emailType = 1;
			}
			
			/*获取抄送人列表*/
			var emailCcReceivers=''
			if($(_pageId +' #emailCcReceivers').attr('data-id')!==''){
				var ReceiversID = $(_pageId +' #emailCcReceivers').attr('data-id').split(',');
				var ReceiversVal = $(_pageId +' #emailCcReceivers').attr('data-value').split(',')
				for(var i=0;i<ReceiversID.length;i++){
					if(i>0 && i != ReceiversID.length){
						emailCcReceivers += ',' +ReceiversID[i]+ '|' +ReceiversVal[i] ;
					}else{
						emailCcReceivers += +ReceiversID[i]+ '|' +ReceiversVal[i];
					}	
				}				
				tempDetail.emailCcReceivers = emailCcReceivers;
			}
			
			
			/*获取短信内容*/
			if($(_pageId+ ' #smsContent').parent().find('.letbl').hasClass('y_check')){
				tempDetail.smsContent = $(_pageId +' #smsContent').val()
				tempDetail.sendSms = 1;
			}else{
				tempDetail.sendSms = 0;
			}
			
			
			/*获取提醒事项的值*/
			if($(_pageId+' .remind ._hrInfo').eq(0).children('div').hasClass('y_check')){
				tempDetail.notifyEmployee=1
			}else{
				tempDetail.notifyEmployee=2
			}
			
			if($(_pageId+' .remind ._hrInfo').eq(1).children('div').hasClass('y_check')){
				tempDetail.notifyHr=1
			}else{
				tempDetail.notifyHr=2
			}
			
			if($(_pageId+' .remind ._hrInfo').eq(2).children('div').hasClass('y_check')){
				tempDetail.notifyOrg=1
			}else{
				tempDetail.notifyOrg=2
			}
			
			/*获取审批人列表*/
			tempDetail.auditUserIds = $(_pageId +' #auditUserInfo').attr('data-id');
			
			if($(_pageId +' #emailCcReceivers').attr('data-id')!==''){
				var auditUserInfo=''
				var auditUserID = $(_pageId +' #emailCcReceivers').attr('data-id').split(',');
				var auditUserVal = $(_pageId +' #emailCcReceivers').attr('data-value').split(',')
				for(var i=0;i<auditUserID.length;i++){
					if(i>0 && i != auditUserID.length){
						auditUserInfo += ',' +auditUserID[i]+ '|' +auditUserVal[i] ;
					}else{
						auditUserInfo += +auditUserID[i]+ '|' +auditUserVal[i];
					}	
				}
				tempDetail.auditUserInfo = auditUserInfo;		
			}
			if(tempDetail.auditUserInfo!==''){
				tempDetail.needAudit = 1;
			}else{
				tempDetail.needAudit = 0;
			}
		}
		
		/*另存为待发offer*/
		function saveCommitted(offerObj){
			
			var validateList = $(_pageId + " .itemck")
			if(!templep_validate(validateList)) return;
			
			getHrInfo();
			tempDetail.sendOffer=0
			for(var k in tempDetail){
				if(offerObj[k]!=null || offerObj[k]!=undefined){
					offerObj[k] = tempDetail[k];
				}
			}
			var param = {
				url:ajaxUrl,
				data: offerObj,
				token: offer_add.getParameter().token,
				success: function(json) {
					if(json.code == 1) {
						layer.msg('已存入待发offer');
					} else {
						layer.msg('保存待发offer失败');
					}
				}
			}
			offer_add._ajax(param);

		}
		
		
		/*获取邮箱配置信息*/
		function getEmailConfig(){
			if($(_pageId + ' .transmit_mode .email').eq(0).hasClass('y_select')){
				var param = {
					url: '/appcenter/offer/getEmailParams.json',
					data: {},
					token: offer_add.getParameter().token,
					success: function(json) {
						if(json.code == 1) {
							if(json.data){
								for(var k  in json.data){
									if(json.data[k]=='' && json.data[k]==null){
										layer.msg('邮箱配置信息错误！');
										
										$('#preview').modal('hide')
										$('#config_email').modal({
											backdrop: 'static',
											show: true
										});
										return false;
									}
								}
							}
						} else {
							layer.msg('你还没有配置邮箱');
							
							$('#preview').modal('hide')
							$('#config_email').modal({
								backdrop: 'static',
								show: true
							});
						}
					}		
				}
				offer_add._ajax(param);
			}
			return true;
		}
		
		/*邮箱校验*/
		function email_validate(validateList){
			for(var i = 0; i < validateList.length; i++) {
				if(validateList.eq(i).val()=='') {
					var text= validateList.eq(i).parent().parent().children().eq(0).text();
					layer.msg('亲！ ' + text + '还没填写哦！');
					return false;
				} 
			}
			return true;
		}

		/*邮箱配置事件*/
		$('.email_update').on('click', function() {
			$('.email_name').attr('readonly', false);
			$('.email_update').css('visibility', 'hidden');
			$('.email_name').focus();
		})

		$('.email_name').on('blur', function() {
			$('.email_name').attr('readonly', 'readonly');
			$('.email_update').css('visibility', 'visible');
		})

		$('#config_email .btn-success').on('click', function() {
			var validateList = $('#config_email input')
			if(! email_validate(validateList)){
				return;
			};
			var param = {
				url: '/appcenter/offer/setEmailParams.json',
				data: {
					fromAddress: $('.email_name').val(),
					fromPassword: $('.email_password').val(),
					sendType: $('.email_type').val(),
					sendServer: $('.email_ip').val(),
					fromPort: $('.email_prot').val() == "" ? '25' : $('.email_prot').val(),
					isEncryption: '1'
				},
				token: offer_add.getParameter().token,
				success: function(json) {
					if(json.code == 1) {
						layer.msg("邮箱配置成功!");
						initialize()
						$('#config_email').modal('hide');
					} else {
						layer.msg(json.message);
					}
				}
			}
			offer_add._ajax(param);
		})

		$('#config_email .btn-default').on('click', function() {
				initialize()
				$('#config_email').modal('hide');
			})
		/*初始化邮箱配置*/
		function initialize() {
			$('#config_email .email_name').val("");
			$('#config_email .email_password').val("");
			$('#config_email .email_ip').val("");
			$('#config_email .email_prot').val("");
		}
		
		
		/*模板校验*/
		function templep_validate(validateList) {
			for(var i = 0; i < validateList.length; i++) {
				if(validateList.eq(i).parent().find('select').length > 0 || validateList.eq(i).parent().find('input').length > 0) {
					if(validateList.eq(i).parent().find('input').eq(0).val()=='') {
						layer.msg('亲！ ' + validateList.eq(i).prev().text() + '还没填写哦！');
						return false;
					}
					if( validateList.eq(i).parent().find('select').length>0 && (validateList.eq(i).parent().find('select').eq(0).val()=='' || validateList.eq(i).parent().find('select').eq(0).val()==null)){
						layer.msg('亲！ ' + validateList.eq(i).prev().text() + '还没填写哦！');
						return false;
					}
				} else {
					if(validateList.eq(i).next().attr('data-value') == '') {
						layer.msg('亲！ ' + validateList.eq(i).prev().text() + '还没填写哦！');
						return false;
					}
				}

			}
			
			var userList = $(_pageId +' .user_info input');
			for(var i=0;i< userList.length;i++){
				if(userList.eq(i).val()=='' || userList.eq(i).val()==null){
					var text= userList.eq(i).parent().parent().children().eq(0).text();
					layer.msg('亲！ ' + text + '还没填写哦！');
					return false;
				}
			}
			return true;
		}
	};

    return offer_add;

});