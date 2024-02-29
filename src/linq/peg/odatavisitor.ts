import { IExpression, Expression, ExpressionType } from './expression/expression'
import { ILiteralExpression, LiteralExpression } from './expression/literalexpression'
import { ICompoundExpression } from './expression/compoundexpression'
import { IIdentifierExpression, IdentifierExpression } from './expression/identifierexpression'
import { IMemberExpression, MemberExpression } from './expression/memberexpression'
import { IMethodExpression, MethodExpression } from './expression/methodexpression'
import { IUnaryExpression, UnaryExpression, UnaryOperatorType, UnaryAffixType } from './expression/unaryexpression'
import { IBinaryExpression, BinaryExpression, BinaryOperatorType } from './expression/binaryexpression'
import { ILogicalExpression, LogicalExpression, LogicalOperatorType } from './expression/logicalexpression'
import { IConditionalExpression } from './expression/conditionalexpression'
import { IArrayExpression, ArrayExpression } from './expression/arrayexpression'

import { ReducerVisitor } from './reducervisitor'
import { LambdaExpression, ILambdaExpression } from './expression/lambdaexpression'

export class ODataVisitor extends ReducerVisitor {
    constructor() {
        super()
    }
    
    public parseOData(filter: string): IExpression {
        return super.parseOData(filter)
    }

    public visitMethod(expression: IMethodExpression): IExpression {
        let parameters: IExpression[] = expression.parameters.map((arg) => arg.accept(this)),
            caller: IExpression | undefined = expression.caller?.accept(this) ?? undefined,
            name: string | undefined = undefined
        
        let params: Array<any> | undefined

        // routine to get all parameters that is a literal, eg; solvable
        let getParams = (expression: IMethodExpression, ...typeofs: Array<string>) => {
            let params: Array<any> | undefined,
                getType = (t: any) => {
                    if(t == null)
                        return 'undefined'

                    if(t != null && typeof t == 'object') {
                        if(t.getTime && t.getTime() >= 0)
                            return 'date'
                    }

                    return typeof t
                }

            try {
                if(parameters.every(expression => expression.type == ExpressionType.Literal) == true) {
                    params = parameters.map(expr => (<LiteralExpression>expr).value)

                    if(new RegExp('^' + typeofs.map(t => t.endsWith('?') ? `(${t.slice(0, -1)})?` : `(${t})`).join(';') + ';?$').test(params.map(p => getType(p)).join(';') + ';') == false)
                        throw new TypeError(params.map(p => getType(p)).join(', '))
                }
                else if((parameters.length == typeofs.length) == false) {
                    throw new Error()
                }
            }
            catch(ex) {
                throw new Error('Method "' + expression.name + '" requires parameters of (' + typeofs.join(', ') + ')' + (ex.name == 'TypeError' ? ', but got "' + ex.message + '"' : ''))
            }

            return params
        }

        switch(expression.name) {
            // String Functions
            case 'substringof': // bool substringof(string po, string p1)
                if((params = getParams(expression, 'string|undefined', 'string')) != null) {
                    if(params[0] == null)
                        return new LiteralExpression(false)

                    return new LiteralExpression(String(params[0]).indexOf(String(params[1])) >= 0)
                }

                break

            case 'endswith': // bool endswith(string p0, string p1)
                if((params = getParams(expression, 'string|undefined', 'string')) != null) {
                    if(params[0] == null)
                        return new LiteralExpression(false)
                    
                    return new LiteralExpression(String(params[0]).endsWith(String(params[1])))
                }
                break

            case 'startswith': // bool startswith(string p0, string p1)
                if((params = getParams(expression, 'string|undefined', 'string')) != null) {
                    if(params[0] == null)
                        return new LiteralExpression(false)

                    return new LiteralExpression(String(params[0]).startsWith(String(params[1])))
                }

                break

            case 'contains': // bool contains(string p0, string p1)
                if((params = getParams(expression, 'string|undefined', 'string')) != null) {
                    if(params[0] == null)
                        return new LiteralExpression(false)
                    
                    return new LiteralExpression(String(params[0]).indexOf(String(params[1])) >= 0)
                }
                
                break

            case 'length': // int length(string p0)
                if((params = getParams(expression, 'string')) != null)
                    return new LiteralExpression(String(params[0]).length)
                
                break

            case 'indexof': // int indexof(string p0, string p1)
                if((params = getParams(expression, 'string', 'string')) != null)
                    return new LiteralExpression(String(params[0]).indexOf(String(params[1])))

                break

            case 'replace': // string replace(string p0, string find, string replace)
                if((params = getParams(expression, 'string', 'string', 'string')) != null)
                    return new LiteralExpression(String(params[0]).replace(String(params[1]), String(params[2])))

                break

            case 'substring': // string substring(string p0, int pos, int? length)
                if((params = getParams(expression, 'string', 'number', 'number?')) != null)
                    return new LiteralExpression(String(params[0]).replace(String(params[1]), String(params[2])))

                break
                    
            case 'tolower': // string tolower(string p0)
                if((params = getParams(expression, 'string|undefined')) != null) {
                    if(params[0] == null)
                        return new LiteralExpression(params[0])

                    return new LiteralExpression(String(params[0]).toLowerCase())
                }

                break

            case 'toupper': // string toupper(string p0)
                if((params = getParams(expression, 'string|undefined')) != null) {
                    if(params[0] == null)
                        return new LiteralExpression(params[0])
                 
                    return new LiteralExpression(String(params[0]).toUpperCase())
                }

                break

            case 'trim': // string trim(string p0)
                if((params = getParams(expression, 'string')) != null)
                    return new LiteralExpression(String(params[0]).trim())

                break

            case 'concat': // string concat(string p0, string p1)
                if((params = getParams(expression, 'string', 'string')) != null)
                    return new LiteralExpression(String(params[0]) + String(params[1]))

                break

            // Date Functions
            case 'day': // int day(DateTime p0)
                if((params = getParams(expression, 'date')) != null)
                    return new LiteralExpression((<Date>params[0]).getDate())

                break
                        
            case 'hour': // int hour(DateTime p0)
                if((params = getParams(expression, 'date')) != null)
                    return new LiteralExpression((<Date>params[0]).getUTCHours())

                break

            case 'minute': // int minute(DateTime p0)
                if((params = getParams(expression, 'date')) != null)
                    return new LiteralExpression((<Date>params[0]).getUTCMinutes())

                break

            case 'month': // int month(DateTime p0)
                if((params = getParams(expression, 'date')) != null)
                    return new LiteralExpression((<Date>params[0]).getMonth() + 1)

                break

            case 'second': // int second(DateTime p0)
                if((params = getParams(expression, 'date')) != null)
                    return new LiteralExpression((<Date>params[0]).getSeconds())

                break

            case 'year': // int year(DateTime p0)
                if((params = getParams(expression, 'date')) != null)
                    return new LiteralExpression((<Date>params[0]).getFullYear())

                break

            // Math Functions
            case 'round': // number round(number p0)
                if((params = getParams(expression, 'number')) != null)
                    return new LiteralExpression(Math.round(Number(params[0])))

                break

            case 'floor': // number floor(number p0)
                if((params = getParams(expression, 'number')) != null)
                    return new LiteralExpression(Math.floor(Number(params[0])))

                break

            case 'ceiling': // number ceiling(number p0)
                if((params = getParams(expression, 'number')) != null)
                    return new LiteralExpression(Math.ceil(Number(params[0])))

                break

            case 'any':
            case 'all':
                break

            default:
                throw new Error('OData visitor does not support function "' + expression.name + '"')
        }

        return new MethodExpression(expression.name, parameters, caller)
    }
    
