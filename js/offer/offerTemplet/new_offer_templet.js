/**
 * Created by zhangys on 2016/11/7.
 */
define(["JQuery", "BaseClass", "layer", "simditor", "preview", "welfare_config", "iselect", "config", "s_module", "bootstrap", 'datetimepicker', 'datetimepicker_zh-CN', 'select2', 'select2-zh-CN'], function($, BaseClass, layer, Simditor, preview, welfare_config, iselect) {

	var new_offer_templet = inherit(BaseClass.prototype);
	var _pageId = "#newTempletContent";

	new_offer_templet.init = function() {

		var tempDetail = JSON.parse(sessionStorage.getItem('tempDetail'));
		if(tempDetail.entryDate.indexOf('1970') != -1 ){
			tempDetail.entryDate='';
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

		var _init = function() {
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

			/*初始化下拉列表*/
			/*注：必须先初始化列表再初始化模板数据*/
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

			/*初始化模板数据*/
			var templet_info = function() {
				for(var k in tempDetail) {
					if(tempDetail[k] !== '' && tempDetail[k] !== '0') {
						if($(_pageId + ' [name=' + k + ']').length > 0) {
							if($(_pageId + ' [name=' + k + ']').get(0).tagName == 'SELECT') {
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
							} else if($(_pageId + ' [name=' + k + ']').get(0).tagName == 'TEXTAREA') {
								if(k == 'material') {
									material_textarea.setValue(tempDetail[k]);
								} else {
									greetMessage.setValue(tempDetail[k]);
								}
							} else if($(_pageId + ' [name=' + k + ']').get(0).tagName == 'INPUT') {
								$(_pageId + ' [name=' + k + ']').val(tempDetail[k]);
							} else if($(_pageId + ' [name=' + k + ']').get(0).tagName == 'DIV') {
								if(k === 'welfare') {
									var _list = tempDetail[k].split(',')
									var _html = '';
									for(var j = 0; j < _list.length; j++) {
										_html += '<div class="fuli_option_i"><div>' + _list[j] + '</div><div></div></div>'
									}
									$(_pageId + ' [name=' + k + ']').eq(0).append(_html)
								} else if(k === 'attachList') { //  附件查询 
									var _list = tempDetail[k];
									var _html = '';
									for(var i = 0; i < _list.length; i++) {
										/*获取附件标*/
										var imageIcon = getImage_icon(_list[i].name);
										if(imageIcon === 'rs') {
											imageIcon = _list[i].url;
										}
										_html += '<div class="boon_option_i" name="attachIds" data-id=' + _list[i].id + ' data-url=' + _list[i].url + ' ><div class="boon_option_img"><img src="' + imageIcon + '"></div><div class="boon_option_info"><div class="info_name">' + _list[i].name + '</div><div class="info_delete del">删除</div><div class="info_time">' + _list[i].creatTime + '</div></div><div class="boon_option_info"><div class="info_size recol">' + _list[i].size + '</div><div class="info_root">来自 HR</div></div></div>'
									}
									/*调用附件查询接口*/
									$(_pageId + ' [name=' + k + ']').append(_html)
								} else {
									/*判断是否是是公用组件标签*/
									if(k == 'orgName' || k == 'positionName' || k == 'leaderName' || k == 'contactName') {
										if(k == 'orgName') {
											$(_pageId + ' [name=' + k + ']').attr('data-id', tempDetail.orgId);
										}
										if(k == 'positionName') {
											$(_pageId + ' [name=' + k + ']').attr('data-id', tempDetail.positionId);
										}
										if(k == 'leaderName') {
											$(_pageId + ' [name=' + k + ']').attr('data-id', tempDetail.leaderId);
										}
										$(_pageId + ' [name=' + k + ']').attr('data-value', tempDetail[k]);
										$(_pageId + ' [name=' + k + ']').find('.select-val').eq(0).text(tempDetail[k]);
									} else {
										$(_pageId + ' [name=' + k + ']').text(tempDetail[k]);
									}

								}
							}
							if($(_pageId + ' [name=' + k + ']').parent().find('.n_check').length > 0) {
								$(_pageId + ' [name=' + k + ']').eq(0).parent().children('.letbl').removeClass('n_check')
								$(_pageId + ' [name=' + k + ']').eq(0).parent().children('.letbl').addClass('y_check')
							}
						}
					}
				}
			}
			templet_info();
		}

		_init();

		/*获取附件小图标*/
		function getImage_icon(fileName) {
			var list = fileName.split('.');
			var imgIcon = "";
			switch(list[list.length - 1]) {
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
		$(document).delegate('.boon_option_i .del', 'click', function(e) {
			//获取删除的文件li元素
			var $fileli = $(this).parent().parent();
			$fileli.remove();
			$.ajax({
				type: "post",
				url: '/appcenter/employeeAttachment/delete.json',
				dataType: 'json',
				headers: {
					token: new_offer_templet.getParameter().token,
				},
				data: {
					attachId: $fileli.attr('data-id')
				},
				beforeSend: function() {
					layer.load(2);
				},
				complete: function() {
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
			history.go(-1)
		})

		/*模板对象*/
		var obj = {
			templateId: tempDetail.templateId,
			title: tempDetail.title,
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
				if(u_check.eq(i).parent().find("input").length > 0 && u_check.eq(i).next().next().attr("name") != 'attachList') { //此处代码没设计好，待优化
					_this = u_check.eq(i).parent().children('input');
					var _key = _this.attr('name');
					obj[_key] = _this.val()
				} else if(u_check.eq(i).parent().find('select').length > 0) {
					_this = u_check.eq(i).parent().find('.select2_div').children('select');
					var _key = _this.attr('name');
					if(_key=='probationPeriodLength'){
						obj[_key] = _this.val()
					}else{
						if(_this.val()=== 1){
							obj[_key] = '初级'
						}else if(_this.val()=== 2){
							obj[_key] = '中级'
						}else{
							obj[_key] = '高级'
						}
					}
					
				} else {
					var _this = u_check.eq(i).next().next()
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
									attachIds += ',' + num.eq(j).attr('data-id');
									attachNames += ',' + num.eq(j).children().eq(1).children().eq(0).text();
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
				token: new_offer_templet.getParameter().token,
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
							formData.append('file', file);
							$.ajax({
								url: '/appcenter/employeeAttachment/upload.json',
								type: "post",
								dataType: 'json',
								data: formData,
								headers: {
									token: new_offer_templet.getParameter().token,
								},
								processData: false,
								contentType: false,
								beforeSend: function() {
									layer.load(2);
								},
								complete: function() {
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
			return true;
		}

		/*附件查询*/
		function attach_info(attachIds) {
			$.ajax({
				type: "post",
				url: '/appcenter/employeeAttachment/query.json',
				dataType: 'json',
				headers: {
					token: new_offer_templet.getParameter().token,
				},
				data: attachIds,
				beforeSend: function() {
					layer.load(2);
				},
				complete: function() {
					layer.closeAll('loading');
				},
				success: function(json) {
					if(json.code == 1) {
						return json.data;
					} else {
						console.log(json.message);
					}
				},
				error: function() {
					console.log("请求删除文件出错!");
				}
			});
			return;
		}

		/*模板预览*/
		$('.newTempletContent .preview').on('click', function() {
			update_templet();
			preview.template_view(obj, 'preview');
		});

		/*添加福利*/
		$(_pageId + ' .add_welfare').on('click', function() {
			welfare_config.init("walfare_config");
		})

		$('#walfare_config ').delegate('.btn-success', 'click', function() {
			var list = $('#walfare_config .check_walfare .check_walfare_i');
			var _html = '';
			for(var i = 0; i < list.length; i++) {
				_html += '<div class="fuli_option_i"><div>' + list.eq(i).children("div").eq(0).text() + '</div><div></div></div>'
			}
			$(_pageId + ' .fuli_option').html(_html);
			$('#walfare_config ').modal('hide');
			$('#walfare_config div').unbind(); //移除所有绑定事件
		})
	};
	return new_offer_templet;
});