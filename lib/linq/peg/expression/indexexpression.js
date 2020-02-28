"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
class IndexExpression extends expression_1.Expression {
    constructor(object, index) {
        super(expression_1.ExpressionType.Index);
        this.object = object;
        this.index = index;
    }
    equal(expression) {
        return this.type == expression.type && this.object.equal(expression.object) && this.index.equal(expression.index);
    }
    toString() {
        return `${this.object.toString()}[${this.index.toString()}]`;
    }
}
exports.IndexExpression = IndexExpression;
//# sourceMappingURL=indexexpression.js.map