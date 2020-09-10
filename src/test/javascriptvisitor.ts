import * as assert from 'assert'
import * as Expr from './../linq/peg/expressionvisitor'
import { JavascriptVisitor } from './../linq/peg/javascriptvisitor'

describe('When using JavascriptVisitor', () => {
    let reducer: JavascriptVisitor,
        vars = { number: 5, string: 'abc', decimal: 5.50, date: new Date('2017-05-10T06:48:00Z'), object: { number: 7 } }

    beforeEach(() => {
        reducer = new JavascriptVisitor()
    })

    it('should evaluate a simple expression with binary operation', () => {
        let reduced = reducer.parseLambda(() => 2 + 3),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, 5)
    })

    it('should be able to do string operations at literal', () => {
        let reduced = reducer.parseLambda(() => 'ABC'.toLowerCase()),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, 'abc')
    })

    it('should be able to do string operations at variables', () => {
        let reduced = reducer.parseLambda((it) => it.string.toUpperCase()),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, 'ABC')
    })

    // it("should evaluate a expression with date as type", () => {
    //     let reduced = reducer.parseLambda((date) => date > this.date, new Date('2017-06-01Z')),
    //         expr = reducer.evaluate(reduced, vars);

    //     assert.equal(expr.type, Expr.ExpressionType.Literal);
    //     assert.equal((<Expr.LiteralExpression>expr).value, true);
    // })

})