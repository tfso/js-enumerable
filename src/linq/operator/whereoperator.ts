import { LinqOperator, LinqType, WhereExpression } from './types'
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
        },
        get sets() {
            function * visitChild(expressions: IExpression[]): IterableIterator<WhereExpression> {
                for(let expr of expressions) {
                    yield * visitExpression(typeof predicate == 'string' ? 'odata' : 'javascript', scopeName, expr)
                }
            }

            function * visit() {
                for(let set of expression.sets) {
                    yield visitChild(set)
                }
            }

            return visit()
        }
    }
}

/***
 * Returns normalized user-friendly where-expression
 */
function * visitIntersection(type: 'odata' | 'javascript', it: string, expression: IExpression): IterableIterator<WhereExpression> {
    for(let expr of expression.intersection) {
        yield * visitExpression(type, it, expr)
    }
}

function * visitExpression(type: 'odata' | 'javascript', it: string, expression: IExpression): IterableIterator<WhereExpression> {
    for(let leaf of visitLeaf(type, it, expression)) {
        if(LogicalExpression.instanceof(leaf)) {
            let value = getPropertyValue(leaf.right),
                property = getPropertyName(leaf.left)?.name.join('.') ?? '',
                operator = getOperator(leaf)
                
            switch(typeof value) {
                case 'string':
                    yield {
                        type: 'string', property, operator, value, wildcard: getWildcard(leaf.right)
                    }
                    break

                case 'bigint':
                    yield {
                        type: 'bigint', property, operator, value
                    }
                    break

                case 'number':
                    yield {
                        type: 'number', property, operator, value
                    }
                    break

                case 'boolean':
                    yield {
                        type: 'boolean', property, operator, value
                    }
                    break
                
                case 'object':
                    if(value == null) {
                        yield {
                            type: 'null', property, operator, value
                        }
                    }
                    else if(typeof value.getTime == 'function' && value.getTime() >= 0) {
                        yield {
                            type: 'date', property, operator, value
                        }
                    }
                    else if(Array.isArray(value) == true) {
                        yield {
                            type: 'array', property, operator, value
                        }
                    }

                    break

                case 'undefined':
                    yield {
                        type: 'null', property, operator, value
                    }

                default:
                    
            }
        }
        else if(MethodExpression.instanceof(leaf)) {
            switch(type) {
                case 'odata':
                    switch(leaf.name) {
                        case 'any':
                        case 'all':
                            let lambda = leaf.parameters[0]

                            if(LambdaExpression.instanceof(lambda)) 
                                yield {
                                    type: 'expression',
                                    property: getPropertyName(leaf.caller)?.name.join('.'),
                                    operator: leaf.name,
                                    value: visitIntersection(type, getPropertyName(lambda.parameters[0])?.name.join('.'), lambda.expression)
                                }

                            break
                    }
                    break

                case 'javascript':
                    switch(leaf.name) {
                        case 'some':
                        case 'every':
                            let lambda = leaf.parameters[0]

                            if(LambdaExpression.instanceof(lambda)) 
                                yield {
                                    type: 'expression',
                                    property: getPropertyName(leaf.caller)?.name.join('.'),
                                    operator: leaf.name == 'some' ? 'any' : 'all',
                                    value: visitIntersection(type, getPropertyName(lambda.parameters[0])?.name.join('.'), lambda.expression)
                                }

                            break
                    }
                    break
            }
        }
    }
}

/***
 * Analyzing expression and returns normalized expressions, where usable expressions is LogicalExpression (unknown at left) or MethodExpression
 */
