import * as assert from 'assert'
import * as Expr from '../../linq/peg/expressionvisitor'

describe('When using ExpressionVisitor', () => {
    let visitor: Expr.ExpressionVisitor,
        expr: Expr.IExpression

    describe('for object Lambda expression', () => {
        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor
        })

        it('it should handle toString', () => {
            assert.equal(visitor.parseLambda(() => <object>{ 'key': 123, 'value': 'abc' }).toString(), '() => {"key": 123, "value": "abc"}')
            assert.equal(visitor.parseLambda(() => <object>{ key: 123, value: 'abc' }).toString(), '() => {"key": 123, "value": "abc"}')
            assert.equal(visitor.parseLambda(() => <object>{ 0: 123, 1: 'abc' }).toString(), '() => {"0": 123, "1": "abc"}')
        })
    })
})
