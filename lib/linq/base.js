"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("./../repository/repository");
class Base {
    constructor(items) {
        this.iterableName = null;
        this.items = null;
        this.operators = [];
        if (items)
            this.from(items);
    }
    get name() {
        if (this.iterableName != null)
            return this.iterableName;
        if (this.items)
            return this.iterableName = this.items.constructor.name;
        return '';
    }
    from(items) {
        if (items) {
            this.items = items;
        }
        return this;
    }
    getAsyncIterator() {
        return __asyncGenerator(this, arguments, function* getAsyncIterator_1() {
            if (!isAsyncIterable(this.items))
                throw new TypeError('Enumerable is not async iterable');
            function iterate(items, operators, idx = null) {
                return __asyncGenerator(this, arguments, function* iterate_1() {
                    if (idx == null)
                        idx = operators.length;
                    let operator = idx > 0 ? operators[idx - 1] : null, evaluate = (item) => 'yield', generator;
                    if (operator) {
                        if ('evaluate' in operator) {
                            switch (idx) {
                                case 0:
                                    generator = items;
                                    break;
                                default: generator = iterate(items, operators, idx - 1);
                            }
                            evaluate = operator.evaluate();
                        }
                        else {
                            generator = operator.asyncIterator(items);
                        }
                    }
                    else {
                        generator = items;
                    }
                    let result;
                    while (!(result = yield __await(Promise.resolve(generator.next()))).done) {
                        let state = evaluate(result.value);
                        if (state == 'break')
                            break;
                        if (state == 'continue')
                            continue;
                        yield yield __await(result.value);
                    }
                });
            }
            let iterator = iterate(this.items instanceof repository_1.Repository ? this.items.query(this) : this.items[Symbol.asyncIterator](), this.operators), result;
            while (!(result = yield __await(Promise.resolve(iterator.next()))).done) {
                yield yield __await(result.value);
            }
        });
    }
    *getIterator() {
        if (!isIterable(this.items))
            throw new TypeError('Enumerable is not iterable');
        function* iterate(items, operators, idx = null) {
            if (idx == null)
                idx = operators.length;
            let operator = idx > 0 ? operators[idx - 1] : null, evaluate = (item) => 'yield', generator;
            if (operator) {
                if ('evaluate' in operator) {
                    switch (idx) {
                        case 0:
                            generator = items;
                            break;
                        default: generator = iterate(items, operators, idx - 1);
                    }
                    evaluate = operator.evaluate();
                }
                else {
                    generator = operator.iterator(items);
                }
            }
            else {
                generator = items;
            }
            let result;
            while (!(result = generator.next()).done) {
                let state = evaluate(result.value);
                if (state == 'break')
                    break;
                if (state == 'continue')
                    continue;
                yield result.value;
            }
        }
        let iterator = iterate(this.items[Symbol.iterator](), this.operators), result;
        while (!(result = iterator.next()).done) {
            yield result.value;
        }
    }
    [Symbol.iterator]() {
        //throw new Error('Enumerable is async iterable but is used as iterable')
        return this.getIterator();
    }
    [Symbol.asyncIterator]() {
        return this.getAsyncIterator();
    }
}
exports.default = Base;
function isRecord(value) {
    return value !== null && typeof value == 'object';
}
function isIterable(value) {
    return isRecord(value) && typeof value[Symbol.iterator] == 'function';
}
function isAsyncIterable(value) {
    return isRecord(value) && typeof value[Symbol.asyncIterator] == 'function';
}
//# sourceMappingURL=base.js.map