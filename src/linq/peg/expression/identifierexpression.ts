import { IIdentifierExpression } from '../interface/iidentifierexpression'
import { IExpression, Expression, ExpressionType } from './expression'

export class IdentifierExpression extends Expression implements IIdentifierExpression {
    constructor(public name: string) {
        super(ExpressionType.Identifier)
    }

    public equal(expression: IIdentifierExpression): boolean {
        return this.type == expression.type && this.name == expression.name
    }

    public toString() {
        return this.name
    }
}

export { IIdentifierExpression }