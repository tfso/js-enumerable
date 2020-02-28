import * as assert from 'assert'
import * as Expr from './../linq/peg/expressionvisitor'

describe('When using ExpressionVisitor', () => {
    let visitor: Expr.ExpressionVisitor,
        expr: Expr.IExpression

    describe('for unary Lambda expression', () => {
        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor
        })

        it('it should return a unary operation', () => {
            expr = visitor.visitLambda((a: number) => !a)

            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression')
            assert.ok((<Expr.IUnaryExpression>expr).argument.type == Expr.ExpressionType.Identifier, 'Expected a identifier as argument')
            assert.ok((<Expr.IIdentifierExpression>(<Expr.IUnaryExpression>expr).argument).name == 'a', 'Expected identifier \'a\' as argument')
        })

        it('it should handle unary operation for negative', () => {
            expr = visitor.visitLambda((a: number) => -a)

            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression')
            assert.ok((<Expr.IUnaryExpression>expr).operator == Expr.UnaryOperatorType.Negative, 'Expected a unary operation for negative')
            assert.ok((<Expr.IUnaryExpression>expr).affix == Expr.UnaryAffixType.Prefix, 'Expected unary operation to be prefixed')
        })

        it('it should handle unary operation for positive', () => {
            expr = visitor.visitLambda((a: number) => +a)

            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression')
            assert.ok((<Expr.IUnaryExpression>expr).operator == Expr.UnaryOperatorType.Positive, 'Expected a unary operation for positive')
            assert.ok((<Expr.IUnaryExpression>expr).affix == Expr.UnaryAffixType.Prefix, 'Expected unary operation to be prefixed')
        })

        it('it should handle unary operation for invert', () => {
            expr = visitor.visitLambda((a: number) => !a)

            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression')
            assert.ok((<Expr.IUnaryExpression>expr).operator == Expr.UnaryOperatorType.Invert, 'Expected a unary operation for inverting')
            assert.ok((<Expr.IUnaryExpression>expr).affix == Expr.UnaryAffixType.Prefix, 'Expected unary operation to be prefixed')
        })

        it('it should handle unary operation for complement', () => {
            expr = visitor.visitLambda((a: number) => ~a)

            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression')
            assert.ok((<Expr.IUnaryExpression>expr).operator == Expr.UnaryOperatorType.Complement, 'Expected a unary operation for complement')
            assert.ok((<Expr.IUnaryExpression>expr).affix == Expr.UnaryAffixType.Prefix, 'Expected unary operation to be prefixed')
        })

        it('it should handle unary operation for prefixed increment', () => {
            expr = visitor.visitLambda((a: number) => ++a)

            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression')
            assert.ok((<Expr.IUnaryExpression>expr).operator == Expr.UnaryOperatorType.Increment, 'Expected a unary operation for increment')
            assert.ok((<Expr.IUnaryExpression>expr).affix == Expr.UnaryAffixType.Prefix, 'Expected unary operation to be prefixed')
        })

        it('it should handle unary operation for postfixed increment', () => {
            expr = visitor.visitLambda((a: number) => a++)

            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression')
            assert.ok((<Expr.IUnaryExpression>expr).operator == Expr.UnaryOperatorType.Increment, 'Expected a unary operation for increment')
            assert.ok((<Expr.IUnaryExpression>expr).affix == Expr.UnaryAffixType.Postfix, 'Expected unary operation to be prefixed')
        })

        it('it should handle unary operation for prefixed decrement', () => {
            expr = visitor.visitLambda((a: number) => --a)

            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression')
            assert.ok((<Expr.IUnaryExpression>expr).operator == Expr.UnaryOperatorType.Decrement, 'Expected a unary operation for decrement')
            assert.ok((<Expr.IUnaryExpression>expr).affix == Expr.UnaryAffixType.Prefix, 'Expected unary operation to be prefixed')
        })

        it('it should handle unary operation for postfixed decrement', () => {
            expr = visitor.visitLambda((a: number) => a--)

            assert.ok(expr.type == Expr.ExpressionType.Unary, 'Expected a UnaryExpression')
            assert.ok((<Expr.IUnaryExpression>expr).operator == Expr.UnaryOperatorType.Decrement, 'Expected a unary operation for decrement')
            assert.ok((<Expr.IUnaryExpression>expr).affix == Expr.UnaryAffixType.Postfix, 'Expected unary operation to be prefixed')
        })

        it('it should handle unary operation increment in binary operation', () => {
            expr = visitor.visitLambda((a: number) => 5 - a++)

            assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
            assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Subtraction, 'Expected binary operation for subtraction')
            assert.ok((<Expr.IBinaryExpression>expr).left.type == Expr.ExpressionType.Literal, 'Expected a literal expression at left side')
            assert.ok((<Expr.IBinaryExpression>expr).right.type == Expr.ExpressionType.Unary, 'Expected a unary expression at right side')
            assert.ok((<Expr.IUnaryExpression>(<Expr.IBinaryExpression>expr).right).operator == Expr.UnaryOperatorType.Increment, 'Expected a unary operation to be increment')
            assert.ok((<Expr.IUnaryExpression>(<Expr.IBinaryExpression>expr).right).argument.type == Expr.ExpressionType.Identifier, 'Expected a unary operation to have an argument as Identifier')
        })

        it('it should handle unary operation decrement in binary operation', () => {
            expr = visitor.visitLambda((a: number) => 5 - a--)

            assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
            assert.ok((<Expr.IBinaryExpression>expr).operator == Expr.BinaryOperatorType.Subtraction, 'Expected binary operation for subtraction')
            assert.ok((<Expr.IBinaryExpression>expr).left.type == Expr.ExpressionType.Literal, 'Expected a literal expression at left side')
            assert.ok((<Expr.IBinaryExpression>expr).right.type == Expr.ExpressionType.Unary, 'Expected a unary expression at right side')
            assert.ok((<Expr.IUnaryExpression>(<Expr.IBinaryExpression>expr).right).operator == Expr.UnaryOperatorType.Decrement, 'Expected a unary operation to be decrement')
            assert.ok((<Expr.IUnaryExpression>(<Expr.IBinaryExpression>expr).right).argument.type == Expr.ExpressionType.Identifier, 'Expected a unary operation to have an argument as Identifier')
        })

        it('it should handle toString', () => {
            assert.equal(visitor.visitLambda((a: number) => 5 - a--).toString(), '5 - a--')
            assert.equal(visitor.visitLambda((a: number) => !a).toString(), '!a')
            assert.equal(visitor.visitLambda((a: number) => -a).toString(), '-a')
            assert.equal(visitor.visitLambda((a: number) => +a).toString(), '+a')
            assert.equal(visitor.visitLambda((a: number) => ~a).toString(), '~a')
            assert.equal(visitor.visitLambda((a: number) => ++a).toString(), '++a')
            assert.equal(visitor.visitLambda((a: number) => --a).toString(), '--a')
            assert.equal(visitor.visitLambda((a: number) => a++).toString(), 'a++')
            assert.equal(visitor.visitLambda((a: number) => a--).toString(), 'a--')
        })
    })
})
