'use strict';

exports.build = function(config,callback) {
    var Y = require('yuidocjs');
    var fs = require("fs");
    var path = require('path');
    var dir = path.dirname(fs.realpathSync(__filename))+"/";

    extendYUIDoc();

    buildDoc(getOptions());

    function getOptions(){
        if(config) {
            return config;
        }
        return require(fs.realpathSync('.') + '/docConfig.js');
    }
    function buildDoc(options) {
        var json;

        if (!options) {
            console.log('The Options of smartDoc is not be defined!');
            return;
        }
        options = Y.mix(options,{
            themedir: dir + 'theme-smart/',
            helpers: [dir + "theme-smart/helpers/helpers.js"]
        });

        try {
            json = (new Y.YUIDoc(options)).run();
        } catch (e) {
            console.log(e);
            return;
        }
        options = Y.Project.mix(json, options);

        var builder = new Y.DocBuilder(options, json);
        var starttime = Date.now();
        console.log('Start YUIDoc compile...');
        builder.compile(function() {
            addDemoLib(options,options.demoLibs);
            callback && callback();
            console.log('YUIDoc compile completed in ' + ((Date.now() - starttime) / 1000) + ' seconds');
        });
    }

    function addDemoLib(options,demoLibs){
         if(demoLibs && demoLibs.length){
            var scripts = "<script src='" + demoLibs.join("'></script><script src='") + "'></script>";
            fs.appendFile(options.outdir + '/assets/demo.html',scripts);
         }
    }

    function extendYUIDoc() {
        Y.DocBuilder.prototype.populateModules = function(opts) {
            var self = this;
            opts.meta.modules = [];
            opts.meta.allModules = [];
            Y.each(this.data.modules, function(v) {
                if (v.external) {
                    return;
                }

                var classes = [];

                for (var cName in v.classes) {
                    classes.push({
                        name: cName
                    });
                }
                opts.meta.allModules.push({
                    displayName: v.displayName || v.name,
                    name: self.filterFileName(v.name),
                    description: v.description,
                    classes: classes.length ? classes : null
                });

                if (!v.is_submodule) {
                    var o = {
                        displayName: v.displayName || v.name,
                        name: self.filterFileName(v.name),
                        classes: classes.length ? classes : null
                    };
                    if (v.submodules) {
                        o.submodules = [];
                        Y.each(v.submodules, function(i, k) {
                            var moddef = self.data.modules[k];
                            if (moddef) {
                                o.submodules.push({
                                    displayName: k,
                                    description: moddef.description
                                });
                                // } else {
                                //     Y.log('Submodule data missing: ' + k + ' for ' + v.name, 'warn', 'builder');
                            }
                        });
                        o.submodules.sort(self.nameSort);
                    }
                    opts.meta.modules.push(o);
                }
            });
            opts.meta.modules.sort(this.nameSort);
            opts.meta.allModules.sort(this.nameSort);
            return opts;
        }
    }
}
