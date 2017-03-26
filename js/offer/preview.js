/**
 * Created by zhangys on 2016/11/7.
 */
define(["JQuery", "BaseClass", "simditor", "s_module", "bootstrap"], function($, BaseClass, layer, Simditor) {

var preview = inherit(BaseClass.prototype);
preview.template_view = function(obj,id,letType){
id ='#'+id;
creatHtml(id)
var keyName = ''
for(var k in obj) {
keyName = '#' + k
if($(id +' '+ keyName ).length > 0 && obj[k]!='' && obj[k]!='点击选择' ) {
if(keyName == '#welfare') {
$(id +' '+ keyName).parent().removeClass('dis')
var _list = obj[k].split(',')
var _html = ''
for(var i = 0; i < _list.length; i++) {
_html += '<div class="welfare_i">' + _list[i] + '</div>'
}
$(id +' '+ keyName ).html(_html);
} else if(keyName == '#attachNames') {
$(id +' '+ keyName).parent().removeClass('dis')
var _list = obj.attachNames.split(',')
var _html = ''
for(var i = 0; i < _list.length; i++) {
_html += '<div class="colorGl">' + _list[i] + '</div>'
}
$(id +' '+ keyName ).html(_html);

} else {
if(k==='positionLevel'){
if(obj[k]==='1'){
$(id +' '+ keyName ).html('初级')
}
if(obj[k]==='2'){
$(id +' '+ keyName ).html('中级')
}
if(obj[k]==='3'){
$(id +' '+ keyName ).html('高级')
}
}else if(k==='probationPeriodLength' && obj[k]!= null){
$(id +' '+ keyName ).html(obj[k]+'个月')
}else{
$(id +' '+ keyName ).html(obj[k])
}
$(id +' '+ keyName).parent().parent().removeClass('dis')
}
}
}
if(letType){
$(id+' .modal-body').css({height: '420px', overflow:'auto'});
$(id+' .modal-footer button').css('margin-right','30px')
}
}
var creatHtml = function(id) {
var _html ='<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><img src="http://www.kuailework.com/china/img/logo_02.png"style="width: 100px;height: 36px;margin-top: 8px;margin-left: 35px;margin-bottom: 5px;"/></div><div class="modal-body"><div style="text-align: center; font-family: MicrosoftYaHei;font-size: 25px;letter-spacing: 0.5px;margin-top: 10px;">录用通知书</div><div style="padding: 30px;font-size: 14px;"><div>亲爱的<span id="employeeName">XXX</span>：</div><div id="greetMessage">经公司领导、相关部门负责人的认真考虑和慎重研究，非常荣幸地通知您，您己被录用！热忱欢迎您加入公司大家庭，我们更期盼您在公司平台上淋漓尽致地发挥自己的智慧和才能，与我们的伙伴一起创造更美好的未来！</div><div style="margin-top: 25px;">您的录用条件如下：</div><div style="margin-top: 25px;overflow: hidden;"><span style="padding: 6px 11px;font-size: 14px; background: #C9D2DB;">岗位情况</span><div style=" border-top: 1px solid #C9D2DB; padding-top: 20px; margin-top: 3px;"><div><div style=" width: 110px; float: left;margin-top: 10px;margin-right: 15px;color: #666666;">入职部门</div><div style="margin-top: 10px;float: left;width: 70%;"><span id="orgName">XXX</span></div></div><div><div style=" width: 110px;float: left;margin-top: 10px;margin-right: 15px;color: #666666;">职位</div><div style="margin-top: 10px;float: left;width: 70%;"><span id="positionName">XXX</span></div></div><div style="display:none"><div style=" width: 110px;float: left;margin-top: 10px;margin-right: 15px;color: #666666;">职位等级</div><div style="margin-top: 10px;float: left;width: 70%;"><span id="positionLevel">XXX</span></div></div><div><div style=" width: 110px;float: left;margin-top: 10px; margin-right: 15px; color: #666666;">汇报对象</div><div style="margin-top: 10px; float: left;width: 70%;"><span id="leaderName">XXX</span></div></div><div><div style=" width: 110px; float: left;margin-top: 10px;margin-right: 15px;color: #666666;">试用期</div><div style="margin-top: 10px;float: left;width: 70%;"><span id="probationPeriodLength">XXX</span></div></div></div></div><div style="margin-top: 25px;overflow: hidden;"><span style="padding: 6px 11px;font-size: 14px;background: #C9D2DB;">薪酬福利</span><div style=" border-top: 1px solid #C9D2DB;padding-top: 20px;margin-top: 3px;"><div><div style=" width: 110px;float: left;margin-top: 10px;margin-right: 15px;color: #666666;">试用期薪资</div><div style="margin-top: 10px;float: left;width: 70%;"><span id="probationPeriodSalary">XXX</span></div></div><div style="display:none"><div style=" width: 110px;float: left;margin-top: 10px;margin-right: 15px;color: #666666;">转正后薪资</div><div style="margin-top: 10px;float: left;width: 70%;"><span id="salary">XXX</span></div></div><div style="display:none"><div style=" width: 110px;float: left;margin-top: 10px;margin-right: 15px;color: #666666;">福利</div><div style="margin-top: 10px;float: left;width: 70%;" id="welfare"></div></div></div></div><div style="margin-top: 25px;overflow: hidden;"><span style="padding: 6px 11px;font-size: 14px;background: #C9D2DB;">报道事宜</span><div style=" border-top: 1px solid #C9D2DB;padding-top: 20px;margin-top: 3px;"><div><div style=" width: 110px;float: left;margin-top: 10px;margin-right: 15px;color: #666666;">报道时间</div><div style="margin-top: 10px;float: left;width: 70%;"><span id="entryDate">XXX</span></div></div><div><div style=" width: 110px; float: left;margin-top: 10px;margin-right: 15px;color: #666666;">报道地点</div><div style="margin-top: 10px;float: left;width: 70%;"><span id="entryAddress">XXX</span></div></div><div style="display:none"><div style=" width: 110px;float: left;margin-top: 10px;margin-right: 15px;color: #666666;">乘车路线</div><div style="margin-top: 10px;float: left;width: 70%;"><span id="entryRoute">XXX</span></div></div><div><div style=" width: 110px;float: left;margin-top: 10px;margin-right: 15px;color: #666666;">联系人</div><div style="margin-top: 10px;float: left;width: 70%;"><span id="contactName">XXX</span></div></div><div><div style=" width: 110px;float: left;margin-top: 10px;margin-right: 15px;color: #666666;">联系电话</div><div style="margin-top: 10px;float: left; width: 70%;"><span id="contactPhone">XXX</span></div></div><div><div style=" width: 110px;float: left;margin-top: 10px;margin-right: 15px;color: #666666;">报道所需材料</div><div style="margin-top: 10px;float: left;width: 70%;"><span id="material">XXXXXX</span></div></div></div></div><div style="margin-top: 25px;overflow: hidden;"><span style="padding: 6px 11px;font-size: 14px;background: #C9D2DB;">其他</span><div style=" border-top: 1px solid #C9D2DB;padding-top: 20px;margin-top: 3px"><div style="display:none"><div style=" width: 110px;float: left;margin-top: 10px; margin-right: 15px; color: #666666;">备注</div><div style="margin-top: 10px; float: left;width: 70%;"><span id="memo">XXX</span></div></div><div style="display:none"><div style=" width: 110px; float: left;margin-top: 10px;margin-right: 15px;color: #666666;">附件</div><div style="margin-top: 10px;float: left;width: 70%;" id="attachNames"></div></div><div><div style=" width: 110px;float: left;margin-top: 10px; margin-right: 15px;color: #666666;"></div><div style=" margin-top: 10px;float: left;width: 70%;"><span>请填写<span style="color:#4d92e3 ;"><a href="#" style="text-decoration:none;">《员工信息登记表》</a></span>，填写完成后即可确认提交</span></div></div></div></div></div></div><div class="modal-footer"><button type="button" class="btn btn-success">发送</button></div></div></div>'
$(id).html(_html);
$(id).modal({
backdrop: 'static',
show: true
});
}
return preview;
});