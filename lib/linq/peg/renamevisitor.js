"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression/expression");
const identifierexpression_1 = require("./expression/identifierexpression");
const memberexpression_1 = require("./expression/memberexpression");
const expressionvisitor_1 = require("./expressionvisitor");
class RenameVisitor extends expressionvisitor_1.ExpressionVisitor {
    constructor(...renames) {
        super();
        this.renames = new Map();
        for (let rename of renames)
            if (typeof (rename) == 'object' && typeof rename.from == 'string' && rename.from.length > 0)
                this.renames.set(rename.from, rename.to);
    }
    visit(expression) {
        return expression.accept(this);
    }
    visitIdentifier(expression) {
        let name;
        if ((name = this.renames.get(expression.name)) == null)
            name = expression.name;
        return new identifierexpression_1.IdentifierExpression(name);
    }
    visitMember(expression) {
        let path;
        if ((path = this.renames.get(this.flattenMember(expression))) == null)
            return new memberexpression_1.MemberExpression(expression.object.accept(this), expression.property.accept(this));
        return this.unflattenMember(path);
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
exports.RenameVisitor = RenameVisitor;
//# sourceMappingURL=renamevisitor.js.map