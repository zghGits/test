define(['jquery', 'layer', 'bootstrap', 'bootstrap-datetimepicker', 'wangEditor'], function ($) {
    //所有区域对应的对象
    var staff_info = {
        //整个页面的事件
        deal: {
            //页面滚动处理事件
            info_deal: null,
            //点击tab标签时页面变化
            click_deal: null,
            //页面中的一些元素距离顶部的距离
            qk: {
                jbxx_offset: 0,
                jtqk_offset: 0,
                xlxx_offset: 0,
                gzjl_offset: 0,
                zgzs_offset: 0,
                fun_offset: 0,
                czgj_offset: 0,
                grfj_offset: 0
            }
        },
        //富文本编辑器
        edit: {
            wEdit: null
        },
        //日期插件
        date: {
            datetime: null
        },
        //基本信息里面的事件
        base_event: {
            //基本信息中点击下拉事件
            details: null,
            staff_edit: null,
            staff_close: null,
            staff_hos: null
        },
        //家庭情况所有事件
        home_background: {
            //家庭情况每行鼠标移动上去显示删除的图标
            jtqk_del: null,
            //新增家庭人员
            staff_addFam: null,
            //删除家庭人员
            staff_delFam: null
        },
        //工作经历所有事件
        work_experience: {
            //编辑或新增工作经历的处理
            AddorEdit: null
        },
        //学历信息所有事件
        education: {
            experience: null,
            edit_experience: null
        },
        //资格证书
        qualifications: {
            right: null,
            editRight: null
        },
        //兴趣爱好所有的事件
        interest: {
            intest_con: null
        },
        //成长轨迹
        growUp: {
            truning: null
        }
    }
    /*页面整体事件处理start*/
    //所有元素距离文档顶部的距离
    function init() {
        staff_info.deal.qk.jbxx_offset = $(".bq_xinxi").offset().top;
        staff_info.deal.qk.jtqk_offset = $('.bq_jtqk').offset().top;
        staff_info.deal.qk.xlxx_offset = $('.bq_study').offset().top;
        staff_info.deal.qk.gzjl_offset = $('.bq_gzjl').offset().top;
        staff_info.deal.qk.zgzs_offset = $('.bq_zgzs').offset().top;
        staff_info.deal.qk.fun_offset = $('.bq_intest').offset().top;
        staff_info.deal.qk.czgj_offset = $('.bq_czgj').offset().top;
        staff_info.deal.qk.grfj_offset = $('.bq_fj').offset().top;
    }

    //给对应的元素添加类
    function changeClass(ele, j, className) {
        var len = ele.length;
        for (var i = 0; i < len; i++) {
            if (ele.eq(i).hasClass(className)) {
                ele.eq(i).removeClass(className);
                ele.eq(j).addClass(className);
                break;
            }
        }
    }

    //导航栏下面的滚动条
    function tab_deal(i) {
        changeClass($('.bq_info_head li'), i, 'bq_chose');
        $('.bq_tab').stop(true, false).animate({
            'width': $('.bq_info_head li').eq(i).css('width'),
            'marginLeft': $('.bq_info_head li').eq(i).offset().left
        }, 1000);
    }

    //管理滚动条滚动时，tab标签的滚动
    function init_data() {
        var offset = 200;
        var distance = $(window).scrollTop();
        if (distance + offset >= staff_info.deal.qk.grfj_offset) {
            tab_deal(7);
        } else if (distance + offset >= staff_info.deal.qk.czgj_offset) {
            tab_deal(6);
        } else if (distance + offset >= staff_info.deal.qk.fun_offset) {
            tab_deal(5);
        } else if (distance + offset >= staff_info.deal.qk.zgzs_offset) {
            tab_deal(4);
        } else if (distance + offset >= staff_info.deal.qk.gzjl_offset) {
            tab_deal(3);
        } else if (distance + offset >= staff_info.deal.qk.xlxx_offset) {
            tab_deal(2);
        } else if (distance + offset >= staff_info.deal.qk.jtqk_offset) {
            tab_deal(1);
        } else if (distance + offset < staff_info.deal.qk.jtqk_offset) {
            tab_deal(0);
        }
    }

    //滚动条初始化
    init();
    init_data();

    //tab导航栏随页面滚动事件与点击事件标识
    var bs = false;

    //页面滚动处理事件
    staff_info.deal.info_deal = function () {
        $(document).on('scroll', function () {
            if (bs) return;
            init();
            init_data();

        });
    }
    //点击滚动条后tab标签栏的改变
    function tab_click(id, distance) {
        $('body,html').animate({
            'scrollTop': distance
        }, 600);
        $('.bq_tab').stop(true, false).animate({
            'width': $('.bq_info_head li').eq(id).css('width'),
            'marginLeft': $('.bq_info_head li').eq(id).offset().left
        }, 600, function () {
            bs = false;
        });
        changeClass($('.bq_info_head li'), id, 'bq_chose');
    }

    //点击tab标签时页面变化
    staff_info.deal.click_deal = function () {

        $('.bq_info_head li').on('click', function () {
            var bq_offset = 65;
            bs = true;
            init();
            var id = $(this).index();
            tab_click(id)
            switch (id) {
                case 0:
                    tab_click(id, 0);
                    break;
                case 1:
                    tab_click(id, staff_info.deal.qk.jtqk_offset - bq_offset);
                    break;
                case 2:
                    tab_click(id, staff_info.deal.qk.xlxx_offset - bq_offset);
                    break;
                case 3:
                    tab_click(id, staff_info.deal.qk.gzjl_offset - bq_offset);
                    break;
                case 4:
                    tab_click(id, staff_info.deal.qk.zgzs_offset - bq_offset);
                    break;
                case 5:
                    tab_click(id, staff_info.deal.qk.fun_offset - bq_offset);
                    break;
                case 6:
                    tab_click(id, staff_info.deal.qk.czgj_offset - bq_offset);
                    break;
                case 7:
                    tab_click(id, staff_info.deal.qk.grfj_offset - bq_offset);
                    break;
            }
        });

    }
    /*页面整体事件处理end*/


    /*富文本编辑器start*/
    //富文本编辑器
    staff_info.edit.wEdit = function () {
        var editor = new wangEditor('edit_table');
        // 普通的自定义菜单
        editor.config.menus = [
            '|',     // '|' 是菜单组的分割线
            'bold',
            'underline',
            'italic',
            'strikethrough',
            'eraser',
            'forecolor',
            'quote',
            'unorderlist',
            'orderlist',
            'link',
            'unlink',
            'undo',
            'redo'
        ];
        editor.create();
        editor.$txt.html('要初始化的内容');
    }

    /*富文本编辑器end*/


    /*日期插件start*/
    staff_info.date.datetime = function () {
        $(".form_datetime").datetimepicker({
            minView: 'month',
            format: 'yyyy.mm',
            autoclose: 1,
            language: 'zh-CN'
        });
    }
    /*日期插件end*/

    /*基本信息中的所有事件start*/
    //基本信息中点击下拉事件
    staff_info.base_event.details = function () {
        $('.bq_xl span').on('click', function () {
            //为了保证每次页面刷新的时候页面不在顶部的时候，或者页面变成，可以保证滚动条的位置
            init();
            if ($(this).parent().siblings('.bq_details').css('display') == 'none') {
                $(this).html('&gt;&gt;');
                $(this).parent().parent().css({
                    'height': 'auto'
                });
                $('.bq_details').slideDown(500);
            } else {
                $(this).html('&lt;&lt;');
                $('.bq_details').slideUp(500);
            }

        });

    }
    //基本信息编辑事件
    staff_info.base_event.staff_edit = function () {
        $('.bq_xinxi>p').eq(4).on('click', function () {
            $('.bq_xinxi').animate({
                'height': '0px',
            }, 200, function () {
                $(this).hide();
            });
            setTimeout(function () {
                $('#bq_info_img').animate({
                    'height': '0px'
                }, 200, function () {
                    $(this).hide();
                });
            }, 200);

            setTimeout(function () {
                $('.bq_staff_edit_xx').slideDown(700);
            }, 400);
        });
    }
    //使得员工信息有编辑状态变为原始状态
    staff_info.base_event.staff_close = function () {
        $('.bq_table_over').on('click', function () {
            $('body,html').animate({
                'scrollTop': 0
            }, 800);
            $('.bq_staff_edit_xx').slideUp(700, function () {
                $('#bq_info_img').show();
                $('.bq_xinxi').show();
            });

            setTimeout(function () {
                $('#bq_info_img').animate({
                    'height': '88px'
                }, 400);
            }, 500);
            setTimeout(function () {
                $('.bq_xinxi').css('height', 'auto');
            }, 700);
        });
    }
    //显示或隐藏详细的信息
    staff_info.base_event.staff_hos = function () {
        $('.bq_table_close').on('click', function () {
            if ($(this).attr('open') === undefined) {
                $('body,html').animate({
                    'scrollTop': 0
                }, 800, function () {
                    $('.bq_details_bq').slideUp(700, function () {
                        $('.bq_table_close').html('显示更多详细信息');
                    });
                });

                $(this).attr('open', true);
            } else {
                $('body,html').animate({
                    'scrollTop': 0
                }, 600);
                $('.bq_details_bq').slideDown(500, function () {
                    $('.bq_table_close').html('隐藏更多详细信息');
                });
                $(this).removeAttr('open');
            }

        });
    }
    /*基本信息中的所有事件end*/


    /*工作经历中的事件start*/
    //编辑或新增工作经历的处理
    staff_info.work_experience.AddorEdit = function () {
        //新增工作经历
        $('.bq_gzjl >p').eq(1).on('click', function () {
            if ($('.edit_staff').length !== 0) {
                layer.alert('请先保存或关闭正在编辑的工作经历页面！');
            } else {
                if (!$(this).parent().hasClass('add_staff_info')) {
                    $(this).hide();
                    $('.bq_gzjl_edit').insertAfter($(this)).show(600);
                    $(this).parent().addClass('add_staff_info');
                }
            }
        });
        //编辑工作经历
        $('.bq_zysy').on('click', '.bq_common_xx_up span:eq(1)', function () {
            if (!$(this).parent().parent().parent().hasClass('edit_staff') && $('.edit_staff').length === 0 && $('.add_staff_info').length === 0) {
                $(this).parent().parent().parent().hide();
                var staff_info = {};
                //获取工作经历的各条信息
                staff_info.gs = $(this).siblings('span').html();
                staff_info.zw = $(this).parent().siblings('.bq_common_xx_down').children('span').eq(0).html();
                staff_info.stime = $(this).parent().siblings('.bq_common_xx_down').children('span').eq(1).children('time').eq(0).html();
                staff_info.etime = $(this).parent().siblings('.bq_common_xx_down').children('span').eq(1).children('time').eq(1).html();
                staff_info.con = $(this).parent().parent().siblings('.bq_jl').html();
                //将工作经历的各种信息添加到编辑框中
                $('.bq_gzjl_edit .bq_input').eq(0).val(staff_info.zw);
                $('.bq_gzjl_edit .bq_input').eq(1).val(staff_info.stime);
                $('.bq_gzjl_edit .bq_input').eq(2).val(staff_info.etime);
                $('.bq_gzjl_edit .bq_input').eq(3).val(staff_info.gs);
                $('#edit_table').html(staff_info.con);

                $('.bq_gzjl_edit').insertBefore($(this).parent().parent().parent()).show(600);
                $(this).parent().parent().parent().addClass('edit_staff');
            } else if ($('.edit_staff').length !== 0) {
                layer.alert('请先保存或关闭正在编辑的工作经历页面！');
            } else if ($('.add_staff_info').length !== 0) {
                layer.alert('请先保存或关闭正在编辑的工作经历页面！');
            }

        });
        //取消工作经历编辑、添加
        $('.bq_can').on('click', function () {
            $(this).parent().parent().parent().parent().parent().slideUp();
            if ($('.edit_staff').length !== 0) {
                $(this).parent().parent().parent().parent().parent().next('.bq_zysy').show().removeClass('edit_staff');
            } else if ($('.add_staff_info').length !== 0) {
                $(this).parent().parent().parent().parent().parent().parent('.bq_gzjl').children('p').eq(1).show();
                $(this).parent().parent().parent().parent().parent().parent('.bq_gzjl').removeClass('add_staff_info');
            }


        });
    }
    /*工作经历中的事件end*/


    /*家庭情况中的所有事件start*/
    //家庭情况每行鼠标移动上去显示删除的图标
    staff_info.home_background.jtqk_del = function () {
        $('.bq_ja_table>table>tbody').on('mouseenter', 'tr', function () {
            $(this).children('td').eq(5).children('img').show();
        });
        $('.bq_ja_table>table>tbody').on('mouseleave', 'tr', function () {
            $(this).children('td').eq(5).children('img').hide();
        });
    }
    //新增家庭人员
    staff_info.home_background.staff_addFam = function () {
        $('.bq_xq p:nth-of-type(2)').on('click', function () {
            if ($(this).html() == '取消') {
                var tcp = $('.bq_jtqk_readd');
                tcp.addClass('animated').removeClass('bq_jtqk_readd').addClass('fadeOutLeft').delay(700).animate({
                    'height': '0px'
                }, 600);
                setTimeout(function () {
                    tcp.empty();
                    $('.bq_jtqk_saveorcancle').hide(300);
                }, 700);
                setTimeout(function () {
                    $('.animated:not(.bq_jtqk_readd)').remove();
                    $('.bq_xq p:nth-of-type(2)').html('<img src="../images/icon－tianjiazhixingren－hoved copy.svg" alt="">添加');
                }, 1950);
            } else {
                $('.bq_jtqk_saveorcancle').show(500);
                $(this).html('取消');
                $('<tr class="animated fadeInLeft bq_jtqk_readd"><td class="saveorcancle"><input type="text" placeholder="请输入姓名"></td><td><input type="text" placeholder="请输入关系"></td><td><input type="text" placeholder="请输入联系电话"></td><td><input type="text" placeholder="请输入出生日期"></td><td><input type="text" placeholder="请输入工作单位及职务"></td><td><img src="../images/icon－shanchu－default.svg" alt=""></td></tr>').insertBefore($('.bq_jtqk_saveorcancle'));
            }
        });
        $('.modal-saorcan').on('click', 'button:eq(0)', function () {
            $('.home-background-modal-sm').modal('hide');
        });
        //取消添加人员
        $('.bq_jtqk_saveorcancle').on('click', 'td>button:nth-of-type(1)', function () {


            var tcp = $('.bq_jtqk_readd');
            tcp.addClass('animated').removeClass('bq_jtqk_readd').addClass('fadeOutLeft').delay(700).animate({
                'height': '0px'
            }, 600);
            setTimeout(function () {
                tcp.empty();
                $('.bq_jtqk_saveorcancle').hide(300);
            }, 700);
            setTimeout(function () {
                $('.animated:not(.bq_jtqk_readd)').remove();
                $('.bq_xq p:nth-of-type(2)').html('<img src="../images/icon－tianjiazhixingren－hoved copy.svg" alt="">添加');
            }, 1950);

        });

    }
    //删除家庭人员
    staff_info.home_background.staff_delFam = function () {

        $('.bq_ja_table').on('click', 'tbody>tr>td:nth-of-type(6)', function () {
            var tcp = $(this);

            layer.confirm('确认删除？', {btn: ['确认', '取消']}, function () {
                //让要删除的元素向左移动，高度变为0
                tcp.parent().addClass('animated').addClass('fadeOutLeft').delay(700).animate({
                    'height': '0px'
                }, 600);
                var tmp = $('.bq_ja_table tbody>tr>td:nth-of-type(6)').parent();
                //定时让元素内部节点清空，解决删除元素后，向上跳动的问题
                setTimeout(function () {
                    tcp.parent().removeClass('bq_jtqk_readd').empty();
                }, 700);
                //删除添加的节点
                setTimeout(function () {
                    $('.animated:not(.bq_jtqk_readd)').remove();
                }, 1950);
                layer.msg('删除成功！');


                //如果删除成功，那么就让下面的保存和取消按钮消失
                if ($('.saveorcancle').length === 1) {
                    $('.bq_jtqk_saveorcancle').hide(500);
                }
            }, function () {

            });

        });

    }


    /*家庭情况中的所有事件end*/


    /*学历信息start*/
    //添加学历信息
    staff_info.education.experience = function () {
        $('.bq_xlxx').on('click', 'p:nth-of-type(2)', function () {
            if ($(this).html() == '取消') {
                $('.bq_xlxx .bq_common_xx_up>span:nth-of-type(2)>button').parent().parent().parent().removeClass('flipInX').addClass('fadeOut').delay(500).hide(500, function () {
                    $(this).remove();
                    $('.bq_xlxx p:nth-of-type(2)').html('<img src="../images/icon－tianjiazhixingren－hoved copy.svg" alt="">添加');
                });
            } else {
                $(this).html('取消');
                $('.bq_xlxx').append('<div class="bq_common_xx bq_common_edit bq_common_readd animated flipInX"><div class="bq_common_xx_up"><span><input type="text" placeholder="请输入学校""></span><span><button type="button">保存</button><button type="button">取消</button></span></div><div class="bq_common_xx_down"><span><input type="text" placeholder="请输入专业""></span><span><time><input type="text" placeholder="开始时间""></time>—<time><input type="text" placeholder="结束时间""></time></span></div></div>');

            }
        });
    }
    //编辑学历信息
    staff_info.education.edit_experience = function () {
        $('.bq_xlxx').on('click', '.bq_common_xx_up>span:nth-of-type(2)', function (e) {
            var education_staff = {};
            if (!$(this).parent().parent().hasClass('bq_common_edit') && e.target.nodeName == 'SPAN') {
                //在点击编辑的时候，整体慢慢隐去，然后再显示出来

                $(this).parent().parent().addClass('animated').addClass('fadeOut');
                var par = $(this);
                setTimeout(function () {
                    //获取学历信息的各个字段值，并且元素内容替换
                    education_staff.school = par.prev().html();
                    par.prev().html('');
                    education_staff.profession = par.parent().next('.bq_common_xx_down').children().eq(0).html();
                    par.parent().next('.bq_common_xx_down').children().eq(0).html('');
                    education_staff.stime = par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(0).html();
                    par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(0).html('');
                    education_staff.etime = par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(1).html();
                    par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(1).html('');
                    par.html('<button type="button">保存</button><button type="button">取消</button>');
                    par.parent().parent().addClass('bq_common_edit');
                    par.prev().append('<input type="text" value="' + education_staff.school + '">');
                    par.parent().next('.bq_common_xx_down').children().eq(0).html('<input type="text" value="' + education_staff.profession + '">');
                    par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(0).html('<input type="text" value="' + education_staff.stime + '">');
                    par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(1).html('<input type="text" value="' + education_staff.etime + '">');
                    par.parent().parent().removeClass('fadeOut').addClass('fadeIn');
                }, 300);

            }
        });
        //保存或取消学历信息
        $('.bq_xlxx').on('click', '.bq_common_xx_up>span:nth-of-type(2)>button', function (e) {
            var education_staff = {};
            if (0 === $(this).index()) {

                //获取学历信息的各个字段值，并且元素内容替换
                $(this).parent().parent().parent().removeClass('bq_common_edit');
                education_staff.school = $(this).parent().prev().children().val();
                education_staff.profession = $(this).parent().parent().next('.bq_common_xx_down').children().eq(0).children().val();
                education_staff.stime = $(this).parent().parent().next('.bq_common_xx_down').children().eq(1).children().eq(0).children().val();
                education_staff.etime = $(this).parent().parent().next('.bq_common_xx_down').children().eq(1).children().eq(1).children().val();
                $(this).parent().prev().html(education_staff.school);
                $(this).parent().parent().next('.bq_common_xx_down').children().eq(0).html(education_staff.profession);
                $(this).parent().parent().next('.bq_common_xx_down').children().eq(1).children().eq(0).html(education_staff.stime);
                $(this).parent().parent().next('.bq_common_xx_down').children().eq(1).children().eq(1).html(education_staff.etime);
                $(this).parent().html('<img src="../images/icon－tianjiazhixingren－hoved copy.svg" alt="">编辑');
                $(this).html('<img src="../images/icon－tianjiazhixingren－hoved copy.svg" alt="">添加');
                layer.alert('保存成功');
            } else if (1 === $(this).index()) {
                if ($(this).parent().parent().parent().hasClass('bq_common_readd')) {
                    $(this).parent().parent().parent().removeClass('flipInX').addClass('fadeOut').delay(500).hide(500, function () {
                        $(this).remove();
                        $('.bq_xlxx p:nth-of-type(2)').html('<img src="../images/icon－tianjiazhixingren－hoved copy.svg" alt="">添加');
                    });
                } else {
                    //获取学历信息的各个字段值，并且元素内容替换
                    $(this).parent().parent().parent().removeClass('flipInX').addClass('fadeOut');
                    var par = $(this).parent();
                    setTimeout(function () {
                        education_staff.school = par.prev().children().val();
                        education_staff.profession = par.parent().next('.bq_common_xx_down').children().eq(0).children().val();
                        education_staff.stime = par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(0).children().val();
                        education_staff.etime = par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(1).children().val();
                        par.prev().html(education_staff.school);
                        par.parent().next('.bq_common_xx_down').children().eq(0).html(education_staff.profession);
                        par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(0).html(education_staff.stime);
                        par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(1).html(education_staff.etime);
                        par.html('<img src="../images/icon－tianjiazhixingren－hoved copy.svg" alt="">编辑');
                        par.parent().parent().removeClass('fadeOut').addClass('fadeIn');
                        par.parent().parent().removeClass('bq_common_edit');
                    }, 500);

                }

            }

        });
    }
    /*学历信息end*/


    /*资格证书start*/
    //添加资格证书
    staff_info.qualifications.right = function () {
        $('.bq_zgzs').on('click', 'p:nth-of-type(2)', function () {
            if ($(this).html() == '取消') {
                $(this).html('<img src="../images/icon－tianjiazhixingren－hoved copy.svg" alt="">添加');
                $('.bq_zgzs .bq_common_xx_up>span:nth-of-type(2)>button').parent().parent().parent().remove();
            } else {
                $(this).html('取消');
                $('.bq_zgzs').append('<div class="bq_common_xx bq_common_edit bq_common_readd bq_common_readd animated flipInX"><div class="bq_common_xx_up"><span><input type="text" placeholder="请输入证书名称""></span><span><button type="button">保存</button><button type="button">取消</button></span></div><div class="bq_common_xx_down"><span><input type="text" placeholder="请输入获奖内容""></span><span><time><input type="text" placeholder="开始时间""></time>—<time><input type="text" placeholder="结束时间""></time></span></div></div>');

            }
        });
    }
    //编辑资格证书
    staff_info.qualifications.editRight = function () {
        $('.bq_zgzs').on('click', '.bq_common_xx_up>span:nth-of-type(2)', function (e) {
            var education_staff = {};
            if (!$(this).parent().parent().hasClass('bq_common_edit') && e.target.nodeName == 'SPAN') {
                //在点击编辑的时候，整体慢慢隐去，然后再显示出来
                $(this).parent().parent().addClass('animated').addClass('fadeOut');
                var par = $(this);
                setTimeout(function () {
                    //获取资格的各个字段值，并且元素内容替换
                    education_staff.school = par.prev().html();
                    par.prev().html('');
                    education_staff.profession = par.parent().next('.bq_common_xx_down').children().eq(0).html();
                    par.parent().next('.bq_common_xx_down').children().eq(0).html('');
                    education_staff.stime = par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(0).html();
                    par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(0).html('');
                    education_staff.etime = par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(1).html();
                    par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(1).html('');
                    par.html('<button type="button">保存</button><button type="button">取消</button>');
                    par.parent().parent().addClass('bq_common_edit');
                    par.prev().append('<input type="text" value="' + education_staff.school + '">');
                    par.parent().next('.bq_common_xx_down').children().eq(0).html('<input type="text" value="' + education_staff.profession + '">');
                    par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(0).html('<input type="text" value="' + education_staff.stime + '">');
                    par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(1).html('<input type="text" value="' + education_staff.etime + '">');
                    par.parent().parent().removeClass('fadeOut').addClass('fadeIn');
                    // alert('a');
                }, 300);
            }
        });
        //保存或取消资格证书
        $('.bq_zgzs').on('click', '.bq_common_xx_up>span:nth-of-type(2)>button', function (e) {
            var education_staff = {};
            if (0 === $(this).index()) {
                //获取学历信息的各个字段值，并且元素内容替换
                $(this).parent().parent().parent().removeClass('bq_common_edit');
                education_staff.school = $(this).parent().prev().children().val();
                education_staff.profession = $(this).parent().parent().next('.bq_common_xx_down').children().eq(0).children().val();
                education_staff.stime = $(this).parent().parent().next('.bq_common_xx_down').children().eq(1).children().eq(0).children().val();
                education_staff.etime = $(this).parent().parent().next('.bq_common_xx_down').children().eq(1).children().eq(1).children().val();
                $(this).parent().prev().html(education_staff.school);
                $(this).parent().parent().next('.bq_common_xx_down').children().eq(0).html(education_staff.profession);
                $(this).parent().parent().next('.bq_common_xx_down').children().eq(1).children().eq(0).html(education_staff.stime);
                $(this).parent().parent().next('.bq_common_xx_down').children().eq(1).children().eq(1).html(education_staff.etime);
                $(this).parent().html('<img src="../images/icon－tianjiazhixingren－hoved copy.svg" alt="">编辑');
                $(this).html('<img src="../images/icon－tianjiazhixingren－hoved copy.svg" alt="">添加');
                layer.alert('保存成功');
            } else if (1 === $(this).index()) {
                if ($(this).parent().parent().parent().hasClass('bq_common_readd')) {
                    $(this).parent().parent().parent().removeClass('flipInX').addClass('fadeOut').delay(500).hide(500, function () {
                        $(this).remove();
                        $(this).html('<img src="../images/icon－tianjiazhixingren－hoved copy.svg" alt="">添加');
                    });
                } else {
                    //获取学历信息的各个字段值，并且元素内容替换
                    $(this).parent().parent().parent().removeClass('flipInX').addClass('fadeOut');
                    var par = $(this).parent();
                    setTimeout(function () {
                        par.parent().parent().removeClass('bq_common_edit');
                        education_staff.school = par.prev().children().val();
                        education_staff.profession = par.parent().next('.bq_common_xx_down').children().eq(0).children().val();
                        education_staff.stime = par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(0).children().val();
                        education_staff.etime = par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(1).children().val();
                        par.prev().html(education_staff.school);
                        par.parent().next('.bq_common_xx_down').children().eq(0).html(education_staff.profession);
                        par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(0).html(education_staff.stime);
                        par.parent().next('.bq_common_xx_down').children().eq(1).children().eq(1).html(education_staff.etime);
                        par.html('<img src="../images/icon－tianjiazhixingren－hoved copy.svg" alt="">编辑');
                        par.parent().parent().removeClass('fadeOut').addClass('fadeIn');
                    }, 500);

                }
            }

        });
    }
    /*资格证书end*/


    /*兴趣、爱好start*/
    //新添加或编辑
    staff_info.interest.intest_con = function () {
        //兴趣编辑
        $('.bq_intest_edit').on('click', function () {
            if ($(this).attr('open') == undefined) {
                $(this).siblings('span:not(.bq_intest_readd)').addClass('bq_dd').addClass('animated').addClass('shake');
                $(this).siblings('span:not(.bq_intest_readd)').children('small').addClass('bq_intest_close');
                $('.bq_intest_edit').html('取消');
                $(this).attr('open', 'true');
            } else {
                $(this).siblings('span:not(.bq_intest_readd)').removeClass('bq_dd').removeClass('animated').removeClass('shake');
                $(this).siblings('span:not(.bq_intest_readd)').children('small').removeClass('bq_intest_close');
                $('.bq_intest_edit').html('<img src="../images/icon－tianjiazhixingren－hoved copy.svg" alt="">编辑');
                $(this).removeAttr('open');
            }
        });
        //兴趣删除
        $('.bq_intest_re').on('click', 'small', function () {
            $(this).parent().addClass('animated').addClass('zoomOutDown').delay(1000).animate({
                'width': '0px',
                'height': '0px',
                'padding': '0px',
                'border': '0px',
                'margin': '0px'
            }, 500, function () {
                $(this).remove();
            });

            $(this).remove();
        });
        //兴趣添加
        $('.bq_intest>p:eq(1)').on('click', function () {
            $('<span class="bq_intest_readd animated fadeInLeft"><input type="text" placeholder="请输入特征"/><cite> |</cite> <small>&times;</small><input type="number" placeholder="请输入指数" />&nbsp;<button>&radic;</button><button>&times;</button></span>').insertBefore($('.bq_intest_re>span:first'));
        });
        //新添加的兴趣直接删除
        $('.bq_intest_re').on('click', 'span.bq_intest_readd>button:nth-of-type(2)', function () {
            $(this).parent().animate({
                'width': '0px',
                'height': '0px',
                'padding': '0px',
                'border': '0px',
                'margin': '0px'
            }, 500, function () {
                $(this).remove();
            });

            $(this).remove();
        });
        //兴趣保存
        $('.bq_intest_re').on('click', 'span.bq_intest_readd>button:nth-of-type(1)', function () {

            $(this).parent().removeClass('bq_intest_readd');
            var bz = $(this).siblings('input[type=text]').val();
            var zs = $(this).siblings('input[type=number]').val();
            $(this).parent().html(bz + '<cite>&nbsp;|&nbsp;</cite><small>&times;</small> ' + zs + '&nbsp;');
            layer.msg('添加成功');
        });
        //鼠标移动上来就停止晃动，
        $('.bq_intest').on('mouseover', '.bq_intest_re span:not(.bq_intest_edit)', function () {
            $(this).removeClass('shake');
        });

    }
    /*兴趣、爱好end*/


    /*成长轨迹start*/
    staff_info.growUp.truning = function () {
        //成长轨迹编辑的时候，各个圆圈之间连接起来，并且添加新的编辑
        $('.bq_czgj_pr').on('click', function () {
            if ($(this).attr('open') === undefined) {
                $("<div class='bq_czgj_info bq_czgj_readd animated fadeIn'><div class='bq_czgj_info_up'><p><span class='bq_chose_aq'></span>轨&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;迹：<input type='text'>  事件：<input type='text'> 时间：<input type='text'></p><p></p></div><div class='bq_czgj_info_down'><div >详细描述：<textarea name='' id='' cols='3' rows='2'></textarea></div><p></p><p><button type='button' class='btn btn-success'>保存</button><button type='button' class='btn btn-warning'>取消</button></p></div></div>").insertBefore($('.bq_czgj_hr'));

                $('.bq_czgj_readd').fadeIn();
                $(this).html('取消');
                //成长轨迹点击编辑的时候，各个圆圈之间连接起来，并且添加新的编辑
                setTimeout(function () {
                    //获取成长轨迹的第一个圆圈的离顶部高度
                    var hei_first = $('.bq_chose_aq:first').offset().top;
                    //获取成长轨迹最后一个圆圈的离顶部高度
                    var hei_last = $('.bq_chose_aq:last').offset().top;
                    //获取成长轨迹圆圈距离左边文档的距离
                    var hei_left = $('.bq_czgj_info_up span').offset().left;
                    var wid = $(document.body).width();

                }, 500);
                $(this).attr('open', 'true');

            } else {

                $('.bq_czgj_readd').removeClass('fadeInop').addClass('fadeOut').animate({
                    'height': '0px'
                }, 500);

                setTimeout(function () {
                    $('.bq_czgj_readd').remove();
                }, 500);

                $('.bq_czgj_stand').animate({
                    'height': '0px'
                }, 1000);
                $(this).removeAttr('open');
                $(this).html('<img src="../images/icon－tianjiazhixingren－hoved copy.svg" alt="">添加');

            }

        });
        //成长轨迹 取消
        $('.bq_czgj').on('click', '.bq_czgj_info_down>p:nth-of-type(2)>button', function (e) {
            if (0 === $(this).index()) {

            } else if (1 === $(this).index()) {

                $('.bq_czgj_readd').removeClass('fadeInLeft').addClass('fadeOut').animate({
                    'height': '0px'
                }, 500);

                setTimeout(function () {
                    $('.bq_czgj_readd').remove();
                }, 500);

                $('.bq_czgj_stand').animate({
                    'height': '0px'
                }, 1000);
                $(this).removeAttr('open');
                $('.bq_czgj_pr').html('<img src="../images/icon－tianjiazhixingren－hoved copy.svg" alt="">添加');
            }

        });
        //成长轨迹下面三角点击下拉事件
        $('.bq_xl').on('click', 'span', function () {
            if ($(this).attr('open') == undefined) {
                $('.bq_czgj_info_info').slideDown(500);
                $(this).html('&gt;&gt;');
                $(this).attr('open', 'true');
            } else {
                $('.bq_czgj_info_info').slideUp(500);
                $(this).html('&lt;&lt;');
                $(this).removeAttr('open');
            }

        });
    }
    /*成长轨迹end*/

    return staff_info;
})