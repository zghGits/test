
define(["JQuery", "BaseClass",'layer', "config", "bootstrap"], function($, BaseClass,layer){

    var employee_info = inherit(BaseClass.prototype);
	var _pageId= "#employee_info_content";
    employee_info.init = function(){
    	$(_pageId).delegate('.delete','click',function(){
    		if($(this).hasClass('work')){
				$(this).next().remove();
				if($(this).prev().hasClass('cut_off')){
    				$(this).prev().remove();
    			}
				if($(this).next().hasClass('cut_off')){
    				$(this).next().remove();
    			}
				$(this).remove();
			
    		}else{
    			$(this).parent().remove();
    		}
    	})
    	$(_pageId + ' ._add').on('click',function(){
    		var idTpye = parseInt($(this).attr('id'));
    		var _html='';
    		switch(idTpye){
    			case 1:
    				_html='<div class="_message"><div><input type="text"></div><div><input type="text"></div><div><input type="text"></div><div><input type="text"></div><div><input type="text"></div><span class="delete">删除</span></div>'
    				$(this).before(_html);
    				break;
				case 2:
					_html='<div class="_message"><div><input type="text"></div><div><input type="text"></div><div><input type="text"></div><div><input type="text"></div><div><input type="text"></div><span class="delete">删除</span></div>'
    				$(this).before(_html);
					break;
				case 3:
					if($('.word_row').length>0){
						_html='<div><div class="cut_off"></div><span class="delete work">删除</span><div class="word_row"><div class="_message"><div class="_key">担任职位</div><div class="_value"><input type="text" value="" placeholder="张三"></div></div><div class="_message"><div class="_key">任职开始时间</div><div class="_value"><input type="text" value="" placeholder="张三"></div></div><div class="_message"><div class="_key">任职结束时间</div><div class="_value"><input type="text" value="" placeholder="张三"></div></div><div class="_message"><div class="_key">公司名称</div><div class="_value"><input type="text" value="" placeholder="张三"></div></div><div class="_message"><div class="_key">公司所属地区</div><div class="_value"><input type="text" value="" placeholder="张三"></div></div><div class="_message"><div class="_key">所属行业</div><div class="_value"><input type="text" value="" placeholder="张三"></div></div><div class="_message_sm"><div class="_key">任职情况说明 </div><div class="_value"><textarea></textarea></div></div></div></div>';
					}else{
						_html='<div><span class="delete work">删除</span><div class="word_row"><div class="_message"><div class="_key">担任职位</div><div class="_value"><input type="text" value="" placeholder="张三"></div></div><div class="_message"><div class="_key">任职开始时间</div><div class="_value"><input type="text" value="" placeholder="张三"></div></div><div class="_message"><div class="_key">任职结束时间</div><div class="_value"><input type="text" value="" placeholder="张三"></div></div><div class="_message"><div class="_key">公司名称</div><div class="_value"><input type="text" value="" placeholder="张三"></div></div><div class="_message"><div class="_key">公司所属地区</div><div class="_value"><input type="text" value="" placeholder="张三"></div></div><div class="_message"><div class="_key">所属行业</div><div class="_value"><input type="text" value="" placeholder="张三"></div></div><div class="_message_sm"><div class="_key">任职情况说明 </div><div class="_value"><textarea></textarea></div></div></div></div>';						
					}
    				$(this).parent().append(_html);
					break;
				case 4:
					_html='<div class="_message"><div>英语</div><div>精通</div><span class="delete">删除</span></div>'
					$(this).before(_html);
					break;
				case 5:
					_html='<div class="_message"><div></div><div></div><span class="delete">删除</span></div>'
					$(this).before(_html);
					break;
				case 6:
					_html='<div class="skill_i"><input type="text"  /><div class="delete"></div></div>'
					$(this).parent().append(_html)
					break;
				case 7:
					_html='<div class="hobbies_interests_i"><input type="text" value="唱歌跳舞" /><div class="delete"></div></div>'
					$(this).parent().append(_html)
					break;
				default:
					break;	
    		}		
    	})
    	
   };
    return employee_info;
});