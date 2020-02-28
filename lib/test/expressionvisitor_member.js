"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Expr = require("../linq/peg/expressionvisitor");
describe('When using ExpressionVisitor', () => {
    let visitor, expr;
    describe('for member Lambda expression', () => {
        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor;
        });
        it('it should return a member expression', () => {
            expr = visitor.visitLambda((it) => it.num);
            assert.ok(expr.type == Expr.ExpressionType.Member, 'Expected a MemberExpression');
            assert.ok(expr.object.type == Expr.ExpressionType.Identifier, 'Expected a identifier as object');
            assert.ok(expr.property.type == Expr.ExpressionType.Identifier, 'Expected a identifier as property');
        });
        it('it should return a member expression with array indexer', () => {
            expr = visitor.visitLambda((it) => it.ar[5]);
            assert.ok(expr.type == Expr.ExpressionType.Member, 'Expected a MemberExpression');
            assert.ok(expr.object.type == Expr.ExpressionType.Identifier, 'Expected a identifier as object');
            assert.ok(expr.property.type == Expr.ExpressionType.Index, 'Expected a index expression as property');
            assert.ok(expr.property.object.type == Expr.ExpressionType.Identifier, 'Expected the object of index property is an identifier');
            assert.ok(expr.property.index.type == Expr.ExpressionType.Literal, 'Expected the index of index property is a literal');
        });
    });
});
//# sourceMappingURL=expressionvisitor_member.js.map