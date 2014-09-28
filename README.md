SmartDoc 0.0.5
======================

基于YUIDoc构建的Javascipt文档生成器。 

特性 
--------------------
    * 基于Bootstrp3构建，排版和样式美化
    * 支持html和js的Demo生成,与查看
    * 提供在线的demo编辑页面（类似于jsfiddler）
    * 可以配置化增强 - 项目信息配置；Document页面导航配置；demo依赖库配置
    * modules和classes结构化，筛选更加便利


使用
--------------------

    npm install -g smartdoc
    smartdoc


配置项
---------------------
在目录中加入docConfig.js文件


    module.exports = {
        //扫描的文件路径
        paths: ['input/'],

        //文档页面输出路径
        outdir: 'doc/',

        //项目信息配置
        project: {

            //项目名称
            name: 'SmartDoc',

            //项目描述，可以配置html，会生成到document主页
            description: '<h2>SmartDoc</h2> <p>Javascript Document builder base on YUIDoc.</p>',

            //版本信息
            version: '1.1.0',

            //地址信息
            url: 'https://github.com/zhh77/smartjs',
            //logo地址
            logo : 'https://github.com/zhh77/logo.png',
            //导航信息
            navs: [{
                name: "Home",
                url: "https://github.com/zhh77/smartjs"
            }, {
                name: "Document",
                url: ""
            }, {
                name: "About",
                url: "https://github.com/zhh77/smartjs"
            }]
        },

        //demo展示页面需要加载的资源； 资源只能是css和js文件
        demoLibs: {

            //外部资源链接
            link : ['http://code.jquery.com/jquery-1.11.0.min.js'],

            //文件复制路径; 将目下的资源复制到doc生成目录中，并在deom页面引用
            paths : ['input/ui/uicode.js','input/']
        },

        //自定义主题路径
        themedir: 'theme/',

        //自定义helpers
        helpers: ["theme/helpers/helpers.js"]
    };

其他使用见 [YUIDoc](http://yui.github.com/yuidoc/)

例子使用说明
------------------
将代码下载后，运行

    npm install
    node test.js


程序会将input/目录下的js扫描，将Document生成到doc/目录下,运行doc/index.html,即可访问生成的文档。


注意：生成后的代码编辑页面需要发布到服务器才能正常运行；
