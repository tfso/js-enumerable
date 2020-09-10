import { ILiteralExpression } from '../interface/iliteralexpression'
import { IExpression, Expression, ExpressionType } from './expression'

export class LiteralExpression extends Expression implements ILiteralExpression {
    constructor(public value: any) {
        super(ExpressionType.Literal)
    }

    public equal(expression: ILiteralExpression): boolean {
        return this.type == expression.type && this.value == expression.value
    }

    public toString() {
        switch(typeof (this.value)) {
            case 'string':
                return `"${new String(this.value).toString().replace(/"/g, '\"')}"`

            case 'object':
                return JSON.stringify(this.value)

            default:
                return new String(this.value).toString()
        }
    }

    public static instanceof(expression: IExpression): expression is ILiteralExpression {
        return expression != null && expression.type == ExpressionType.Literal
    }
}

export { ILiteralExpression }