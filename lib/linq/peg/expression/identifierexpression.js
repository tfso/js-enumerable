"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
class IdentifierExpression extends expression_1.Expression {
    constructor(name) {
        super(expression_1.ExpressionType.Identifier);
        this.name = name;
    }
    equal(expression) {
        return this.type == expression.type && this.name == expression.name;
    }
    toString() {
        return this.name;
    }
}
exports.IdentifierExpression = IdentifierExpression;
//# sourceMappingURL=identifierexpression.js.map