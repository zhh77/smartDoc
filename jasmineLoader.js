var jasmineMethod = ["beforeEach", "afterEach"],
    jasmineArgs = [],
    jasmineModules = {},
    formatCode;

function loop() {}

function jasmine(path) {
    this.unit = jasmineModules[path] = {};
}

function describe(name, test) {
    test();
}

jasmineMethod.forEach(function() {
    jasmineArgs.push(loop);
})

function buildTestCode(test) {
    var strFn = test.toString(),
        code = strFn.substring(strFn.indexOf('{') + 1,strFn.lastIndexOf('}')),
        start, end, arg;

    if (test.length) {
        start = strFn.indexOf('(') + 1;
        end = strFn.indexOf(')');
        arg = strFn.substring(start,end) + '()';
        code = code.replace(arg+";","");
        code = code.replace(arg,"");
    }
    return formatCode(code);
}

function compile(mod, path, content) {
    var funArgs = ["describe", "it"].concat(jasmineMethod),
        fn;

    function it(name, fnUnit) {
        var code = fnUnit.toString();
        mod[name] = buildTestCode(code);
    }

    try {
        fn = new Function(funArgs, content);
    } catch (err) {
        console.log("jasmine demo解析失败:" + err);
    }

    fn.apply(null, [describe, it].concat(jasmineArgs));
}

exports.load = function(path, unit, fnGetFile, fnFormatCode) {
    var mod = jasmineModules[path];
    if (!mod) {
        formatCode = fnFormatCode;
        var content = fnGetFile(path);
        if (!content)
            return;

        mod = jasmineModules[path] = {};
        compile(mod, path, content);
    }

    return mod[unit];
}
