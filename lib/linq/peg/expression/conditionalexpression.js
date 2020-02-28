"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
/**
 * Not in use for now
 */
class ConditionalExpression extends expression_1.Expression {
    constructor(condition, success, failure) {
        super(expression_1.ExpressionType.Conditional);
        this.condition = condition;
        this.success = success;
        this.failure = failure;
    }
    equal(expression) {
        if (this.type == expression.type && this.condition.equal(expression.condition) && this.success.equal(expression.success) && this.failure.equal(expression.failure))
            return true;
        return false;
    }
    toString() {
        return `(${this.condition.toString()} ? ${this.success.toString()} : ${this.failure.toString()})`;
    }
}
exports.ConditionalExpression = ConditionalExpression;
//# sourceMappingURL=conditionalexpression.js.map