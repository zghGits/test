/**
 * Created by zhangys on 2016/11/7.
 */
define(["JQuery", "BaseClass", "layer", "simditor", "preview", "iselect", "config", "s_module", "bootstrap", 'datetimepicker', 'datetimepicker_zh-CN'], function($, BaseClass, layer, Simditor, preview, iselect) {

	var new_offer_templet = inherit(BaseClass.prototype);
	var _pageId = "#newTempletContent";
	new_offer_templet.init = function() {
		
		var _init = function(){
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
			
			/*初始化日期控件*/
			var initData = function() {
				$(_pageId + ' .form_datetime').datetimepicker({
					minView: 2,
					language: 'zh-CN',
					format: 'yyyy-mm-dd',
					todayBtn: 1,
					autoclose: 1,
					startDate: new Date
				})
			}
			initData();
			
			
			/*初始化下拉列表*/
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
		}
		_init();
		
		
		
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
				delete obj[_this]
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
				obj[_this] = '';
			}
		})

		$(_pageId + " .cancel").on('click', function() {
			$('#config_email').modal({
				backdrop: 'static',
				show: true
			});
		})

		

	

		/*模板对象*/
		var obj = {
			templateId: '10030006',
			title: '标准模板',
			greetMessage: '',
			orgId: '',
			orgName: '',
			positionId: '',
			positionName: '',
			leaderId: '',
			leaderName: '',
			probationPeriodLength: '',
			probationPeriodSalary: '',
			entryDate: '',
			entryAddress: '',
			contactName: '',
			material: '',
			sendRegForm: '1',
		}

		function update_templet() {
			/*修改模板对象*/
			var u_check = $('.u_check');
			var y_check = $('.y_check');
			var u_check = $.merge(u_check, y_check);
			var _this = '';
			/*获取富文本的值*/
			obj.material = material_textarea.getValue();
			obj.greetMessage = greetMessage.getValue();

			for(var i = 0; i < u_check.length; i++) {
				if(u_check.eq(i).parent().find("input").length > 0 && u_check.eq(i).next().next().attr("name")!= 'attachIds') { //此处代码没设计好，待优化
					_this = u_check.eq(i).parent().children('input');
					var _key = _this.attr('name');
					obj[_key] = _this.val()
				} else if(u_check.eq(i).parent().find('select').length > 0) {
					_this = u_check.eq(i).parent().children('select');
					var _key = _this.attr('name');
					obj[_key] = _this.val()
				} else {
					var _this = u_check.eq(i).next().next()
					if(_this.attr('name') == 'welfare' || _this.attr('name') == 'attachIds') {
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
							obj.welfare = welfare
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
							obj.attachIds = attachIds;
							obj.attachNames = attachNames;
						}
					} else {
						var _this = u_check.eq(i).next().next().next();
						if(_this.attr("id")) {
							var _key = _this.attr("id");
							var _val = _this.attr("data-id");
							for(var k in obj) {
								if(k == _key) {
									obj[k] = _val;
									break;
								}
							}
						}
						if(_this.attr("name")) {
							var _key = _this.attr("name");
							var _val = _this.attr("data-value");
							for(var k in obj) {
								if(k == _key) {
									obj[k] = _val;
									break;
								}
							}
						}
					}
				}
			}
			delete obj.undefined;
		}

		/*修改模板确认事件*/
		$(_pageId + " .submetInfo").on('click', function() {
			/*模板校验*/
			var validateList = $(_pageId + " .itemck")
			if(!templep_validate(validateList)) return;

			update_templet();

			/*调用更新模板接口*/

			var param = {
				url: '/appcenter/offerTemplate/update.json',
				data: obj,
				token: 'bdk20VAk5eg1aS/bX781waLEycb//gOrxgLhcE9tRnmK7mT332ujuChvrOQD0IBJ853h+TU3pcM=',
				success: function(json) {
					if(json.code == 1) {
						layer.msg("修改模板成功!");
					} else {
						layer.msg(json.message);
					}
				}
			}
			new_offer_templet._ajax(param);

		})

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
								url: 'http://localhost:9000/appcenter/employeeAttachment/upload.json',
								type: "post",
								dataType: 'json',
								data: formData,
								headers:{
				                    token:'wIOD4rqg6hc1aS/bX781waLEycb//gOrxgLhcE9tRnmK7mT332ujuLnqwTFThwmaD8bNHv425Q4='
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
			}).off("click", ".boon_option_i .del").on("click", ".boon_option_i .del", function() { //文件删除
				//获取删除的文件li元素
				var $fileli = $(this).parent().parent();
				
				$.ajax({
					type: "post",
					url: 'http://localhost:9000/appcenter/employeeAttachment/delete.json',
					dataType: 'json',
					headers:{
	                    token:'wIOD4rqg6hc1aS/bX781waLEycb//gOrxgLhcE9tRnmK7mT332ujuLnqwTFThwmaD8bNHv425Q4='
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
							
							//移除当前文件li元素
							$fileli.remove();
							//向后台请求删除文件
							
						} else {
							console.log('请求删除文件返回数据有误,错误码:' + data.message);
						}
					},
					error: function() {
						console.log("请求删除文件出错!");
					}
				});
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
		
		/*邮箱校验*/
		function email_validate(validateList){
			for(var i = 0; i < validateList.length; i++) {
				if(validateList.eq(i).val()=='') {
					var text= validateList.eq(i).parent().parent().children().eq(0).text();
					layer.msg('亲！ ' + text + '还没填写哦！');
					return false;
				} 
			}
			return;
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
			if(! email_validate(validateList)) return;
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
				token: 'bdk20VAk5eg1aS/bX781waLEycb//gOrxgLhcE9tRnmK7mT332ujuChvrOQD0IBJ853h+TU3pcM=',
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
			new_offer_templet._ajax(param);
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
		
		/*模板预览*/
		$('.newTempletContent .preview').on('click', function() {
			update_templet();
			preview.template_view(obj, 'preview');
		});

		/*员工信息登记表预览*/
	};
	return new_offer_templet;
});