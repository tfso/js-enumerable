"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Expr = require("../linq/peg/expressionvisitor");
describe('When using ExpressionVisitor', () => {
    let visitor, expr;
    describe('for method', () => {
        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor;
        });
        describe('OData expression', () => {
            it('should return a method expression', () => {
                expr = visitor.visitOData('tolower(Country) eq \'NO\'');
                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression');
                assert.ok(expr.left.type == Expr.ExpressionType.Method, 'Expected a MethodExpression at left side');
                assert.ok((expr.left).name == 'tolower', 'Expected method name \'tolower\'');
                assert.ok((expr.left).parameters.length == 1, 'Expected one argument');
                assert.ok((expr.left).parameters[0].type == Expr.ExpressionType.Identifier, 'Expected a identifier as first argument');
            });
            it('should return a method expression for nested methods', () => {
                expr = visitor.visitOData('concat(FCode, tolower(FText)) eq \'2TEST\'');
                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression');
                assert.ok(expr.left.type == Expr.ExpressionType.Method, 'Expected a MethodExpression at left side');
                assert.ok((expr.left).name == 'concat', 'Expected method name \'concat\'');
                assert.ok((expr.left).parameters.length == 2, 'Expected two arguments');
                assert.ok(((expr.left).parameters[0]).type == Expr.ExpressionType.Identifier, 'Expected a identifier for first argument');
                assert.ok(((expr.left).parameters[1]).type == Expr.ExpressionType.Method, 'Expected a method for second argument');
                assert.ok(((expr.left).parameters[1]).name == 'tolower', 'Expected method name \'tolower\' for second argument');
                assert.ok(((expr.left).parameters[1]).parameters.length == 1, 'Expected one argument in method for second argument');
                assert.ok(((expr.left).parameters[1]).parameters[0].type == Expr.ExpressionType.Identifier, 'Expected a identifier as first argument in method for second argument');
            });
        });
        describe('Lambda expression', () => {
            it('should return a method expression', () => {
                expr = visitor.visitLambda((str) => str.indexOf('a'));
                assert.ok(expr.type == Expr.ExpressionType.Method, 'Expected a MethodExpression');
                assert.ok(expr.name == 'indexOf', 'Expected method name \'indexOf\'');
                assert.ok(expr.parameters.length == 1, 'Expected one argument');
                assert.ok(expr.caller.type == Expr.ExpressionType.Identifier, 'Expected a identifier as caller');
            });
            it('should return a method expression for nested calls', () => {
                expr = visitor.visitLambda((str) => str.indexOf('a').toString());
                assert.ok(expr.type == Expr.ExpressionType.Method, 'Expected a MethodExpression');
                assert.ok(expr.name == 'toString', 'Expected method name \'toString\'');
                assert.ok(expr.parameters.length == 0, 'Expected zero arguments');
                assert.ok(expr.caller.type == Expr.ExpressionType.Method, 'Expected a new method as caller');
                assert.ok((expr.caller).name == 'indexOf', 'Expected method name \'indexOf\'');
                assert.ok((expr.caller).parameters.length == 1, 'Expected one argument');
                assert.ok((expr.caller).caller.type == Expr.ExpressionType.Identifier, 'Expected a identifier as caller');
            });
        });
    });
});
//# sourceMappingURL=expressionvisitor_method.js.map