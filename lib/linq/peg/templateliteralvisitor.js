"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression/expression");
exports.ExpressionType = expression_1.ExpressionType;
const literalexpression_1 = require("./expression/literalexpression");
const templateliteralexpression_1 = require("./expression/templateliteralexpression");
const objectexpression_1 = require("./expression/objectexpression");
const javascriptvisitor_1 = require("./javascriptvisitor");
class TemplateLiteralVisitor extends javascriptvisitor_1.JavascriptVisitor {
    constructor(wrapper) {
        super();
        this._wrapper = wrapper || ((value) => value);
    }
    //public visitTemplateLiteral(expression: ITemplateLiteralExpression): IExpression {
    //    let elements = expression.elements.map((element) => element.accept(this));
    //    if (elements.every(expr => expr.type == ExpressionType.Literal)) 
    //    {
    //        return new LiteralExpression(elements.reduce((output, expr) => {
    //            return output + new String((<ILiteralExpression>expr).value).toString();
    //        }, ''));
    //    }
    //    return new TemplateLiteralExpression(elements);
    //}
    evaluate(expression, it = null) {
        let value = null;
        if (expression == null)
            return null;
        switch (expression.type) {
            case expression_1.ExpressionType.TemplateLiteral:
                let templateExpr = expression, expressions = templateExpr.expressions.map(expr => this.evaluate(expr, it));
                if (it) {
                    if (expressions.every(el => el.type == expression_1.ExpressionType.Literal) == true) {
                        return new literalexpression_1.LiteralExpression(templateExpr.literals.reduce((out, str, idx) => out += str.value + this._wrapper(idx < expressions.length ? expressions[idx].value : ''), ''));
                        //return new LiteralExpression(elements.reduce((out, el) => out += this._wrapper((<ILiteralExpression>el).value), ''));
                    }
                }
                return new templateliteralexpression_1.TemplateLiteralExpression(templateExpr.literals, expressions);
            case expression_1.ExpressionType.Object:
                let properties = expression.properties.map(el => ({ key: this.evaluate(el.key, it), value: this.evaluate(el.value, it) }));
                if (it) {
                    if (properties.every(el => el.value.type == expression_1.ExpressionType.Literal) == true)
                        return new literalexpression_1.LiteralExpression(properties.reduce((o, p) => {
                            o[p.key.type == expression_1.ExpressionType.Identifier ? p.key.name : p.key.value] = p.value.value;
                            return o;
                        }, {}));
                }
                return new objectexpression_1.ObjectExpression(properties);
            default:
                return super.evaluate(expression, it);
        }
        //return expression;
    }
    static evaluate(expression, it) {
        let reducer = new TemplateLiteralVisitor(), result;
        if (typeof expression == 'function')
            expression = reducer.visitLambda(expression);
        result = reducer.evaluate(expression, it);
        return result.type == expression_1.ExpressionType.Literal ? result.value : undefined;
    }
}
exports.TemplateLiteralVisitor = TemplateLiteralVisitor;
//# sourceMappingURL=templateliteralvisitor.js.map