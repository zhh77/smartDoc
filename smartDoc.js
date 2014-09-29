'use strict';

exports.build = function(config, callback) {
    var Y = require('yuidocjs'),
        fs = require("fs"),
        path = require('path'),
        stat = fs.stat,
        themeDir = path.dirname(fs.realpathSync(__filename)) + "/theme-smart/";

    extendYUIDoc();

    buildDoc(getOptions());

    function getOptions() {
        if (config) {
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
        options = Y.mix(options, {
            paths: ['src/'],
            outdir: 'doc/',
            themedir: themeDir,
            helpers: [themeDir + "helpers/helpers.js"]
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
        console.log('Start SmartDoc compile...');
        console.log('Scanning: ' + options.paths);
        console.log('Output: ' + (options.outdir).cyan);

        builder.compile(function() {
            builder.writeDemo(function() {
                callback && callback();
                console.log('SmartDoc compile completed in ' + ((Date.now() - starttime) / 1000) + ' seconds');
            });
        });
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

    Y.DocBuilder.prototype.writeDemo = function(cb) {
        var self = this,
            stack = new Y.Parallel();

        Y.log('Preparing demo.html', 'info', 'builder');

        render(self, stack.add(function(html, view) {
            stack.html = html;
            stack.view = view;
            Y.Files.writeFile(path.join(self.options.outdir + 'assets/', 'demo.html'), html, stack.add(function() {}));
            Y.Files.writeFile(path.join(self.options.outdir + 'assets/', 'show.html'), html + "<script src='js/show.js'></script>", stack.add(function() {}));
        }));

        stack.done(function(html, view) {
            Y.log('Writing demo.html', 'info', 'builder');
            cb(stack.html, stack.view);
        });
    }

    function isJS(file) {
        return path.extname(file) === '.js';
    }

    function isCss(file) {
        return path.extname(file) === '.css';
    }

    function render(builder, cb) {
        Y.prepare([themeDir, themeDir], builder.getProjectMeta(), function(err, opts) {
            var css = [],
                script = [],
                des = builder.options.demoDependencies;

            function addRes(res) {
                if (isJS(res)) {
                    script.push(res);
                } else if (isCss(res)) {
                    css.push(res);
                } else
                    return false;
                return true;
            }

            function buildDemo() {
                opts.meta.css = css;
                opts.meta.script = script;

                var view = new Y.DocView(opts.meta);

                var tmplFn = Y.Handlebars.compile(opts.layouts.demo);
                html = tmplFn(view);
                builder.files++;
                cb(html, view);
            }

            if (des) {
                des.link && des.link.forEach(addRes)

                if (des.paths) {
                    var resPath = builder.options.outdir + 'assets/res';
                    fs.mkdirSync(resPath);
                    des.paths.forEach(function(item) {
                        if (item.charAt(item.length - 1) === '/') {
                            copyDir(addRes, item, resPath);
                        } else {
                            copyRes(addRes, path.basename(item), item, resPath);
                        }
                    })
                }
            }

            buildDemo();
        });
    }

    function copyDir(addRes, src, dst) {
        if (!fs.existsSync(dst))
            fs.mkdirSync(dst);

        // 读取目录中的所有文件/目录
        var paths = fs.readdirSync(src);

        paths.forEach(function(fileName) {
            copyRes(addRes, fileName, src + '/' + path, dst)
        });

    }

    function copyRes(addRes, fileName, src, dst) {
        if (addRes('res/' + fileName)) {
            var _dst = dst + '/' + fileName,
                readable, writable;

            stat(src, function(err, st) {
                if (err) {
                    throw err;
                }

                // 判断是否为文件
                if (st.isFile()) {
                    // 创建读取流
                    readable = fs.createReadStream(src);
                    // 创建写入流
                    writable = fs.createWriteStream(_dst);
                    // 通过管道来传输流
                    readable.pipe(writable);
                }
                // 如果是目录则递归调用自身
                else if (st.isDirectory()) {
                    copyDir(addRes, src, _dst);
                }
            });
        }
    }
}
