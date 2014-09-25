$(function() {
    var txtCode = $("#txtCode"),
        txtHtml = $("#txtHtml"),
        show = $('#show'),
        logs = $('#logs'),
        editor, htmlEditor, code, html;

    editor = CodeMirror.fromTextArea(txtCode[0], {
        lineNumbers: true,
        mode: "javascript",
        keyMap: "sublime",
        autoCloseBrackets: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: "monokai",
        lint: true,
        extraKeys: {
            "Ctrl-J": "autocomplete"
        },
        gutters: ["CodeMirror-lint-markers"]
    });

    htmlEditor = CodeMirror.fromTextArea(txtHtml[0], {
        lineNumbers: true,
        mode: "text/html",
        keyMap: "sublime",
        autoCloseBrackets: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: "monokai",
        extraKeys: {
            "Ctrl-J": "autocomplete"
        }
    })


    code = window.name;
    html = getCode('html');
    code = getCode('script') || code;

    function getCode(type) {
        var index = code.indexOf('<'+ type + '>');

        if (index > -1) {
            return code.substring(index + type.length + 2, code.indexOf('</'+ type + '>'));
        }
    }

    function resetCode() {
        editor.setValue(code);
        htmlEditor.setValue(html || '');
        show.empty();
        logs.empty();
    }
    resetCode();

    $('#mod').text(location.search.substr(3));

    $('#btnRun').click(function() {
        show.empty().append(htmlEditor.getValue());

        logs.empty();
        var code = editor.getValue();
        if (code.length === 0)
            return;
        try {
            eval('(function (){' + code + "})();")
        } catch (ex) {
            alert(ex);
        }
    }).next().click(resetCode);

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

        logs.append('<li class=' + (success ? 'success' : 'fail') + '><p><b>result : </b>' + tester.ret + '</p><p><b>expect : </b>' + expectResult + '</li>');
    }

    function log(result) {
        logs.append('<li><p><b>log : </b>' + result + '</p></li>')
    }

});