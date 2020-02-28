"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ilogicalexpression_1 = require("../interface/ilogicalexpression");
exports.LogicalOperatorType = ilogicalexpression_1.LogicalOperatorType;
const expression_1 = require("./expression");
class LogicalExpression extends expression_1.Expression {
    constructor(operator, left, right) {
        super(expression_1.ExpressionType.Logical);
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
    equal(expression) {
        if (this.type == expression.type && this.operator == expression.operator && this.left.equal(expression.left) && this.right.equal(expression.right))
            return true;
        switch (this.operator) {
            case ilogicalexpression_1.LogicalOperatorType.And:
            case ilogicalexpression_1.LogicalOperatorType.Or:
            case ilogicalexpression_1.LogicalOperatorType.NotEqual:
            case ilogicalexpression_1.LogicalOperatorType.Equal:
                return this.operator == expression.operator && this.left.equal(expression.right) && this.right.equal(expression.left);
            case ilogicalexpression_1.LogicalOperatorType.Greater: // 5 > 2 == 2 < 5
                return expression.operator == ilogicalexpression_1.LogicalOperatorType.Lesser && this.left.equal(expression.right) && this.right.equal(expression.left);
            case ilogicalexpression_1.LogicalOperatorType.GreaterOrEqual: // 5 >= 2 == 2 <= 5
                return expression.operator == ilogicalexpression_1.LogicalOperatorType.LesserOrEqual && this.left.equal(expression.right) && this.right.equal(expression.left);
            case ilogicalexpression_1.LogicalOperatorType.Lesser: // 5 < 2 == 2 > 5
                return expression.operator == ilogicalexpression_1.LogicalOperatorType.Greater && this.left.equal(expression.right) && this.right.equal(expression.left);
            case ilogicalexpression_1.LogicalOperatorType.LesserOrEqual: // 5 <= 2 == 2 >= 5
                return expression.operator == ilogicalexpression_1.LogicalOperatorType.GreaterOrEqual && this.left.equal(expression.right) && this.right.equal(expression.left);
        }
        return false;
    }
    toString() {
        let left, right, operator = () => {
            switch (this.operator) {
                case ilogicalexpression_1.LogicalOperatorType.And: return '&&';
                case ilogicalexpression_1.LogicalOperatorType.Or: return '||';
                case ilogicalexpression_1.LogicalOperatorType.Equal: return '==';
                case ilogicalexpression_1.LogicalOperatorType.Greater: return '>';
                case ilogicalexpression_1.LogicalOperatorType.GreaterOrEqual: return '>=';
                case ilogicalexpression_1.LogicalOperatorType.Lesser: return '<';
                case ilogicalexpression_1.LogicalOperatorType.LesserOrEqual: return '<=';
                case ilogicalexpression_1.LogicalOperatorType.NotEqual: return '!=';
            }
        };
        switch (this.left.type) {
            case expression_1.ExpressionType.Binary:
                left = `(${this.left.toString()})`;
                break;
            default:
                left = this.left.toString();
                break;
        }
        switch (this.right.type) {
            case expression_1.ExpressionType.Binary:
                right = `(${this.right.toString()})`;
                break;
            default:
                right = this.right.toString();
                break;
        }
        return (this.operator == ilogicalexpression_1.LogicalOperatorType.And) ? `(${left} ${operator()} ${right})` : `${left} ${operator()} ${right}`;
    }
}
exports.LogicalExpression = LogicalExpression;
//# sourceMappingURL=logicalexpression.js.map