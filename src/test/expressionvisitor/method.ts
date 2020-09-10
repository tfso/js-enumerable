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
                expr = visitor.parseOData('tolower(Country) eq \'NO\'')

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')

                assert.ok((<Expr.LogicalExpression>expr).left.type == Expr.ExpressionType.Method, 'Expected a MethodExpression at left side')
                assert.ok((<Expr.IMethodExpression>((<Expr.LogicalExpression>expr).left)).name == 'tolower', 'Expected method name \'tolower\'')
                assert.ok((<Expr.IMethodExpression>((<Expr.LogicalExpression>expr).left)).parameters.length == 1, 'Expected one argument')
                assert.ok((<Expr.IMethodExpression>((<Expr.LogicalExpression>expr).left)).parameters[0].type == Expr.ExpressionType.Identifier, 'Expected a identifier as first argument')
            })

            it('should return a method expression when having lambda expression as argument', () => {
                expr = visitor.parseOData('Countries/any(a: a/Country eq \'NO\')')

                assert.ok(expr.type == Expr.ExpressionType.Method, 'Expected a MethodExpression')
                assert.ok((<Expr.IMethodExpression>expr).name == 'any', 'Expected method name \'any\'')
                assert.ok((<Expr.IMethodExpression>expr).caller.type == Expr.ExpressionType.Identifier, 'Expected a identifier as caller')
                assert.ok((<Expr.IIdentifierExpression>(<Expr.IMethodExpression>expr).caller).name == 'Countries', 'Expected name \'Countries\' of identifier as caller')
                assert.ok((<Expr.IMethodExpression>expr).parameters.length == 1, 'Expected one argument')
                assert.ok((<Expr.IMethodExpression>expr).parameters[0].type == Expr.ExpressionType.Lambda, 'Expected a lambda expression as first argument')
            })

            it('should return a method expression for nested methods', () => {
                expr = visitor.parseOData('concat(FCode, tolower(FText)) eq \'2TEST\'')

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
                expr = visitor.parseLambda((str: string) => str.indexOf('a'))
                                
                if(expr.type == Expr.ExpressionType.Lambda) 
                    expr = (<Expr.ILambdaExpression>expr).expression

                assert.ok(expr.type == Expr.ExpressionType.Method, 'Expected a MethodExpression')
                assert.ok((<Expr.IMethodExpression>expr).name == 'indexOf', 'Expected method name \'indexOf\'')
                assert.ok((<Expr.IMethodExpression>expr).parameters.length == 1, 'Expected one argument')
                assert.ok((<Expr.IMethodExpression>expr).caller.type == Expr.ExpressionType.Identifier, 'Expected a identifier as caller')
            })

            it('should return a method expression when having lambda expression as argument', () => {
                expr = visitor.parseLambda((ar: Array<any>) => ar.every(a => true))
                                
                if(expr.type == Expr.ExpressionType.Lambda) 
                    expr = (<Expr.ILambdaExpression>expr).expression

                assert.ok(expr.type == Expr.ExpressionType.Method, 'Expected a MethodExpression')
                assert.ok((<Expr.IMethodExpression>expr).name == 'every', 'Expected method name \'indexOf\'')
                assert.ok((<Expr.IMethodExpression>expr).caller.type == Expr.ExpressionType.Identifier, 'Expected a identifier as caller')
                assert.ok((<Expr.IIdentifierExpression>(<Expr.IMethodExpression>expr).caller).name == 'ar', 'Expected name \'ar\' of identifier as caller')
                assert.ok((<Expr.IMethodExpression>expr).parameters.length == 1, 'Expected one argument')
                assert.ok((<Expr.IMethodExpression>expr).parameters[0].type == Expr.ExpressionType.Lambda, 'Expected a lambda expression as first argument')
            })

            it('should return a method expression for nested calls', () => {
                expr = visitor.parseLambda((str: string) => str.indexOf('a').toString())
                                
                if(expr.type == Expr.ExpressionType.Lambda) 
                    expr = (<Expr.ILambdaExpression>expr).expression

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