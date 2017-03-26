wp_fileuploader = (function(){
	//所有的文件请求的数据配置
	var options = {
		//uploadurl:'http://localhost:5858/', //上传请求路径
		//datatype:'text', //文件返回类型
		uploadurl:'http://192.168.1.33:9000/appcenter/employeeAttachment/upload.json',
		delurl:'http://192.168.1.33:9000/appcenter/employeeAttachment/delete.json', //删除文件请求
		datatype:'json'
	};

	/* 图片上传(单文件上传)
	 * 参数1：文件容器选择器
	 * 参数2：可选，错误信息显示元素选择器
	 * */
	var imgupload = function(outerSelector,errSelector){
		//布置内部元素结构
		$(outerSelector).html('<div class="wp_fileContainer">'+
			'<div class="add"><span>+</span></div>'+
			'<form class="file_form" enctype="multipart/form-data" style="display:none"><input class="file_inp" type="file" name="file" multiple/></form>' +
			'</div>');

		//添加按钮
		$(outerSelector).off("click", ".add").on("click", ".add", function() {
			$(outerSelector + " .file_inp").trigger("click");
		}).off("change", ".file_inp").on("change", ".file_inp", function() {//文件元素的监听
			var files = this.files;
			for (var i = 0, f; f = files[i]; i++) {
				//创建文件读取对象
				var reader = new FileReader();
				//读取文件
				reader.readAsDataURL(f);
				//监听读取的文件内容,因为需要在绑定时传入参数,所以使用了闭包
				reader.onload = (function(file) {
					return function() {
						//获取文件扩展名
						var extname = file.name.substr(file.name.lastIndexOf(".") + 1);
						//通过扩展名对是否是图片进行判断,是则添加图片，不是则给出警告
						if (extname.indexOf("img") != -1 || extname.indexOf("gif") != -1 || extname.indexOf("png") != -1 ||
							extname.indexOf("jpg") != -1 || extname.indexOf("jpeg") != -1) {
							$(outerSelector + ' .add').before("<div class='img'><img src='" + this.result + "' style='width: 100%;height: 100%'/></div>");
						} else {
							//如果没有给错误信息显示选择器就不作反应
							if(errSelector == undefined){
								return;
							}

							//给出警告然后一段时间后消失
							$(errSelector).css('color','red').text('只能上传图片!');
							setTimeout(function(){$(errSelector).text('');},3000);
						}

						//创建formData数据用于发送文件
						var formData = new FormData($(outerSelector + ' .file_form')[0]);
						$.ajax({
							url: options.uploadurl,
							type: 'post',
							dataType: options.datatype,
							data: formData,
							processData: false, //发送文件必写
							contentType: false, //发送文件必写
							success: function(data) {
								console.log(typeof data);
								//如果有返回成功字段在返回数据中可以下面方式判断
								if(data.code == 1){
									//获取返回数据并且进行处理
									var data = data.data;
									var $img = $(outerSelector + ' .add').prev('.img');
									$img.attr({
										"data-id":data.attachId,
										"data-url":data.url
									});
								}else{
									console.log("发送图片请求所返回的数据有误!错误码：" + data.message);
								}
							},
							error: function(XmlHttpRequest, textStatus, errorThrown) {
								console.log("发送图片请求出错!!!");
								if(errSelector == undefined){
									return;
								}

								$(errSelector).css('color','red').text('上传失败!');
								setTimeout(function(){$(errSelector).text('');},3000);
							}
						});
					};
				})(f); //在此时传入文件对象
			}
		});
	}

	/* 所有文件上传
         * 参数1：保存文件的容器选择器(div)
         * 参数2：打开文件选择框的上传选择器(a)
         * 注意事项：返回类型和后台不同意有可能造成状态是200和4但是进入error的情况
         */
	var allTypeUpload = function(outerselector, uploadselector){
		//配置内部的html结构
		$(outerselector).html('<div class="wp_fileContainer">'+
			'<form class="file_form" enctype="multipart/form-data" style="display: none;">'+
				'<input class="file_inp" type="file" name="file" accept="*/*" multiple="multiple">'+
			'</form><ul></ul></div>');

	    //如果上传按钮在外部则可通过外部触发文件选择器
	    $(document).off("click", uploadselector).on("click", uploadselector, function() {
	    	/* 从外部触发内部的input元素  */
	        $(outerselector + " .file_inp").trigger('click');
	    });

		//监听文件元素的值的改变
	    $(outerselector).off("change", ".file_inp").on("change", ".file_inp", function() {
	    	//获取input元素的文件列表并遍历
	        var files = this.files;
	        for (var i = 0, f; f = files[i]; i++) {
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
	                    switch (extname) {
	                        case "txt":
	                            imgSrc = 'images/icon－txt.svg';
	                            break;
	                        case "rar":
	                            imgSrc = 'images/icon－rar.svg';
	                            break;
	                        case "zip":
	                            imgSrc = 'images/icon－zip.svg';
	                            break;
	                        case "doc":
	                        case "docx":
	                            imgSrc = 'images/icon－word.svg';
	                            break;
	                        case "ppt":
	                        case "pptx":
	                            imgSrc = 'images/icon－ppt.svg';
	                            break;
	                        case "xls":
	                        case "xlsx":
	                            imgSrc = 'images/icon－excle.svg';
	                            break;
	                        case "pdf":
	                            imgSrc = 'images/icon－pdf.svg';
	                            break;
	                        case "gif":
	                        case "img":
	                        case "jpeg":
	                        case "jpg":
	                        case "png":
	                            imgSrc = this.result;
	                            break;
	                        default:
	                            imgSrc = 'images/icon－weizhiwenjian0.svg';
	                            break;
	                    }

	                    //处理文件大小单位的转换
	                    var filesize = file.size;
	                    filesize = (filesize > 1024 * 1024) ? (Math.round(filesize / 1024 / 1024 * 100) / 100 + "M") : ((filesize > 1024) ? (Math.round(filesize / 1024 * 100) / 100 + "KB") : (filesize + "B"));

						//上传时间记录
						var now = new Date();
						var year = now.getFullYear();
						var month = (now.getMonth()+1) > 9 ? (now.getMonth()+1) : ('0' + (now.getMonth()+1));
						var day = (now.getDate()) > 9 ? (now.getDate()) : ('0' + (now.getDate()));
						var hour = (now.getHours()) > 9 ? (now.getHours()) : ('0' + (now.getHours()));
						var minute = (now.getMinutes()) > 9 ? (now.getMinutes()) : ('0' + (now.getMinutes()));
						var sec = (now.getSeconds()) > 9 ? (now.getSeconds()) : ('0' + (now.getSeconds()));
						var createdate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + sec;
	                    //追加文件li元素到容器内
	                    var html = '<li class="file_li">' +
	                        '<div class="left">' +
	                        '<div class="fileImg"><img src="' + imgSrc + '"/></div>' +
	                        '<div>' +
	                        '<div class="name" title="' + filename + '">' + (filename.length > 11 ? filename.substr(0, 10) + "..." : filename) + '</div>' +
	                        '<div class="size">' + filesize + '</div>' +
	                        '</div>' +
	                        '</div>' +
	                        '<div class="right">' +
	                        '<div class="date">'+ createdate +'</div>' +
	                        '<div class="from">来自某人</div>' +
	                        '</div>' +
	                        '<div class="center">' +
	                        '<div>' +
	                        '<a href="javascript:;" class="download">下载</a><a href="javascript:;" class="del">删除</a>' +
	                        '</div>' +
	                        '<div class="progress_outer"><div class="progress_inner"></div></div><label></label>' +
	                        '</div>' +
	                        '</li>';
	                    $(outerselector + " .wp_fileContainer > ul").prepend(html);

	                    //获取当前添加的文件li元素
	                    var $curfileli = $(outerselector + " .wp_fileContainer > ul li").eq(0);

	                    //创建formData数据用于发送文件
	                    var formData = new FormData($(outerselector + ' .file_form')[0]);
	                    $.ajax({
	                        url: options.uploadurl,
	                        type: 'post',
	                        dataType: options.datatype, //注意返回类型,如果不对会出现请求成功但是进入error的情况
	                        data: formData,
	                        processData: false,
	                        contentType: false,
	                        xhr: function() {
	                        	//获取xmlhttprequest对象
	                            var xhr = $.ajaxSettings.xhr();
								//检查upload属性是否存在
	                            if (xhr.upload) {
	                                //监听xhr请求状态
	                                xhr.upload.onload = function() {
	                                    console.log("文件准备完成,即将上传!");
	                                }

									//监听文件上传进度
	                                xhr.upload.onprogress = function(e) {
										//如果兼容
	                                    if (e.lengthComputable) {
	                                    	//处理上传进度并渲染到页面进度条上
	                                        var percent = e.loaded / e.total * 100 + '%';
	                                        var progress = $curfileli.children(".center").children('.progress_outer').children('.progress_inner');
	                                        progress.css("width", percent);
	                                        if (percent == "100%") {
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
	                            if(data.code == 1){
	                            	console.log("文件上传请求成功");
	                            	$curfileli.attr({
										'data-id':data.data.attachId,
										'data-url':data.data.url
									});
	                            }else{
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
	    }).off("click", ".file_li .del").on("click", ".file_li .del", function() { //文件删除
			//获取删除的文件li元素
	    	var $fileli = $(this).parent().parent().parent();
			//将文件元素值重置，防止文件上传失败后再次上传同名文件会失效，使能够监听到file的change事件
			$(outerselector + " .file").val('');
			//移除当前文件li元素
	    	$fileli.remove();
			//向后台请求删除文件
	    	$.ajax({
				type:"post",
				url:options.delurl,
				dataType:'json',
				data:{fileName:$fileli.attr('data-filename')},
				success:function(data){
					if(data.code == 1){
						console.log("请求删除文件成功!");
					}else{
						console.log('请求删除文件返回数据有误,错误码:' + data.message);
					}
				},
				error:function(){
					console.log("请求删除文件出错!");
				}
			});
	    }).off('click',".file_li .download").on('click','.file_li .download',function(){ //文件下载

	    });
	}

	/* 拖拽和手动上传
         * 参数1：可拖拽区域的选择器(div)
         * 参数2：保存文件的容器选择器(div)
         * 注意事项：返回类型和后台不同意有可能造成状态是200和4但是进入error的情况
         */
	var dragUpload = function(dragSelector,fileContainerSelector){
		//获取可拖拽区域
		var $dragdiv = $(dragSelector);
		//布置可拖拽区域内部的html结构
		$dragdiv.html('<div class="wp_dragContainer">'+
    			'<span>可拖拽文件到此处上传文件或者直接点击</span>'+
    			'<a href="javascript:;" class="upload">上传文件</a>'+
				'<form class="file_form" enctype="multipart/form-data" style="display: none">'+
					'<input class="file_inp" type="file" name="file" accept="*/*" multiple="multiple" />'+
				'</form>'+
    		'</div>');
	    $(fileContainerSelector).html('<div class="wp_fileContainer"></div>');

		//文件拖拽到区域内部的时候触发
		$dragdiv[0].ondragenter = function(e){
			e.preventDefault();
			$dragdiv.css('background-color','lightgray');
		}

		//文件拖拽到指定区域内部移动的时候触发
		$dragdiv[0].ondragover = function(e){
			e.preventDefault();
			$dragdiv.css('background-color','lightgray');
		}

		//文件移出指定区域内部的时候触发
		$dragdiv[0].ondragleave = function(e){
			e.preventDefault();
			$dragdiv.css('background-color','white');
		}

		//当文件在指定区域内被放下的时候触发
		$dragdiv[0].ondrop = function(e){
			e.preventDefault();
			e.stopPropagation();
			$dragdiv.css('background-color','white');

			//获取拖拽的文件信息列表
			var fileList = e.dataTransfer.files;

            //判断文件列表长度用于检测是否是拖拽上传操作，如果不是则直接返回
	        if(fileList.length == 0){
	            return false;
	        }

	        //遍历每一个文件
	        for(var i=0;i<fileList.length;i++){
				//获取预览图片的路径
	        	var fileUrl = window.URL.createObjectURL(fileList[i]);
				//获取文件名
		        var filename = fileList[i].name;
				//获取文件大小
		        var filesize = fileList[i].size;

		        //控制上传文件大小
		        /*if(Math.floor((filesize)/1024) > 500){
		            alert("上传大小不能超过500K.");
		            return false;
		        }*/

				//控制文件夹上传
                if(filename.lastIndexOf(".") == -1){
					alert("不支持直接上传文件夹，抱歉!");
		        	return false;
				}

		        var formData = new FormData();
		        formData.append('file',fileList[i]);
		        ajax(filename,filesize,fileUrl,formData);
	        }
		}

		//非拖拽文件上传触发
		$(dragSelector + " .upload").off("click").on('click',function(e){
			$(dragSelector + ' .file_inp').trigger('click');
		});
		$(dragSelector + ' .file_inp').off('change').on('change',function(e){
			//获取文件列表
			var files = this.files;
			//遍历文件列表
	        for (var i = 0, f; f = files[i]; i++) {
	        	//实例化文件读取对象
	            var reader = new FileReader();
				//读取数据
	            reader.readAsDataURL(f);
				//监听文件读取过程
	            reader.onload = (function(file) {
	                return function() {
	                	//获取文件名
	                    var filename = file.name;
						//获取文件大小
	                    var filesize = file.size;

						//创建formData数据用于发送文件
            			var formData = new FormData($(dragSelector + ' .file_form')[0]);
	                    ajax(filename,filesize,this.result,formData);
	                }
	            })(f); //在此时传入文件对象
	        }
		});

		//预览，下载，删除的事件绑定
		$(document).off('click',fileContainerSelector + ' .file .preview').on('click',fileContainerSelector + ' .file .preview',function(){

		}).off('click',fileContainerSelector + ' .file .download').on('click',fileContainerSelector + ' .file .download',function(){
			//获取当前渲染的文件元素
			var $thisfile = $(this).parent().parent();
			//链接到下载路径进行文件下载
			window.location.url = $thisfile.attr('data-url');
		}).off('click',fileContainerSelector + ' .file .del').on('click',fileContainerSelector + ' .file .del',function(){
			//获取当前渲染的文件元素
			var $thisfile = $(this).parent().parent();
			//移除当前文件元素
			$thisfile.remove();
			$.ajax({
				type:"post",
				url:options.delurl,
				dataType:'json',
				data:{fileName:$thisfile.attr('data-filename')},
				success:function(data){
					if(data.code == 1){
						console.log("删除附件请求成功!");
					}else{
						console.log('删除附件请求返回数据有误,错误码:' + data.message);
					}
				},
				error:function(){
					console.log("删除附件请求出错!");
				}
			});
		});

		//封装一个请求方法
		var ajax = function(filename,filesize,thumbnail,formData){
			//获取文件扩展名
			var extname = filename.substr(filename.lastIndexOf(".") + 1);
			//用于记录预览文件图片的路径
            var imgSrc = "";
            switch (extname) {
                case "txt":
                    imgSrc = 'images/icon－txt.svg';
                    break;
                case "rar":
                    imgSrc = 'images/icon－rar.svg';
                    break;
                case "zip":
                    imgSrc = 'images/icon－zip.svg';
                    break;
                case "doc":
                case "docx":
                    imgSrc = 'images/icon－word.svg';
                    break;
                case "ppt":
                case "pptx":
                    imgSrc = 'images/icon－ppt.svg';
                    break;
                case "xls":
                case "xlsx":
                    imgSrc = 'images/icon－excle.svg';
                    break;
                case "pdf":
                    imgSrc = 'images/icon－pdf.svg';
                    break;
                case "gif":
                case "img":
                case "jpeg":
                case "jpg":
                case "png":
                    imgSrc = thumbnail;
                    break;
                default:
                    imgSrc = 'images/icon－weizhiwenjian0.svg';
                    break;
            }

			//处理文件大小的单位转换
            filesize = (filesize > 1024 * 1024) ? (Math.round(filesize / 1024 / 1024 * 100) / 100 + "M") : ((filesize > 1024) ? (Math.round(filesize / 1024 * 100) / 100 + "KB") : (filesize + "B"));

			//创建将要渲染到页面上的文件div结构,并添加到文件容器中
			var str = "<div class='file'>"+
				"<div class='touch_div'><a href='javascript:;' class='preview'>预览</a><a href='javascript:;' class='download'>下载</a><a href='javascript:;' class='del'>删除</a></div>"+
				"<img src='" + imgSrc + "'>"+
				"<p class='name'>"+filename+"</p><p class='size'>"+filesize+"</p></div>";
			$(fileContainerSelector + ' .wp_fileContainer').prepend(str);

			//获取本次添加到页面上的文件对象
			var $thisFile = $(fileContainerSelector + ' .wp_fileContainer .file').eq(0);

            $.ajax({
                url: options.uploadurl,
                type: 'post',
                dataType: options.datatype, //注意返回类型,如果不对会出现请求成功但是进入error的情况
                data: formData,
                processData: false,
                contentType: false,
                success: function(data) {
                	if(data.code == 1){
                		console.log("请求上传附件成功!");
                		$thisFile.attr({
							'data-id':data.data.attachId,
							'data-url':data.data.url
						});
                	}else{
                		console.log("请求上传附件返回数据有误!错误码：" + data.message);
                	}
                },
                error: function(XmlHttpRequest, textStatus, errorThrown) {
                    console.log("请求上传附件出错!");
					//在当前渲染的文件元素中显示错误信息
                    $thisFile.append('<div style="color:red;position:absolute;z-index=2;top:120px;left:100px">文件上传失败!</div>');
        			//指定时间之后移除当前文件元素
					setTimeout(function(){
						$thisFile.remove();
						//重置input文件元素方便重新上传同文件而不失效
						$(dragSelector + ' .file_inp').val('');
					},3000);
                }
            });
		}
	}

	/* 文件夹和文件上传
         * 参数1：上传选择器(div)
         * 参数2：文件容器(div)
         * 注意事项：返回类型和后台不同意有可能造成状态是200和4但是进入error的情况
         */
	var folderUpload = function(uploadSeletor,fileContainerSelector){
		//配置内部的html结构
		$(uploadSeletor).html('<div class="wp_folderUploader">'+
    		'<div class="btndiv">'+
    			'<div class="upload">上传</div>'+
    			'<a href="javascript:;" class="uploadfile_a">上传文件</a>'+
    			'<a href="javascript:;" class="uploadfolder_a">上传文件夹</a>'+
    		'</div>'+
			'<form class="file_form" enctype="multipart/form-data" style="display:none">'+
				'<input class="file_inp" type="file" name="file" accept="*/*" multiple/>'+
			'</form>'+
			'<form class="folder_form" enctype="multipart/form-data" style="display:none">'+
				'<input class="folder_inp" type="file" name="file[]" accept="*/*" webkitdirectory="" multiple=""/>'+
			'</form>'+
    	'</div>');
		$(fileContainerSelector).html('<ul class="wp_folderContainer"></ul>');

		/* 文件和文件夹上传按钮事件绑定 */
		$(document).off('click',uploadSeletor + ' .upload,' + uploadSeletor + ' .uploadfile_a')
		.on('click',uploadSeletor + ' .upload,' + uploadSeletor + ' .uploadfile_a',function(){
			$(uploadSeletor + ' .file_inp').trigger('click');
		}).off('click',uploadSeletor + ' .uploadfolder_a').on('click',uploadSeletor + ' .uploadfolder_a',function(){
			$(uploadSeletor + ' .folder_inp').trigger('click');
		});

		//监听文件元素的值的改变
		$(uploadSeletor + ' .file_inp').off("change").on("change",function(){
			//获取文件列表
			var files = this.files;
	        for (var i = 0, f; f = files[i]; i++) {
	        	//实例化文件读取对象
	            var reader = new FileReader();
				//读取数据
	            reader.readAsDataURL(f);
				//监听文件读取过程
	            reader.onload = (function(file) {
	                return function() {
	                	//获取文件名
	                	var filename = file.name;
						//获取文件大小
	                    var filesize = file.size;
						//获取文件扩展名
	                    var extname = filename.substr(filename.lastIndexOf(".") + 1);
						//用于记录文件预览图片链接
						var imgSrc = "";
			            switch (extname) {
			                case "txt":
			                    imgSrc = 'images/icon－txt.svg';
			                    break;
			                case "rar":
			                    imgSrc = 'images/icon－rar.svg';
			                    break;
			                case "zip":
			                    imgSrc = 'images/icon－zip.svg';
			                    break;
			                case "doc":
			                case "docx":
			                    imgSrc = 'images/icon－word.svg';
			                    break;
			                case "ppt":
			                case "pptx":
			                    imgSrc = 'images/icon－ppt.svg';
			                    break;
			                case "xls":
			                case "xlsx":
			                    imgSrc = 'images/icon－excle.svg';
			                    break;
			                case "pdf":
			                    imgSrc = 'images/icon－pdf.svg';
			                    break;
			                case "gif":
			                case "img":
			                case "jpeg":
			                case "jpg":
			                case "png":
			                    imgSrc = this.result;
			                    break;
			                default:
			                    imgSrc = 'images/icon－weizhiwenjian0.svg';
			                    break;
			            }

						//处理文件大小单位转换
			            filesize = (filesize > 1024 * 1024) ? (Math.round(filesize / 1024 / 1024 * 100) / 100 + "M") : ((filesize > 1024) ? (Math.round(filesize / 1024 * 100) / 100 + "KB") : (filesize + "B"));

	                    //上传时间记录
						var now = new Date();
						var year = now.getFullYear();
						var month = (now.getMonth()+1) > 9 ? (now.getMonth()+1) : ('0' + (now.getMonth()+1));
						var day = (now.getDate()) > 9 ? (now.getDate()) : ('0' + (now.getDate()));
						var hour = (now.getHours()) > 9 ? (now.getHours()) : ('0' + (now.getHours()));
						var minute = (now.getMinutes()) > 9 ? (now.getMinutes()) : ('0' + (now.getMinutes()));
						var sec = (now.getSeconds()) > 9 ? (now.getSeconds()) : ('0' + (now.getSeconds()));
						var createdate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + sec;

	                    //控制文件名长度
	                    filename = filename.length > 11 ? (filename.substr(0,10) + "...") : filename;
	                	var html = '<li class="file" title="'+filename+'">'+
	                		'<img class="fileImg" src="' + imgSrc + '"/>'+
	                		'<span class="filename">' + filename + '</span>'+
					        '<span class="createname">创建人:自己人</span>'+
	                		'<span class="size">' + filesize + '</span>'+
	                		'<span class="date">' + createdate + '</span>'+
	                		'<span class="errinfo"></span>'+
	                	'</li>';
	                	$(fileContainerSelector + ' .wp_folderContainer').prepend(html);
	                	var formData = new FormData($(uploadSeletor + ' .file_form')[0]);
			            ajax($(fileContainerSelector + ' .wp_folderContainer > li').eq(0),formData);
	                };
	            })(f); //在此时传入文件对象
	        }
		});

		//监听文件夹的input元素值的改变
		$(uploadSeletor + ' .folder_inp').off("change").on("change",function(){
			//获取文件列表
			var files = this.files;
			//遍历文件列表
	        for (var i = 0, f; f = files[i]; i++) {
				//实例化文件读取对象
	            var reader = new FileReader();
				//读取文件数据
	            reader.readAsDataURL(f);
				//监听文件读取过程
	            reader.onload = (function(file) {
	                return function() {
	                	//获取文件名
	                	var filename = file.name;
						//获取文件大小
	                    var filesize = file.size;
						//获取文件扩展名
	                    var extname = filename.substr(filename.lastIndexOf(".") + 1);
						//获取文件夹的每一级路径名数组
	                	var pathNameArr = file.webkitRelativePath.split('/');
						//初始化文件预览图链接变量
	                	var imgSrc = "";

	                	//上传时间记录
						var now = new Date();
						var year = now.getFullYear();
						var month = (now.getMonth()+1) > 9 ? (now.getMonth()+1) : ('0' + (now.getMonth()+1));
						var day = (now.getDate()) > 9 ? (now.getDate()) : ('0' + (now.getDate()));
						var hour = (now.getHours()) > 9 ? (now.getHours()) : ('0' + (now.getHours()));
						var minute = (now.getMinutes()) > 9 ? (now.getMinutes()) : ('0' + (now.getMinutes()));
						var sec = (now.getSeconds()) > 9 ? (now.getSeconds()) : ('0' + (now.getSeconds()));
						var createdate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + sec;

						//遍历每一个路径名
	                	for(var i=0;i < pathNameArr.length;i++){
	                		//判断是文件或者是文件夹的处理
	                		if(filename != pathNameArr[i]){
	                			//是文件夹则赋值文件夹图标链接到变量
	                			imgSrc = 'images/folder.png';
								//判断文件容器内是否包含当前遍历的路径的li元素
	                			var isexit = $.contains($('.wp_folderContainer')[0], $('li[title="' + pathNameArr[i] + '"]')[0]);
	                			if(isexit){

	                			}else{
	                				//过滤当前文件夹名
	                    			cutfilename = pathNameArr[i].length > 11 ? (pathNameArr[i].substr(0,10) + "...") : pathNameArr[i];
	                				//判断当前文件夹是否是最顶层文件夹
									if(i == 0){
	                					$('.wp_folderContainer').prepend('<li class="folder" data-id="" title="' + pathNameArr[i] + '"><div class="folderlink">'+
		                					'<img class="fileImg" src="' + imgSrc + '"/>'+
					                		'<span class="filename">' + cutfilename + '</span>'+
					                		'<span class="createname">创建人:自己人</span>'+
					                		'<span class="date">' + createdate + '</span>'+
	                					'</div><ul style="display:none"></ul></li>');
	                				}else{//如果文件夹是子文件夹就在上层文件夹中创建文件夹元素
	                					$('.wp_folderContainer li[title="' + pathNameArr[i-1] + '"] > ul').prepend('<li class="folder" data-id="" title="' + pathNameArr[i] + '"><div class="folderlink">'+
		                					'<img class="fileImg" src="' + imgSrc + '"/>'+
		                					'<span class="filename">' + cutfilename + '</span>'+
					                		'<span class="createname">创建人:自己人</span>'+
					                		'<span class="date">' + createdate + '</span>'+
	                					'</div><ul style="display:none"></ul></li>');
	                				}
	                			}
	                		}else{ //如果是文件
	                			switch (extname) {
					                case "txt":
					                    imgSrc = 'images/icon－txt.svg';
					                    break;
					                case "rar":
					                    imgSrc = 'images/icon－rar.svg';
					                    break;
					                case "zip":
					                    imgSrc = 'images/icon－zip.svg';
					                    break;
					                case "doc":
					                case "docx":
					                    imgSrc = 'images/icon－word.svg';
					                    break;
					                case "ppt":
					                case "pptx":
					                    imgSrc = 'images/icon－ppt.svg';
					                    break;
					                case "xls":
					                case "xlsx":
					                    imgSrc = 'images/icon－excle.svg';
					                    break;
					                case "pdf":
					                    imgSrc = 'images/icon－pdf.svg';
					                    break;
					                case "gif":
					                case "img":
					                case "jpeg":
					                case "jpg":
					                case "png":
					                    imgSrc = this.result;
					                    break;
					                default:
					                    imgSrc = 'images/icon－weizhiwenjian0.svg';
					                    break;
					            }

								//处理文件大小单位转换
					            filesize = (filesize > 1024 * 1024) ? (Math.round(filesize / 1024 / 1024 * 100) / 100 + "M") : ((filesize > 1024) ? (Math.round(filesize / 1024 * 100) / 100 + "KB") : (filesize + "B"));

			                    //控制文件长度
								filename = filename.length > 11 ? (filename.substr(0,10) + "...") : filename;

								//构建文件li元素结构,然后添加到文件容器中
			                	var html = '<li class="file">'+
			                		'<img class="fileImg" src="' + imgSrc + '"/>'+
			                		'<span class="filename">' + filename + '</span>'+
			                		'<span class="createname">创建人:自己人</span>'+
			                		'<span class="size">' + filesize + '</span>'+
			                		'<span class="date">' + createdate + '</span>'+
			                		'<span class="errinfo"></span>'+
			                	'</li>';
			                	$('.wp_folderContainer li[title="' + pathNameArr[i-1] + '"] > ul').append(html);

								//创建表单数据用于发送文件
			                	var formData = new FormData($(uploadSeletor + ' .folder_form')[0]);
			                	ajax($('.wp_folderContainer li[title="' + pathNameArr[i-1] + '"] > ul>li:last-child'),formData);
	                		}
	                	}
	                };
	            })(f);
	        }
		});

		//文件夹元素点击事件,展开子目录
		$(document).off("click",'.wp_folderContainer .folder .fileImg,.wp_folderContainer .folder .filename')
		.on("click",'.wp_folderContainer .folder .fileImg,.wp_folderContainer .folder .filename',function(){
			$(this).parent().parent().children('ul').slideToggle("fast");
		});

		//异步请求发送文件到后台
		var ajax = function(fileli,formData){
			$.ajax({
                url: options.uploadurl,
                type: 'post',
                dataType: options.datatype,
                data: formData,
                processData: false,
                contentType: false,
                success: function(data) {
                    console.log("文件上传请求成功!");
                },
                error: function(XmlHttpRequest, textStatus, errorThrown) {
                    console.log("文件上传请求出错");
                    fileli.children('span.errinfo').css('color','red').text('上传失败');
                }
            });
		}
	}

	/* 暴露给外界的接口   */
	return {
		imgupload:imgupload,
		allTypeUpload:allTypeUpload,
		dragUpload:dragUpload,
		folderUpload:folderUpload
	}
})();
