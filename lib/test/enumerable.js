var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
/* eslint-disable-next-line */
if (jsEnumerable == null) {
    /* eslint-disable-next-line */
    var jsEnumerable = require('./../linq/enumerable');
}
function* iterator() {
    yield 5;
    yield 10;
    yield 7;
    yield 11;
    yield 1;
}
function asyncIterator() {
    return __asyncGenerator(this, arguments, function* asyncIterator_1() {
        yield yield __await(5);
        yield yield __await(10);
        yield yield __await(7);
        yield yield __await(11);
        yield yield __await(1);
    });
}
describe('When using enumerable', () => {
    describe('as an asynchronous iterable', () => {
        it('should async iterate normally', () => __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            let total = 0, firstResult = asyncIterator().next(), firstValue = (yield firstResult).value;
            chai.expect(firstResult instanceof Promise).to.be.true;
            chai.expect(firstValue).to.equal(5);
            try {
                for (var _b = __asyncValues(asyncIterator()), _c; _c = yield _b.next(), !_c.done;) {
                    let num = _c.value;
                    total += num;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            chai.expect(total).to.equal(34);
        }));
        it('should async iterate using Enumerable', () => __awaiter(this, void 0, void 0, function* () {
            var e_2, _d;
            let total = 0;
            try {
                for (var _e = __asyncValues(new jsEnumerable.Enumerable(asyncIterator())), _f; _f = yield _e.next(), !_f.done;) {
                    let num = _f.value;
                    total += num;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_d = _e.return)) yield _d.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
            chai.expect(total).to.equal(34);
        }));
        it('should async iterate using Enumerable with take', () => __awaiter(this, void 0, void 0, function* () {
            var e_3, _g;
            let total = 0;
            try {
                for (var _h = __asyncValues(new jsEnumerable.Enumerable(asyncIterator()).take(2)), _j; _j = yield _h.next(), !_j.done;) {
                    let num = _j.value;
                    total += num;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_g = _h.return)) yield _g.call(_h);
                }
                finally { if (e_3) throw e_3.error; }
            }
            chai.expect(total).to.equal(15);
        }));
        it('should async iterate using Enumerable with skip', () => __awaiter(this, void 0, void 0, function* () {
            var e_4, _k;
            let total = 0;
            try {
                for (var _l = __asyncValues(new jsEnumerable.Enumerable(asyncIterator()).skip(3)), _m; _m = yield _l.next(), !_m.done;) {
                    let num = _m.value;
                    total += num;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_m && !_m.done && (_k = _l.return)) yield _k.call(_l);
                }
                finally { if (e_4) throw e_4.error; }
            }
            chai.expect(total).to.equal(12);
        }));
        it('should async iterate using Enumerable with skip/take', () => __awaiter(this, void 0, void 0, function* () {
            var e_5, _o;
            let total = 0;
            try {
                for (var _p = __asyncValues(new jsEnumerable.Enumerable(asyncIterator()).skip(2).take(2)), _q; _q = yield _p.next(), !_q.done;) {
                    let num = _q.value;
                    total += num;
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_q && !_q.done && (_o = _p.return)) yield _o.call(_p);
                }
                finally { if (e_5) throw e_5.error; }
            }
            chai.expect(total).to.equal(18);
        }));
        it('should async iterate using Enumerable with slice', () => __awaiter(this, void 0, void 0, function* () {
            var e_6, _r;
            let total = 0;
            try {
                for (var _s = __asyncValues(new jsEnumerable.Enumerable(asyncIterator()).slice(2, 4)), _t; _t = yield _s.next(), !_t.done;) {
                    let num = _t.value;
                    total += num;
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_t && !_t.done && (_r = _s.return)) yield _r.call(_s);
                }
                finally { if (e_6) throw e_6.error; }
            }
            chai.expect(total).to.equal(18);
        }));
        it('should async iterate using Enumerable with orderBy', () => __awaiter(this, void 0, void 0, function* () {
            var e_7, _u;
            let ar = [];
            try {
                for (var _v = __asyncValues(new jsEnumerable.Enumerable(asyncIterator()).orderBy()), _w; _w = yield _v.next(), !_w.done;) {
                    let num = _w.value;
                    ar.push(num);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_w && !_w.done && (_u = _v.return)) yield _u.call(_v);
                }
                finally { if (e_7) throw e_7.error; }
            }
            chai.expect(ar).to.deep.equal([1, 5, 7, 10, 11]);
        }));
    });
    describe('as a synchronous iterable', () => {
        it('should iterate normally', () => {
            let total = 0, firstResult = iterator().next(), firstValue = firstResult.value;
            chai.expect(typeof firstResult == 'object').to.be.true;
            chai.expect(firstValue).to.equal(5);
            for (let num of iterator())
                total += num;
            chai.expect(total).to.equal(34);
        });
        it('should iterate using Enumerable', () => {
            let total = 0;
            for (let num of new jsEnumerable.Enumerable(iterator()))
                total += num;
            chai.expect(total).to.equal(34);
        });
        it('should iterate using Enumerable with take', () => {
            let total = 0;
            for (let num of new jsEnumerable.Enumerable(iterator()).take(2))
                total += num;
            chai.expect(total).to.equal(15);
        });
        it('should iterate using Enumerable with skip', () => {
            let total = 0;
            for (let num of new jsEnumerable.Enumerable(iterator()).skip(3))
                total += num;
            chai.expect(total).to.equal(12);
        });
        it('should iterate using Enumerable with skip/take', () => {
            let total = 0;
            for (let num of new jsEnumerable.Enumerable(iterator()).skip(2).take(2))
                total += num;
            chai.expect(total).to.equal(18);
        });
        it('should iterate using Enumerable with slice', () => {
            let total = 0;
            for (let num of new jsEnumerable.Enumerable(iterator()).slice(2, 4))
                total += num;
            chai.expect(total).to.equal(18);
        });
        it('should iterate using Enumerable with orderBy', () => {
            let ar = Array.from(new jsEnumerable.Enumerable(iterator()).orderBy());
            chai.expect(ar).to.deep.equal([1, 5, 7, 10, 11]);
        });
    });
});
//# sourceMappingURL=enumerable.js.map