/* global $:true */
$(function() {
    'use strict';

    //nav init
    function navInit() {
        var sidebar = $('#sidebar');
        sidebar.find(' > dl > dt > span').click(function() {
            $(this).toggleClass('glyphicon-minus').parent().next().toggleClass('hide');
        })

        $('#txtSearch').keyup(function(e) {
            //if(e.keyCode === 13){
            filter($(this).parent().next().children('dd'), $.trim(this.value));
            //}
        })

        var path = window.location.pathname,
            name = path.substring(path.lastIndexOf('/')),
            current = sidebar.find('a[href$="' + name + '"]:first').addClass('active').parent().parent().parent();

        if (current.hasClass('hide')) {
            current.removeClass('hide').prev().children('span').addClass('glyphicon-minus');
        }

    }

    function filter(list, text) {
        if (text) {
            var fnMatch = matchText(text);
            list.each(function() {
                var modMatch, mod;
                mod = $(this).find(' > ul > li').each(function() {
                    var cls = $(this);
                    if (fnMatch(cls.text())) {
                        cls.removeClass('hide');
                        modMatch = true;
                    } else {
                        cls.addClass('hide');
                    }
                }).end().prev();

                if (!modMatch) {
                    modMatch = fnMatch(mod.children('a').text());
                }
                mod.toggleClass('hide', !modMatch);
            })
        } else {
            list.find('.hide').removeClass('hide');
        }
    }

    function matchText(match) {
        match = match.toLowerCase();
        return function(text) {
            return text.toLowerCase().indexOf(match) > -1;
        }
    }

    function InitClasses() {
        $('#classesItems').find('a').on('click', function(event) {
            var tabToActivate = $(this).attr('data-tabid'),
                anchor = $(this).attr('data-anchor');
            event.preventDefault();
            anchorTo(tabToActivate, anchor);
        });

        var tab = $('#itemTab'),
            doc = $(document);

        function anchorTo(tabToActivate, anchor) {
            tab.find('[href="' + tabToActivate + '"]').click();
            doc.scrollTop($(anchor).offset().top - 50);
        }

        function gotoItem() {
            var hash = location.hash,
                params;
            if (hash.length > 1) {
                params = hash.split('_');
                setTimeout(function() {
                    anchorTo(params[0], hash);
                }, 100)
            }
        }
        window.onhashchange = gotoItem;

        gotoItem();
    }

    /* 代码行定位 */
    function gotoCode() {
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

    function initDemoView() {
        $('.btn-viewDemo').click(function() {
            var code = $(this).prev().text().trim();
            window.open('../assets/show.html', code);
        }).next().click(function() {
            var btn = $(this),
                code = btn.prev().prev().text().trim();
            window.open('../assets/code.html?n=' + btn.parent().parent().children(':first').text(), code);
        })
    }

    function initFilterApi() {
        var config = window.__docConfig,
            filterItems = config.filterItems,
            filterList = $('#filterList'),
            txtSearchAPI = $('#txtSearchAPI'),
            path = location.pathname;

        if (path.charAt(path.length - 1) === '/' || path.lastIndexOf('/index.html') > 0)
            path = "./";
        else
            path = "../";

        var timer,curItem;
        txtSearchAPI.keyup(function(e) {
            var code = e.keyCode;
            if (code === 38 || code === 40) {
                moveItem(e.keyCode);
            } 
            else if(code === 13) {
                if(filterList.css('display') === 'none')
                    filterList.show();
                else if(curItem)
                   location.href = curItem.children().attr('href');
            }
            else {
                if (timer)
                    clearTimeout(timer);

                timer = setTimeout(filterAPI, 200);

            }

            return false;
        }).blur(function() {
            setTimeout(function() {
                filterList.hide();
            }, 300);
        })

        function moveItem(code){
            var next,isNext = code === 40;
            if(curItem){
                curItem.removeClass('active');
                curItem = isNext ? curItem.next() : curItem.prev();
                if(curItem.length === 0)
                    curItem = null;
            }

            if(!curItem)
                curItem = filterList.children(isNext ? ':first' : ':last')
           
            curItem.addClass('active');
        }

        function filterAPI() {
            timer = null;
            var text = $.trim(txtSearchAPI.val()),
                fnMatch, result = [];

            if (text) {
                var fnMatch = matchText(text);
                filterItems.forEach(function(item) {
                    var itemTag;
                    if (fnMatch(item.name)) {
                        result.push('<li><a href="', path, item.type === 'module' ? 'modules/' : 'classes/', item.className || item.name, '.html');

                        if (item.className) {
                            result.push("#", item.type, "_", item.name);
                            itemTag = '<b>' + item.className + '</b>-' + item.type;
                        }

                        result.push('">', item.name, " <em>[", itemTag || item.type, "]</em></a></li>");
                    }
                })
                filterList.html(result.join('')).show();
                curItem = filterList.children(':first');

                if(curItem.length)
                    curItem.addClass('active')
                else
                    curItem = null;
            } else
                filterList.hide();
        }
    }

    navInit();
    initDemoView();
    prettyPrint();
    initFilterApi();

    if (checkPath('/classes/')) {
        InitClasses();
    } else if (checkPath('/files/')) {
        gotoCode();
    }

    function checkPath(type) {
        return location.pathname.indexOf(type) > -1;
    }
});
