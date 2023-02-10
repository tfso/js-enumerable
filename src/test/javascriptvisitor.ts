import * as assert from 'assert'
import * as Expr from './../linq/peg/expressionvisitor'
import { JavascriptVisitor } from './../linq/peg/javascriptvisitor'

describe('When using JavascriptVisitor', () => {
    let reducer: JavascriptVisitor,
        vars = { 
            number: 5, 
            string: 'abc', 
            decimal: 5.50, 
            date: new Date('2017-05-10T06:48:00Z'), 
            object: { 
                number: 7 
            },
            array: [5, 45, 13, 21, 38, 17],
            arraystring: ['qwe', 'edc', 'abc', 'lol'],
            arrayobject: [
                { name: 'A', age: 45 },
                { name: 'T', age: 13 },
                { name: 'K', age: 21 },
                { name: 'D', age: 38 },
                { name: 'Q', age: 17 }
            ]
        }

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

    it('should evaluate in operator using constant with primary array where it is true', () => {
        let reduced = reducer.parseLambda(it => it.array.includes(13)),
            expr = reducer.evaluate(reduced, vars)

        assert.ok(expr.type == Expr.ExpressionType.Literal, 'Expected a literal')
        assert.ok((<Expr.ILiteralExpression>expr).value == true, 'Expected a literal of value true')
    })

    it('should evaluate in operator using variable with primary array where it is true', () => {
        let reduced = reducer.parseLambda(it => it.array.includes(it.number)),
            expr = reducer.evaluate(reduced, vars)

        assert.ok(expr.type == Expr.ExpressionType.Literal, 'Expected a literal')
        assert.ok((<Expr.ILiteralExpression>expr).value == true, 'Expected a literal of value true')
    })

    it('should evaluate in operator using variable with number array where it is true', () => {
        let reduced = reducer.parseLambda(it => [1,3,5,7].includes(it.number)),
            expr = reducer.evaluate(reduced, vars)

        assert.ok(expr.type == Expr.ExpressionType.Literal, 'Expected a literal')
        assert.ok((<Expr.ILiteralExpression>expr).value == true, 'Expected a literal of value true')
    })

    it('should evaluate in operator using variable with complex array where it is true', () => {
        let reduced = reducer.parseLambda(`it => [1,3,3+2,7].includes(it.number)`),
            expr = reducer.evaluate(reduced, vars)

        assert.ok(expr.type == Expr.ExpressionType.Literal, 'Expected a literal')
        assert.ok((<Expr.ILiteralExpression>expr).value == true, 'Expected a literal of value true')
    })

    it('should evaluate in operator using variable with number array where it is false', () => {
        let reduced = reducer.parseLambda(it => [1,2,4,8].includes(it.number)),
            expr = reducer.evaluate(reduced, vars)

        assert.ok(expr.type == Expr.ExpressionType.Literal, 'Expected a literal')
        assert.ok((<Expr.ILiteralExpression>expr).value == false, 'Expected a literal of value false')
    })

    // it("should evaluate a expression with date as type", () => {
    //     let reduced = reducer.parseLambda((date) => date > this.date, new Date('2017-06-01Z')),
    //         expr = reducer.evaluate(reduced, vars);

    //     assert.equal(expr.type, Expr.ExpressionType.Literal);
    //     assert.equal((<Expr.LiteralExpression>expr).value, true);
    // })

})