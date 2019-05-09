/**
 * Created by Administrator on 2019/3/15.
 */


var myFunc = {

    Conf:function(){
        var conf = {
            body:$("body"),
            url:"/index.php/mobile/index/getModal"
        };
        return conf;
    },
    myModal: function(title,body,callback){
        var conf = myFunc.Conf();
        var modal = myFunc.getModal(title);
        conf.body.append(modal);
        var box = $("#areaModal");
        //var contentBox = box.find("#modalBody");
        if($.isPlainObject(body)){
            if(!body.hasOwnProperty('type')){
                return false;
            }
            switch (body.type){
                case 'getRegion':
                    myFunc.getRegion(0,1,"#modalBody",'html',callback);
                    break;
            }
        }else {
            return false;
        }
        box.find(".icon-closes").on("click",function(){
            console.log(123);
            box.remove();
        });
    },
    Test:function(){

        console.log(2);
    },

    Scroll:function(funct){
        var scroH;
        $(document).scroll(function(){
            scroH = $(document).scrollTop();  //滚动高度
            //console.log(scroH)
            funct
        })
    },

    getModal:function(title){
        var bottom = myFunc.getModalBottom();
        var modal = "<div class='area-modal' id='areaModal' style=''> <div class='area-content'>"+
                "<div class='area-titel'> <span>"+title+"</span> <i class='area-modal-close iconfont icon-closes'></i> </div>"+
                "<div class='area-body' id='modalBody'></div></div></div>";
        return modal;
    },
    getModalContent:function(){

    },
    getModalBottom:function(){

    },
    getRegion:function(pid,lv,contentBox,type,callback){
        $.ajax({
            url:"/index.php/mobile/index/getRegion",
            data:{'pid':pid,'level':lv,'type':type},
            success:function(res){
                if(type=='html'){
                    $(contentBox).html(res);
                    $(contentBox).find(".area-level").on("click",function(){
                        var lv = $(this).attr("lv");
                        myFunc.checkRegion(0,"",lv,contentBox,"json",callback);
                    })
                }
                if(type=='json'){
                    var items = "";
                    $.each(res,function(k,v){
                        items += "<div class='area-item' p-lv="+lv+" item-id='"+k+"'>"+v+"</div>"
                    });
                    $(contentBox).find(".area-city-group").html(items);
                    //return false;
                }
                $(contentBox).find(".area-city-group>.area-item").on("click",function(){
                    var item_id = $(this).attr("item-id");
                    var p_lv = $(this).attr("p-lv");
                    var region = $(this).text();
                    myFunc.checkRegion(item_id,region,p_lv,contentBox,"json",callback);
                });
            }
        });

    },
    checkRegion:function(pid,region,lv,contentBox,type,callback){
        var p_box;
        var text;
        switch (lv*1){
            case 1:
                p_box = $("#areaModal").find("#province");
                text = "请选择省份";
                break;
            case 2:
                p_box = $("#areaModal").find("#city");
                text = "请选择城市";
                break;
            case 3:
                p_box = $("#areaModal").find("#district");
                text = "请选择区县";
                break;
            default:
                return false;
                break;
        }
        if(pid!=0){
            p_box.text(region);
            p_box.attr("data-id",pid);
            if(Number(lv)==3){
                var result = $(contentBox).find(".area-level-select-bar>div");
                var res = {'address':"",'province':"",'city':"",'district':""};
                $.each(result,function(k,v){
                    res.address += $(v).text();
                    var address_lv = Number($(v).attr("lv"));
                    var address_id = Number($(v).attr("data-id"));
                    switch (address_lv){
                        case 1:
                            res.province = address_id;
                            break;
                        case 2:
                            res.city = address_id;
                            break;
                        case 3:
                            res.district = address_id;
                            break;
                    }
                });
                // console.log(res);
                $('#area').html(res.address)
                $('#IdStr').val(res.province+','+res.city+','+res.district)
                // callback(res);
                return res;
            }
            lv = Number(lv)+1;
        }else {
            if(Number(lv)!=1){
                pid = Number(p_box.prev().attr("data-id"));
                if(pid<=0){
                    return false;
                }
            }
            p_box.text(text);
        }
        myFunc.getRegion(pid,lv,contentBox,"json");

    }
}