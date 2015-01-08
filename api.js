YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Deferred",
        "JSON",
        "UI",
        "YUI~oop",
        "mywidget.SubWidget",
        "mywidget.SubWidget2",
        "mywidget.SuperWidget"
    ],
    "modules": [
        "ExampleModule",
        "Promise",
        "json",
        "json-parse",
        "json-stringify",
        "oop",
        "uiModule"
    ],
    "allModules": [
        {
            "displayName": "ExampleModule",
            "name": "ExampleModule",
            "description": "This is my example module",
            "classes": [
                {
                    "name": "mywidget.SuperWidget"
                },
                {
                    "name": "mywidget.SubWidget"
                },
                {
                    "name": "mywidget.SubWidget2"
                }
            ]
        },
        {
            "displayName": "json",
            "name": "json",
            "description": "<p>The JSON module adds support for serializing JavaScript objects into\nJSON strings and parsing JavaScript objects from strings in JSON format.</p>\n\n<p>The JSON namespace is added to your YUI instance including static methods\nY.JSON.parse(..) and Y.JSON.stringify(..).</p>\n\n<p>The functionality and method signatures follow the ECMAScript 5\nspecification.  In browsers with native JSON support, the native\nimplementation is used.</p>\n\n<p>The <code>json</code> module is a rollup of <code>json-parse</code> and\n<code>json-stringify</code>.</p>\n\n<p>As their names suggest, <code>json-parse</code> adds support for parsing\nJSON data (Y.JSON.parse) and <code>json-stringify</code> for serializing\nJavaScript data into JSON strings (Y.JSON.stringify).  You may choose to\ninclude either of the submodules individually if you don't need the\ncomplementary functionality, or include the rollup for both.</p>",
            "classes": [
                {
                    "name": "JSON"
                }
            ]
        },
        {
            "displayName": "json-parse",
            "name": "json-parse",
            "description": "Provides Y.JSON.parse method to accept JSON strings and return native\nJavaScript objects.",
            "classes": [
                {
                    "name": "JSON"
                }
            ]
        },
        {
            "displayName": "json-stringify",
            "name": "json-stringify",
            "description": "Provides Y.JSON.stringify method for converting objects to JSON strings.",
            "classes": null
        },
        {
            "displayName": "oop",
            "name": "oop",
            "description": "Supplies object inheritance and manipulation utilities.  This adds\nadditional functionaity to what is provided in yui-base, and the\nmethods are applied directly to the YUI instance.  This module\nis required for most YUI components.",
            "classes": [
                {
                    "name": "YUI~oop"
                }
            ]
        },
        {
            "displayName": "Promise",
            "name": "Promise",
            "description": "Promise的实现对象，接口基本与Jquery相同，不依赖JQuery的时候使用;\n\nUpdate Note：\n    + 2014.10 ：Created",
            "classes": [
                {
                    "name": "Deferred"
                }
            ]
        },
        {
            "displayName": "uiModule",
            "name": "uiModule",
            "description": "ui测试模块；\n* 提供了example的html与js实例；\n* example中引用了jquery的dns和本模块的uiCode.js文件",
            "classes": [
                {
                    "name": "UI"
                }
            ]
        }
    ]
} };
});