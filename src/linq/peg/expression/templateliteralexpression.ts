import { ITemplateLiteralExpression } from '../interface/itemplateliteralexpression'

import { IExpression, Expression, ExpressionType } from './expression'
import { ILiteralExpression, LiteralExpression } from './literalexpression'

export class TemplateLiteralExpression extends Expression implements ITemplateLiteralExpression {
    private _elements: Array<IExpression> = [];

    private indexerLiterals: Array<number> = []
    private indexerExpressions: Array<number> = [];
    
    /**
     * Literals and Expressions comes always in pairs, so first literal and last expression may be empty
     * @param literals 
     * @param expressions 
     */
    constructor(literals: Array<ILiteralExpression> = [], expressions: Array<IExpression> = []) {
        super(ExpressionType.TemplateLiteral)

        this.combine(literals, expressions)
    }

    public equal(expression: ITemplateLiteralExpression): boolean {
        if(this.type == expression.type && this.elements.length == expression.elements.length) {
            for(let i = 0; i < this.elements.length; i++) {
                if(this.elements[i].equal(expression.elements[i]) == false)
                    return false
            }

            return true
        }

        return false
    }

    public get elements() {
        return this._elements
    }

    public set elements(value) {
        this._elements = value
    }

    public get literals(): Array<ILiteralExpression> {
        return this.elements
            .filter((expr, idx) => this.indexerLiterals.indexOf(idx) >= 0)
            .map(expr => <ILiteralExpression>expr)
    }

    public get expressions(): Array<IExpression> {
        return this.elements
            .filter((expr, idx) => this.indexerExpressions.indexOf(idx) >= 0)
    }

    public toString() {
        return `\`${(this.elements || [])
            .map((element, idx) => {
                let value = element.toString()

                if(this.indexerLiterals.indexOf(idx) >= 0)
                    return value.slice(1, value.length - 1)
                
                return `\$\{${element.toString()}\}`
            })
            .join('')
        }\``
    }

    private combine(literals: Array<IExpression> = [], expressions: Array<IExpression> = []) {
        for(let i = 0; i < literals.length; i++) {
            this.indexerLiterals.push(this._elements.push(literals[i]) - 1)
            
            if(i < expressions.length)
                this.indexerExpressions.push(this._elements.push(expressions[i]) - 1)
        }
    }
}

export { ITemplateLiteralExpression }