"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Expr = require("./../linq/peg/expressionvisitor");
describe('When using ExpressionVisitor', () => {
    let visitor, expr;
    describe('for template literal Lambda expression', () => {
        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor;
        });
        it('it should handle toString', () => {
            let expr = visitor.visitLambda(() => `My number is ${5} and the next is ${5 + 1}`);
            assert.equal(expr.toString(), '`My number is ${5} and the next is ${5 + 1}`');
        });
    });
});
//# sourceMappingURL=expressionvisitor_templateliteral.js.map