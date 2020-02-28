"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression");
class TemplateLiteralExpression extends expression_1.Expression {
    /**
     * Literals and Expressions comes always in pairs, so first literal and last expression may be empty
     * @param literals
     * @param expressions
     */
    constructor(literals = [], expressions = []) {
        super(expression_1.ExpressionType.TemplateLiteral);
        this._elements = [];
        this.indexerLiterals = [];
        this.indexerExpressions = [];
        this.combine(literals, expressions);
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
    get elements() {
        return this._elements;
    }
    set elements(value) {
        this._elements = value;
    }
    get literals() {
        return this.elements
            .filter((expr, idx) => this.indexerLiterals.indexOf(idx) >= 0)
            .map(expr => expr);
    }
    get expressions() {
        return this.elements
            .filter((expr, idx) => this.indexerExpressions.indexOf(idx) >= 0);
    }
    toString() {
        return `\`${(this.elements || [])
            .map((element, idx) => {
            let value = element.toString();
            if (this.indexerLiterals.indexOf(idx) >= 0)
                return value.slice(1, value.length - 1);
            return `\$\{${element.toString()}\}`;
        })
            .join('')}\``;
    }
    combine(literals = [], expressions = []) {
        for (let i = 0; i < literals.length; i++) {
            this.indexerLiterals.push(this._elements.push(literals[i]) - 1);
            if (i < expressions.length)
                this.indexerExpressions.push(this._elements.push(expressions[i]) - 1);
        }
    }
}
exports.TemplateLiteralExpression = TemplateLiteralExpression;
//# sourceMappingURL=templateliteralexpression.js.map