﻿import ODataParser from './parser/odata-parser'
import JavascriptParser from './parser/javascript-parser'
import { ExpressionStack } from './expressionstack'

import { IExpressionVisitor } from './interface/iexpressionvisitor'

import { IExpression, Expression, ExpressionType } from './expression/expression'
import { ILiteralExpression, LiteralExpression } from './expression/literalexpression'
import { IIndexExpression, IndexExpression } from './expression/indexexpression'
import { ICompoundExpression } from './expression/compoundexpression'
import { IIdentifierExpression, IdentifierExpression } from './expression/identifierexpression'
import { IMemberExpression, MemberExpression } from './expression/memberexpression'
import { IMethodExpression, MethodExpression } from './expression/methodexpression'
import { IUnaryExpression, UnaryExpression, UnaryOperatorType, UnaryAffixType } from './expression/unaryexpression'
import { IBinaryExpression, BinaryExpression, BinaryOperatorType } from './expression/binaryexpression'
import { ILogicalExpression, LogicalExpression, LogicalOperatorType } from './expression/logicalexpression'
import { IConditionalExpression, ConditionalExpression } from './expression/conditionalexpression'
import { IArrayExpression, ArrayExpression } from './expression/arrayexpression'
import { ITemplateLiteralExpression, TemplateLiteralExpression } from './expression/templateliteralexpression'
import { IObjectExpression, ObjectExpression, IObjectProperty } from './expression/objectexpression'
import { ILambdaExpression, LambdaExpression } from './expression/lambdaexpression'

export class ExpressionVisitor implements IExpressionVisitor {
    protected _rawExpression: { expression: string, parameters: Array<string>, fn: ((...args: Array<any>) => any) }
    private _expressionStack: ExpressionStack

    constructor() {
        this._expressionStack = new ExpressionStack()
    }

    public get stack(): ExpressionStack {
        return this._expressionStack
    }

    public parseOData(filter: string): IExpression {
        let ast = ODataParser.parse(filter)
        try {
            if(ast) {
                return this.visit(this.transform(ast))
            }
        }
        catch(ex) {
            throw new Error(ex.message)
        }

        return null
    }

    public parseLambda(lambda: string): IExpression
    public parseLambda(lambda: (it: any, ...param: Array<any>) => any): IExpression
    public parseLambda(): IExpression {
        let lambda: string

        switch(typeof arguments[0]) {
            case 'string':
                lambda = arguments[0]
                break

            case 'function':
                let regexs = [
                    /^\(?\s*([^)]*?)\s*\)?\s*(?:=>)+\s*(.*)$/i, //  arrow function; (item) => 5 + 1
                    /^(?:function\s*)?\(\s*([^)]*?)\s*\)\s*(?:=>)?\s*\{\s*.*?(?:return)\s*(.*?)\;?\s*\}\s*$/i // () => { return 5 + 1 } or function() { return 5 + 1 }
                ]

                let raw = arguments[0].toString(),
                    parameters: Array<string>,
                    expression: string

