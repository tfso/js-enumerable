import * as assert from 'assert'
import * as Expr from '../../linq/peg/expressionvisitor'

describe('When using ExpressionVisitor', () => {
    let visitor: Expr.ExpressionVisitor,
        expr: Expr.IExpression

    describe('for method', () => {
        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor
        })

        describe('OData expression', () => {

            it('should return a method expression', () => {
                expr = visitor.visitOData('tolower(Country) eq \'NO\'')

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')

                assert.ok((<Expr.LogicalExpression>expr).left.type == Expr.ExpressionType.Method, 'Expected a MethodExpression at left side')
                assert.ok((<Expr.IMethodExpression>((<Expr.LogicalExpression>expr).left)).name == 'tolower', 'Expected method name \'tolower\'')
                assert.ok((<Expr.IMethodExpression>((<Expr.LogicalExpression>expr).left)).parameters.length == 1, 'Expected one argument')
                assert.ok((<Expr.IMethodExpression>((<Expr.LogicalExpression>expr).left)).parameters[0].type == Expr.ExpressionType.Identifier, 'Expected a identifier as first argument')
            })

            it('should return a method expression for nested methods', () => {
                expr = visitor.visitOData('concat(FCode, tolower(FText)) eq \'2TEST\'')

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')

                assert.ok((<Expr.LogicalExpression>expr).left.type == Expr.ExpressionType.Method, 'Expected a MethodExpression at left side')
                assert.ok((<Expr.IMethodExpression>((<Expr.LogicalExpression>expr).left)).name == 'concat', 'Expected method name \'concat\'')
                assert.ok((<Expr.IMethodExpression>((<Expr.LogicalExpression>expr).left)).parameters.length == 2, 'Expected two arguments')

                assert.ok(((<Expr.IMethodExpression>((<Expr.LogicalExpression>expr).left)).parameters[0]).type == Expr.ExpressionType.Identifier, 'Expected a identifier for first argument')

                assert.ok(((<Expr.IMethodExpression>((<Expr.LogicalExpression>expr).left)).parameters[1]).type == Expr.ExpressionType.Method, 'Expected a method for second argument')
                assert.ok((<Expr.IMethodExpression>((<Expr.IMethodExpression>((<Expr.LogicalExpression>expr).left)).parameters[1])).name == 'tolower', 'Expected method name \'tolower\' for second argument')
                assert.ok((<Expr.IMethodExpression>((<Expr.IMethodExpression>((<Expr.LogicalExpression>expr).left)).parameters[1])).parameters.length == 1, 'Expected one argument in method for second argument')
                assert.ok((<Expr.IMethodExpression>((<Expr.IMethodExpression>((<Expr.LogicalExpression>expr).left)).parameters[1])).parameters[0].type == Expr.ExpressionType.Identifier, 'Expected a identifier as first argument in method for second argument')
            })
        })

        describe('Lambda expression', () => {
            it('should return a method expression', () => {
                expr = visitor.visitLambda((str: string) => str.indexOf('a'))

                assert.ok(expr.type == Expr.ExpressionType.Method, 'Expected a MethodExpression')
                assert.ok((<Expr.IMethodExpression>expr).name == 'indexOf', 'Expected method name \'indexOf\'')
                assert.ok((<Expr.IMethodExpression>expr).parameters.length == 1, 'Expected one argument')
                assert.ok((<Expr.IMethodExpression>expr).caller.type == Expr.ExpressionType.Identifier, 'Expected a identifier as caller')
            })

            it('should return a method expression for nested calls', () => {
                expr = visitor.visitLambda((str: string) => str.indexOf('a').toString())

                assert.ok(expr.type == Expr.ExpressionType.Method, 'Expected a MethodExpression')
                assert.ok((<Expr.IMethodExpression>expr).name == 'toString', 'Expected method name \'toString\'')
                assert.ok((<Expr.IMethodExpression>expr).parameters.length == 0, 'Expected zero arguments')
                assert.ok((<Expr.IMethodExpression>expr).caller.type == Expr.ExpressionType.Method, 'Expected a new method as caller')

                assert.ok((<Expr.IMethodExpression>((<Expr.IMethodExpression>expr).caller)).name == 'indexOf', 'Expected method name \'indexOf\'')
                assert.ok((<Expr.IMethodExpression>((<Expr.IMethodExpression>expr).caller)).parameters.length == 1, 'Expected one argument')
                assert.ok((<Expr.IMethodExpression>((<Expr.IMethodExpression>expr).caller)).caller.type == Expr.ExpressionType.Identifier, 'Expected a identifier as caller')
            })
        })
    })
})
