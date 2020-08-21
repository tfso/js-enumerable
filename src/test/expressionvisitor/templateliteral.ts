import * as assert from 'assert'
import * as Expr from '../../linq/peg/expressionvisitor'

describe('When using ExpressionVisitor', () => {
    let visitor: Expr.ExpressionVisitor,
        expr: Expr.IExpression

    describe('for template literal Lambda expression', () => {
        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor
        })

        it('it should handle toString', () => {
            let expr = visitor.parseLambda(() => `My number is ${5} and the next is ${5+1}`)
            
            assert.equal(expr.toString(), '`My number is ${5} and the next is ${5 + 1}`')
        })
    })
})
