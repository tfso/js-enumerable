"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
class ArrayExpression extends expression_1.Expression {
    constructor(elements) {
        super(expression_1.ExpressionType.Array);
        this.elements = elements;
    }
    equal(expression) {
        if (this.type == expression.type && this.elements.length == expression.elements.length) {
            for (let i = 0; i < this.elements.length; i++) {
                if (this.elements[i].equal(expression.elements[i]) == false)
                    return false;
            }
            return true;
        }
        return false;
    }
    toString() {
        return `[${(this.elements || []).map(element => element.toString()).join(', ')}]`;
    }
}
exports.ArrayExpression = ArrayExpression;
//# sourceMappingURL=arrayexpression.js.map