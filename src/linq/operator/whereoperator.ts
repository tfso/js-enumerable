import { LinqOperator, LinqType } from './types'
import { Entity } from '../types'

import { ReducerVisitor } from './../peg/reducervisitor'
import { IExpression, ExpressionType, ILogicalExpression, LogicalOperatorType, IMethodExpression, IMemberExpression, IIdentifierExpression, ILiteralExpression, IArrayExpression, ILambdaExpression, MethodExpression, LambdaExpression } from './../peg/expressionvisitor'
import { ODataVisitor } from './../peg/odatavisitor'

import { LogicalExpression } from './../peg/expression/logicalexpression'
import { LiteralExpression } from './../peg/expression/literalexpression'

export function whereOperator<TEntity extends Entity>(predicate: string): LinqOperator<TEntity>
export function whereOperator<TEntity extends Entity>(predicate: (it: TEntity, ...param: any[]) => boolean, ...param: any[]): LinqOperator<TEntity>
export function whereOperator<TEntity extends Entity>(): LinqOperator<TEntity> {
    let predicate: any = arguments[0],
        parameters: Array<any> = [],
        expression: IExpression,
        validate: (entity: TEntity) => boolean,
        scopeName: string

    if(arguments.length >= 2)
        parameters = Array.from(arguments).slice(1)

    switch(typeof predicate) {
        case 'string':
            expression = new ODataVisitor().parseOData(predicate)
            validate = (entity: TEntity) => ODataVisitor.evaluate(expression, entity) === true
            scopeName = ''

            break

        case 'function':
            let visitor = new ReducerVisitor()

            expression = visitor.parseLambda(predicate, ...parameters)

            if(LambdaExpression.instanceof(expression)) {
                if(expression.parameters[0].type == ExpressionType.Identifier) {
                    scopeName = (<IIdentifierExpression>expression.parameters[0]).name
                }
            }
            
            validate = (entity: TEntity) => predicate.apply({}, [entity].concat(parameters))
            
            break

        default:
            throw new Error('Where operator can not recognize predicate either as javascript or odata')
    }

    return {
        type: LinqType.Where,
        expression,
        evaluate: () => {
            return (item) => ({ type: validate(item) == true ? 'yield' : 'continue', value: item })
        },
        get intersection() {
            return visitIntersection(typeof predicate == 'string' ? 'odata' : 'javascript', scopeName, expression)
        }
    }
}

function * visitIntersection(type: 'odata' | 'javascript', it: string, expression: IExpression) {
    for(let expr of expression.intersection) {
        for(let leaf of visitLeaf(type, it, expr)) {

            if(LogicalExpression.instanceof(leaf)) {
                yield {
                    property: getPropertyName(leaf.left)?.name.join('.') ?? '',
                    operator: getOperator(leaf),
                    value: getPropertyValue(leaf.right),
                    wildcard: getWildcard(leaf.right)
                }
            }
        }
    }
}

function getOperator(expression: IExpression): '==' | '!=' | '>' | '>=' | '<' | '<=' {
    if(LogicalExpression.instanceof(expression)) {
        switch(expression.operator) {
            case LogicalOperatorType.Equal:
                return '=='

            case LogicalOperatorType.NotEqual:
                return '!='

            case LogicalOperatorType.Greater:
                return '>'

            case LogicalOperatorType.GreaterOrEqual:
                return '>='

            case LogicalOperatorType.Lesser:
                return '<'

            case LogicalOperatorType.LesserOrEqual:
                return '<='
        }
    }
}

function getPropertyValue(expression: IExpression): any {
    switch(expression.type) {
        case ExpressionType.Array:
            return (<IArrayExpression>expression).elements.map(expr => getPropertyValue(expr))

        case ExpressionType.Literal:
            switch(typeof (<ILiteralExpression>expression).value) {
                case 'string':
                    return (<ILiteralExpression>expression).value.replace(/\[\[*\]\]/gi, '')

                default:
                    return (<ILiteralExpression>expression).value
            }

        case ExpressionType.Object:
            return null
    }
}

function getWildcard(expression: IExpression): 'none' | 'left' | 'right' | 'both' {
    switch(expression.type) {
        case ExpressionType.Literal:
            let value = (<ILiteralExpression>expression).value

            if(typeof value == 'string') {
                let match = /^(\[\[*\]\])?.*(\[\[*\]\])?$/.exec(value)
                if(match) {
                    if(match[1] && match[2])
                        return 'both'
                    else if(match[1])
                        return 'left'
                    else if(match[2])
                        return 'right'                   
                }
            }
            // fallthrough

        default:
            return 'none'
    }
}

