import { ILogicalExpression, LogicalOperatorType } from '../interface/ilogicalexpression'
import { IExpression, Expression, ExpressionType } from './expression'

export class LogicalExpression extends Expression implements ILogicalExpression {
    constructor(public operator: LogicalOperatorType, public left: IExpression, public right: IExpression) {
        super(ExpressionType.Logical)
    }

    public equal(expression: ILogicalExpression) {
        if(this.type == expression.type && this.operator == expression.operator && this.left.equal(expression.left) && this.right.equal(expression.right))
            return true

        switch(this.operator) {
            case LogicalOperatorType.And:
            case LogicalOperatorType.Or:
            case LogicalOperatorType.NotEqual:
            case LogicalOperatorType.Equal:
                return this.operator == expression.operator && this.left.equal(expression.right) && this.right.equal(expression.left)

            case LogicalOperatorType.Greater: // 5 > 2 == 2 < 5
                return expression.operator == LogicalOperatorType.Lesser && this.left.equal(expression.right) && this.right.equal(expression.left)

            case LogicalOperatorType.GreaterOrEqual: // 5 >= 2 == 2 <= 5
                return expression.operator == LogicalOperatorType.LesserOrEqual && this.left.equal(expression.right) && this.right.equal(expression.left)

            case LogicalOperatorType.Lesser: // 5 < 2 == 2 > 5
                return expression.operator == LogicalOperatorType.Greater && this.left.equal(expression.right) && this.right.equal(expression.left)

            case LogicalOperatorType.LesserOrEqual: // 5 <= 2 == 2 >= 5
                return expression.operator == LogicalOperatorType.GreaterOrEqual && this.left.equal(expression.right) && this.right.equal(expression.left)
        }

        return false
    }

    public toString() {
        let left: string, right: string,
            operator = () => {
                switch(this.operator) {
                    case LogicalOperatorType.And: return '&&'
                    case LogicalOperatorType.Or: return '||'
                    case LogicalOperatorType.Equal: return '=='
                    case LogicalOperatorType.Greater: return '>'
                    case LogicalOperatorType.GreaterOrEqual: return '>='
                    case LogicalOperatorType.Lesser: return '<'
                    case LogicalOperatorType.LesserOrEqual: return '<='
                    case LogicalOperatorType.NotEqual: return '!='
                }
            }

        switch(this.left.type) {
            case ExpressionType.Binary: 
                left = `(${this.left.toString()})`; break

            default:
                left = this.left.toString(); break
        }

        switch(this.right.type) {
            case ExpressionType.Binary: 
                right = `(${this.right.toString()})`; break
            
            default:
                right = this.right.toString(); break
        }

        return (this.operator == LogicalOperatorType.And) ? `(${left} ${operator()} ${right})` : `${left} ${operator()} ${right}`
    }
}

export { ILogicalExpression, LogicalOperatorType }