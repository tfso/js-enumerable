import { 
    IExpressionVisitor, ExpressionVisitor,
    IExpression, Expression, ExpressionType,
    ILambdaExpression, LambdaExpression,
    ILiteralExpression, LiteralExpression,
    ICompoundExpression,
    IIdentifierExpression, IdentifierExpression,
    IMemberExpression, MemberExpression,
    IMethodExpression, MethodExpression,
    IUnaryExpression, UnaryExpression, UnaryOperatorType, UnaryAffixType,
    IBinaryExpression, BinaryExpression, BinaryOperatorType,
    ILogicalExpression, LogicalExpression, LogicalOperatorType,
    IConditionalExpression, ConditionalExpression,
    IArrayExpression, ArrayExpression,
    IIndexExpression, IndexExpression,
    ITemplateLiteralExpression, TemplateLiteralExpression,
    IObjectExpression, ObjectExpression, IObjectProperty 
} from './expressionvisitor'

import { parse } from './parser'

export class ReducerVisitor extends ExpressionVisitor {
    private _parentExpressionStack: Array<IExpression> = [];

    constructor() {
        super()
    }

    public parse(type: 'odata', predicate: string): ReturnType<typeof parse>
    public parse(type: 'javascript', lambda: (it: any, ...param: Array<any>) => boolean, ...params: Array<any>): ReturnType<typeof parse>
    public parse(type: 'javascript', predicate: string, ...params: Array<any>): ReturnType<typeof parse>
    public parse(type: 'odata' | 'javascript', predicate: any, ...params: Array<any>): ReturnType<typeof parse> {
        let { original, expression } = super.parse(<any>type, predicate) ?? { }

        if(type == 'javascript') {
            let scope: Record<string, any> = {},
                scopeName: string | null = null
    
            if(expression?.type == ExpressionType.Lambda) {
                for(let idx = 0; idx < (<ILambdaExpression>expression).parameters.length; idx++) {
                    let param = (<ILambdaExpression>expression).parameters[idx]

                    if(param.type == ExpressionType.Identifier) {
                        if(idx == 0) {
                            scopeName = (<IIdentifierExpression>param).name
                        }
                        else {
                            if(idx <= params.length) {
                                scope[(<IIdentifierExpression>param).name] = params[idx - 1]
                            }
                        }
                    }
                }

                let reduced = this.evaluate((<ILambdaExpression>expression).expression, {}, scope)

                return {
                    type: 'javascript', 
                    original,
                    expression: reduced.type == ExpressionType.Literal ? reduced : new LambdaExpression((<ILambdaExpression>expression).parameters, reduced)
                }
            }
        }

        return {
            type, 
            original,
            expression
        }
    }

    public parseLambda(lambda: string, ...params: Array<any>): IExpression
    public parseLambda(lambda: (it: Record<string, any>, ...params: Array<any>) => any, ...params: Array<any>): IExpression
    public parseLambda(lambda: any, ...params: Array<any>): IExpression {
        return this.parse('javascript', lambda, ...params)?.expression
    }
    
    public visitLiteral(expression: ILiteralExpression): IExpression {
        return this.evaluate(expression)
    }

    public visitMethod(expression: IMethodExpression): IExpression {
        let expr: IMethodExpression,
            value: any

        expr = new MethodExpression(expression.name, expression.parameters.map((arg) => arg.accept(this)), expression.caller)

        return expr
    }

