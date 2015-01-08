var fs = require("fs");

function getSetting(path,startFlag,endFlag){
    var start = path.indexOf(startFlag),end,setting;
    if (start > 0) {
        end = path.indexOf(endFlag);
        if(end > start){
            return [path.substr(0, index),]
        }
        unit = path.substring(index + 1, path.length - 1);
        path = path.substr(0, index);
    }
}

module.exports = {
    build : function (path,config, target) {
        var index = path.indexOf("{"),
            unit,title, code,loader;

        path = path.replace(/\{([\s\S]*?)}/g, function (s, matched) {
            title = matched;
            return '';
        }).replace(/\[([\s\S]*?)]/g, function (s, matched) {
            unit = matched;
            return '';
        });

        function getCode(demoPath) {
            var data;
            try {
                data = fs.readFileSync(config.demoDir + demoPath.trim(), 'utf-8');
            } catch (err) {
                console.error("demo 文件读取失败：" + err);
            }
            return data;
        }

        if(!title){
            title = path.substring(path.lastIndexOf('/') + 1,path.indexOf('.'));
        }

        if(unit){
            loader = require(config.codeLoader);
            code = loader.load(path, unit, getCode, this.formatCode);
        }
        else
             code = this.formatCode(getCode(path))

        return {
            code : code,
            title : title
        };
    },
    formatCode :  function (code) {
        if (code)
            return "\t" + code.replace(/\n/g, '\n\t');
    }
};