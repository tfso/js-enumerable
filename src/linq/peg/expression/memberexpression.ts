import { IMemberExpression } from '../interface/imemberexpression'
import { IExpression, Expression, ExpressionType } from './expression'

export class MemberExpression extends Expression implements IMemberExpression {
    constructor(public object: IExpression, public property: IExpression) {
        super(ExpressionType.Member)
    }

    public equal(expression: IMemberExpression): boolean {
        return this.type == expression.type && this.object.equal(expression.object) && this.property.equal(expression.property)
    }

    public toString() {
        return `${this.object.toString()}.${this.property.toString()}` 
    }
}

export { IMemberExpression }