"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
class MethodExpression extends expression_1.Expression {
    constructor(name, parameters, caller) {
        super(expression_1.ExpressionType.Method);
        this.name = name;
        this.parameters = parameters;
        this.caller = caller;
    }
    equal(expression) {
        if (this.type == expression.type && this.name == expression.name && ((this.caller == null && expression.caller == null) || this.caller.equal(expression.caller))) {
            if (this.parameters == null && expression.parameters == null)
                return true;
            if (this.parameters.length != expression.parameters.length)
                return false;
            for (let i = 0; i < this.parameters.length; i++) {
                if (this.parameters[i].equal(expression.parameters[i]) == false)
                    return false;
            }
            return true;
        }
        return false;
    }
    toString() {
        return `${this.caller ? `${this.caller.toString()}.` : ''}${this.name}(${(this.parameters || []).map(parameter => parameter.toString()).join(', ')})`;
    }
}
exports.MethodExpression = MethodExpression;
//# sourceMappingURL=methodexpression.js.map