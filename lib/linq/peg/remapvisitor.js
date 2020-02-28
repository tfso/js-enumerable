"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression/expression");
const identifierexpression_1 = require("./expression/identifierexpression");
const memberexpression_1 = require("./expression/memberexpression");
const literalexpression_1 = require("./expression/literalexpression");
const expressionvisitor_1 = require("./expressionvisitor");
class RemapVisitor extends expressionvisitor_1.ExpressionVisitor {
    constructor(remapKey, remapValue) {
        super();
        this.remapKey = remapKey;
        this.remapValue = remapValue;
        if (typeof this.remapKey != 'function')
            this.remapKey = null;
        if (typeof this.remapValue != 'function')
            this.remapValue = null;
    }
    visit(expression) {
        return expression.accept(this);
    }
    visitLiteral(expression) {
        let parent = this.stack.peek(), property, value;
        if (this.remapValue && (property = this.findIdentifier(parent)) && (value = this.remapValue(this.flattenMember(property), expression.value)) !== undefined)
            return new literalexpression_1.LiteralExpression(value);
        return new literalexpression_1.LiteralExpression(expression.value);
    }
    visitIdentifier(expression) {
        let parent = this.stack.peek(), name;
        if (this.remapKey && parent.type != expression_1.ExpressionType.Member) {
            if ((name = this.remapKey(expression.name)) != null)
                return new identifierexpression_1.IdentifierExpression(name);
        }
        return new identifierexpression_1.IdentifierExpression(expression.name);
    }
    visitMember(expression) {
        let path;
        if (this.remapKey && (path = this.remapKey(this.flattenMember(expression))) != null)
            return this.unflattenMember(path);
        return new memberexpression_1.MemberExpression(expression.object.accept(this), expression.property.accept(this));
    }
    findIdentifier(expression) {
        let member;
        switch (expression.type) {
            case expression_1.ExpressionType.Logical:
                if ((member = this.findIdentifier(expression.left)) != null)
                    return member;
                if ((member = this.findIdentifier(expression.right)) != null)
                    return member;
                break;
            case expression_1.ExpressionType.Identifier:
                return expression;
            case expression_1.ExpressionType.Member:
                return expression;
            case expression_1.ExpressionType.Method:
                if (expression.caller != null && (member = this.findIdentifier(expression.caller)) != null)
                    return member;
                if (expression.parameters.length >= 1 && (member = this.findIdentifier(expression.parameters[0])) != null)
                    return member;
                break;
        }
        return null;
    }
    flattenMember(expression) {
        switch (expression.type) {
            case expression_1.ExpressionType.Member:
                let prop = this.flattenMember(expression.property);
                return this.flattenMember(expression.object) + (prop.length > 0 ? '.' + prop : '');
            case expression_1.ExpressionType.Identifier:
                return expression.name;
            default:
                return '';
        }
    }
    unflattenMember(path, idx = 0) {
        let parts = path.split('.');
        if (idx + 1 >= parts.length)
            return new identifierexpression_1.IdentifierExpression(parts[idx]);
        return new memberexpression_1.MemberExpression(new identifierexpression_1.IdentifierExpression(parts[idx]), this.unflattenMember(path, idx + 1));
    }
}
exports.RemapVisitor = RemapVisitor;
//# sourceMappingURL=remapvisitor.js.map