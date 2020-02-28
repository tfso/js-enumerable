"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Expr = require("./../linq/peg/expressionvisitor");
describe('When using ExpressionVisitor', () => {
    let visitor, expr;
    describe('for array Lambda expression', () => {
        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor;
        });
        it('it should handle toString', () => {
            assert.equal(visitor.visitLambda(() => ['yes', 'no']).toString(), '["yes", "no"]');
            assert.equal(visitor.visitLambda(() => [1, 2 + 4, 4, 8]).toString(), '[1, 2 + 4, 4, 8]');
            assert.equal(visitor.visitLambda(() => [1, 2 + 4 * 4, 4, 8]).toString(), '[1, 2 + (4 * 4), 4, 8]');
        });
    });
});
//# sourceMappingURL=expressionvisitor_array.js.map