                for(let regex of regexs) {
                    let match: RegExpMatchArray
        
                    if((match = raw.match(regex)) !== null) {
                        parameters = match[1].split(',').map((el) => el.trim())
                        expression = match[2]
                            .replace(/_this/gi, 'this')
                            .replace(/\(function\(([^)]+)\)\{return\s(.*?)\}\)/gi, '($1) => $2') // inner arrow functions in methods (for some/every) will probably be converted to a function by babel etc
        
                        break
                    }
                }

                lambda = `(${parameters.join(', ')}) => ${expression}`

                break
        }

        let ast = JavascriptParser.parse(lambda)
        try {
            if(ast) {
                return this.visit(this.transform(ast))
            }
        }
        catch(ex) {
            throw new Error(ex.message)
        }

        return null
    }

    public visit(expression: IExpression): IExpression {
        return expression.accept(this)
    }

    public visitLambda(expression: ILambdaExpression): IExpression {
        expression.parameters = expression.parameters.map((element) => element.accept(this))
        expression.expression = expression.expression.accept(this)

        return expression
    }

    public visitLiteral(expression: ILiteralExpression): IExpression {
        return expression
    }

    public visitArray(expression: IArrayExpression): IExpression {
        expression.elements = expression.elements.map((element) => element.accept(this))

        return expression
    }

    public visitTemplateLiteral(expression: ITemplateLiteralExpression): IExpression {
        expression.elements = expression.elements.map((element) => element.accept(this))

        return expression
    }

    public visitObject(expression: IObjectExpression): IExpression {
        expression.properties = expression.properties.map((element) => <IObjectProperty>{ key: element.key.accept(this), value: element.value.accept(this) })

        return expression
    }

    public visitIndex(expression: IIndexExpression): IExpression {
        expression.index = expression.index.accept(this)
        expression.object = expression.object.accept(this)

        return expression
    }

    public visitCompound(expression: ICompoundExpression): IExpression {
        expression.body = expression.body.map((expr) => expr.accept(this))

        return expression
    }

    public visitIdentifier(expression: IIdentifierExpression): IExpression {
        return expression
    }

    public visitBinary(expression: IBinaryExpression): IExpression {
        expression.left = expression.left.accept(this)
        expression.right = expression.right.accept(this)

        return expression
    }


    public visitMethod(expression: IMethodExpression): IExpression {
        if(expression.caller)
            expression.caller = expression.caller.accept(this)

        expression.parameters = expression.parameters.map((arg) => arg.accept(this))

        return expression
    }


    public visitUnary(expression: IUnaryExpression): IExpression {
        expression.argument = expression.argument.accept(this)

        return expression
    }

    public visitMember(expression: IMemberExpression): IExpression {
        expression.object = expression.object.accept(this)
        expression.property = expression.property.accept(this)

        return expression
    }

    public visitLogical(expression: ILogicalExpression): IExpression {
        expression.left = expression.left.accept(this)
        expression.right = expression.right.accept(this)

        return expression
    }

    public visitConditional(expression: IConditionalExpression): IExpression {
        expression.condition = expression.condition.accept(this)
        expression.success = expression.success.accept(this)
        expression.failure = expression.failure.accept(this)

        return expression

    }

    /**
     * transform pegjs expression ast tree to our internal ast tree to make it easier to swap expression parser at a later time
     * @see
     * http://www.odata.org/documentation/odata-version-2-0/uri-conventions/
     *
     * @param expression pegjs expression object
     * @returns 
     */
    private transform(expression: Record<string, any>): IExpression {
        let child: IExpression

        switch(expression.type) {
            case 'LambdaExpression':
                return new LambdaExpression(Array.isArray(expression.arguments) ? expression.arguments.map((arg) => this.transform(arg)) : [], this.transform(expression.expression))

            case 'Identifier':
                return new IdentifierExpression(expression.name)

            case 'MemberExpression':
                switch(expression.property.type) {
                    case 'CallExpression':
                        child = this.transform(expression.property);
                        (<MethodExpression>child).caller = this.transform(expression.object)

                        return child

                    case 'MemberExpression':
                        let current = expression,
                            stack = []

                        do {
                            stack.push(this.transform(current.object))

                            if(current.property.type != 'MemberExpression')
                                break

                            current = current.property
                        } 
                        while (true)

                        if(current.property.type == 'CallExpression') {
                            // we want stacked memberexpressions as caller for handyness
                            child = this.transform(current.property);

                            (<MethodExpression>child).caller = stack.reduceRight((caller, member) => {
                                if(!caller)
                                    return member
                                else 
                                    return new MemberExpression(member, caller)
                            }, null)

                            return child
                        }

                        // fall through

                    default:
                        return new MemberExpression(this.transform(expression.object), this.transform(expression.property))
                }
                
            case 'CallExpression':
                switch(expression.object.type) {
                    case 'Identifier':
                        return new MethodExpression(expression.object.name, Array.isArray(expression.arguments) ? expression.arguments.map((arg) => this.transform(arg)) : [], null)

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
                return new ConditionalExpression(this.transform(expression.test), this.transform(expression.left), this.transform(expression.right))

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
                        return { key: this.transform(key), value: this.transform(value) }
                    }) : [])

            case 'TemplateLiteral':
                if(Array.isArray(expression.values) && expression.values.length > 0) {
                    let literals: Array<ILiteralExpression> = [], 
                        expressions: Array<IExpression> = [],
                        first = expression.values[0]

                    if(first.type == 'TemplateExpression') 
                        literals.push(<ILiteralExpression>this.transform({ type: 'Literal', value: '' }))

                    literals.push(...expression.values
                        .filter(value => value.type == 'Literal')
                        .map(value => <ILiteralExpression>this.transform(value))
                        .map(literal => { literal.value = literal.value.replace(/(\\)?\$(\\)?\{/g, '${'); return literal })
                    )
                    expressions.push(...expression.values.filter(value => value.type == 'TemplateExpression').map(value => this.transform(value.value)))

                    return new TemplateLiteralExpression(literals, expressions)
                }

                return new TemplateLiteralExpression([], [])

            case 'ArrayExpression':
                return new IndexExpression(this.transform(expression.object), this.transform(expression.index))

            case 'ArrayLiteral':
                return new ArrayExpression(Array.isArray(expression.elements) ? expression.elements.map((arg) => this.transform(arg)) : [])

            case 'LogicalExpression':
            case 'LogicalExpression':
                switch(expression.operator) {
                    case '&&':
                        return new LogicalExpression(LogicalOperatorType.And, this.transform(expression.left), this.transform(expression.right))
                    case '||':
                        return new LogicalExpression(LogicalOperatorType.Or, this.transform(expression.left), this.transform(expression.right))
                }
                break

            case 'RelationalExpression':
                switch(expression.operator) {
                    case '==': // equal
                        return new LogicalExpression(LogicalOperatorType.Equal, this.transform(expression.left), this.transform(expression.right))

                    case '!=': // not equal
                        return new LogicalExpression(LogicalOperatorType.NotEqual, this.transform(expression.left), this.transform(expression.right))

                    case '<': // lesser
                        return new LogicalExpression(LogicalOperatorType.Lesser, this.transform(expression.left), this.transform(expression.right))

                    case '<=': // lesser or equal
                        return new LogicalExpression(LogicalOperatorType.LesserOrEqual, this.transform(expression.left), this.transform(expression.right))

                    case '>': // greater
                        return new LogicalExpression(LogicalOperatorType.Greater, this.transform(expression.left), this.transform(expression.right))

                    case '>=': // greater or equal
                        return new LogicalExpression(LogicalOperatorType.GreaterOrEqual, this.transform(expression.left), this.transform(expression.right))
                }
                break

            case 'PostfixExpression':
                switch(expression.operator) {
                    case '--':
                        return new UnaryExpression(UnaryOperatorType.Decrement, UnaryAffixType.Postfix, this.transform(expression.argument))
                    case '++':
                        return new UnaryExpression(UnaryOperatorType.Increment, UnaryAffixType.Postfix, this.transform(expression.argument))
                }
                break

            case 'UnaryExpression':
                switch(expression.operator) {
                    case '!':
                        return new UnaryExpression(UnaryOperatorType.Invert, UnaryAffixType.Prefix, this.transform(expression.argument))
                    case '~':
                        return new UnaryExpression(UnaryOperatorType.Complement, UnaryAffixType.Prefix, this.transform(expression.argument))
                    case '+':
                        return new UnaryExpression(UnaryOperatorType.Positive, UnaryAffixType.Prefix, this.transform(expression.argument))
                    case '-':
                        return new UnaryExpression(UnaryOperatorType.Negative, UnaryAffixType.Prefix, this.transform(expression.argument))
                    case '--':
                        return new UnaryExpression(UnaryOperatorType.Decrement, UnaryAffixType.Prefix, this.transform(expression.argument))
                    case '++':
                        return new UnaryExpression(UnaryOperatorType.Increment, UnaryAffixType.Prefix, this.transform(expression.argument))
                }
                break

            case 'ShiftExpression':
                switch(expression.operator) {
                    case '<<':
                        return new BinaryExpression(BinaryOperatorType.LeftShift, this.transform(expression.left), this.transform(expression.right))
                    case '>>':
                        return new BinaryExpression(BinaryOperatorType.RightShift, this.transform(expression.left), this.transform(expression.right))
                    case '>>>': // zero-fill right-shift 
                        return new BinaryExpression(BinaryOperatorType.RightShift, this.transform(expression.left), this.transform(expression.right))
                }
                break

            case 'BitwiseExpression':
                switch(expression.operator) {
                    case '|':
                        return new BinaryExpression(BinaryOperatorType.Or, this.transform(expression.left), this.transform(expression.right))
                    case '^':
                        return new BinaryExpression(BinaryOperatorType.ExclusiveOr, this.transform(expression.left), this.transform(expression.right))
                    case '&':
                        return new BinaryExpression(BinaryOperatorType.And, this.transform(expression.left), this.transform(expression.right))
                }
                break

            case 'BinaryExpression':
                switch(expression.operator) {
                    case '+': // addition
                        return new BinaryExpression(BinaryOperatorType.Addition, this.transform(expression.left), this.transform(expression.right))

                    case '-': // subtraction
                        return new BinaryExpression(BinaryOperatorType.Subtraction, this.transform(expression.left), this.transform(expression.right))

                    case '*': // multiplication
                        return new BinaryExpression(BinaryOperatorType.Multiplication, this.transform(expression.left), this.transform(expression.right))

                    case '/': // division
                        return new BinaryExpression(BinaryOperatorType.Division, this.transform(expression.left), this.transform(expression.right))

                    case '%': // modulus
                        return new BinaryExpression(BinaryOperatorType.Modulus, this.transform(expression.left), this.transform(expression.right))
                }
                break                
        }

        throw new Error('Expression type "' + expression.type + '" is unknown')
    }

  
}

