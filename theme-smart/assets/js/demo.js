(function() {
    var logs = document.getElementById('logs');

    window.__st_render = function (html,code) {
        html && (document.getElementById('show').innerHTML = html);
        logs.innerHTML = '';

        if(code){
             eval('(function (){ try {' + code + "} catch(e) { alert(e); } })();")
        }
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
            check(this, undefined, this.ret !== undefined);
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

    function log(result) {
        addLi('<p><b>log : </b>' + result + '</p>');
    }

    function addLi(html,css){
        var li = document.createElement('li');
        css && (li.className = css);
        li.innerHTML = html;
        logs.appendChild(li);
    }

})();