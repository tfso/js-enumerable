import * as assert from 'assert'
import * as Expr from '../../linq/peg/expressionvisitor'

describe('When using ExpressionVisitor', () => {
    let visitor: Expr.ExpressionVisitor,
        expr: Expr.IExpression

    describe('with input parameters', () => {
        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor
        })

        it('it should handle a simple binary operator', () => {
            expr = visitor.parseLambda((table) => 5 + 2)

            assert.ok(expr.type == Expr.ExpressionType.Binary, 'Expected a BinaryExpression')
        })

        it('it should handle a expression using input parameter', () => {

            expr = visitor.parseLambda((table: any) => table.number == 5 + 2)

            assert.ok(expr.type == Expr.ExpressionType.Logical, 'Expected a LogicalExpression')
            assert.ok((<Expr.ILogicalExpression>expr).operator == Expr.LogicalOperatorType.Equal, 'Expected a logical expression with operator equal')
            assert.ok((<Expr.ILogicalExpression>expr).left.type == Expr.ExpressionType.Member, 'Expected a member expression at left side')
            assert.ok((<Expr.ILogicalExpression>expr).right.type == Expr.ExpressionType.Binary, 'Expected a binary expression at right side')
            assert.ok((<Expr.IMemberExpression>(<Expr.ILogicalExpression>expr).left).object.type == Expr.ExpressionType.Identifier, 'Expected that member object of left side has a member as a identifier')
            assert.ok((<Expr.IMemberExpression>(<Expr.ILogicalExpression>expr).left).property.type == Expr.ExpressionType.Identifier, 'Expected that member property of left side has a member as a identifier')
            assert.ok((<Expr.IIdentifierExpression>(<Expr.IMemberExpression>(<Expr.ILogicalExpression>expr).left).object).name == 'table', 'Expected that member object of left side has a member as a identifier with name \'table\'')
            assert.ok((<Expr.IIdentifierExpression>(<Expr.IMemberExpression>(<Expr.ILogicalExpression>expr).left).property).name == 'number', 'Expected that member property of left side has a member as a identifier with name \'number\'')
        })
    })
})