//export { IExpression, Expression, ExpressionType } from './expression';
//export { IArrayExpression, IBinaryExpression, ICompoundExpression, IConditionalExpression, IIdentifierExpression, ILiteralExpression, ILogicalExpression, IMemberExpression, IMethodExpression, IUnaryExpression }

export { IExpressionVisitor } from './interface/iexpressionvisitor'

export { IExpression, Expression, ExpressionType } from './expression/expression'
export { ILambdaExpression, LambdaExpression } from './expression/lambdaexpression'
export { ILiteralExpression, LiteralExpression } from './expression/literalexpression'
export { ICompoundExpression } from './expression/compoundexpression'
export { IIdentifierExpression, IdentifierExpression } from './expression/identifierexpression'
export { IMemberExpression, MemberExpression } from './expression/memberexpression'
export { IMethodExpression, MethodExpression } from './expression/methodexpression'
export { IUnaryExpression, UnaryExpression, UnaryOperatorType, UnaryAffixType } from './expression/unaryexpression'
export { IBinaryExpression, BinaryExpression, BinaryOperatorType } from './expression/binaryexpression'
export { ILogicalExpression, LogicalExpression, LogicalOperatorType } from './expression/logicalexpression'
export { IConditionalExpression, ConditionalExpression } from './expression/conditionalexpression'
export { IArrayExpression, ArrayExpression } from './expression/arrayexpression'
export { IIndexExpression, IndexExpression } from './expression/indexexpression'
export { ITemplateLiteralExpression, TemplateLiteralExpression } from './expression/templateliteralexpression'
export { IObjectExpression, ObjectExpression, IObjectProperty } from './expression/objectexpression'