"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_1 = require("./expression/expression");
const literalexpression_1 = require("./expression/literalexpression");
const methodexpression_1 = require("./expression/methodexpression");
const reducervisitor_1 = require("./reducervisitor");
class ODataVisitor extends reducervisitor_1.ReducerVisitor {
    constructor() {
        super();
    }
    visitOData(filter) {
        return super.visitOData(filter);
    }
    get it() {
        return '';
    }
    visitMethod(expression) {
        let parameters = expression.parameters.map((arg) => arg.accept(this)), caller = undefined, name = undefined;
        let params;
        // routine to get all parameters that is a literal, eg; solvable
        let getParams = (expression, ...typeofs) => {
            let params = null, getType = (t) => {
                if (typeof t == 'object') {
                    if (t.getTime && t.getTime() >= 0)
                        return 'date';
                }
                return typeof t;
            };
            try {
                if (parameters.every(expression => expression.type == expression_1.ExpressionType.Literal) == true) {
                    params = parameters.map(expr => expr.value);
                    if (new RegExp('^' + typeofs.map(t => t.endsWith('?') ? '(' + t.slice(0, -1) + ')?' : t).join(';') + ';?$').test(params.map(p => getType(p)).join(';') + ';') == false)
                        throw new TypeError(params.map(p => getType(p)).join(', '));
                }
                else if ((parameters.length == typeofs.length) == false) {
                    throw new Error();
                }
            }
            catch (ex) {
                throw new Error('Method "' + expression.name + '" requires parameters of (' + typeofs.join(', ') + ')' + (ex.name == 'TypeError' ? ', but got "' + ex.message + '"' : ''));
            }
            return params;
        };
        switch (expression.name) {
            // String Functions
            case 'substringof': // bool substringof(string po, string p1)
                if ((params = getParams(expression, 'string', 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).indexOf(String(params[1])) >= 0);
                break;
            case 'endswith': // bool endswith(string p0, string p1)
                if ((params = getParams(expression, 'string', 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).endsWith(String(params[1])));
                break;
            case 'startswith': // bool startswith(string p0, string p1)
                if ((params = getParams(expression, 'string', 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).startsWith(String(params[1])));
                break;
            case 'contains': // bool contains(string p0, string p1)
                if ((params = getParams(expression, 'string', 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).indexOf(String(params[1])) >= 0);
                break;
            case 'length': // int length(string p0)
                if ((params = getParams(expression, 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).length);
                break;
            case 'indexof': // int indexof(string p0, string p1)
                if ((params = getParams(expression, 'string', 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).indexOf(String(params[1])));
                break;
            case 'replace': // string replace(string p0, string find, string replace)
                if ((params = getParams(expression, 'string', 'string', 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).replace(String(params[1]), String(params[2])));
                break;
            case 'substring': // string substring(string p0, int pos, int? length)
                if ((params = getParams(expression, 'string', 'number', 'number?')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).replace(String(params[1]), String(params[2])));
                break;
            case 'tolower': // string tolower(string p0)
                if ((params = getParams(expression, 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).toLowerCase());
                break;
            case 'toupper': // string toupper(string p0)
                if ((params = getParams(expression, 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).toUpperCase());
                break;
            case 'trim': // string trim(string p0)
                if ((params = getParams(expression, 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]).trim());
                break;
            case 'concat': // string concat(string p0, string p1)
                if ((params = getParams(expression, 'string', 'string')) != null)
                    return new literalexpression_1.LiteralExpression(String(params[0]) + String(params[1]));
                break;
            // Date Functions
            case 'day': // int day(DateTime p0)
                if ((params = getParams(expression, 'date')) != null)
                    return new literalexpression_1.LiteralExpression(params[0].getDate());
                break;
            case 'hour': // int hour(DateTime p0)
                if ((params = getParams(expression, 'date')) != null)
                    return new literalexpression_1.LiteralExpression(params[0].getUTCHours());
                break;
            case 'minute': // int minute(DateTime p0)
                if ((params = getParams(expression, 'date')) != null)
                    return new literalexpression_1.LiteralExpression(params[0].getUTCMinutes());
                break;
            case 'month': // int month(DateTime p0)
                if ((params = getParams(expression, 'date')) != null)
                    return new literalexpression_1.LiteralExpression(params[0].getMonth() + 1);
                break;
            case 'second': // int second(DateTime p0)
                if ((params = getParams(expression, 'date')) != null)
                    return new literalexpression_1.LiteralExpression(params[0].getSeconds());
                break;
            case 'year': // int year(DateTime p0)
                if ((params = getParams(expression, 'date')) != null)
                    return new literalexpression_1.LiteralExpression(params[0].getFullYear());
                break;
            // Math Functions
            case 'round': // number round(number p0)
                if ((params = getParams(expression, 'number')) != null)
                    return new literalexpression_1.LiteralExpression(Math.round(Number(params[0])));
                break;
            case 'floor': // number floor(number p0)
                if ((params = getParams(expression, 'number')) != null)
                    return new literalexpression_1.LiteralExpression(Math.floor(Number(params[0])));
                break;
            case 'ceiling': // number ceiling(number p0)
                if ((params = getParams(expression, 'number')) != null)
                    return new literalexpression_1.LiteralExpression(Math.ceil(Number(params[0])));
                break;
            // Type Functions
            //case 'isof': // bool IsOf(type p0) | bool IsOf(expression p0, type p1)
            default:
                throw new Error('OData visitor does not support function "' + expression.name + '"');
        }
        return new methodexpression_1.MethodExpression(expression.name, parameters, caller);
    }
    static evaluate(expression, it = null) {
        let reducer = new ODataVisitor(), result;
        if (typeof expression == 'string')
            expression = reducer.visitOData(expression);
        result = reducer.evaluate(expression, it);
        return result.type == expression_1.ExpressionType.Literal ? result.value : undefined;
    }
}
exports.ODataVisitor = ODataVisitor;
//# sourceMappingURL=odatavisitor.js.map