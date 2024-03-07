import { IExpression, Expression, ExpressionType } from '../expression/expression'
import { ILiteralExpression, LiteralExpression } from '../expression/literalexpression'
import { IIndexExpression, IndexExpression } from '../expression/indexexpression'
import { ICompoundExpression } from '../expression/compoundexpression'
import { IIdentifierExpression, IdentifierExpression } from '../expression/identifierexpression'
import { IMemberExpression, MemberExpression } from '../expression/memberexpression'
import { IMethodExpression, MethodExpression } from '../expression/methodexpression'
import { IUnaryExpression, UnaryExpression, UnaryOperatorType, UnaryAffixType } from '../expression/unaryexpression'
import { IBinaryExpression, BinaryExpression, BinaryOperatorType } from '../expression/binaryexpression'
import { ILogicalExpression, LogicalExpression, LogicalOperatorType } from '../expression/logicalexpression'
import { IConditionalExpression, ConditionalExpression } from '../expression/conditionalexpression'
import { IArrayExpression, ArrayExpression } from '../expression/arrayexpression'
import { ITemplateLiteralExpression, TemplateLiteralExpression } from '../expression/templateliteralexpression'
import { IObjectExpression, ObjectExpression, IObjectProperty } from '../expression/objectexpression'
import { ILambdaExpression, LambdaExpression } from '../expression/lambdaexpression'

import * as ODataParser from './odata-parser'
import * as JavascriptParser from './javascript-parser'

type ReturnExpression = { 
    type: 'odata' | 'javascript'
    original: string
    expression: IExpression
}

export function parse(type: 'odata', predicate: string): ReturnExpression
export function parse(type: 'javascript', lambda: (it: any, ...param: Array<any>) => boolean): ReturnExpression
export function parse(type: 'javascript', predicate: string): ReturnExpression
export function parse(type: 'odata' | 'javascript', predicate: string | ((it: any, ...param: Array<any>) => boolean)): ReturnExpression {
    let ast: Record<string, any> | null = null

    switch(type) {
        case 'javascript':
            let lambda: string | null = null

            switch(typeof predicate) {
                case 'string':
                    lambda = predicate
                    break
    
                case 'function':
                    let regexs = [
                        /^\(?\s*([^)]*?)\s*\)?\s*(?:=>)+\s*(.*)$/i, //  arrow function; (item) => 5 + 1
                        /^(?:function\s*)?\(\s*([^)]*?)\s*\)\s*(?:=>)?\s*\{\s*.*?(?:return)\s*(.*?)\;?\s*\}\s*$/i // () => { return 5 + 1 } or function() { return 5 + 1 }
                    ]
    
                    let raw = predicate.toString(),
                        parameters: Array<string> = [],
                        expression = ''
    
                    for(let regex of regexs) {
                        let match: RegExpMatchArray | null
            
                        if((match = raw.match(regex)) !== null) {
                            parameters = match[1].split(',').map((el) => el.trim())
                            expression = match[2]
                                .replace(/_this/gi, 'this')
                                .replace(/\(function\(([^)]+)\)\{return\s(.*?)\}\)/gi, '($1) => $2') // inner arrow functions in methods (for some/every) will probably be converted to a function by babel etc
            
                            lambda = `(${parameters.join(', ')}) => ${expression}`

                            break
                        }
                    }

                    if(!lambda)
                        throw new Error(`Javascript predicate is missing parsable lambda function; '${raw}'`)
    
                    break
                
                default:
                    throw new Error('Javascript predicate has to be a string, fat arrow function or a function with a return as first statement')
            }
    
            ast = JavascriptParser.parse(lambda)

            if(!ast)
                throw new Error(`Couldn't extract Abstact Syntax Tree from '${lambda}'`)

            try {
                return {
                    type: 'javascript', 
                    original: lambda,
                    expression: transform(ast)
                }
            }
            catch(ex) {
                throw new Error(ex.message)
            }

        case 'odata':
            if(typeof predicate !== 'string')
                throw new Error('OData predicate has to be a string')

            ast = ODataParser.parse(predicate)

            if(!ast) 
                throw new Error(`Couldn't extract Abstact Syntax Tree from '${predicate}'`)

            try {    
                return {
                    type: 'odata', 
                    original: predicate,
                    expression: transform(ast)
                }
            }
            catch(ex) {
                throw new Error(ex.message)
            }
        
        default:
            throw new Error(`Unknown type ${type}`)
    }
}

