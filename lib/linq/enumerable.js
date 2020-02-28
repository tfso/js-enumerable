"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
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
const base_1 = require("./base");
const operator_1 = require("./operator");
class Enumerable extends base_1.default {
    constructor(items) {
        super(items);
    }
    skip(count) {
        this.operators.push({
            type: operator_1.LinqType.Skip,
            count,
            evaluate: () => {
                let idx = 0;
                return (item) => {
                    if (idx++ < count)
                        return 'continue';
                    return 'yield';
                };
            }
        });
        return this;
    }
    take(count) {
        this.operators.push({
            type: operator_1.LinqType.Take,
            count,
            evaluate: () => {
                let idx = 0;
                return (item) => {
                    if (idx++ == count)
                        return 'break';
                    return 'yield';
                };
            }
        });
        return this;
    }
    slice(begin, end) {
        this.operators.push({
            type: operator_1.LinqType.Slice,
            begin,
            end,
            evaluate: () => {
                let idx = 0, skip = typeof begin === 'string' ? 0 : begin;
                return (item) => {
                    idx++;
                    if (idx <= skip)
                        return 'continue';
                    if (end && idx > end)
                        return 'break';
                    return 'yield';
                };
            }
        });
        return this;
    }
    includes(entity, fromIndex) {
        this.operators.push({ type: operator_1.LinqType.Includes,
            entity,
            evaluate: () => {
                let values = Object.entries(entity);
                return (item) => {
                    if (isRecord(item) && values.every(([key, value]) => key in item && (value == undefined || value == item[key])))
                        return 'yield';
                    return 'continue';
                };
            } });
        return this;
    }
    orderBy(property) {
        this.operators.push({
            type: operator_1.LinqType.OrderBy,
            property,
            iterator: function* (items) {
                let ar = Array.from(items);
                ar.sort((a, b) => {
                    let left = null, right = null;
                    if (typeof property == 'string') {
                        if (isRecord(a) && isRecord(b)) {
                            left = a[property];
                            right = b[property];
                        }
                    }
                    else {
                        left = a;
                        right = b;
                    }
                    return left >= right && left <= right ? 0 : left < right ? -1 : 1; // using >= && <= instead of == fixes comparisons for dates
                });
                yield* ar;
            },
            asyncIterator: function (items) {
                return __asyncGenerator(this, arguments, function* () {
                    var e_1, _a;
                    let ar = [];
                    try {
                        for (var items_1 = __asyncValues(items), items_1_1; items_1_1 = yield __await(items_1.next()), !items_1_1.done;) {
                            let item = items_1_1.value;
                            ar.push(item);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (items_1_1 && !items_1_1.done && (_a = items_1.return)) yield __await(_a.call(items_1));
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    ar.sort((a, b) => {
                        let left = null, right = null;
                        if (typeof property == 'string') {
                            if (isRecord(a) && isRecord(b)) {
                                left = a[property];
                                right = b[property];
                            }
                        }
                        else {
                            left = a;
                            right = b;
                        }
                        return left >= right && left <= right ? 0 : left < right ? -1 : 1; // using >= && <= instead of == fixes comparisons for dates
                    });
                    yield __await(yield* __asyncDelegator(__asyncValues(ar)));
                });
            }
        });
        return this;
    }
}
exports.Enumerable = Enumerable;
function isRecord(value) {
    return value !== null && typeof value == 'object';
}
//# sourceMappingURL=enumerable.js.map