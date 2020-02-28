"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const odata_parser_1 = require("./parser/odata-parser");
const javascript_parser_1 = require("./parser/javascript-parser");
const literalexpression_1 = require("./expression/literalexpression");
const indexexpression_1 = require("./expression/indexexpression");
const identifierexpression_1 = require("./expression/identifierexpression");
const memberexpression_1 = require("./expression/memberexpression");
const methodexpression_1 = require("./expression/methodexpression");
const unaryexpression_1 = require("./expression/unaryexpression");
const binaryexpression_1 = require("./expression/binaryexpression");
const logicalexpression_1 = require("./expression/logicalexpression");
const conditionalexpression_1 = require("./expression/conditionalexpression");
const arrayexpression_1 = require("./expression/arrayexpression");
const templateliteralexpression_1 = require("./expression/templateliteralexpression");
const objectexpression_1 = require("./expression/objectexpression");
const lambdaexpression_1 = require("./expression/lambdaexpression");
class ExpressionStack {
    constructor() {
        this.items = [];
        this.count = 0;
    }
    length() {
        return this.count;
    }
    push(item) {
        this.items.push(item);
        this.count = this.count + 1;
    }
    pop() {
        if (this.count > 0) {
            this.count = this.count - 1;
        }
        return this.items.pop();
    }
    peek(steps = 0) {
        if ((this.count + steps) <= 1)
            return {
                type: 0
            };
        return this.items[this.count - 2 + steps]; // current object is always last
    }
}
exports.ExpressionStack = ExpressionStack;
class ExpressionVisitor {
    constructor() {
        this._expressionStack = new ExpressionStack();
    }
    get stack() {
        return this._expressionStack;
    }
    visitOData(filter) {
        let ast = odata_parser_1.default.parse(filter);
        try {
            if (ast) {
                return this.visit(this.transform(ast));
            }
        }
        catch (ex) {
            throw new Error(ex.message);
        }
        return null;
    }
    visitLambdaExpression(expression) {
        if (expression) {
            let ast = javascript_parser_1.default.parse(expression);
            try {
                if (ast) {
                    return this.visit(this.transform(ast));
                }
            }
            catch (ex) {
                throw new Error(ex.message);
            }
        }
        return null;
    }
    visitLambda(predicate) {
        let expression = (this._lambdaExpression = new lambdaexpression_1.LambdaExpression(predicate)).expression;
        return this.visitLambdaExpression(expression);
    }
    visit(expression) {
        return expression.accept(this);
    }
    visitLiteral(expression) {
        return expression;
    }
    visitArray(expression) {
        expression.elements = expression.elements.map((element) => element.accept(this));
        return expression;
    }
    visitTemplateLiteral(expression) {
        expression.elements = expression.elements.map((element) => element.accept(this));
        return expression;
    }
    visitObject(expression) {
        expression.properties = expression.properties.map((element) => ({ key: element.key.accept(this), value: element.value.accept(this) }));
        return expression;
    }
    visitIndex(expression) {
        expression.index = expression.index.accept(this);
        expression.object = expression.object.accept(this);
        return expression;
    }
    visitCompound(expression) {
        expression.body = expression.body.map((expr) => expr.accept(this));
        return expression;
    }
    visitIdentifier(expression) {
        return expression;
    }
    visitBinary(expression) {
        expression.left = expression.left.accept(this);
        expression.right = expression.right.accept(this);
        return expression;
    }
    visitMethod(expression) {
        if (expression.caller)
            expression.caller = expression.caller.accept(this);
        expression.parameters = expression.parameters.map((arg) => arg.accept(this));
        return expression;
    }
    visitUnary(expression) {
        expression.argument = expression.argument.accept(this);
        return expression;
    }
    visitMember(expression) {
        expression.object = expression.object.accept(this);
        expression.property = expression.property.accept(this);
        return expression;
    }
    visitLogical(expression) {
        expression.left = expression.left.accept(this);
        expression.right = expression.right.accept(this);
        return expression;
    }
    visitConditional(expression) {
        expression.condition = expression.condition.accept(this);
        expression.success = expression.success.accept(this);
        expression.failure = expression.failure.accept(this);
        return expression;
    }
    /**
     * transform pegjs expression ast tree to our internal ast tree to make it easier to swap expression parser at a later time
     * @see
     * http://www.odata.org/documentation/odata-version-2-0/uri-conventions/
     *
     * @param expression pegjs expression object
     * @returns
     */
    transform(expression) {
        let child;
        switch (expression.type) {
            case 'Identifier':
                return new identifierexpression_1.IdentifierExpression(expression.name);
            case 'MemberExpression':
                switch (expression.property.type) {
                    case 'CallExpression':
                        child = this.transform(expression.property);
                        child.caller = this.transform(expression.object);
                        return child;
                    default:
                        return new memberexpression_1.MemberExpression(this.transform(expression.object), this.transform(expression.property));
                }
            case 'CallExpression':
                switch (expression.object.type) {
                    case 'Identifier':
                        return new methodexpression_1.MethodExpression(expression.object.name, Array.isArray(expression.arguments) ? expression.arguments.map((arg) => this.transform(arg)) : [], null);
                    default:
                        throw new Error('Caller of method expression is not a Identifier, but is ' + expression.object.type);
                }
            case 'DateTimeLiteral':
                return new literalexpression_1.LiteralExpression(new Date(expression.value));
            case 'DateLiteral':
                let value = new Date(expression.value);
                return new literalexpression_1.LiteralExpression(new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), 0, 0, 0, 0)));
            case 'NumberLiteral':
                return new literalexpression_1.LiteralExpression(Number(expression.value));
            case 'BooleanLiteral':
                return new literalexpression_1.LiteralExpression(expression.value == true || expression.value == 'true' ? true : false);
            case 'NullLiteral':
                return new literalexpression_1.LiteralExpression(null);
            case 'Literal':
                return new literalexpression_1.LiteralExpression(expression.value);
            case 'ConditionalExpression':
                return new conditionalexpression_1.ConditionalExpression(this.transform(expression.test), this.transform(expression.left), this.transform(expression.right));
            case 'ObjectLiteral':
                return new objectexpression_1.ObjectExpression(Array.isArray(expression.properties) ?
                    expression.properties.map(({ key, value }) => {
                        switch (key.type) {
                            case 'Identifier':
                                key = {
                                    type: 'Literal',
                                    value: key.name
                                };
                                break;
                            default:
                                break;
                        }
                        return { key: this.transform(key), value: this.transform(value) };
                    }) : []);
            case 'TemplateLiteral':
                if (Array.isArray(expression.values) && expression.values.length > 0) {
                    let literals = [], expressions = [], first = expression.values[0];
                    if (first.type == 'TemplateExpression')
                        literals.push(this.transform({ type: 'Literal', value: '' }));
                    literals.push(...expression.values
                        .filter(value => value.type == 'Literal')
                        .map(value => this.transform(value))
                        .map(literal => { literal.value = literal.value.replace(/(\\)?\$(\\)?\{/g, '${'); return literal; }));
                    expressions.push(...expression.values.filter(value => value.type == 'TemplateExpression').map(value => this.transform(value.value)));
                    return new templateliteralexpression_1.TemplateLiteralExpression(literals, expressions);
                }
                return new templateliteralexpression_1.TemplateLiteralExpression([], []);
            case 'ArrayExpression':
                return new indexexpression_1.IndexExpression(this.transform(expression.object), this.transform(expression.index));
            case 'ArrayLiteral':
                return new arrayexpression_1.ArrayExpression(Array.isArray(expression.elements) ? expression.elements.map((arg) => this.transform(arg)) : []);
            case 'LogicalExpression':
            case 'LogicalExpression':
                switch (expression.operator) {
                    case '&&':
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.And, this.transform(expression.left), this.transform(expression.right));
                    case '||':
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.Or, this.transform(expression.left), this.transform(expression.right));
                }
                break;
            case 'RelationalExpression':
                switch (expression.operator) {
                    case '==': // equal
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.Equal, this.transform(expression.left), this.transform(expression.right));
                    case '!=': // not equal
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.NotEqual, this.transform(expression.left), this.transform(expression.right));
                    case '<': // lesser
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.Lesser, this.transform(expression.left), this.transform(expression.right));
                    case '<=': // lesser or equal
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.LesserOrEqual, this.transform(expression.left), this.transform(expression.right));
                    case '>': // greater
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.Greater, this.transform(expression.left), this.transform(expression.right));
                    case '>=': // greater or equal
                        return new logicalexpression_1.LogicalExpression(logicalexpression_1.LogicalOperatorType.GreaterOrEqual, this.transform(expression.left), this.transform(expression.right));
                }
                break;
            case 'PostfixExpression':
                switch (expression.operator) {
                    case '--':
                        return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Decrement, unaryexpression_1.UnaryAffixType.Postfix, this.transform(expression.argument));
                    case '++':
                        return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Increment, unaryexpression_1.UnaryAffixType.Postfix, this.transform(expression.argument));
                }
                break;
            case 'UnaryExpression':
                switch (expression.operator) {
                    case '!':
                        return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Invert, unaryexpression_1.UnaryAffixType.Prefix, this.transform(expression.argument));
                    case '~':
                        return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Complement, unaryexpression_1.UnaryAffixType.Prefix, this.transform(expression.argument));
                    case '+':
                        return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Positive, unaryexpression_1.UnaryAffixType.Prefix, this.transform(expression.argument));
                    case '-':
                        return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Negative, unaryexpression_1.UnaryAffixType.Prefix, this.transform(expression.argument));
                    case '--':
                        return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Decrement, unaryexpression_1.UnaryAffixType.Prefix, this.transform(expression.argument));
                    case '++':
                        return new unaryexpression_1.UnaryExpression(unaryexpression_1.UnaryOperatorType.Increment, unaryexpression_1.UnaryAffixType.Prefix, this.transform(expression.argument));
                }
                break;
            case 'ShiftExpression':
                switch (expression.operator) {
                    case '<<':
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.LeftShift, this.transform(expression.left), this.transform(expression.right));
                    case '>>':
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.RightShift, this.transform(expression.left), this.transform(expression.right));
                    case '>>>': // zero-fill right-shift 
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.RightShift, this.transform(expression.left), this.transform(expression.right));
                }
                break;
            case 'BitwiseExpression':
                switch (expression.operator) {
                    case '|':
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Or, this.transform(expression.left), this.transform(expression.right));
                    case '^':
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.ExclusiveOr, this.transform(expression.left), this.transform(expression.right));
                    case '&':
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.And, this.transform(expression.left), this.transform(expression.right));
                }
                break;
            case 'BinaryExpression':
                switch (expression.operator) {
                    case '+': // addition
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Addition, this.transform(expression.left), this.transform(expression.right));
                    case '-': // subtraction
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Subtraction, this.transform(expression.left), this.transform(expression.right));
                    case '*': // multiplication
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Multiplication, this.transform(expression.left), this.transform(expression.right));
                    case '/': // division
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Division, this.transform(expression.left), this.transform(expression.right));
                    case '%': // modulus
                        return new binaryexpression_1.BinaryExpression(binaryexpression_1.BinaryOperatorType.Modulus, this.transform(expression.left), this.transform(expression.right));
                }
                break;
        }
        throw new Error('Expression type "' + expression.type + '" is unknown');
    }
}
exports.ExpressionVisitor = ExpressionVisitor;
//export { IExpression, Expression, ExpressionType } from './expression';
//export { IArrayExpression, IBinaryExpression, ICompoundExpression, IConditionalExpression, IIdentifierExpression, ILiteralExpression, ILogicalExpression, IMemberExpression, IMethodExpression, IUnaryExpression }
var expression_1 = require("./expression/expression");
exports.Expression = expression_1.Expression;
exports.ExpressionType = expression_1.ExpressionType;
var literalexpression_2 = require("./expression/literalexpression");
exports.LiteralExpression = literalexpression_2.LiteralExpression;
var identifierexpression_2 = require("./expression/identifierexpression");
exports.IdentifierExpression = identifierexpression_2.IdentifierExpression;
var memberexpression_2 = require("./expression/memberexpression");
exports.MemberExpression = memberexpression_2.MemberExpression;
var methodexpression_2 = require("./expression/methodexpression");
exports.MethodExpression = methodexpression_2.MethodExpression;
var unaryexpression_2 = require("./expression/unaryexpression");
exports.UnaryExpression = unaryexpression_2.UnaryExpression;
exports.UnaryOperatorType = unaryexpression_2.UnaryOperatorType;
exports.UnaryAffixType = unaryexpression_2.UnaryAffixType;
var binaryexpression_2 = require("./expression/binaryexpression");
exports.BinaryExpression = binaryexpression_2.BinaryExpression;
exports.BinaryOperatorType = binaryexpression_2.BinaryOperatorType;
var logicalexpression_2 = require("./expression/logicalexpression");
exports.LogicalExpression = logicalexpression_2.LogicalExpression;
exports.LogicalOperatorType = logicalexpression_2.LogicalOperatorType;
var conditionalexpression_2 = require("./expression/conditionalexpression");
exports.ConditionalExpression = conditionalexpression_2.ConditionalExpression;
var arrayexpression_2 = require("./expression/arrayexpression");
exports.ArrayExpression = arrayexpression_2.ArrayExpression;
var indexexpression_2 = require("./expression/indexexpression");
exports.IndexExpression = indexexpression_2.IndexExpression;
var templateliteralexpression_2 = require("./expression/templateliteralexpression");
exports.TemplateLiteralExpression = templateliteralexpression_2.TemplateLiteralExpression;
var objectexpression_2 = require("./expression/objectexpression");
exports.ObjectExpression = objectexpression_2.ObjectExpression;
//# sourceMappingURL=expressionvisitor.js.map