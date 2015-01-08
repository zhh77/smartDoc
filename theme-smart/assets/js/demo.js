(function() {
    var logs = document.getElementById('__logs'),win = window;

    win.__st_render = function (html,code) {
        html && (document.getElementById('__show').innerHTML = html);
        logs.innerHTML = '';

        if(code){
             eval('(function (){  \r\n try { \r\n' + code + "\r\n} \r\n catch(e) {\r\n __showErr(e); \r\n} \r\n})();")
        }
    }

    function __showErr(e){
        //ff下错误行捕获
        if(e.lineNumber){
            alert(e.message + '\n  at JS ' + e.lineNumber);
            return;
        }
        else {
            var stack = e.stack;
            if(stack)
            {
                var arr = stack.split('\n'),
                    msg = arr[0],
                    code = arr[1];

                var index = code.lastIndexOf(':');
                index = code.lastIndexOf(':',--index);
                if(index > 0){
                    var lines = code.substring(index + 1,code.length - 1).split(':');
                    lines[0] = lines[0] * 1 - 2;
                    alert(msg + '\n  at JS ' + lines.join(':'));
                    return;
                }
            }
        }
        
        alert(e);
    }

    function expect(result) {
        return new Tester(result);
    }

    function Tester(result) {
        this.ret = result;
        this.not = new Not(result);
    }

    Tester.prototype = {
        toBe: function(expectResult) {
            check(this, expectResult);
        },
        toEqual: function(expectResult) {
            check(this, expectResult, this.ret == expectResult);
        },
        toBeDefined: function() {
            check(this, 'defined', this.ret !== undefined);
        },
        toBeUndefined: function() {
            check(this, undefined);
        },
        toBeNull: function() {
            check(this, null);
        },
        toBeTruthy: function() {
            check(this, true);
        },
        toBeFalsy: function() {
            check(this, false);
        }
    }

    function Not(result) {
        this.ret = result;
    }

    Not.prototype = Tester.prototype;


    function check(tester, expectResult, success) {
        success === undefined && (success = tester.ret === expectResult);
        if (!tester.not)
            success = !success;

        var html = '<p><b>result : </b>' + tester.ret + '</p><p><b>expect : </b>' + expectResult;
        addLi(html,success ? 'success' : 'fail')
    }

    function log() {
        var item,args = arguments,i =0,len = args.length,result = [];
        for(;i < len; i++){
            item = args[i];
            if(item && typeof item === 'object' && window.JSON)
                item = window.JSON.stringify(item);

            result.push(item);
        }

        addLi('<p><b>log : </b>' + result.join(' , ') + '</p>');
    }

    function addLi(html,css){
        var li = document.createElement('li');
        css && (li.className = css);
        li.innerHTML = html;
        logs.appendChild(li);
    }

})();