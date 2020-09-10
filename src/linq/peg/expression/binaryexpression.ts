import { IBinaryExpression, BinaryOperatorType } from '../interface/ibinaryexpression'
import { IExpression, Expression, ExpressionType } from '../expression/expression'

export class BinaryExpression extends Expression implements IBinaryExpression {
    constructor(public operator: BinaryOperatorType, public left: IExpression, public right: IExpression) {
        super(ExpressionType.Binary)
    }

    public equal(expression: IBinaryExpression): boolean {
        if(this.operator == expression.operator && this.left.equal(expression.left) && this.right.equal(expression.right))
            return true

        if(this.operator == expression.operator) {
            switch(this.operator) {
                case BinaryOperatorType.Addition:
                case BinaryOperatorType.Multiplication:
                case BinaryOperatorType.ExclusiveOr:
                case BinaryOperatorType.And:
                case BinaryOperatorType.Or:
                    return this.left.equal(expression.right) && this.right.equal(expression.left)
            }
        }

        return false
    }

    public toString() {
        let operator = () => {
            switch(this.operator) {
                case BinaryOperatorType.Addition: return '+'
                case BinaryOperatorType.Subtraction: return '-'
                case BinaryOperatorType.Multiplication: return '*'
                case BinaryOperatorType.Division: return '/'
                case BinaryOperatorType.Modulus: return '%'
                case BinaryOperatorType.And: return '&'
                case BinaryOperatorType.Or: return '|'
                case BinaryOperatorType.ExclusiveOr: return '^'
                case BinaryOperatorType.LeftShift: return '<<'
                case BinaryOperatorType.RightShift: return '>>'
            }
        }

        return `${(this.left.type == ExpressionType.Binary) ? `(${this.left.toString()})` : this.left.toString()} ${operator()} ${(this.right.type == ExpressionType.Binary) ? `(${this.right.toString()})` : this.right.toString()}`
    }

    public static instanceof(expression: IExpression): expression is IBinaryExpression {
        return expression != null && expression.type == ExpressionType.Binary
    }
}

export { IBinaryExpression, BinaryOperatorType }