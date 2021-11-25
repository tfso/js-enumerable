import * as assert from 'assert'

import { isLambdaExpression, isBinaryExpression, isMemberExpression, isIdentifierExpression, isLogicalExpression } from '../linq/peg/expression'
import { isLiteralExpression } from '../linq/peg/expression/expression'

import * as Expr from '../linq/peg/expressionvisitor'
import { RewriteVisitor } from '../linq/peg/rewritevisitor'

describe('When using Rewrite for ExpressionVisitor', () => {
    let reducer: RewriteVisitor,
        vars = { number: 5, array: [8, 7, 6, 5, 4, 3, 2, 1]}

    beforeEach(() => {
        reducer = new RewriteVisitor()
    })

    it('should be able to rewrite member name', () => {
        const rewrite = new RewriteVisitor({ from: 'mynumber', to: 'number' })
        const lambda = rewrite.parseLambda('(it) => it.mynumber + 3')

        chai.expect(isLambdaExpression(lambda)).to.be.true

        const binaryExpr = isLambdaExpression(lambda) && isBinaryExpression(lambda.expression) ? lambda.expression : undefined
        const memberExpr = isMemberExpression(binaryExpr?.left) ? binaryExpr?.left : undefined
        const identifierExpr = isIdentifierExpression(memberExpr?.property) ? memberExpr?.property : undefined

        chai.expect(identifierExpr?.name).to.equal('number')
    })

    it('should be able to rewrite member name and corresponding value', () => {
        const rewrite = new RewriteVisitor({ from: 'mynumber', to: 'number', rewriteValue: (value) => value * 2 })
        const lambda = rewrite.parseLambda('(it) => it.mynumber == 2.5')

        chai.expect(isLambdaExpression(lambda)).to.be.true

        const logicalExpr = isLambdaExpression(lambda) && isLogicalExpression(lambda.expression) ? lambda.expression : undefined
        const memberExpr = isMemberExpression(logicalExpr?.left) ? logicalExpr?.left : undefined
        const identifierExpr = isIdentifierExpression(memberExpr?.property) ? memberExpr?.property : undefined
    
        chai.expect(identifierExpr?.name).to.equal('number')

        const literalExpr = isLiteralExpression(logicalExpr?.right) ? logicalExpr?.right : undefined

        chai.expect(literalExpr?.value).to.equal(2.5 * 2)
    })

    it('should be able to rewrite member name and corresponding value by visiting', () => {
        const expression = new Expr.ExpressionVisitor().parseLambda('(it) => it.mynumber == 2.5')
        const rewrite = new RewriteVisitor({ from: 'mynumber', to: 'number', rewriteValue: (value) => value * 2 })
        const lambda = rewrite.visit(expression)

        chai.expect(isLambdaExpression(lambda)).to.be.true

        const logicalExpr = isLambdaExpression(lambda) && isLogicalExpression(lambda.expression) ? lambda.expression : undefined
        const memberExpr = isMemberExpression(logicalExpr?.left) ? logicalExpr?.left : undefined
        const identifierExpr = isIdentifierExpression(memberExpr?.property) ? memberExpr?.property : undefined
    
        chai.expect(identifierExpr?.name).to.equal('number')

        const literalExpr = isLiteralExpression(logicalExpr?.right) ? logicalExpr?.right : undefined

        chai.expect(literalExpr?.value).to.equal(2.5 * 2)
    })

    it('should be able to rewrite member with scoping', () => {
        const rewrite = new RewriteVisitor({ from: 'it.mynumber', to: 'number', rewriteValue: (value) => value * 2 })
        const lambda = rewrite.parseLambda('(it) => it.it.mynumber == 2.5')

        chai.expect(isLambdaExpression(lambda)).is.not.undefined

        const logicalExpr = isLambdaExpression(lambda) && isLogicalExpression(lambda.expression) ? lambda.expression : undefined
        const memberExpr = isMemberExpression(logicalExpr?.left) ? logicalExpr?.left : undefined
        const identifierExpr = isIdentifierExpression(memberExpr?.property) ? memberExpr?.property : undefined

        chai.expect(identifierExpr?.name).to.equal('number')

        const literalExpr = isLiteralExpression(logicalExpr?.right) ? logicalExpr?.right : undefined

        chai.expect(literalExpr?.value).to.equal(2.5 * 2)
    })

    it('should not be able to rewrite member with scoping using wrong scope', () => {
        const rewrite = new RewriteVisitor({ from: 'it.mynumber', to: 'number', rewriteValue: (value) => value * 2 })
        const lambda = rewrite.parseLambda('(it) => it.mynumber == 2.5')

        chai.expect(isLambdaExpression(lambda)).is.not.undefined

        const logicalExpr = isLambdaExpression(lambda) && isLogicalExpression(lambda.expression) ? lambda.expression : undefined
        const memberExpr = isMemberExpression(logicalExpr?.left) ? logicalExpr?.left : undefined
        const identifierExpr = isIdentifierExpression(memberExpr?.property) ? memberExpr?.property : undefined

        chai.expect(identifierExpr?.name).to.equal('mynumber')

        const literalExpr = isLiteralExpression(logicalExpr?.right) ? logicalExpr?.right : undefined

        chai.expect(literalExpr?.value).to.equal(2.5)
    })

    it('should not be able to rewrite member with scoping using correct scope', () => {
        const rewrite = new RewriteVisitor({ from: 'it.mynumber', to: 'number', rewriteValue: (value) => value * 2 })
        const lambda = rewrite.parseLambda('() => it.mynumber == 2.5')

        chai.expect(isLambdaExpression(lambda)).to.not.be.undefined

        const logicalExpr = isLambdaExpression(lambda) && isLogicalExpression(lambda.expression) ? lambda.expression : undefined
        const identifierExpr = isIdentifierExpression(logicalExpr?.left) ? logicalExpr?.left : undefined

        chai.expect(identifierExpr?.name).to.equal('number')

        const literalExpr = isLiteralExpression(logicalExpr?.right) ? logicalExpr?.right : undefined

        chai.expect(literalExpr?.value).to.equal(5)
    })

    it('should be able to rewrite member using expression as string', () => {
        const rewrite = new RewriteVisitor({ from: 'mynumber', to: 'number', rewriteValue: (value) => value * 2 })
        const expression = rewrite.parseLambda('mynumber == 2.5')

        const logicalExpr = isLogicalExpression(expression) ? expression : undefined
        const identifierExpr = isIdentifierExpression(logicalExpr?.left) ? logicalExpr?.left : undefined
    
        chai.expect(identifierExpr?.name).to.equal('number')

        const literalExpr = isLiteralExpression(logicalExpr?.right) ? logicalExpr?.right : undefined

        chai.expect(literalExpr?.value).to.equal(2.5 * 2)
    })

    
})
