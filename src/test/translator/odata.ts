import * as assert from 'assert'
import * as Expr from '../../linq/peg/expressionvisitor'
import { ODataTranslator } from '../../linq/peg/translator/odatatranslator'

describe('When using Translator', () => {
    let visitor: Expr.ExpressionVisitor,
        translator: ODataTranslator

    describe('for OData', () => {
        beforeEach(() => {
            visitor = new Expr.ExpressionVisitor
            translator = new ODataTranslator()
        })

        it('should rewrite simple javascript to OData', () => {
            let expr = visitor.parseLambda((num: number) => num + 5 > 40 && num == 38)

            if(expr.type == Expr.ExpressionType.Lambda)
                expr = (<Expr.ILambdaExpression>expr).expression

            let odata = translator.visit(expr)

            chai.expect(odata).to.equal('((num add 5) gt 40) and (num eq 38)')
        })

        it('should handle method', () => {
            let expr = visitor.parseOData(`contains(customer/name, 'kalle') eq true`)
            let odata = translator.visit(expr)

            chai.expect(odata).to.equal(`contains(customer/name, 'kalle') eq true`)
        })

        it('should handle or with method', () => {
            let expr = visitor.parseOData(`contains(customer/name, 'kalle') eq true or contains(customer/no, '54')`)
            let odata = translator.visit(expr)

            chai.expect(odata).to.equal(`(contains(customer/name, 'kalle') eq true) or (contains(customer/no, '54'))`)
        })
    })
})