    public evaluate(expression: IExpression, scope?: Record<string, any> | number | string | null): IExpression
    public evaluate(expression: IExpression | null, scope?: Record<string, any> | number | string | null): IExpression | null
    public evaluate(expression: IExpression | null, scope: Record<string, any> | number | string | null = null): IExpression | null {
        if(expression == null)
            return null

        switch(expression.type) {
            case ExpressionType.Method:
                let caller = this.evaluate((<IMethodExpression>expression).caller ?? null, scope)

                if(caller && LiteralExpression.instanceof(caller) && Array.isArray(caller.value)) {
                    switch((<IMethodExpression>expression).name) {
                        case 'any': {
                            let lambda = <ILambdaExpression>(<IMethodExpression>expression).parameters[0],
                                reducer = new ODataVisitor(),
                                isTrue = (expr: IExpression) => {
                                    return LiteralExpression.instanceof(expr) && expr.value === true
                                },
                                scopeName = (<IIdentifierExpression>lambda.parameters[0]).name

                            if(caller.value.some(e => isTrue(reducer.evaluate(lambda.expression, isRecord(e) ? Object.assign({}, { [scopeName]: e }) : e)))) {
                                return new LiteralExpression(true)
                            }
                            
                            return new LiteralExpression(false)
                        }

                        case 'all': {
                            let lambda = <ILambdaExpression>(<IMethodExpression>expression).parameters[0],
                                reducer = new ODataVisitor(),
                                isTrue = (expr: IExpression) => {
                                    return LiteralExpression.instanceof(expr) && expr.value === true
                                },
                                scopeName = (<IIdentifierExpression>lambda.parameters[0]).name
                                
                            if(caller.value.every(e => isTrue(reducer.evaluate(lambda.expression, isRecord(e) ? Object.assign({}, { [scopeName]: e }) : e)))) {
                                return new LiteralExpression(true)
                            }
                            
                            return new LiteralExpression(false)
                        }
                    }
                }

                return this.visit(new MethodExpression((<IMethodExpression>expression).name, (<IMethodExpression>expression).parameters.map(p => this.evaluate(p, scope)), caller ?? undefined))

            default:
                return super.evaluate(expression, scope)
        }
    }

    public static evaluate(expression: string, scope?: Record<string, any> | number | Date | string | null): any
    public static evaluate(expression: IExpression, scope?: Record<string, any> | number | Date | string | null): any
    public static evaluate(expression: IExpression | string, scope: Record<string, any> | number | Date | string | null = null): any {
        let reducer = new ODataVisitor(),
            result: IExpression

        if(typeof expression == 'string')
            expression = reducer.parseOData(expression)

        result = reducer.evaluate(expression, scope)

        return result.type == ExpressionType.Literal ? (<ILiteralExpression>result).value : undefined
    }
}

function isRecord(value: Record<string, any> | any): value is Record<string, any> {
    return value !== null && typeof value == 'object' && value.getTime === undefined
}