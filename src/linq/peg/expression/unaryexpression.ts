import { IUnaryExpression, UnaryOperatorType, UnaryAffixType } from '../interface/iunaryexpression'
import { IExpression, Expression, ExpressionType } from './expression'

export class UnaryExpression extends Expression implements IUnaryExpression {
    constructor(public operator: UnaryOperatorType, public affix: UnaryAffixType, public argument: IExpression) {
        super(ExpressionType.Unary)
    }

    public equal(expression: IUnaryExpression) {
        return (this.type == expression.type && this.operator == expression.operator && this.affix == expression.affix && this.argument.equal(expression.argument))
    }

    public toString() {

        let operator = () => {
            switch(this.operator) {
                case UnaryOperatorType.Complement: return '~'
                case UnaryOperatorType.Invert: return '!'
                case UnaryOperatorType.Negative: return '-'
                case UnaryOperatorType.Positive: return '+'
                case UnaryOperatorType.Increment: return '++'
                case UnaryOperatorType.Decrement: return '--'
            }
        }

        if(this.affix == UnaryAffixType.Prefix) {
            return `${operator()}${this.argument.toString()}`
        }
        else {
            return `${this.argument.toString()}${operator()}`
        }
    }
}

export { IUnaryExpression, UnaryOperatorType, UnaryAffixType }