    public visitBinary(expression: IBinaryExpression): IExpression {
        let left = expression.left,
            right = expression.right 

        if(left.type == ExpressionType.Literal && right.type == ExpressionType.Literal) {
            let leftValue = (<LiteralExpression>left).value,
                rightValue = (<LiteralExpression>right).value

            switch(expression.operator) {
                case BinaryOperatorType.Addition:
                    return new LiteralExpression(leftValue + rightValue)

                case BinaryOperatorType.Subtraction:
                    return new LiteralExpression(leftValue - rightValue)

                case BinaryOperatorType.Multiplication:
                    return new LiteralExpression(leftValue * rightValue)

                case BinaryOperatorType.Division:
                    return new LiteralExpression(leftValue / rightValue)

                case BinaryOperatorType.Modulus:
                    return new LiteralExpression(leftValue % rightValue)

                case BinaryOperatorType.And:
                    return new LiteralExpression(leftValue & rightValue)

                case BinaryOperatorType.Or:
                    return new LiteralExpression(leftValue | rightValue)

                case BinaryOperatorType.ExclusiveOr:
                    return new LiteralExpression(leftValue ^ rightValue)

                case BinaryOperatorType.LeftShift:
                    return new LiteralExpression(leftValue << rightValue)

                case BinaryOperatorType.RightShift:
                    return new LiteralExpression(leftValue >> rightValue)
            }
        }

        return new BinaryExpression(expression.operator, left.accept(this), right.accept(this))
    }

    public visitConditional(expression: IConditionalExpression): IExpression {
        let condition: IExpression = expression.condition.accept(this)

        if(condition.type == ExpressionType.Literal) {
            if((<LiteralExpression>condition).value === true)
                return expression.success.accept(this)
            else
                return expression.failure.accept(this)
        }

        return new ConditionalExpression(condition, expression.success.accept(this), expression.failure.accept(this))
    }

    public visitLogical(expression: ILogicalExpression): IExpression {
        let left: IExpression = expression.left.accept(this),
            right: IExpression = expression.right.accept(this)

        if(left.type == ExpressionType.Literal && right.type == ExpressionType.Literal) {
            let leftValue = (<LiteralExpression>left).value,
                rightValue = (<LiteralExpression>right).value

            switch(expression.operator) {
                case LogicalOperatorType.Equal:
                    return new LiteralExpression(leftValue >= rightValue && leftValue <= rightValue) // fixes date comparements
                case LogicalOperatorType.NotEqual:
                    return new LiteralExpression(leftValue < rightValue || leftValue > rightValue) // fixes date comparements
                case LogicalOperatorType.And:
                    return new LiteralExpression(leftValue && rightValue)
                case LogicalOperatorType.Or:
                    return new LiteralExpression(leftValue || rightValue)
                case LogicalOperatorType.Greater:
                    return new LiteralExpression(leftValue > rightValue)
                case LogicalOperatorType.GreaterOrEqual:
                    return new LiteralExpression(leftValue >= rightValue)
                case LogicalOperatorType.Lesser:
                    return new LiteralExpression(leftValue < rightValue)
                case LogicalOperatorType.LesserOrEqual:
                    return new LiteralExpression(leftValue <= rightValue)
                case LogicalOperatorType.In:
                    const values = Array.isArray(rightValue) ? rightValue : [rightValue]
                    return new LiteralExpression(values.includes(leftValue))
            }
        }

        switch(expression.operator) {
            case LogicalOperatorType.In:
                if(left.type == ExpressionType.Literal && (right.type == ExpressionType.Array || right.type == ExpressionType.Literal)) {
                    const leftValue = (<LiteralExpression>left).value
                    const rightValues: IExpression[] = []

                    if(right.type == ExpressionType.Array)
                        rightValues.push(...(<ArrayExpression>right).elements)

                    else if(right.type == ExpressionType.Literal)
                        rightValues.push((<LiteralExpression>right).value)

                    return new LiteralExpression(rightValues.some(expr => expr.type == ExpressionType.Literal ? (<LiteralExpression>expr).value === leftValue : false))
                }
                break

            case LogicalOperatorType.And:
                if(left.type == ExpressionType.Literal && (<LiteralExpression>left).value === true) return right
                if(right.type == ExpressionType.Literal && (<LiteralExpression>right).value === true) return left

                break

            case LogicalOperatorType.Or:
                if(left.type == ExpressionType.Literal && (<LiteralExpression>left).value === true) return left
                if(right.type == ExpressionType.Literal && (<LiteralExpression>right).value === true) return right

                break
        }

        return new LogicalExpression(expression.operator, left, right)
    }

