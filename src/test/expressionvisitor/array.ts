import * as assert from 'assert'
import * as Expr from '../../linq/peg/expressionvisitor'

describe('When using ExpressionVisitor', () => {
    let visitor: Expr.ExpressionVisitor,
        expr: Expr.IExpression


    describe('for array Lambda expression', () => {
        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor
        })

        it('it should handle toString', () => {
            assert.equal(visitor.parseLambda(() => ['yes', 'no']).toString(), '() => ["yes", "no"]')
            assert.equal(visitor.parseLambda(() => [1, 2+4, 4, 8]).toString(), '() => [1, 2 + 4, 4, 8]')
            assert.equal(visitor.parseLambda(() => [1, 2+4*4, 4, 8]).toString(), '() => [1, 2 + (4 * 4), 4, 8]')
        })
    })

})
