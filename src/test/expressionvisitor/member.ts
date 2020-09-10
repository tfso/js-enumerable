import * as assert from 'assert'
import * as Expr from '../../linq/peg/expressionvisitor'

describe('When using ExpressionVisitor', () => {
    let visitor: Expr.ExpressionVisitor,
        expr: Expr.IExpression

    describe('for member Lambda expression', () => {
        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor
        })

        it('it should return a member expression', () => {
            expr = visitor.parseLambda((it) => it.num)
                                    
            if(expr.type == Expr.ExpressionType.Lambda) 
                expr = (<Expr.ILambdaExpression>expr).expression

            assert.ok(expr.type == Expr.ExpressionType.Member, 'Expected a MemberExpression')
            assert.ok((<Expr.IMemberExpression>expr).object.type == Expr.ExpressionType.Identifier, 'Expected a identifier as object')
            assert.ok((<Expr.IMemberExpression>expr).property.type == Expr.ExpressionType.Identifier, 'Expected a identifier as property')
        })

        it('it should return a member expression with array indexer', () => {
            expr = visitor.parseLambda((it) => it.ar[5])
                                    
            if(expr.type == Expr.ExpressionType.Lambda) 
                expr = (<Expr.ILambdaExpression>expr).expression

            assert.ok(expr.type == Expr.ExpressionType.Member, 'Expected a MemberExpression')
            assert.ok((<Expr.IMemberExpression>expr).object.type == Expr.ExpressionType.Identifier, 'Expected a identifier as object')
            assert.ok((<Expr.IMemberExpression>expr).property.type == Expr.ExpressionType.Index, 'Expected a index expression as property')
            assert.ok((<Expr.IIndexExpression>(<Expr.IMemberExpression>expr).property).object.type == Expr.ExpressionType.Identifier, 'Expected the object of index property is an identifier')
            assert.ok((<Expr.IIndexExpression>(<Expr.IMemberExpression>expr).property).index.type == Expr.ExpressionType.Literal, 'Expected the index of index property is a literal')
        })
    })
})
