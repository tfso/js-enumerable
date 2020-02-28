import * as assert from 'assert'
import * as Expr from './../linq/peg/expressionvisitor'

describe('When using ExpressionVisitor', () => {
    let visitor: Expr.ExpressionVisitor,
        expr: Expr.IExpression

    describe('for binary', () => {

        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor
        })

        describe('equalization', () => {
            it('should compare for operation of addition that is 100% equal', () => {
                let a = visitor.visitLambda(() => 6 + 2)
                let b = visitor.visitLambda(() => 6 + 2)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of addition that is inverted', () => {
                let a = visitor.visitLambda(() => 6 + 2)
                let b = visitor.visitLambda(() => 2 + 6)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of subtraction that is 100% equal', () => {
                let a = visitor.visitLambda(() => 6 - 2)
                let b = visitor.visitLambda(() => 6 - 2)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of subtraction that is inverted', () => {
                let a = visitor.visitLambda(() => 6 - 2)
                let b = visitor.visitLambda(() => 2 - 6)

                assert.ok(a.equal(b) == false)
            })

            it('should compare for operation of multiplication that is 100% equal', () => {
                let a = visitor.visitLambda(() => 6 * 2)
                let b = visitor.visitLambda(() => 6 * 2)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of multiplication that is inverted', () => {
                let a = visitor.visitLambda(() => 6 * 2)
                let b = visitor.visitLambda(() => 2 * 6)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of division that is 100% equal', () => {
                let a = visitor.visitLambda(() => 6 / 2)
                let b = visitor.visitLambda(() => 6 / 2)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of division that is inverted', () => {
                let a = visitor.visitLambda(() => 6 / 2)
                let b = visitor.visitLambda(() => 2 / 6)

                assert.ok(a.equal(b) == false)
            })

            it('should compare for operation of modulus that is 100% equal', () => {
                let a = visitor.visitLambda(() => 6 % 2)
                let b = visitor.visitLambda(() => 6 % 2)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of modulus that is inverted', () => {
                let a = visitor.visitLambda(() => 6 % 2)
                let b = visitor.visitLambda(() => 2 % 6)

                assert.ok(a.equal(b) == false)
            })

            it('should compare for operation of and that is 100% equal', () => {
                let a = visitor.visitLambda(() => 6 & 2)
                let b = visitor.visitLambda(() => 6 & 2)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of and that is inverted', () => {
                let a = visitor.visitLambda(() => 6 & 2)
                let b = visitor.visitLambda(() => 2 & 6)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of or that is 100% equal', () => {
                let a = visitor.visitLambda(() => 6 | 2)
                let b = visitor.visitLambda(() => 6 | 2)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of or that is inverted', () => {
                let a = visitor.visitLambda(() => 6 | 2)
                let b = visitor.visitLambda(() => 2 | 6)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of exlusive or that is 100% equal', () => {
                let a = visitor.visitLambda(() => 6 ^ 2)
                let b = visitor.visitLambda(() => 6 ^ 2)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of exlusive or that is inverted', () => {
                let a = visitor.visitLambda(() => 6 ^ 2)
                let b = visitor.visitLambda(() => 2 ^ 6)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of right shift that is 100% equal', () => {
                let a = visitor.visitLambda(() => 6 >> 2)
                let b = visitor.visitLambda(() => 6 >> 2)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of right shift that is inverted', () => {
                let a = visitor.visitLambda(() => 6 >> 2)
                let b = visitor.visitLambda(() => 2 >> 6)

                assert.ok(a.equal(b) == false)
            })

            it('should compare for operation of left shift that is 100% equal', () => {
                let a = visitor.visitLambda(() => 6 << 2)
                let b = visitor.visitLambda(() => 6 << 2)

                assert.ok(a.equal(b) == true)
            })

            it('should compare for operation of left shift that is inverted', () => {
                let a = visitor.visitLambda(() => 6 << 2)
                let b = visitor.visitLambda(() => 2 << 6)

                assert.ok(a.equal(b) == false)
            })
        })

        describe('OData Expression', () => {
            it('should return a binary operation', () => {
                expr = visitor.visitOData('5 add 2')

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Addition, 'Expected a binary operation of addition')

                assert.ok((<Expr.IBinaryExpression>expr).left.type == Expr.ExpressionType.Literal, 'Expected a literal at left side')
                assert.ok((<Expr.IBinaryExpression>expr).right.type == Expr.ExpressionType.Literal, 'Expected a lteral at right side')
                assert.ok((<Expr.ILiteralExpression>(<Expr.IBinaryExpression>expr).left).value == 5, 'Expected number 5 at left side')
                assert.ok((<Expr.ILiteralExpression>(<Expr.IBinaryExpression>expr).right).value == 2, 'Expected number 2 at right side')
            })

            it('should handle binary operation for addition for negative number', () => {
                expr = visitor.visitOData('5 add -2')

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Addition, 'Expected a binary operation of addition')
                assert.ok((<Expr.ILiteralExpression>(<Expr.IBinaryExpression>expr).left).value == 5, 'Expected number 5 at left side')
                assert.ok((<Expr.ILiteralExpression>(<Expr.IBinaryExpression>expr).right).value == -2, 'Expected number -2 at right side')
            })

            it('should handle binary operation for addition for positive number', () => {
                expr = visitor.visitOData('5 add +2')

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Addition, 'Expected a binary operation of addition')
                assert.ok((<Expr.ILiteralExpression>(<Expr.IBinaryExpression>expr).left).value == 5, 'Expected number 5 at left side')
                assert.ok((<Expr.ILiteralExpression>(<Expr.IBinaryExpression>expr).right).value == 2, 'Expected number 2 at right side')
            })

            it('should handle binary operation for subtraction', () => {
                expr = visitor.visitOData('5 sub 2')

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Subtraction, 'Expected a binary operation of subtraction')
            })

            it('should handle binary operation for subtraction for negative number', () => {
                expr = visitor.visitOData('5 sub -2')

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Subtraction, 'Expected a binary operation of subtraction')
                assert.ok((<Expr.ILiteralExpression>(<Expr.IBinaryExpression>expr).left).value == 5, 'Expected number 5 at left side')
                assert.ok((<Expr.ILiteralExpression>(<Expr.IBinaryExpression>expr).right).value == -2, 'Expected number -2 at right side')
            })

            it('should handle binary operation for subtraction for positive number', () => {
                expr = visitor.visitOData('5 sub +2')

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Subtraction, 'Expected a binary operation of subtraction')
                assert.ok((<Expr.ILiteralExpression>(<Expr.IBinaryExpression>expr).left).value == 5, 'Expected number 5 at left side')
                assert.ok((<Expr.ILiteralExpression>(<Expr.IBinaryExpression>expr).right).value == 2, 'Expected number 2 at right side')
            })

            it('should handle binary operation for multiplication', () => {
                expr = visitor.visitOData('5 mul 2')

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Multiplication, 'Expected a binary operation of multiplication')
            })

            it('should handle binary operation for division', () => {
                expr = visitor.visitOData('5 div 2')

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Division, 'Expected a binary operation of division')
            })

            it('should handle binary operation for modulus', () => {
                expr = visitor.visitOData('5 mod 2')

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Modulus, 'Expected a binary operation of modulus')
            })

            it('should handle toString', () => {
                assert.equal(visitor.visitOData('5 add 2').toString(), '5 + 2')
                assert.equal(visitor.visitOData('5 add +2').toString(), '5 + 2')
                assert.equal(visitor.visitOData('5 add -2').toString(), '5 + -2')
            })
        })

        describe('Lambda Expression', () => {
            it('should return a binary operation', () => {
                expr = visitor.visitLambda(() => 5 + 2)

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).left.type == Expr.ExpressionType.Literal, 'Expected a literal at left side')
                assert.ok((<Expr.IBinaryExpression>expr).right.type == Expr.ExpressionType.Literal, 'Expected a lteral at right side')
                assert.ok((<Expr.ILiteralExpression>(<Expr.IBinaryExpression>expr).left).value == 5, 'Expected number 5 at left side')
                assert.ok((<Expr.ILiteralExpression>(<Expr.IBinaryExpression>expr).right).value == 2, 'Expected number 5 at right side')
            })

            it('should handle binary operation for addition', () => {
                expr = visitor.visitLambda(() => 5 + 2)

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Addition, 'Expected a binary operation of addition')
            })

            it('should handle binary operation for addition for negative number', () => {
                expr = visitor.visitLambda(() => 5 + -2)

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Addition, 'Expected a binary operation of addition')
                assert.ok((<Expr.IBinaryExpression>expr).right.type == Expr.ExpressionType.Literal, 'Expected a literal at right side of addition')
            })

            it('should handle binary operation for addition for positive number', () => {
                expr = visitor.visitLambda(() => 5 + +2)

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Addition, 'Expected a binary operation of addition')
                assert.ok((<Expr.IBinaryExpression>expr).right.type == Expr.ExpressionType.Literal, 'Expected a literal at right side of addition')
            })

            it('should handle binary operation for subtraction', () => {
                expr = visitor.visitLambda(() => 5 - 2)

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Subtraction, 'Expected a binary operation of subtraction')
            })

            it('should handle binary operation for subtraction for negative number', () => {
                expr = visitor.visitLambda(() => 5 - -2)

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Subtraction, 'Expected a binary operation of subtraction')
                assert.ok((<Expr.IBinaryExpression>expr).right.type == Expr.ExpressionType.Literal, 'Expected a literal at right side of addition')
            })

            it('should handle binary operation for subtraction for positive number', () => {
                expr = visitor.visitLambda(() => 5 - +2)

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Subtraction, 'Expected a binary operation of subtraction')
                assert.ok((<Expr.IBinaryExpression>expr).right.type == Expr.ExpressionType.Literal, 'Expected a literal at right side of addition')
            })

            it('should handle binary operation for multiplication', () => {
                expr = visitor.visitLambda(() => 5 * 2)

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Multiplication, 'Expected a binary operation of multiplication')
            })

            it('should handle binary operation for division', () => {
                expr = visitor.visitLambda(() => 5 / 2)

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Division, 'Expected a binary operation of division')
            })

            it('should handle binary operation for modulus', () => {
                expr = visitor.visitLambda(() => 5 % 2)

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Modulus, 'Expected a binary operation of modulus')
            })

            it('should handle binary operation for and', () => {
                expr = visitor.visitLambda(() => 5 & 2)

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.And, 'Expected a binary operation of and')
            })

            it('should handle binary operation for or', () => {
                expr = visitor.visitLambda(() => 5 | 2)

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Or, 'Expected a binary operation of or')
            })

            it('should handle binary operation for left shift', () => {
                expr = visitor.visitLambda(() => 5 << 2)

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.LeftShift, 'Expected a binary operation of left shift')
            })

            it('should handle binary operation for right shift', () => {
                expr = visitor.visitLambda(() => 5 >> 2)

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.RightShift, 'Expected a binary operation of right shift')
            })

            it('should handle binary operation for zero-fill right shift', () => {
                expr = visitor.visitLambda(() => 5 >>> 2)

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.RightShift, 'Expected a binary operation of right shift')
            })

            it('should handle binary operation for exlusive or', () => {
                expr = visitor.visitLambda(() => 5 ^ 2)

                assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
                assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.ExclusiveOr, 'Expected a binary operation of exclusive or')
            })

            it('should handle toString', () => {
                assert.equal(visitor.visitLambda(() => 5 + 2).toString(), '5 + 2')
                assert.equal(visitor.visitLambda(() => 5 + +2).toString(), '5 + 2')
                assert.equal(visitor.visitLambda(() => 5 + -2).toString(), '5 + -2')
                assert.equal(visitor.visitLambda(() => 5 - 2).toString(), '5 - 2')
                assert.equal(visitor.visitLambda(() => 5 - +2).toString(), '5 - 2')
                assert.equal(visitor.visitLambda(() => 5 - -2).toString(), '5 - -2')

                assert.equal(visitor.visitLambda(() => 5 + 2 * 4).toString(), '5 + (2 * 4)')
                assert.equal(visitor.visitLambda(() => (5 + 2) * 4).toString(), '(5 + 2) * 4')
            })
        })
    })
})
