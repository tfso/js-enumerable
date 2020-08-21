import * as assert from 'assert'
import * as Expr from './../linq/peg/expressionvisitor'
import { ODataVisitor } from './../linq/peg/odatavisitor'

describe('When using OData for ExpressionVisitor', () => {
    let reducer: ODataVisitor,
        vars = { 
            number: 5, 
            stringhavingdate: '2018-05-30Z', 
            string: 'abc', 
            decimal: 5.50, 
            dateonly: new Date('2020-01-28Z'), 
            date: new Date('2017-05-10T06:48:00Z'), 
            object: { number: 7 },
            array: [45, 13, 21, 38, 17],
            arrayobject: [
                { name: 'A', age: 45 },
                { name: 'T', age: 13 },
                { name: 'K', age: 21 },
                { name: 'D', age: 38 },
                { name: 'Q', age: 17 }
            ]
        }

    beforeEach(() => {
        reducer = new ODataVisitor()
    })

    it('should evaluate a simple expression with binary operation', () => {
        let reduced = reducer.parseOData('2 add 3'),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, 5)
    })

    it('should evaluate a simple expression with binary operation and identifier', () => {
        let reduced = reducer.parseOData('2 add number'),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, 7)
    })

    it('should evaluate a expression with binary operation and method \'length\' with Identifier Expression', () => {
        let reduced = reducer.parseOData('2 add length(string)'),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, 5)
    })

    it('should evaluate a expression with binary operation and method \'floor\' with Identifier Expression', () => {
        let reduced = reducer.parseOData('2 add floor(decimal)'),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, 7)
    })

    it('should evaluate a expression with binary operation and method \'ceiling\' with Identifier Expression', () => {
        let reduced = reducer.parseOData('2 add ceiling(decimal)'),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, 8)
    })

    it('should evaluate a expression with binary operation and method \'ceiling\' with Literal Expression', () => {
        let reduced = reducer.parseOData('2 add ceiling(5.50)'),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, 8)
    })

    it('should evaluate a expression with contains', () => {
        let reduced = reducer.parseOData('contains(string, \'bc\')'),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, true)
    })

    it('should evaluate a expression with contains', () => {
        let reduced = reducer.parseOData('contains(stringhavingdate, \'bc\')'),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, false)
    })    

    it('should evaluate a expression with date as type (v4)', () => {
        let reduced = reducer.parseOData('date ge 2017-05-01Z'),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, true)
    })

    it('should evaluate a expression with date as type for lesser (v4)', () => {
        let reduced = reducer.parseOData('date le 2017-05-20Z'),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, true)
    })

    it('should evaluate a expression with datetime as type (v4)', () => {
        let reduced = reducer.parseOData('date ge 2017-05-01T12:00:00Z'),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, true)
    })

    it('should evaluate a expression with date as type for greater and equal', () => {
        let reduced = reducer.parseOData('dateonly ge 2020-01-28Z'),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, true)
    })

    it('should evaluate a expression with date as type for equal', () => {
        let reduced = reducer.parseOData('dateonly eq 2020-01-28Z'),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, true)
    })


    it('should evaluate a expression with date as string', () => {
        let reduced = reducer.parseOData('date ge datetime\'2017-05-01Z\''),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, true)
    })

    it('should evaluate a expression with datetime as string', () => {
        let reduced = reducer.parseOData('date ge datetime\'2017-05-01T12:00:00Z\''),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, true)
    })

    it('should evaluate a expression with binary operation and method \'year\' with a Date type', () => {
        let reduced = reducer.parseOData('year(date) sub year(2016-05-01)'),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, 1)
    })

    it('should evaluate a complex expression with binary operation and method \'year\' with a Date type', () => {
        let reduced = reducer.parseOData('(number add 2012) sub year(2016-05-01)'),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, 1)
    })

    it('should evaluate a complex expression that is using casing', () => {
        let reduced = reducer.parseOData('(number Add 2012) SUB year(2016-05-01)'),
            expr = reducer.evaluate(reduced, vars)

        assert.equal(expr.type, Expr.ExpressionType.Literal)
        assert.equal((<Expr.LiteralExpression>expr).value, 1)
    })

    it('should evaluate a complex expression with binary operation', () => {

        let reduced = reducer.parseOData('number ge 5 and number lt 10'),
            expr = reducer.evaluate(reduced, vars)

        assert.ok(expr.type == Expr.ExpressionType.Literal, 'Expected a literal')
        assert.ok((<Expr.ILiteralExpression>expr).value == true, 'Expected a literal of value true')
    })

    it('should evaluate a complex expression with binary operation using object', () => {

        let reduced = reducer.parseOData('object/number ge 7 and object/number lt 10 and number eq 5'),
            expr = reducer.evaluate(reduced, vars)

        assert.ok(expr.type == Expr.ExpressionType.Literal, 'Expected a literal')
        assert.ok((<Expr.ILiteralExpression>expr).value == true, 'Expected a literal of value true')
    })
})