function getPropertyName(expression: IExpression): { name: string[], method?: IExpression } {
    
    switch(expression.type) {
        case ExpressionType.Identifier:
            return {
                name: [(<IIdentifierExpression>expression).name]
            }
        
        case ExpressionType.Member:
            let member = <IMemberExpression>expression

            if(member.object.type == ExpressionType.Identifier) {
                let identifier = <IIdentifierExpression>member.object,
                    child = getPropertyName(member.property)
                
                return {
                    name: [identifier.name, ...child.name]
                }
            }

        case ExpressionType.Method:
            let method = <IMethodExpression>expression

            return {
                name: method.caller ? [...getPropertyName(method.caller).name] : [],
                method: expression
            }

            break
    }
}


function * visitLeaf(type: 'odata' | 'javascript', it: string, expression: IExpression): IterableIterator<IExpression> {
    if(LogicalExpression.instanceof(expression)) {
        let left = visitLeaf(type, it, expression.left).next(),
            right = visitLeaf(type, it, expression.right).next()

        if((left.value?.type == ExpressionType.Identifier || left.value?.type == ExpressionType.Member || left.value?.type == ExpressionType.Method) == false) {
            switch(expression.operator) {
                case LogicalOperatorType.Or:
                case LogicalOperatorType.And:
                case LogicalOperatorType.Equal:
                case LogicalOperatorType.NotEqual:
                    yield new LogicalExpression(expression.operator, right.value, left.value)
                    break

                case LogicalOperatorType.Greater:  // 5 > 2 == 2 < 5
                    yield new LogicalExpression(LogicalOperatorType.Lesser, right.value, left.value)
                    break

                case LogicalOperatorType.GreaterOrEqual: // 5 >= 2 == 2 <= 5
                    yield new LogicalExpression(LogicalOperatorType.LesserOrEqual, right.value, left.value)
                    break

                case LogicalOperatorType.Lesser: // 5 < 2 == 2 > 5
                    yield new LogicalExpression(LogicalOperatorType.Greater, right.value, left.value)
                    break

                case LogicalOperatorType.LesserOrEqual: // 5 <= 2 == 2 >= 5
                    yield new LogicalExpression(LogicalOperatorType.GreaterOrEqual, right.value, left.value)
                    break
            }
        } 
        else {
            yield new LogicalExpression(expression.operator, left.value, right.value)
        }
    }
    else {
        if(expression.type == ExpressionType.Member) {
            if((<IMemberExpression>expression).object.type == ExpressionType.Identifier && (<IIdentifierExpression>(<IMemberExpression>expression).object).name == it)
                yield (<IMemberExpression>expression).property
            else
                yield expression
        }
        else {
            switch(type) {
                case 'odata':
                    if(MethodExpression.instanceof(expression)) {
                        switch(expression.name) {
                            case 'tolower':
                            case 'toupper':
                                yield expression.parameters[0]
                                break

                            case 'contains': // bool contains(string p0, string p1)
                            case 'substringof': {  // bool substringof(string po, string p1)
                                let left = visitLeaf(type, it, expression.parameters[0]).next(),
                                    right = visitLeaf(type, it, expression.parameters[1]).next()

                                if(right.value?.type == ExpressionType.Literal) {
                                    yield new LogicalExpression(LogicalOperatorType.Equal, left.value, new LiteralExpression(`[[*]]${(<ILiteralExpression>right.value).value}[[*]]`))
                                }

                                yield expression
                                break
                            }

                            case 'endswith': { // bool endswith(string p0, string p1)
                                let left = visitLeaf(type, it, expression.parameters[0]).next(),
                                    right = visitLeaf(type, it, expression.parameters[1]).next()

                                if(right.value?.type == ExpressionType.Literal) {
                                    yield new LogicalExpression(LogicalOperatorType.Equal, left.value, new LiteralExpression(`[[*]]${(<ILiteralExpression>right.value).value}`))
                                }

                                yield expression
                                break
                            }
                            case 'startswith': { // bool startswith(string p0, string p1)
                                let left = visitLeaf(type, it, expression.parameters[0]).next(),
                                    right = visitLeaf(type, it, expression.parameters[1]).next()

                                if(right.value?.type == ExpressionType.Literal) {
                                    yield new LogicalExpression(LogicalOperatorType.Equal, left.value, new LiteralExpression(`${(<ILiteralExpression>right.value).value}[[*]]`))
                                }

                                yield expression
                                break
                            }

                            default: 
                                yield expression
                                break
                        }
                    }
                    else {
                        yield expression
                    }

                    break

                case 'javascript':
                    yield expression
                    break
            }
        }
    }
}