/**
 * Created by xs on 2016/12/13.
 */
var keyword;
var ipPort = 'http://172.25.50.30:9000';
define(["JQuery", "BaseClass", "layer", "config"], function($,BaseClass,layer) {

    var contractManage = inherit(BaseClass.prototype);


    contractManage.init = function(){

        loadMessageByPage(1);
        this.event();
    };

    contractManage.event = function(){


        //搜索框功能
        $("#boxHeader").on('input','.searchFrame',function () {
            keyword=$(".searchFrame").val()
            loadMessageByPage(1,keyword);
        })
        //筛选框
        $(".shaixuanBtn").click(function (event) {
            event.stopPropagation();
            $("#shaixuanModel").toggle(500);
            return false;
        });
        //点击空白消失
        $(document).click(function(event){
            if(!$('#shaixuanModel').is(event.target) && $('#shaixuanModel').has(event.target).length === 0){
                $('#shaixuanModel').hide(500);
            }
        });
        $("#shaixuanModel .row div").click(function () {
            $(this).parent().parent(".type").find(".active").removeClass("active");
            $(this).addClass("active");
            var html=$(this).html();
            if($(this).parent().parent().hasClass("type1")){
                $("#contractmanage .shaixuanBox .t1 span").html(html);
            }else if($(this).parent().parent().hasClass("type2")){
                $("#contractmanage .shaixuanBox .t2 span").html(html);
            }else{
                $("#contractmanage .shaixuanBox .t3 span").html(html);
            }
            //var append='<div class="col-sm-3">员工：'+html+' <i class="close">&times;</i></div>';
            //$("#contractmanage .shaixuanBox").append(append);
        })
        $("#contractmanage  .shaixuanBox .close").click(function () {
            $(this).parent().hide(200);
        })
        $("#shaixuanModel .qingchu").click(function () {
            $("#shaixuanModel").toggle(500)
        })
        //筛选框end
        //右侧组织树
        $("#contractmanage .rgIcon .zuzhi").click(function (event) {
            event.stopPropagation();
            $(".zuzhishu").toggle(400);
            return false;
        });
        //点击空白消失
        $(document).click(function(event){
            if(!$('.zuzhishu').is(event.target) && $('.zuzhishu').has(event.target).length === 0){
                $('.zuzhishu').hide(400);
            }
        });
        $(".jiajian").click(function () {
            if($(this).attr("src")=="images/assets/zuzhishu-.jpg"){
                $(this).attr("src","images/assets/zuzhishu+.jpg");
                $(this).parent().parent().next(".sel").hide();
                $(this).parent().next(".sel1").hide();
            }
            else if($(this).attr("src")=="images/assets/zuzhishu+.jpg"){
                $(this).attr("src","images/assets/zuzhishu-.jpg");
                $(this).parent().parent().next(".sel").show()
                $(this).parent().next(".sel1").show()
            }
        })
        $("#contractmanage label").click(function () {
            if($(this).siblings(".xuanze").hasClass("active")){
                $(this).siblings(".xuanze").removeClass("active");
            }else if($(this).siblings(".xuanze").className!=="active"){
                $(this).siblings(".xuanze").addClass("active");
            }
        })
        $("#contractmanage .xuanze").click(function () {
            if($(this).hasClass("active")){
                $(this).removeClass("active");
            }
            else if(!$(this).hasClass("active")){
                $(this).addClass("active");
            }
        })
        $("#contractmanage .selAll").click(function () {
            if(!$(this).hasClass("active")){
                $(this).removeClass("active");
                $(this).parent().parent().next(".sel").find(".xuanze").removeClass("active");
                $(this).parent().next(".sel1").find(".xuanze").removeClass("active");
            }
            else if($(this).hasClass("active")){
                $(this).addClass("active");
                $(this).parent().parent().next(".sel").find(".xuanze").addClass("active");
                $(this).parent().next(".sel1").find(".xuanze").addClass("active");
            }
        })
        $("#contractmanage .quxiao").click(function () {
            $("#contractmanage .shezhiBox").css("display","none");
            $(".zuzhishu").css("display","none");
        })
        //右侧设置end

        /**用户点击分页条中的页号时，实现数据的异步加载**/
        $(document).off('click','.footer .pagination a:not([aria-label])').on('click', '.footer .pagination a:not([aria-label])', function (event) {
            event.preventDefault(); //阻止跳转行为
            //获取要跳转的页号
            var pageNo = $(this).attr('href');
            loadMessageByPage(pageNo);
        }).off('click','.footer .pagination a.prevPage').on('click', '.footer .pagination a.prevPage', function (event) {
            event.preventDefault(); //阻止跳转行为
            //获取要跳转的页号
            var pageNo = Number($(".pagination li.active a").html())-1;
            loadMessageByPage(pageNo);
        }).off('click','.footer .pagination a.nextPage').on('click', '.footer .pagination a.nextPage', function (event) {
            event.preventDefault(); //阻止跳转行为
            //获取要跳转的页号
            var pageNo = Number($(".pagination li.active a").html())+1;
            loadMessageByPage(pageNo);
        });

    }
    return contractManage;
})