    public evaluate(expression: IExpression, scope?: Record<string, any> | number | string | null, global?: Record<string, any>): IExpression 
    public evaluate(expression: IExpression | null, scope?: Record<string, any> | number | string | null, global?: Record<string, any>): IExpression | null
    public evaluate(expression: IExpression | null, scope: Record<string, any> | number | string | null = null, global: Record<string, any> = {}): IExpression | null {
        if(expression == null)
            return null

        let value: any = null       

        switch(expression.type) {
            case ExpressionType.Lambda:
                let parameter = (<ILambdaExpression>expression).parameters[0] ?? null,
                    scopeName: string | null = null

                if(parameter?.type == ExpressionType.Identifier) {
                    scopeName = (<IIdentifierExpression>parameter).name
                }
                
                let newScope = {}
                if(typeof scopeName == 'string') {
                    if(isRecord(global) && scopeName in global)
                        Object.assign(newScope, global[scopeName])

                    if(isRecord(scope))
                        Object.assign(newScope, { [scopeName]: scope })
                } 

                let result = this.evaluate((<ILambdaExpression>expression).expression, newScope, Object.assign({}, global, newScope))
                
                return result.type == ExpressionType.Literal ? result : new LambdaExpression((<ILambdaExpression>expression).parameters, result)

            case ExpressionType.Literal:
                break

            case ExpressionType.Identifier: {
                let identifier = (<IIdentifierExpression>expression),
                    currentScope = Object.assign({}, global ?? {}, scope ?? {})

                
                // this object
                if(isRecord(currentScope) && identifier.name in currentScope) {
                    value = currentScope[identifier.name]
                    
                    if(value == null)
                        return new LiteralExpression(null)

                    switch(typeof value) {
                        case 'string':
                        case 'number':
                        case 'boolean':
                            break
                    
                        case 'object':
                            if(value.getTime && value.getTime() >= 0)
                                break

                            if(Array.isArray(value) == true)
                                break // hmm, literal value as array?

                            value = null
                            break

                        default:
                            value = null
                            break
                    }

                    return new LiteralExpression(value)
                }
                else if(['number', 'string'].includes(typeof scope)) {
                    return new LiteralExpression(scope)
                }
                
                break
            }

            case ExpressionType.Array:
                const elements = (<IArrayExpression>expression).elements.map(v => this.evaluate(v, scope, global))

                if(elements.every(expr => expr.type == ExpressionType.Literal))
                    return new LiteralExpression(elements.map(expr => (<LiteralExpression>expr).value))
                
                return new ArrayExpression(elements)

            case ExpressionType.Object:
                return new ObjectExpression((<IObjectExpression>expression).properties.map(el => <IObjectProperty>{ key: this.evaluate(el.key, scope, global), value: this.evaluate(el.value, scope, global) }))

            case ExpressionType.Index: {
                let object = this.evaluate((<IIndexExpression>expression).object, scope, global),
                    index = this.evaluate((<IIndexExpression>expression).index, scope, global)

                if(index.type == ExpressionType.Literal)
                    switch(object.type) {
                        case ExpressionType.Object: 
                            let property = (<IObjectExpression>object).properties.find(prop => {
                                switch(prop.key.type) {
                                    case ExpressionType.Identifier:
                                        if((<IIdentifierExpression>prop.key).name == (<ILiteralExpression>index).value)
                                            return true
                                        break

                                    case ExpressionType.Literal:
                                        if((<ILiteralExpression>prop.key).value == (<ILiteralExpression>index).value)
                                            return true
                                        break
                                }

                                return false
                            })
                            return property ? this.evaluate(property.value, scope, global) : new LiteralExpression(null)

                        case ExpressionType.Array:
                            return Array.from((<IArrayExpression>object).elements)[(<ILiteralExpression>index).value]
                            
                        case ExpressionType.Literal:
                            if(typeof (<ILiteralExpression>object).value == 'object') {
                                if(Array.isArray((<ILiteralExpression>object).value)) {
                                    return new LiteralExpression(Array.from((<ILiteralExpression>object).value)[(<ILiteralExpression>index).value])
                                }
                                
                                let descriptor: PropertyDescriptor | undefined

                                if(descriptor = Object.getOwnPropertyDescriptor((<ILiteralExpression>object).value, (<ILiteralExpression>index).value))
                                    return new LiteralExpression(descriptor.value)
                            }
                            
                            return new LiteralExpression(null)                            
                    }

                break
            }

            case ExpressionType.Member: {
                let currentGlobal = Object.assign({}, global),
                    currentScope = Object.assign({}, global, scope),
                    current = <IMemberExpression>expression                    

                do {
                    if(IdentifierExpression.instanceof(current.object)) {
                        if(current.object.name != 'this') {
                            let descriptor = Object.getOwnPropertyDescriptor(currentScope, current.object.name)

                            if(descriptor && typeof descriptor.value == 'object')
                                currentScope = Object.assign({}, descriptor.value)
                            else {
                                currentScope = {}
                                break
                            }
                        }
                    }
                    else {
                        currentScope = {}
                        break
                    }

                    if(!MemberExpression.instanceof(current.property))
                        break

                    current = current.property
                }
                while (true)

                if(current.property.type == ExpressionType.Identifier) {
                    currentGlobal = {}
                } 

                value = this.evaluate(current.property, currentScope, currentGlobal)

                if(value.type == ExpressionType.Literal) {
                    return value
                }
                else if(current.property.equal(value) == false) {
                    return new MemberExpression(current.object, value)
                }

                break
            }

            case ExpressionType.Conditional:
                return this.visit(new ConditionalExpression(this.evaluate((<IConditionalExpression>expression).condition, scope, global), this.evaluate((<IConditionalExpression>expression).success, scope, global), this.evaluate((<IConditionalExpression>expression).failure, scope, global)))

            case ExpressionType.Logical:
                return this.visit(new LogicalExpression((<ILogicalExpression>expression).operator, this.evaluate((<ILogicalExpression>expression).left, scope, global), this.evaluate((<ILogicalExpression>expression).right, scope, global)))

            case ExpressionType.Binary:
                return this.visit(new BinaryExpression((<IBinaryExpression>expression).operator, this.evaluate((<IBinaryExpression>expression).left, scope, global), this.evaluate((<IBinaryExpression>expression).right, scope, global)))

            case ExpressionType.Method:
                return this.visit(new MethodExpression((<IMethodExpression>expression).name, (<IMethodExpression>expression).parameters.map(p => this.evaluate(p, scope, global)), (<IMethodExpression>expression).caller ? this.evaluate((<IMethodExpression>expression).caller ?? null, scope, global) ?? undefined : undefined))
            
            default:
                let o = <IExpression>Object.create(Object.getPrototypeOf(expression), Object.getOwnPropertyNames(expression).reduce<Record<string, any>>((prev, cur) => {
                    let prop = Object.getOwnPropertyDescriptor(expression, cur)

                    if(prop?.value instanceof Expression)
                        prop.value = this.evaluate(prop.value, scope, global)
                    else if(prop?.value instanceof Array)
                        prop.value = prop.value.map(a => a instanceof Expression ? this.evaluate(a, scope, global) : a)

                    prev[cur] = prop

                    return prev
                }, {}))

                return this.visit(o)
        }

        return expression
    }

    public static evaluate(expression: IExpression, scope: Record<string, any> | null = null): any {
        let reducer = new ReducerVisitor(),
            result = reducer.evaluate(expression, scope)

        return result.type == ExpressionType.Literal ? (<ILiteralExpression>result).value : undefined
    }

    //private getInputParameters(): {} {
    //    if (this._lambdaExpression && this._lambdaExpression.parameters.length > 0)
    //        return this._lambdaExpression.parameters.reduce((res, val, index) => {
    //            if (index > 0 && index <= this._params.length)
    //                res[val] = this._params[index - 1]

    //            return res;
    //        }, {})

    //    return {}
    //}
}

function isRecord(value: Record<string, any> | any): value is Record<string, any> {
    return value !== null && typeof value == 'object' && value.getTime === undefined
}