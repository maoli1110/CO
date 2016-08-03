/**
 * Created by sdergt on 2016/7/21.
 */
$(function(){

    //$(".pro_list").hide();
    $(".good_list").on("click",".good_list>dl",function(){
        alert(123)
        $(".good_list").hide();
        $(".pro_list").show();
    })
    //alert($(".tools_bar").length)
//    图片选择器效果
    $(".pro_list>.list>li>.img_list>.tools_bar").click(function(){
        console.info($(this).index());
    })


//    图片查看器
    var slid = $('ul.slide_box li')
//	,controls = $('ul.bx-controls a');
    slid.addClass('none');
    slid.eq(0).removeClass('none');
    var slideindex = 0;
    function switchi() {
        if(slideindex == slid.length - 1){
            slideindex = 0;
        }else {
            slideindex = slideindex + 1;
        }
        slid.addClass('none');
        slid.eq(slideindex).removeClass('none');
    }

    var timer = setInterval(switchi, 3000);

    function options(indexs) {
        slid.addClass('none');
        slid.eq(indexs).removeClass('none');
    }
    $(".list>li").click(function(){
        index = $(this).index();
        console.info(index)
        var $img = $(".slide_box img");
        //获取一组数据中小图片的个数，来判断插入多少张大图；
        var aLiChild = $(this).find(".bx-controls").children();
      console.info(aLiChild);
        //动态插入一组数据，通过索引值的方式插入指定文件夹下面的图片；
        for(var i=0;i<aLiChild.length;i++){
            //通过attr属性改变图片的src路径
            var url = "imgs/show/"+index+"/"+(i+1)+".jpg";
            $img.eq(i).attr('src',url);
//          var li =$("<li><a href="#'><img src='show'/+index+'/'+(i+1)+'.jpg" alt=""></a></li>");
//          $(".slide_box").append(li);
        }
        //$img.eq(i).attr('src',url);
    });

    //判断是第几页的内容

    //前进后退的效果
    //如果恒等于0的时候就等于三，执行减操作，执行上一个动作

    $('a.options').click(function(){
        var drec = $(this).data('drec');
        if(drec == 'pre') {
            if(slideindex == 0) {
                slideindex = 3;
            }else {
                slideindex = slideindex - 1;
            }
            //如果恒等于3的时候就等于0 ，执行加操作,执行下一个
        }else {
            if(slideindex == 3) {
                slideindex = 0;
            }else {
                slideindex = slideindex + 1;
            }
        }
        clearInterval(timer);
        options(slideindex);
    });
    $('ul li .bx-controls .img_list').click(function(){

        slideindex = $(this).index();
        clearInterval(timer);
        options(slideindex);
        $(".mask").show();
        $(".showImg").show();
        $(".turnDown").show();
    });
    $(".turnDown").click(function(){
        $(this).hide();
        $(".mask").hide();
        $(".showImg").hide();
    })
})
