"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression/expression");
const literalexpression_1 = require("./expression/literalexpression");
const methodexpression_1 = require("./expression/methodexpression");
const reducervisitor_1 = require("./reducervisitor");
class JavascriptVisitor extends reducervisitor_1.ReducerVisitor {
    constructor() {
        super();
    }
    visitMember(expression) {
        return super.visitMember(expression);
    }
    visitMethod(expression) {
        let parameters = expression.parameters.map((arg) => arg.accept(this)), caller = expression.caller ? expression.caller.accept(this) : null, name = expression.name;
        if (caller) {
            let value = undefined, params = parameters.map(expr => expr.type == expression_1.ExpressionType.Literal ? expr.value : undefined);
            switch (caller.type) {
                case expression_1.ExpressionType.Identifier:
                    switch (caller.name) {
                        case 'Math':
                            switch (name) {
                                case 'abs':
                                case 'acos':
                                case 'acosh':
                                case 'asin':
                                case 'asinh':
                                case 'atan':
                                case 'atanh':
                                case 'atan2':
                                case 'cbrt':
                                case 'ceil':
                                case 'clz32':
                                case 'cos':
                                case 'cosh':
                                case 'exp':
                                case 'expm1':
                                case 'floor':
                                case 'fround':
                                case 'hypot':
                                case 'imul':
                                case 'log':
                                case 'log1p':
                                case 'log10':
                                case 'log2':
                                case 'max':
                                case 'min':
                                case 'pow':
                                case 'random':
                                case 'round':
                                case 'sign':
                                case 'sin':
                                case 'sinh':
                                case 'sqrt':
                                case 'tan':
                                case 'tanh':
                                case 'trunc':
                                    return new literalexpression_1.LiteralExpression(Math[name].call(null, ...params));
                            }
                    }
                    break;
                case expression_1.ExpressionType.Literal:
                    switch (typeof (value = caller.value)) {
                        case 'string':
                            switch (name) {
                                case 'charAt':
                                case 'charCodeAt':
                                case 'concat':
                                case 'includes':
                                case 'endsWith':
                                case 'indexOf':
                                case 'lastIndexOf':
                                case 'localeCompare':
                                case 'match':
                                case 'normalize':
                                case 'padEnd':
                                case 'padStart':
                                case 'repeat':
                                case 'replace':
                                case 'search':
                                case 'slice':
                                case 'split':
                                case 'startsWith':
                                case 'substr':
                                case 'substring':
                                case 'toLocaleLowerCase':
                                case 'toLocaleUpperCase':
                                case 'toLowerCase':
                                case 'toString':
                                case 'toUpperCase':
                                case 'trim':
                                    return new literalexpression_1.LiteralExpression(String.prototype[name].call(value, ...params));
                                default:
                                    break;
                            }
                            break;
                        case 'number':
                            switch (name) {
                                case 'toExponential':
                                case 'toFixed':
                                case 'toPrecision':
                                    return new literalexpression_1.LiteralExpression(Number.prototype[name].call(value, ...params));
                                case 'isNaN':
                                case 'isFinite':
                                case 'isInteger':
                                case 'isSafeInteger':
                                case 'parseFloat':
                                case 'parseInt':
                                case 'toLocaleString':
                                case 'toString':
                                    return new literalexpression_1.LiteralExpression(Number[name].call(value, ...params));
                            }
                            break;
                        case 'object':
                            if (value.getTime && value.getTime() >= 0)
                                break;
                            if (Array.isArray(value) == true)
                                break;
                            break;
                    }
                    break;
            }
        }
        return new methodexpression_1.MethodExpression(name, parameters, caller);
    }
    static evaluate(expression, it) {
        let reducer = new JavascriptVisitor(), result;
        if (typeof expression == 'function')
            expression = reducer.visitLambda(expression);
        result = reducer.evaluate(expression, it);
        return result.type == expression_1.ExpressionType.Literal ? result.value : undefined;
    }
}
exports.JavascriptVisitor = JavascriptVisitor;
//# sourceMappingURL=javascriptvisitor.js.map