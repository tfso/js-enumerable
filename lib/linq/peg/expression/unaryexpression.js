"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iunaryexpression_1 = require("../interface/iunaryexpression");
exports.UnaryOperatorType = iunaryexpression_1.UnaryOperatorType;
exports.UnaryAffixType = iunaryexpression_1.UnaryAffixType;
const expression_1 = require("./expression");
class UnaryExpression extends expression_1.Expression {
    constructor(operator, affix, argument) {
        super(expression_1.ExpressionType.Unary);
        this.operator = operator;
        this.affix = affix;
        this.argument = argument;
    }
    equal(expression) {
        return (this.type == expression.type && this.operator == expression.operator && this.affix == expression.affix && this.argument.equal(expression.argument));
    }
    toString() {
        let operator = () => {
            switch (this.operator) {
                case iunaryexpression_1.UnaryOperatorType.Complement: return '~';
                case iunaryexpression_1.UnaryOperatorType.Invert: return '!';
                case iunaryexpression_1.UnaryOperatorType.Negative: return '-';
                case iunaryexpression_1.UnaryOperatorType.Positive: return '+';
                case iunaryexpression_1.UnaryOperatorType.Increment: return '++';
                case iunaryexpression_1.UnaryOperatorType.Decrement: return '--';
            }
        };
        if (this.affix == iunaryexpression_1.UnaryAffixType.Prefix) {
            return `${operator()}${this.argument.toString()}`;
        }
        else {
            return `${this.argument.toString()}${operator()}`;
        }
    }
}
exports.UnaryExpression = UnaryExpression;
//# sourceMappingURL=unaryexpression.js.map