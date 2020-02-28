import { 
    ExpressionVisitor,
    IExpression, Expression, ExpressionType,
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

import { LambdaExpression } from './expression/lambdaexpression'

export class ReducerVisitor extends ExpressionVisitor {
    private _parentExpressionStack: Array<IExpression> = [];
    private _it: string = null;

    constructor() {
        super()
    }

    public get it(): string {
        return this._it
    }

    public visitLambda(predicate: (it: Record<string, any>, ...param: Array<any>) => any, ...param: Array<any>): IExpression {
        //this._isSolvable = true; // reset it as checks for solvability is done for each visit
        this._it = null // do not involve "this" at the moment, since evalute is using "ReducerVisitor.it" to find out the named "this" scope.

        let expr = super.visitLambda(predicate),
            vars = null

        if(param.length > 0) {
            if(Array.isArray(this._lambdaExpression) && this._lambdaExpression.parameters.length > 0) {
                vars = this._lambdaExpression.parameters.reduce<Record<string, any>>((res, val, index) => {
                    if(index > 0 && index <= param.length)
                        res[val] = param[index - 1]

                    return res
                }, {})
            }
        }

        expr = this.evaluate.call(this, expr, vars)

        this._it = this._lambdaExpression != null && this._lambdaExpression.parameters.length > 0 ? this._lambdaExpression.parameters[0] : null

        return expr
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
        let condition = expression.condition.accept(this)

        if(condition.type == ExpressionType.Literal) {
            if((<LiteralExpression>condition).value === true)
                return expression.success.accept(this)
            else
                return expression.failure.accept(this)
        }

        return new ConditionalExpression(condition, expression.success.accept(this), expression.failure.accept(this))
    }

    public visitLogical(expression: ILogicalExpression): IExpression {
        let left = expression.left.accept(this),
            right = expression.right.accept(this)

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
            }
        }

        switch(expression.operator) {
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

    public evaluate(expression: IExpression, it?: Record<string, any>): IExpression 
    public evaluate(expression: IExpression, it: Record<string, any> = null): IExpression {
        if(expression == null)
            return null

        let value: any = null
            

        switch(expression.type) {
            case ExpressionType.Literal: 
                break

            case ExpressionType.Identifier: {
                let identifier = (<IIdentifierExpression>expression)

                if(it != null) {
                    // this object
                    if(typeof it == 'object' && identifier.name in it && (value = it[identifier.name]) !== undefined) {
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
                                    break

                                // fall through

                            default:
                                value = null
                        }

                        return new LiteralExpression(value)
                    }
                }

                break
            }

            case ExpressionType.Array:
                return new ArrayExpression((<IArrayExpression>expression).elements.map(v => this.evaluate(v, it)))

            case ExpressionType.Object:
                return new ObjectExpression((<IObjectExpression>expression).properties.map(el => <IObjectProperty>{ key: this.evaluate(el.key, it), value: this.evaluate(el.value, it) }))

            case ExpressionType.Index: {
                let object = this.evaluate((<IIndexExpression>expression).object, it),
                    index = this.evaluate((<IIndexExpression>expression).index, it)

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
                            return property ? this.evaluate(property.value) : new LiteralExpression(null)

                        case ExpressionType.Array:
                            return Array.from((<IArrayExpression>object).elements)[(<ILiteralExpression>index).value]
                            
                        case ExpressionType.Literal:
                            if(typeof (<ILiteralExpression>object).value == 'object') {
                                if(Array.isArray((<ILiteralExpression>object).value)) {
                                    return new LiteralExpression(Array.from((<ILiteralExpression>object).value)[(<ILiteralExpression>index).value])
                                }
                                
                                let descriptor: PropertyDescriptor
                                if(descriptor = Object.getOwnPropertyDescriptor((<ILiteralExpression>object).value, (<ILiteralExpression>index).value))
                                    return new LiteralExpression(descriptor.value)
                            }
                            
                            return new LiteralExpression(null)                            
                    }

                break
            }

            case ExpressionType.Member: {
                let object = (<IMemberExpression>expression).object,
                    property = (<IMemberExpression>expression).property

                if(it != null) {
                    if(object.type == ExpressionType.Identifier) {
                        if((<IIdentifierExpression>object).name == 'this' || (<IIdentifierExpression>object).name == this.it) {
                            value = this.evaluate(property, it)
                            if(property.equal(value) == false)
                                return value
                        }
                        else {
                            let descriptor = Object.getOwnPropertyDescriptor(it, (<IIdentifierExpression>object).name)
                            if(descriptor && typeof descriptor.value == 'object') {
                                value = this.evaluate(property, descriptor.value)
                                if(property.equal(value) == false)
                                    return value
                            }
                        }
                    }
                }

                break
            }

            case ExpressionType.Conditional:
                return this.visit(new ConditionalExpression(this.evaluate((<IConditionalExpression>expression).condition, it), this.evaluate((<IConditionalExpression>expression).success, it), this.evaluate((<IConditionalExpression>expression).failure, it)))

            case ExpressionType.Logical:
                return this.visit(new LogicalExpression((<ILogicalExpression>expression).operator, this.evaluate((<ILogicalExpression>expression).left, it), this.evaluate((<ILogicalExpression>expression).right, it)))

            case ExpressionType.Binary:
                return this.visit(new BinaryExpression((<IBinaryExpression>expression).operator, this.evaluate((<IBinaryExpression>expression).left, it), this.evaluate((<IBinaryExpression>expression).right, it)))

            case ExpressionType.Method:
                return this.visit(new MethodExpression((<IMethodExpression>expression).name, (<IMethodExpression>expression).parameters.map(p => this.evaluate(p, it)), this.evaluate((<IMethodExpression>expression).caller, it)))
            
            default:
                let o = <IExpression>Object.create(Object.getPrototypeOf(expression), Object.getOwnPropertyNames(expression).reduce<Record<string, any>>((prev, cur) => {
                    let prop = Object.getOwnPropertyDescriptor(expression, cur)

                    if(prop.value instanceof Expression)
                        prop.value = this.evaluate(prop.value, it)
                    else if(prop.value instanceof Array)
                        prop.value = prop.value.map(a => a instanceof Expression ? this.evaluate(a, it) : a)

                    prev[cur] = prop

                    return prev
                }, {}))

                return this.visit(o)
        }

        return expression
    }

    public static evaluate(expression: IExpression, it: Record<string, any> = null): any {
        let reducer = new ReducerVisitor(),
            result = reducer.evaluate(expression, it)

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

