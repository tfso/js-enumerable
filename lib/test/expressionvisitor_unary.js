"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Expr = require("./../linq/peg/expressionvisitor");
describe('When using ExpressionVisitor', () => {
    let visitor, expr;
    describe('for unary Lambda expression', () => {
        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor;
        });
        it('it should return a unary operation', () => {
            expr = visitor.visitLambda((a) => !a);
            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression');
            assert.ok(expr.argument.type == Expr.ExpressionType.Identifier, 'Expected a identifier as argument');
            assert.ok(expr.argument.name == 'a', 'Expected identifier \'a\' as argument');
        });
        it('it should handle unary operation for negative', () => {
            expr = visitor.visitLambda((a) => -a);
            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression');
            assert.ok(expr.operator == Expr.UnaryOperatorType.Negative, 'Expected a unary operation for negative');
            assert.ok(expr.affix == Expr.UnaryAffixType.Prefix, 'Expected unary operation to be prefixed');
        });
        it('it should handle unary operation for positive', () => {
            expr = visitor.visitLambda((a) => +a);
            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression');
            assert.ok(expr.operator == Expr.UnaryOperatorType.Positive, 'Expected a unary operation for positive');
            assert.ok(expr.affix == Expr.UnaryAffixType.Prefix, 'Expected unary operation to be prefixed');
        });
        it('it should handle unary operation for invert', () => {
            expr = visitor.visitLambda((a) => !a);
            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression');
            assert.ok(expr.operator == Expr.UnaryOperatorType.Invert, 'Expected a unary operation for inverting');
            assert.ok(expr.affix == Expr.UnaryAffixType.Prefix, 'Expected unary operation to be prefixed');
        });
        it('it should handle unary operation for complement', () => {
            expr = visitor.visitLambda((a) => ~a);
            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression');
            assert.ok(expr.operator == Expr.UnaryOperatorType.Complement, 'Expected a unary operation for complement');
            assert.ok(expr.affix == Expr.UnaryAffixType.Prefix, 'Expected unary operation to be prefixed');
        });
        it('it should handle unary operation for prefixed increment', () => {
            expr = visitor.visitLambda((a) => ++a);
            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression');
            assert.ok(expr.operator == Expr.UnaryOperatorType.Increment, 'Expected a unary operation for increment');
            assert.ok(expr.affix == Expr.UnaryAffixType.Prefix, 'Expected unary operation to be prefixed');
        });
        it('it should handle unary operation for postfixed increment', () => {
            expr = visitor.visitLambda((a) => a++);
            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression');
            assert.ok(expr.operator == Expr.UnaryOperatorType.Increment, 'Expected a unary operation for increment');
            assert.ok(expr.affix == Expr.UnaryAffixType.Postfix, 'Expected unary operation to be prefixed');
        });
        it('it should handle unary operation for prefixed decrement', () => {
            expr = visitor.visitLambda((a) => --a);
            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression');
            assert.ok(expr.operator == Expr.UnaryOperatorType.Decrement, 'Expected a unary operation for decrement');
            assert.ok(expr.affix == Expr.UnaryAffixType.Prefix, 'Expected unary operation to be prefixed');
        });
        it('it should handle unary operation for postfixed decrement', () => {
            expr = visitor.visitLambda((a) => a--);
            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression');
            assert.ok(expr.operator == Expr.UnaryOperatorType.Decrement, 'Expected a unary operation for decrement');
            assert.ok(expr.affix == Expr.UnaryAffixType.Postfix, 'Expected unary operation to be prefixed');
        });
        it('it should handle unary operation increment in binary operation', () => {
            expr = visitor.visitLambda((a) => 5 - a++);
            assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression');
            assert.ok(expr.operator == Expr.BinaryOperatorType.Subtraction, 'Expected binary operation for subtraction');
            assert.ok(expr.left.type == Expr.ExpressionType.Literal, 'Expected a literal expression at left side');
            assert.ok(expr.right.type == Expr.ExpressionType.Unary, 'Expected a unary expression at right side');
            assert.ok(expr.right.operator == Expr.UnaryOperatorType.Increment, 'Expected a unary operation to be increment');
            assert.ok(expr.right.argument.type == Expr.ExpressionType.Identifier, 'Expected a unary operation to have an argument as Identifier');
        });
        it('it should handle unary operation decrement in binary operation', () => {
            expr = visitor.visitLambda((a) => 5 - a--);
            assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression');
            assert.ok(expr.operator == Expr.BinaryOperatorType.Subtraction, 'Expected binary operation for subtraction');
            assert.ok(expr.left.type == Expr.ExpressionType.Literal, 'Expected a literal expression at left side');
            assert.ok(expr.right.type == Expr.ExpressionType.Unary, 'Expected a unary expression at right side');
            assert.ok(expr.right.operator == Expr.UnaryOperatorType.Decrement, 'Expected a unary operation to be decrement');
            assert.ok(expr.right.argument.type == Expr.ExpressionType.Identifier, 'Expected a unary operation to have an argument as Identifier');
        });
        it('it should handle toString', () => {
            assert.equal(visitor.visitLambda((a) => 5 - a--).toString(), '5 - a--');
            assert.equal(visitor.visitLambda((a) => !a).toString(), '!a');
            assert.equal(visitor.visitLambda((a) => -a).toString(), '-a');
            assert.equal(visitor.visitLambda((a) => +a).toString(), '+a');
            assert.equal(visitor.visitLambda((a) => ~a).toString(), '~a');
            assert.equal(visitor.visitLambda((a) => ++a).toString(), '++a');
            assert.equal(visitor.visitLambda((a) => --a).toString(), '--a');
            assert.equal(visitor.visitLambda((a) => a++).toString(), 'a++');
            assert.equal(visitor.visitLambda((a) => a--).toString(), 'a--');
        });
    });
});
//# sourceMappingURL=expressionvisitor_unary.js.map