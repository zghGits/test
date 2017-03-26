/**
 * Created by zhangys on 2016/11/7.
 */
define(["JQuery", "BaseClass", "bootstrap"], function($, BaseClass) {

	var welfare = inherit(BaseClass.prototype);
	
	
	
	welfare.init =function(id){
		var id='#'+id;
		var creatHtml =function(){
			var html = '<div class="modal-dialog" ><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><div class="modal-title">福利</div></div><div class="modal-body"><div class="moadl_content"><div class="_top"><input placeholder="添加自定义" name="custom_walfare" /><div class="_add">贴上</div></div><div class="_info"><div class="walfare_substance"><div class="walfare_title">福利内容</div><div class="walfare_i"><div>五险一金</div><div class="n_check"></div></div><div class="walfare_i"><div>带薪年假</div><div class="n_check"></div></div><div class="walfare_i"><div>交通补助</div><div class="y_check"></div></div><div class="walfare_i"><div>通讯补贴</div><div class="y_check"></div></div><div class="walfare_i"><div>加班补贴</div><div class="y_check"></div></div><div class="walfare_i"><div>节日礼金</div><div class="n_check"></div></div><div class="walfare_i"><div>股票期权</div><div class="y_check"></div></div><div class="walfare_i"><div>年底分红</div><div class="n_check"></div></div><div class="walfare_i"><div>项目奖金</div><div class="n_check"></div></div>	</div><div class="check_walfare"><div class="walfare_title">已选择福利</div><label class="check_walfare_i"><div>交通补助</div><div class="_delete">×</div></label><label class="check_walfare_i"><div>通讯补贴</div><div class="_delete">×</div></label><label class="check_walfare_i"><div>加班补贴</div><div class="_delete">×</div></label><label class="check_walfare_i"><div>股票期权</div><div class="_delete">×</div></label></div></div></div></div><div class="modal-footer"><button type="button" class="btn btn-success">确认</button><button type="button" class="btn btn-default">取消</button></div></div></div>'
			$(id).html(html);
			$(id).modal({
				backdrop: 'static',
				show: true
			});
		}
		creatHtml()
		
		/*初始化绑定事件*/
		$(id + ' .add_welfare').on('click',function(){
			$('#walfare_config').modal({
					backdrop: 'static',
					show: true
			});
		})	
		$(id).on(' ._add','click',function(){
			var custom_text = $('#walfare_config input[name="custom_walfare"]').val();
			if(custom_text!=''){
				var _html='<div class="walfare_i"><div>'+custom_text+'</div><div class="n_check"></div></div>'
				$('#walfare_config .walfare_substance').append(_html);
			}
		})
		$(id).delegate(' .walfare_i div:nth-child(2)', 'click', function() {
			if($(this).hasClass('y_check')) {
				var textval = $(this).prev().text();
				$(this).removeClass('y_check')
				$(this).addClass('n_check')
				var list = $('#walfare_config .check_walfare .check_walfare_i')
				for(var i=0;i < list.length;i++){
					if(textval===list.eq(i).children("div").eq(0).text()){
						list[i].remove();
					}
				}
			} else if($(this).hasClass('n_check')) {
				$(this).removeClass('n_check')
				$(this).addClass('y_check')
				var textval = $(this).prev().text();
				var _html='<label class="check_walfare_i"><div>'+textval+'</div><div class="_delete">×</div></label>'
				$('#walfare_config .check_walfare').append(_html);
			}
		})
		
		$(id).delegate('._delete','click', function(){
			var textval = $(this).prev().text();
			var list = $('#walfare_config .walfare_substance .walfare_i')
			$(this).parent().remove()
			for(var i=0;i < list.length;i++){
				if(textval===list.eq(i).children("div").eq(0).text()){
					list.eq(i).children("div").eq(1).removeClass('y_check')
					list.eq(i).children("div").eq(1).addClass('n_check')
				}
			}
		})
	}
	
	return welfare;
});