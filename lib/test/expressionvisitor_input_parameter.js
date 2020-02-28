"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Expr = require("./../linq/peg/expressionvisitor");
describe('When using ExpressionVisitor', () => {
    let visitor, expr;
    describe('with input parameters', () => {
        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor;
        });
        it('it should handle a simple binary operator', () => {
            expr = visitor.visitLambda((table) => 5 + 2);
            assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression');
        });
        it('it should handle a expression using input parameter', () => {
            expr = visitor.visitLambda((table) => table.number == 5 + 2);
            assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression');
            assert.ok(expr.operator == Expr.LogicalOperatorType.Equal, 'Expected a logical expression with operator equal');
            assert.ok(expr.left.type == Expr.ExpressionType.Member, 'Expected a member expression at left side');
            assert.ok(expr.right.type == Expr.ExpressionType.Binary, 'Expected a binary expression at right side');
            assert.ok(expr.left.object.type == Expr.ExpressionType.Identifier, 'Expected that member object of left side has a member as a identifier');
            assert.ok(expr.left.property.type == Expr.ExpressionType.Identifier, 'Expected that member property of left side has a member as a identifier');
            assert.ok(expr.left.object.name == 'table', 'Expected that member object of left side has a member as a identifier with name \'table\'');
            assert.ok(expr.left.property.name == 'number', 'Expected that member property of left side has a member as a identifier with name \'number\'');
        });
    });
});
//# sourceMappingURL=expressionvisitor_input_parameter.js.map