function * visitLeaf(type: 'odata' | 'javascript', it: string, expression: IExpression): IterableIterator<IExpression> {
    if(expression === null)
        return null

    if(LogicalExpression.instanceof(expression)) {
        let left = visitLeaf(type, it, expression.left).next(),
            right = visitLeaf(type, it, expression.right).next()

        if(LogicalExpression.instanceof(left.value) && LiteralExpression.instanceof(right.value)) {
            switch(right.value.value) {
                case true:
                    switch(expression.operator) {
                        case LogicalOperatorType.Equal:
                        case LogicalOperatorType.GreaterOrEqual:
                        case LogicalOperatorType.LesserOrEqual:
                            let visited = visitLeaf(type, it, left.value).next()

                            if(LogicalExpression.instanceof(visited.value))
                                yield visited.value

                            break
                    }
                    break

                case false:
                    if(expression.operator == LogicalOperatorType.NotEqual) {
                        let visited = visitLeaf(type, it, left.value).next()

                        if(LogicalExpression.instanceof(visited.value))
                            yield visited.value
                    }
                    break
            }
        }
        else if(LogicalExpression.instanceof(right.value) && LiteralExpression.instanceof(left.value)) {
            switch(left.value.value) {
                case true:
                    switch(expression.operator) {
                        case LogicalOperatorType.Equal:
                        case LogicalOperatorType.GreaterOrEqual:
                        case LogicalOperatorType.LesserOrEqual:
                            let visited = visitLeaf(type, it, right.value).next()

                            if(LogicalExpression.instanceof(visited.value))
                                yield visited.value
                            
                            break
                    }
                    break

                case false:
                    if(expression.operator == LogicalOperatorType.NotEqual) {
                        let visited = visitLeaf(type, it, right.value).next()

                        if(LogicalExpression.instanceof(visited.value))
                            yield visited.value
                    }
                    break
            }
        }
        else if((left.value?.type == ExpressionType.Identifier || left.value?.type == ExpressionType.Member || left.value?.type == ExpressionType.Method) == false) {
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
                            case 'tolower': {
                                let parameter = visitLeaf(type, it, expression.parameters[0]).next()

                                if(LiteralExpression.instanceof(parameter.value)) {
                                    yield new LiteralExpression(String(parameter.value).toLowerCase())
                                }
                                else {
                                    yield parameter.value
                                }
                                break
                            }

                            case 'toupper': {
                                let parameter = visitLeaf(type, it, expression.parameters[0]).next()

                                if(LiteralExpression.instanceof(parameter.value)) {
                                    yield new LiteralExpression(String(parameter.value).toLowerCase())
                                }
                                else {
                                    yield parameter.value
                                }
                                break
                            }

                            case 'contains': // bool contains(string p0, string p1)
                            case 'substringof': {  // bool substringof(string po, string p1)
                                let left = visitLeaf(type, it, expression.parameters[0]).next(),
                                    right = visitLeaf(type, it, expression.parameters[1]).next()

                                if(right.value?.type == ExpressionType.Literal) {
                                    yield new LogicalExpression(LogicalOperatorType.Equal, left.value, new LiteralExpression(`[[*]]${(<ILiteralExpression>right.value).value}[[*]]`))
                                }
                                else {
                                    yield expression
                                }
                                break
                            }

                            case 'endswith': { // bool endswith(string p0, string p1)
                                let left = visitLeaf(type, it, expression.parameters[0]).next(),
                                    right = visitLeaf(type, it, expression.parameters[1]).next()

                                if(right.value?.type == ExpressionType.Literal) {
                                    yield new LogicalExpression(LogicalOperatorType.Equal, left.value, new LiteralExpression(`[[*]]${(<ILiteralExpression>right.value).value}`))
                                } 
                                else {
                                    yield expression
                                }

                                break
                            }
                            case 'startswith': { // bool startswith(string p0, string p1)
                                let left = visitLeaf(type, it, expression.parameters[0]).next(),
                                    right = visitLeaf(type, it, expression.parameters[1]).next()

                                if(right.value?.type == ExpressionType.Literal) {
                                    yield new LogicalExpression(LogicalOperatorType.Equal, left.value, new LiteralExpression(`${(<ILiteralExpression>right.value).value}[[*]]`))
                                }
                                else {
                                    yield expression
                                }
                                
                                break
                            }
                            case 'any':
                            case 'all':
                            default: 
                                let caller = visitLeaf(type, it, expression.caller).next()

                                yield new MethodExpression(expression.name, expression.parameters, caller.value)
                                break
                        }
                    }
                    else {
                        yield expression
                    }

                    break

                case 'javascript':
                    if(MethodExpression.instanceof(expression)) {
                        let caller = visitLeaf(type, it, expression.caller).next()

                        yield new MethodExpression(expression.name, expression.parameters, caller.value)
                    }
                    else {
                        yield expression
                    }
                    break
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

    return null
}

function getPropertyValue(expression: IExpression): any {
    switch(expression.type) {
        case ExpressionType.Array:
            return (<IArrayExpression>expression).elements.map(expr => getPropertyValue(expr))

        case ExpressionType.Literal:
            switch(typeof (<ILiteralExpression>expression).value) {
                case 'string':
                    return (<ILiteralExpression>expression).value.replace(/\[\[\*\]\]/gi, '')

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
                let match = /^(\[\[\*\]\])?.*?(\[\[\*\]\])?$/.exec(value)
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