//分页加载商品数据，并动态创建分页条
function loadMessageByPage(pageNo,keyword) {
    $.ajax({
        url: ipPort+"/staff/query.json",
        data: {pageNo:pageNo,keyword:keyword},
        success: function (pager) {
            console.log('fn: success...');
            //遍历读取到分页器对象，拼接HTML，追加到DOM树
            if(pager.data.list){
                $.each(pager.data.list,function(i,p){
                    html +='<tr class="text-center"><td class="name">'+
                        p.name+'</td> <td class="jobNumber">'+
                        p.companyId+' </td> <td class="phoneNumber">'+
                        p.mobile+'</td><td class="industryTitle">'+
                        p.orgName+'</td><td class="jobTitle">'+
                        p.postName+'</td><td class="contractEndDate">'+
                        p.entrantDateStr+'</td>';
                    var date=new Date();
                    console.log(date.toLocaleDateString())
                    if(p.entrantDateStr==''){
                        html+=' <td class="operate"> <a href="renewIndex.html" class="qianding">签订</a>&nbsp;<a href="#">查看</a> </td></tr>'
                    }else if(p.entrantDateStr<=date.toLocaleDateString()){
                        html+=' <td class="operate"> <a href="renewIndex.html" class="xuqian">续签</a>&nbsp;<a href="#">查看</a> </td></tr>'
                    }else{
                        html+=' <td class="operate"> <a href="#" class="zhongzhi">终止</a>&nbsp;<a href="#">查看</a> </td></tr>'
                    }
                });
            }


            $('tbody').html(html);
            $(".footer .totalNum").html(pager.data.totalCount+'人');
            //根据返回的分页数据，动态创建分页条内容
            var html = '';
            var pageNO=pager.data.pageNo;
            html+='<li><a href="" aria-label="Previous" class="prevPage"><span aria-hidden="true" class="glyphicon glyphicon-menu-left"></span></a></li>'
            if(pageNO-2>0){
                html += '<li><a href="'+Number(pageNO-2)+'">'+Number(pageNO-2)+'</a></li>';
            }
            if(pageNO-1>0){
                html += '<li><a href="'+Number(pageNO-1)+'">'+Number(pageNO-1)+'</a></li>';
            }

            html +='<li class="active"><a href="#">'+pageNO+'</a></li>';

            if(pageNO+1<=pager.data.totalPage){
                html +='<li><a href="'+Number(pageNO+1)+'">'+Number(pageNO+1)+'</a></li>';
            }
            if(pageNO+2<=pager.data.totalPage){
                html += '<li><a href="'+Number(pageNO+2)+'">'+Number(pageNO+2)+'</a></li>';
            }
            html+='<li><a href="' + Number(pageNO + 2) + '"class="pt">…' + pager.data.totalPage + '</a></li>';
            html+='<li> <a href="" aria-label="Next" class="nextPage"> <span aria-hidden="true" class="glyphicon glyphicon-menu-right"></span> </a> </li>'
                + '<li> <a href="" class="lastPage"> <span aria-hidden="true" class="glyphicon glyphicon-triangle-right"></span> </a> </li>';
            $('.pagination').html(html);
        },
        error: function () {
            console.log('fn: error...');
            console.log(arguments);
        },
    })
}


