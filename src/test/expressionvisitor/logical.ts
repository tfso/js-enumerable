import * as assert from 'assert'
import * as Expr from '../../linq/peg/expressionvisitor'

describe('When using ExpressionVisitor', () => {
    let visitor: Expr.ExpressionVisitor,
        expr: Expr.IExpression

    describe('for logical', () => {
        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor
        })

        describe('equalization', () => {
            it('should compare for operation of and that is 100% equal', () => {
                let a = visitor.visitLambda(() => true && false)
                let b = visitor.visitLambda(() => true && false)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of and that is inverted', () => {
                let a = visitor.visitLambda(() => true && false)
                let b = visitor.visitLambda(() => false && true)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of or that is 100% equal', () => {
                let a = visitor.visitLambda(() => true || false)
                let b = visitor.visitLambda(() => true || false)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of or that is inverted', () => {
                let a = visitor.visitLambda(() => true || false)
                let b = visitor.visitLambda(() => false || true)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of equal that is 100% equal', () => {
                let a = visitor.visitLambda(() => <number>6 == <number>2)
                let b = visitor.visitLambda(() => <number>6 == <number>2)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of equal that is inverted', () => {
                let a = visitor.visitLambda(() => <number>6 == <number>2)
                let b = visitor.visitLambda(() => <number>2 == <number>6)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of not equal that is 100% equal', () => {
                let a = visitor.visitLambda(() => <number>6 != <number>2)
                let b = visitor.visitLambda(() => <number>6 != <number>2)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of not equal that is inverted', () => {
                let a = visitor.visitLambda(() => <number>6 != <number>2)
                let b = visitor.visitLambda(() => <number>2 != <number>6)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of lesser that is 100% equal', () => {
                let a = visitor.visitLambda(() => <number>6 < <number>2)
                let b = visitor.visitLambda(() => <number>6 < <number>2)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of lesser that is inverted', () => {
                let a = visitor.visitLambda(() => <number>6 < <number>2)
                let b = visitor.visitLambda(() => <number>2 < <number>6)

                assert.ok(a.equal(b) != true)
            })

            it('should compare for operation of lesser that is inverted but 100% equal', () => {
                let a = visitor.visitLambda(() => <number>6 < <number>2)
                let b = visitor.visitLambda(() => <number>2 > <number>6)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of greater that is 100% equal', () => {
                let a = visitor.visitLambda(() => <number>6 > <number>2)
                let b = visitor.visitLambda(() => <number>6 > <number>2)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of greater that is inverted', () => {
                let a = visitor.visitLambda(() => <number>6 > <number>2)
                let b = visitor.visitLambda(() => <number>2 > <number>6)

                assert.ok(a.equal(b) != true)
            })

            it('should compare for operation of greater that is inverted but 100% equal', () => {
                let a = visitor.visitLambda(() => <number>6 > <number>2)
                let b = visitor.visitLambda(() => <number>2 < <number>6)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of lesser or equal that is 100% equal', () => {
                let a = visitor.visitLambda(() => <number>6 <= <number>2)
                let b = visitor.visitLambda(() => <number>6 <= <number>2)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of lesser or equal that is inverted', () => {
                let a = visitor.visitLambda(() => <number>6 <= <number>2)
                let b = visitor.visitLambda(() => <number>2 <= <number>6)

                assert.ok(a.equal(b) != true)
            })

            it('should compare for operation of lesser or equal that is inverted but 100% equal', () => {
                let a = visitor.visitLambda(() => <number>6 <= <number>2)
                let b = visitor.visitLambda(() => <number>2 >= <number>6)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of greater or equal that is 100% equal', () => {
                let a = visitor.visitLambda(() => <number>6 >= <number>2)
                let b = visitor.visitLambda(() => <number>6 >= <number>2)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of greater or equal that is inverted', () => {
                let a = visitor.visitLambda(() => <number>6 >= <number>2)
                let b = visitor.visitLambda(() => <number>2 >= <number>6)

                assert.ok(a.equal(b) != true)
            })

            it('should compare for operation of greater or equal that is inverted but 100% equal', () => {
                let a = visitor.visitLambda(() => <number>6 >= <number>2)
                let b = visitor.visitLambda(() => <number>2 <= <number>6)

                assert.ok(a.equal(b) == true)
            })
        })

        describe('OData expression', () => {
            it('should return a logical operation', () => {
                expr = visitor.visitOData('5 gt 2 and 2 lt 5')

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.IBinaryExpression>expr).left.type == Expr.ExpressionType.Logical, 'Expected a logical expression at left side')
                assert.ok((<Expr.IBinaryExpression>expr).right.type == Expr.ExpressionType.Logical, 'Expected a logical expression at right side')
                assert.ok((<Expr.ILogicalExpression>(<Expr.IBinaryExpression>expr).left).operator == Expr.LogicalOperatorType.Greater, 'Expected a binary operation of greather than at left side')
                assert.ok((<Expr.ILogicalExpression>(<Expr.IBinaryExpression>expr).right).operator == Expr.LogicalOperatorType.Lesser, 'Expected a binary operation of lesser than at right side')
            })

            it('should handle logical operation for and', () => {
                expr = visitor.visitOData('5 gt 2 and 2 lt 5')

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.And, 'Expected a binary operation of and')            
            })

            it('should handle logical operation for or', () => {
                expr = visitor.visitOData('5 gt 2 or 2 lt 5')

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.Or, 'Expected a binary operation of or')
            })

            it('should handle logical operation for equal', () => {
                expr = visitor.visitOData('5 eq 2')

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.Equal, 'Expected a binary operation of equal')
            })

            it('should handle logical operation for not equal', () => {
                expr = visitor.visitOData('5 ne 2')

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.NotEqual, 'Expected a binary operation of not equal')
            })

            it('should handle logical operation for greater than', () => {
                expr = visitor.visitOData('5 gt 2')

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.Greater, 'Expected a binary operation of greather than')
            })

            it('should handle logical operation for greater or equal than', () => {
                expr = visitor.visitOData('5 ge 2')

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.GreaterOrEqual, 'Expected a binary operation of greater or equal than')
            })

            it('should handle logical operation for lesser', () => {
                expr = visitor.visitOData('5 lt 2')

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.Lesser, 'Expected a binary operation of lesser')
            })

            it('should handle logical operation for lesser and equal', () => {
                expr = visitor.visitOData('5 le 2')

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.LesserOrEqual, 'Expected a binary operation of lesser or equal than')
            })
        })

        describe('Lambda expression', () => {
            it('should return a logical operation', () => {
                expr = visitor.visitLambda(() => 5 && 2)

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.IBinaryExpression>expr).left.type == Expr.ExpressionType.Literal, 'Expected a literal at left side')
                assert.ok((<Expr.IBinaryExpression>expr).right.type == Expr.ExpressionType.Literal, 'Expected a lteral at right side')
                assert.ok((<Expr.ILiteralExpression>(<Expr.IBinaryExpression>expr).left).value == 5, 'Expected number 5 at left side')
                assert.ok((<Expr.ILiteralExpression>(<Expr.IBinaryExpression>expr).right).value == 2, 'Expected number 5 at right side')
            })

            it('should handle logical operation for and', () => {
                expr = visitor.visitLambda(() => 5 && 2)

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.And, 'Expected a binary operation of and')
            })

            it('should handle logical operation for or', () => {
                expr = visitor.visitLambda(() => 5 || 2)

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.Or, 'Expected a binary operation of or')
            })

            it('should handle logical operation for equal', () => {
                expr = visitor.visitLambda(() => <number>5 == <number>2)

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.Equal, 'Expected a binary operation of equal')
            })

            it('should handle logical operation for not equal', () => {
                expr = visitor.visitLambda(() => <number>5 != <number>2)

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.NotEqual, 'Expected a binary operation of not equal')
            })

            it('should handle logical operation for greater than', () => {
                expr = visitor.visitLambda(() => 5 > 2)

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.Greater, 'Expected a binary operation of greather than')
            })

            it('should handle logical operation for greater or equal than', () => {
                expr = visitor.visitLambda(() => 5 >= 2)

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.GreaterOrEqual, 'Expected a binary operation of greater or equal than')
            })

            it('should handle logical operation for lesser', () => {
                expr = visitor.visitLambda(() => 5 < 2)

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.Lesser, 'Expected a binary operation of lesser')
            })

            it('should handle logical operation for lesser and equal', () => {
                expr = visitor.visitLambda(() => 5 <= 2)

                assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
                assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.LesserOrEqual, 'Expected a binary operation of lesser or equal than')
            })

            it('it should handle toString', () => {
                assert.equal(visitor.visitLambda(() => true && true).toString(), '(true && true)')
                assert.equal(visitor.visitLambda(() => false || true && true).toString(), 'false || (true && true)')
                assert.equal(visitor.visitLambda(() => false && true || true && true).toString(), '(false && true) || (true && true)')
            })
        })
    })
})
