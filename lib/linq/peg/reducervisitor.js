"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expressionvisitor_1 = require("./expressionvisitor");
class ReducerVisitor extends expressionvisitor_1.ExpressionVisitor {
    constructor() {
        super();
        this._parentExpressionStack = [];
        this._it = null;
    }
    get it() {
        return this._it;
    }
    visitLambda(predicate, ...param) {
        //this._isSolvable = true; // reset it as checks for solvability is done for each visit
        this._it = null; // do not involve "this" at the moment, since evalute is using "ReducerVisitor.it" to find out the named "this" scope.
        let expr = super.visitLambda(predicate), vars = null;
        if (param.length > 0) {
            if (Array.isArray(this._lambdaExpression) && this._lambdaExpression.parameters.length > 0) {
                vars = this._lambdaExpression.parameters.reduce((res, val, index) => {
                    if (index > 0 && index <= param.length)
                        res[val] = param[index - 1];
                    return res;
                }, {});
            }
        }
        expr = this.evaluate.call(this, expr, vars);
        this._it = this._lambdaExpression != null && this._lambdaExpression.parameters.length > 0 ? this._lambdaExpression.parameters[0] : null;
        return expr;
    }
    visitLiteral(expression) {
        return this.evaluate(expression);
    }
    visitMethod(expression) {
        let expr, value;
        expr = new expressionvisitor_1.MethodExpression(expression.name, expression.parameters.map((arg) => arg.accept(this)), expression.caller);
        return expr;
    }
    visitBinary(expression) {
        let left = expression.left, right = expression.right;
        if (left.type == expressionvisitor_1.ExpressionType.Literal && right.type == expressionvisitor_1.ExpressionType.Literal) {
            let leftValue = left.value, rightValue = right.value;
            switch (expression.operator) {
                case expressionvisitor_1.BinaryOperatorType.Addition:
                    return new expressionvisitor_1.LiteralExpression(leftValue + rightValue);
                case expressionvisitor_1.BinaryOperatorType.Subtraction:
                    return new expressionvisitor_1.LiteralExpression(leftValue - rightValue);
                case expressionvisitor_1.BinaryOperatorType.Multiplication:
                    return new expressionvisitor_1.LiteralExpression(leftValue * rightValue);
                case expressionvisitor_1.BinaryOperatorType.Division:
                    return new expressionvisitor_1.LiteralExpression(leftValue / rightValue);
                case expressionvisitor_1.BinaryOperatorType.Modulus:
                    return new expressionvisitor_1.LiteralExpression(leftValue % rightValue);
                case expressionvisitor_1.BinaryOperatorType.And:
                    return new expressionvisitor_1.LiteralExpression(leftValue & rightValue);
                case expressionvisitor_1.BinaryOperatorType.Or:
                    return new expressionvisitor_1.LiteralExpression(leftValue | rightValue);
                case expressionvisitor_1.BinaryOperatorType.ExclusiveOr:
                    return new expressionvisitor_1.LiteralExpression(leftValue ^ rightValue);
                case expressionvisitor_1.BinaryOperatorType.LeftShift:
                    return new expressionvisitor_1.LiteralExpression(leftValue << rightValue);
                case expressionvisitor_1.BinaryOperatorType.RightShift:
                    return new expressionvisitor_1.LiteralExpression(leftValue >> rightValue);
            }
        }
        return new expressionvisitor_1.BinaryExpression(expression.operator, left.accept(this), right.accept(this));
    }
    visitConditional(expression) {
        let condition = expression.condition.accept(this);
        if (condition.type == expressionvisitor_1.ExpressionType.Literal) {
            if (condition.value === true)
                return expression.success.accept(this);
            else
                return expression.failure.accept(this);
        }
        return new expressionvisitor_1.ConditionalExpression(condition, expression.success.accept(this), expression.failure.accept(this));
    }
    visitLogical(expression) {
        let left = expression.left.accept(this), right = expression.right.accept(this);
        if (left.type == expressionvisitor_1.ExpressionType.Literal && right.type == expressionvisitor_1.ExpressionType.Literal) {
            let leftValue = left.value, rightValue = right.value;
            switch (expression.operator) {
                case expressionvisitor_1.LogicalOperatorType.Equal:
                    return new expressionvisitor_1.LiteralExpression(leftValue >= rightValue && leftValue <= rightValue); // fixes date comparements
                case expressionvisitor_1.LogicalOperatorType.NotEqual:
                    return new expressionvisitor_1.LiteralExpression(leftValue < rightValue || leftValue > rightValue); // fixes date comparements
                case expressionvisitor_1.LogicalOperatorType.And:
                    return new expressionvisitor_1.LiteralExpression(leftValue && rightValue);
                case expressionvisitor_1.LogicalOperatorType.Or:
                    return new expressionvisitor_1.LiteralExpression(leftValue || rightValue);
                case expressionvisitor_1.LogicalOperatorType.Greater:
                    return new expressionvisitor_1.LiteralExpression(leftValue > rightValue);
                case expressionvisitor_1.LogicalOperatorType.GreaterOrEqual:
                    return new expressionvisitor_1.LiteralExpression(leftValue >= rightValue);
                case expressionvisitor_1.LogicalOperatorType.Lesser:
                    return new expressionvisitor_1.LiteralExpression(leftValue < rightValue);
                case expressionvisitor_1.LogicalOperatorType.LesserOrEqual:
                    return new expressionvisitor_1.LiteralExpression(leftValue <= rightValue);
            }
        }
        switch (expression.operator) {
            case expressionvisitor_1.LogicalOperatorType.And:
                if (left.type == expressionvisitor_1.ExpressionType.Literal && left.value === true)
                    return right;
                if (right.type == expressionvisitor_1.ExpressionType.Literal && right.value === true)
                    return left;
                break;
            case expressionvisitor_1.LogicalOperatorType.Or:
                if (left.type == expressionvisitor_1.ExpressionType.Literal && left.value === true)
                    return left;
                if (right.type == expressionvisitor_1.ExpressionType.Literal && right.value === true)
                    return right;
                break;
        }
        return new expressionvisitor_1.LogicalExpression(expression.operator, left, right);
    }
    evaluate(expression, it = null) {
        if (expression == null)
            return null;
        let value = null;
        switch (expression.type) {
            case expressionvisitor_1.ExpressionType.Literal:
                break;
            case expressionvisitor_1.ExpressionType.Identifier: {
                let identifier = expression;
                if (it != null) {
                    // this object
                    if (typeof it == 'object' && identifier.name in it && (value = it[identifier.name]) !== undefined) {
                        if (value == null)
                            return new expressionvisitor_1.LiteralExpression(null);
                        switch (typeof value) {
                            case 'string':
                            case 'number':
                            case 'boolean':
                                break;
                            case 'object':
                                if (value.getTime && value.getTime() >= 0)
                                    break;
                                if (Array.isArray(value) == true)
                                    break;
                            // fall through
                            default:
                                value = null;
                        }
                        return new expressionvisitor_1.LiteralExpression(value);
                    }
                }
                break;
            }
            case expressionvisitor_1.ExpressionType.Array:
                return new expressionvisitor_1.ArrayExpression(expression.elements.map(v => this.evaluate(v, it)));
            case expressionvisitor_1.ExpressionType.Object:
                return new expressionvisitor_1.ObjectExpression(expression.properties.map(el => ({ key: this.evaluate(el.key, it), value: this.evaluate(el.value, it) })));
            case expressionvisitor_1.ExpressionType.Index: {
                let object = this.evaluate(expression.object, it), index = this.evaluate(expression.index, it);
                if (index.type == expressionvisitor_1.ExpressionType.Literal)
                    switch (object.type) {
                        case expressionvisitor_1.ExpressionType.Object:
                            let property = object.properties.find(prop => {
                                switch (prop.key.type) {
                                    case expressionvisitor_1.ExpressionType.Identifier:
                                        if (prop.key.name == index.value)
                                            return true;
                                        break;
                                    case expressionvisitor_1.ExpressionType.Literal:
                                        if (prop.key.value == index.value)
                                            return true;
                                        break;
                                }
                                return false;
                            });
                            return property ? this.evaluate(property.value) : new expressionvisitor_1.LiteralExpression(null);
                        case expressionvisitor_1.ExpressionType.Array:
                            return Array.from(object.elements)[index.value];
                        case expressionvisitor_1.ExpressionType.Literal:
                            if (typeof object.value == 'object') {
                                if (Array.isArray(object.value)) {
                                    return new expressionvisitor_1.LiteralExpression(Array.from(object.value)[index.value]);
                                }
                                let descriptor;
                                if (descriptor = Object.getOwnPropertyDescriptor(object.value, index.value))
                                    return new expressionvisitor_1.LiteralExpression(descriptor.value);
                            }
                            return new expressionvisitor_1.LiteralExpression(null);
                    }
                break;
            }
            case expressionvisitor_1.ExpressionType.Member: {
                let object = expression.object, property = expression.property;
                if (it != null) {
                    if (object.type == expressionvisitor_1.ExpressionType.Identifier) {
                        if (object.name == 'this' || object.name == this.it) {
                            value = this.evaluate(property, it);
                            if (property.equal(value) == false)
                                return value;
                        }
                        else {
                            let descriptor = Object.getOwnPropertyDescriptor(it, object.name);
                            if (descriptor && typeof descriptor.value == 'object') {
                                value = this.evaluate(property, descriptor.value);
                                if (property.equal(value) == false)
                                    return value;
                            }
                        }
                    }
                }
                break;
            }
            case expressionvisitor_1.ExpressionType.Conditional:
                return this.visit(new expressionvisitor_1.ConditionalExpression(this.evaluate(expression.condition, it), this.evaluate(expression.success, it), this.evaluate(expression.failure, it)));
            case expressionvisitor_1.ExpressionType.Logical:
                return this.visit(new expressionvisitor_1.LogicalExpression(expression.operator, this.evaluate(expression.left, it), this.evaluate(expression.right, it)));
            case expressionvisitor_1.ExpressionType.Binary:
                return this.visit(new expressionvisitor_1.BinaryExpression(expression.operator, this.evaluate(expression.left, it), this.evaluate(expression.right, it)));
            case expressionvisitor_1.ExpressionType.Method:
                return this.visit(new expressionvisitor_1.MethodExpression(expression.name, expression.parameters.map(p => this.evaluate(p, it)), this.evaluate(expression.caller, it)));
            default:
                let o = Object.create(Object.getPrototypeOf(expression), Object.getOwnPropertyNames(expression).reduce((prev, cur) => {
                    let prop = Object.getOwnPropertyDescriptor(expression, cur);
                    if (prop.value instanceof expressionvisitor_1.Expression)
                        prop.value = this.evaluate(prop.value, it);
                    else if (prop.value instanceof Array)
                        prop.value = prop.value.map(a => a instanceof expressionvisitor_1.Expression ? this.evaluate(a, it) : a);
                    prev[cur] = prop;
                    return prev;
                }, {}));
                return this.visit(o);
        }
        return expression;
    }
    static evaluate(expression, it = null) {
        let reducer = new ReducerVisitor(), result = reducer.evaluate(expression, it);
        return result.type == expressionvisitor_1.ExpressionType.Literal ? result.value : undefined;
    }
}
exports.ReducerVisitor = ReducerVisitor;
//# sourceMappingURL=reducervisitor.js.map