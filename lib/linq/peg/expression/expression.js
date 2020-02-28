"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expressiontype_1 = require("./expressiontype");
exports.ExpressionType = expressiontype_1.ExpressionType;
class Expression {
    constructor(type) {
        this._type = type;
    }
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }
    accept(visitor) {
        let expression;
        // add this as parent to stack for next acceptance/visit
        visitor.stack.push(this);
        switch (this.type) {
            case expressiontype_1.ExpressionType.Literal:
                expression = visitor.visitLiteral(this);
                break;
            case expressiontype_1.ExpressionType.Compound:
                expression = visitor.visitCompound(this);
                break;
            case expressiontype_1.ExpressionType.Identifier:
                expression = visitor.visitIdentifier(this);
                break;
            case expressiontype_1.ExpressionType.Member:
                expression = visitor.visitMember(this);
                break;
            case expressiontype_1.ExpressionType.Method:
                expression = visitor.visitMethod(this);
                break;
            case expressiontype_1.ExpressionType.Unary:
                expression = visitor.visitUnary(this);
                break;
            case expressiontype_1.ExpressionType.Binary:
                expression = visitor.visitBinary(this);
                break;
            case expressiontype_1.ExpressionType.Logical:
                expression = visitor.visitLogical(this);
                break;
            case expressiontype_1.ExpressionType.Conditional:
                expression = visitor.visitConditional(this);
                break;
            case expressiontype_1.ExpressionType.Array:
                expression = visitor.visitArray(this);
                break;
            case expressiontype_1.ExpressionType.Index:
                expression = visitor.visitIndex(this);
                break;
            case expressiontype_1.ExpressionType.TemplateLiteral:
                expression = visitor.visitTemplateLiteral(this);
                break;
            case expressiontype_1.ExpressionType.Object:
                expression = visitor.visitObject(this);
                break;
        }
        // remove it from stack
        visitor.stack.pop();
        // return the newly visited expression
        return expression;
    }
}
exports.Expression = Expression;
//# sourceMappingURL=expression.js.map