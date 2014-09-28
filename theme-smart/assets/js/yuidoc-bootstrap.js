/* global $:true */
$(function() {
    'use strict';

    //nav init
    (function(){
        var sidebar = $('#sidebar');
        sidebar.find(' > dl > dt > span').click(function(){
            $(this).toggleClass('glyphicon-minus').parent().next().toggleClass('hide');
        })

        $('#txtSearch').keyup(function(e){
            //if(e.keyCode === 13){
                filter($(this).parent().next().children('dd'),$.trim(this.value));
            //}
        })

        var path = window.location.pathname,
            name = path.substring(path.lastIndexOf('/')),
            current = sidebar.find('a[href$="' + name + '"]:first').addClass('active').parent().parent().parent();

            if(current.hasClass('hide')){
                current.removeClass('hide').prev().children('span').addClass('glyphicon-minus');
            }

    })();

    function filter(list,text){
        if(text){
            var regex = new RegExp(text, 'ig');
            list.each(function(){
                var modMatch,mod;
                mod = $(this).find(' > ul > li').each(function(){
                    var cls = $(this);
                    if(regex.test(cls.text())){
                        cls.removeClass('hide');
                         modMatch = true;
                    }
                    else
                    {
                        cls.addClass('hide');
                    }
                }).end().prev();

                if(!modMatch){
                    modMatch = regex.test(mod.children('a').text());
                }
                mod.toggleClass('hide',!modMatch);
            })
        }
        else
        {
            list.find('.hide').removeClass('hide');
        }
    }

     $('[data-tabid]').on('click', function(event) {
        var tabToActivate = $(this).attr('data-tabid'),
            anchor = $(this).attr('data-anchor');
        event.preventDefault();
        $('[data-toggle=tab][href="' + tabToActivate + '"]').click();
        $(document).scrollTop($(anchor).offset().top);
    });

    /* 代码行定位 */
    (function() {
        if (location.href.indexOf('/files/') > 0) {
            var line = location.hash,
                item, top;
            if (line && line.length > 2) {
                line = location.hash.substring(2);
                item = $('#src_code > ol > li:eq(' + line + ")");
                if (item.length) {
                    item.addClass('active');
                    top = item.position().top - 100;
                    setTimeout(function() {
                        $(document).scrollTop(top);
                    }, 0)
                }
            }
        }

    })();

    (function() {
        $('.btn-viewDemo').click(function(){
             var code = $(this).prev().text().trim();
            window.open('../assets/show.html', code);
        }).next().click(function() {
            var btn = $(this),
                code = btn.prev().prev().text().trim();
            window.open('../assets/code.html?n=' +  btn.parent().parent().children(':first').text(), code);
        })
    })();
});
