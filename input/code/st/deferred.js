"use strict";
/**
    Promise的实现对象，接口基本与Jquery相同，不依赖JQuery的时候使用;
    
    Update Note：
        + 2014.10 ：Created

    @module Promise
*/
stDefine('deferred', function(st) {

    var priorityList = st.priorityList,
        sliceArgs = st.sliceArgs;

    /**
     * Deferred对象
     * @class Deferred
     * @constructor
     * @demo st/deferred.js [resolve]
     */
    function Deferred() {
        var defer = this;
        defer.__state = 'pendding';
        defer.__resolvedCalls = priorityList();
        defer.__rejectedCalls = priorityList();
        defer.__alwaysCalls = priorityList();
    }

    function addCallbacks(defer, callbacks, state) {
        var status = defer.state(),
            list,
            len = callbacks.length,
            priority;

        if (len > 0) {
            callbacks = sliceArgs(callbacks);

            if (len > 1) {
                priority = callbacks[len - 1];

                if (priority === undefined || typeof priority === 'number')
                    callbacks.pop();
                else
                    priority = null;
            }

            if (status === state) {
                callbacks.forEach(function(callback) {
                    callback && callback.apply(null, defer.__result);
                })
            } else {
                list = defer['__' + state + 'Calls'];

                callbacks.forEach(function(callback) {
                    callback && list.add(callback, priority);
                })
            }
        }

        return defer;
    }

    function complete(defer, args, state) {
        defer.__state = state;

        var list = defer['__' + state + 'Calls'],
            fnCallback = function(callback) {
                callback.apply(defer, args);
            };

        list.each(fnCallback)

        defer.__alwaysCalls.each(fnCallback);
    }

    Deferred.prototype = {
        /**
         * 解决递延对象，并根据给定的参数调用任何完成的回调函数
         * @method resolve
         * @param  {object} result 解决传递的结果
         * @demo st/deferred.js [multi resolve]
         */
        resolve: function(result) {
            complete(this, arguments, 'resolved');
        },
        /**
         * 拒绝延迟对象，并根据给定的参数调用任何失败的回调函数。
         * @method reject
         * @param  {object} arg 拒绝传递的参数
         * @demo st/deferred.js [reject]
         */
        reject: function(arg) {
            complete(this, arguments, 'rejected');
        },
        /**
         * 返回契约
         * @method promise
         */
        promise: function() {
            return this.__state === 'pendding' ? this : this.__result;
        },
        /**
         * 返回契约状态；
         *     1. pending: 未完成状态。 
         *     2. resolved: 解决状态。 
         *     3. rejected: 拒绝的状态。
         * @method state
         */
        state: function() {
            return this.__state;
        },
         /**
         * 当延迟成功时调用一个函数或者数组函数。
         * @method done
         * @param  {function|array} callback 回调函数或者数组函数
         */
        done: function(callback) {
            return addCallbacks(this, arguments, 'resolved');
        },
        /**
         * 当延迟失败时调用一个函数或者数组函数。
         * @method fail
         * @param  {function|array} callback 回调函数或者数组函数
         */
        fail: function(callback) {
            return addCallbacks(this, arguments, 'rejected');
        },
        /**
         * 当递延对象是解决或拒绝时被调用添加处理程序；
         * @method always
         * @param  {function|array} callback 回调函数或者数组函数
         */
        always: function() {
            return addCallbacks(this, arguments, 'always');
        },
        /**
         * 添加处理程序被调用时，递延对象得到解决或者拒绝；
         * @method then
         * @param  {function} doneCallback 成功回调函数
         * @param  {function} callback 失败回调函数或者数组函数
         * @param  {number} priority 权重；优先级
         */
        then: function(doneCallback, failCallback, priority) {
            doneCallback && this.done(doneCallback, priority);
            failCallback && this.fail(failCallback, priority);
            return this;
        }
    }

    return {
        Deferred: function() {
            return new Deferred();
        },
        /**
         * 捕获promise的方法，使用st.when调用；
         * @method when
         * @param  {object|args} result 单个判断对象或者一组（参数组）判断对象
         * @demo 
         */
        when: function() {
            var deferList = sliceArgs(arguments),
                count = deferList.length,
                isResolve = true,
                num = 0,
                rets = new Array(count),
                isFinish,
                whenDefer = new Deferred();

            function process(i, result, state) {
                num++;
                if (isResolve && state === 'rejected')
                    isResolve = false;

                rets[i] = result;

                if (num === count) {
                    whenDefer[isResolve ? 'resolve' : 'reject'].apply(whenDefer, rets);
                    isFinish = true;
                }
            }

            deferList.forEach(function(defer, i) {
                if (defer instanceof Deferred) {
                    defer.always(function(result) {
                        process(i, result, this.state());
                    })
                } else
                    process(i, defer);
            })

            if (isFinish) {
                whenDefer.__result = rets;
            }
            return whenDefer;
        }
    };
})
