"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Expr = require("./../linq/peg/expressionvisitor");
describe('When using ExpressionVisitor', () => {
    let visitor, expr;
    describe('for object Lambda expression', () => {
        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor;
        });
        it('it should handle toString', () => {
            assert.equal(visitor.visitLambda(() => ({ 'key': 123, 'value': 'abc' })).toString(), '{"key": 123, "value": "abc"}');
            assert.equal(visitor.visitLambda(() => ({ key: 123, value: 'abc' })).toString(), '{"key": 123, "value": "abc"}');
            assert.equal(visitor.visitLambda(() => ({ 0: 123, 1: 'abc' })).toString(), '{"0": 123, "1": "abc"}');
        });
    });
});
//# sourceMappingURL=expressionvisitor_object.js.map