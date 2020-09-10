import { IConditionalExpression } from '../interface/iconditionalexpression'
import { IExpression, Expression, ExpressionType } from './expression'

/**
 * Not in use for now
 */

export class ConditionalExpression extends Expression implements IConditionalExpression {
    constructor(public condition: IExpression, public success: IExpression, public failure: IExpression) {
        super(ExpressionType.Conditional)
    }

    public equal(expression: IConditionalExpression) {
        if(this.type == expression.type && this.condition.equal(expression.condition) && this.success.equal(expression.success) && this.failure.equal(expression.failure))
            return true

        return false
    }

    public toString() {
        return `(${this.condition.toString()} ? ${this.success.toString()} : ${this.failure.toString()})`
    }

    public static instanceof(expression: IExpression): expression is IConditionalExpression {
        return expression != null && expression.type == ExpressionType.Conditional
    }
}

export { IConditionalExpression }