/**
 * transform pegjs expression ast tree to our internal ast tree to make it easier to swap expression parser at a later time
 * @see
 * http://www.odata.org/documentation/odata-version-2-0/uri-conventions/
 *
 * @param expression pegjs expression object
 * @returns 
 */
export function transform(expression: Record<string, any>): IExpression {
    let child: IExpression

    switch(expression.type) {
        case 'LambdaExpression':
            return new LambdaExpression(Array.isArray(expression.arguments) ? expression.arguments.map((arg) => transform(arg)) : [], transform(expression.expression))

        case 'Identifier':
            return new IdentifierExpression(expression.name)

        case 'MemberExpression':
            switch(expression.property.type) {
                case 'CallExpression':
                    child = transform(expression.property);
                    (<MethodExpression>child).caller = transform(expression.object)

                    return child

                case 'MemberExpression':
                    let current = expression,
                        stack = []

                    do {
                        stack.push(transform(current.object))

                        if(current.property.type != 'MemberExpression')
                            break

                        current = current.property
                    } 
                    while (true)

                    if(current.property.type == 'CallExpression') {
                        // we want stacked memberexpressions as caller for handyness
                        child = transform(current.property);

                        (<MethodExpression>child).caller = stack.reduceRight((caller, member) => {
                            if(caller == null)
                                return member
                            else 
                                return new MemberExpression(member, caller)
                        })

                        return child
                    }

                    // fall through

                default:
                    return new MemberExpression(transform(expression.object), transform(expression.property))
            }
            
        case 'CallExpression':
            switch(expression.object.type) {
                case 'Identifier':
                    return new MethodExpression(expression.object.name, Array.isArray(expression.arguments) ? expression.arguments.map((arg) => transform(arg)) : [])

                default:
                    throw new Error('Caller of method expression is not a Identifier, but is ' + expression.object.type)
            }

        case 'DateTimeLiteral':
            return new LiteralExpression(new Date(expression.value))

        case 'DateLiteral':
            let value = new Date(expression.value)
            
            return new LiteralExpression(new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), 0, 0, 0, 0)))

        case 'NumberLiteral':
            return new LiteralExpression(Number(expression.value))

        case 'BooleanLiteral':
            return new LiteralExpression(expression.value == true || expression.value == 'true' ? true : false)

        case 'NullLiteral':
            return new LiteralExpression(null)

        case 'Literal':
            return new LiteralExpression(expression.value)

        case 'ConditionalExpression':
            return new ConditionalExpression(transform(expression.test), transform(expression.left), transform(expression.right))

        case 'ObjectLiteral':
            return new ObjectExpression(Array.isArray(expression.properties) ? 
                expression.properties.map(({ key, value }) => {
                    switch(key.type) {
                        case 'Identifier':
                            key = {
                                type: 'Literal',
                                value: key.name
                            }
                            break
                        default:
                            break
                    }
                    return { key: transform(key), value: transform(value) }
                }) : [])

        case 'TemplateLiteral':
            if(Array.isArray(expression.values) && expression.values.length > 0) {
                let literals: Array<ILiteralExpression> = [], 
                    expressions: Array<IExpression> = [],
                    first = expression.values[0]

                if(first.type == 'TemplateExpression') 
                    literals.push(<ILiteralExpression>transform({ type: 'Literal', value: '' }))

                literals.push(...expression.values
                    .filter(value => value.type == 'Literal')
                    .map(value => <ILiteralExpression>transform(value))
                    .map(literal => { literal.value = literal.value.replace(/(\\)?\$(\\)?\{/g, '${'); return literal })
                )
                expressions.push(...expression.values.filter(value => value.type == 'TemplateExpression').map(value => transform(value.value)))

                return new TemplateLiteralExpression(literals, expressions)
            }

            return new TemplateLiteralExpression([], [])

        case 'ArrayExpression':
            return new IndexExpression(transform(expression.object), transform(expression.index))

        case 'ArrayLiteral':
            return new ArrayExpression(Array.isArray(expression.elements) ? expression.elements.map((arg) => transform(arg)) : [])

        case 'LogicalExpression':
        case 'LogicalExpression':
            switch(expression.operator) {
                case '&&':
                    return new LogicalExpression(LogicalOperatorType.And, transform(expression.left), transform(expression.right))
                case '||':
                    return new LogicalExpression(LogicalOperatorType.Or, transform(expression.left), transform(expression.right))
            }
            break

        case 'RelationalExpression':
            switch(expression.operator) {
                case '==': // equal
                case '===': // equal strict
                    return new LogicalExpression(LogicalOperatorType.Equal, transform(expression.left), transform(expression.right))

                case '!=': // not equal
                case '!==': // not equal strict
                    return new LogicalExpression(LogicalOperatorType.NotEqual, transform(expression.left), transform(expression.right))

                case '<': // lesser
                    return new LogicalExpression(LogicalOperatorType.Lesser, transform(expression.left), transform(expression.right))

                case '<=': // lesser or equal
                    return new LogicalExpression(LogicalOperatorType.LesserOrEqual, transform(expression.left), transform(expression.right))

                case '>': // greater
                    return new LogicalExpression(LogicalOperatorType.Greater, transform(expression.left), transform(expression.right))

                case '>=': // greater or equal
                    return new LogicalExpression(LogicalOperatorType.GreaterOrEqual, transform(expression.left), transform(expression.right))

                case 'in': // in
                    return new LogicalExpression(LogicalOperatorType.In, transform(expression.left), transform(expression.right))
            }
            break

        case 'PostfixExpression':
            switch(expression.operator) {
                case '--':
                    return new UnaryExpression(UnaryOperatorType.Decrement, UnaryAffixType.Postfix, transform(expression.argument))
                case '++':
                    return new UnaryExpression(UnaryOperatorType.Increment, UnaryAffixType.Postfix, transform(expression.argument))
            }
            break

        case 'UnaryExpression':
            switch(expression.operator) {
                case '!':
                    return new UnaryExpression(UnaryOperatorType.Invert, UnaryAffixType.Prefix, transform(expression.argument))
                case '~':
                    return new UnaryExpression(UnaryOperatorType.Complement, UnaryAffixType.Prefix, transform(expression.argument))
                case '+':
                    return new UnaryExpression(UnaryOperatorType.Positive, UnaryAffixType.Prefix, transform(expression.argument))
                case '-':
                    return new UnaryExpression(UnaryOperatorType.Negative, UnaryAffixType.Prefix, transform(expression.argument))
                case '--':
                    return new UnaryExpression(UnaryOperatorType.Decrement, UnaryAffixType.Prefix, transform(expression.argument))
                case '++':
                    return new UnaryExpression(UnaryOperatorType.Increment, UnaryAffixType.Prefix, transform(expression.argument))
            }
            break

        case 'ShiftExpression':
            switch(expression.operator) {
                case '<<':
                    return new BinaryExpression(BinaryOperatorType.LeftShift, transform(expression.left), transform(expression.right))
                case '>>':
                    return new BinaryExpression(BinaryOperatorType.RightShift, transform(expression.left), transform(expression.right))
                case '>>>': // zero-fill right-shift 
                    return new BinaryExpression(BinaryOperatorType.RightShift, transform(expression.left), transform(expression.right))
            }
            break

        case 'BitwiseExpression':
            switch(expression.operator) {
                case '|':
                    return new BinaryExpression(BinaryOperatorType.Or, transform(expression.left), transform(expression.right))
                case '^':
                    return new BinaryExpression(BinaryOperatorType.ExclusiveOr, transform(expression.left), transform(expression.right))
                case '&':
                    return new BinaryExpression(BinaryOperatorType.And, transform(expression.left), transform(expression.right))
            }
            break

        case 'BinaryExpression':
            switch(expression.operator) {
                case '+': // addition
                    return new BinaryExpression(BinaryOperatorType.Addition, transform(expression.left), transform(expression.right))

                case '-': // subtraction
                    return new BinaryExpression(BinaryOperatorType.Subtraction, transform(expression.left), transform(expression.right))

                case '*': // multiplication
                    return new BinaryExpression(BinaryOperatorType.Multiplication, transform(expression.left), transform(expression.right))

                case '/': // division
                    return new BinaryExpression(BinaryOperatorType.Division, transform(expression.left), transform(expression.right))

                case '%': // modulus
                    return new BinaryExpression(BinaryOperatorType.Modulus, transform(expression.left), transform(expression.right))
            }
            break                
    }

    throw new Error('Expression type "' + expression.type + '" is unknown')
}