import { ODataVisitor } from '../odatavisitor'
import { ExpressionVisitor } from '../expressionvisitor'
import { ExpressionStack } from '../expressionstack'

import { IExpressionVisitor } from '../interface/iexpressionvisitor'

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

// http://docs.oasis-open.org/odata/odata/v4.01/cs01/abnf/odata-abnf-construction-rules.txt

export class ODataTranslator implements IExpressionVisitor<string> {
    private _expressionStack: ExpressionStack

    constructor() {
        this._expressionStack = new ExpressionStack()
    }

    public get stack(): ExpressionStack {
        return this._expressionStack
    }

    public visit(expression: IExpression): string {
        return expression.accept(this)
    }

    public visitLambda(expr: ILambdaExpression): string {
        const parameters: string[] = expr.parameters.map((element) => element.accept(this))
        const expression = expr.expression.accept(this)

        return '' //expression
    }

    public visitLiteral(expression: ILiteralExpression): string {
        switch(typeof expression.value) {
            case 'bigint':
            case 'number':
                return `${expression.value}`

            case 'string':
                return `'${expression.value.replace(/'/g, '\'')}'`

            case 'boolean':
                return expression.value ? 'true' : 'false'
            
            case 'object':
                if(expression.value === null)
                    return 'null'
                
                if(expression.value instanceof Date) {
                    if(expression.value.getHours() == 0 && expression.value.getMinutes() == 0 && expression.value.getSeconds() == 0 && expression.value.getMilliseconds() == 0)
                        return `${expression.value.getFullYear()}-${expression.value.getMonth()}-${expression.value.getDate()}`
                    
                    return `${expression.value.getFullYear()}-${expression.value.getMonth()}-${expression.value.getDate()}T${expression.value.getHours()}:${expression.value.getMinutes()}:${expression.value.getSeconds()}`
                }

                return ''
        }
        return expression.value
    }

    public visitArray(expression: IArrayExpression): string {
        const elements: string[] = expression.elements.map((element) => element.accept(this))

        return `[${elements.join(', ')}]`
    }

    public visitTemplateLiteral(expression: ITemplateLiteralExpression): string {
        throw new Error('Template literals is not supported by OData')
    }

    public visitObject(expression: IObjectExpression): string {
        //expression.properties = expression.properties.map((element) => <IObjectProperty>{ key: element.key.accept(this), value: element.value.accept(this) })

        return '' //expression
    }

    public visitIndex(expression: IIndexExpression): string {
        const object: string = expression.object.accept(this)
        const index: string = expression.index.accept(this)
    
        return `${object}[${index}]`
    }

    public visitCompound(expression: ICompoundExpression): string {
        throw new Error('Compound is not supported by OData')
    }

    public visitIdentifier(expression: IIdentifierExpression): string {
        return expression.name
    }

    public visitBinary(expression: IBinaryExpression): string {
        const left: string = expression.left.accept(this)
        const right: string = expression.right.accept(this)

        switch(expression.operator) {
            case BinaryOperatorType.Addition:
                return `(${left} add ${right})`

            case BinaryOperatorType.Division:
                return `(${left} div ${right})`

            case BinaryOperatorType.Subtraction:
                return `(${left} sub ${right})`

            case BinaryOperatorType.Multiplication:
                return `(${left} mul ${right})`

            default:
                throw new Error(`Expression '${expression.toString()}' is not supported by OData`)
        }
    }

    public visitMethod(expression: IMethodExpression): string {
        const caller: string = expression.caller?.accept(this) ?? ''
        const parameters: string[] = expression.parameters.map((arg) => arg.accept(this))

        // javascript to odata? næææ, not yet, perhaps methods should be standardized before doing that to avoid alot of language handling

        if(['concat', 'contains', 'endswith', 'indexof', 'length', 'startswith', 'substring', 'tolower', 'toupper', 'trim', 'year', 'month', 'day', 'hour', 'minute', 'second', 'fractionalseconds', 'totalseconds', 'date', 'time'].includes(expression.name) == false)
            throw new Error(`Method expression '${expression.toString()}' is not supported by OData`)

        return `${caller ? `${caller}/` : ''}${expression.name}(${parameters.join(', ')})`
    }

    public visitUnary(expression: IUnaryExpression): string {
        throw new Error('Unary expressions is not supported by OData')
    }

    public visitMember(expression: IMemberExpression): string {
        const object: string = expression.object.accept(this)
        const property: string = expression.property.accept(this)

        return `${object}/${property}`
    }

    public visitLogical(expression: ILogicalExpression): string {
        const left: string = expression.left.accept(this)
        const right: string = expression.right.accept(this)

        switch(expression.operator) {
            case LogicalOperatorType.And:
                return `(${left}) and (${right})`

            case LogicalOperatorType.Or:
                return `(${left}) or (${right})`

            case LogicalOperatorType.Greater:
                return `${left} gt ${right}`

            case LogicalOperatorType.GreaterOrEqual:
                return `${left} ge ${right}`

            case LogicalOperatorType.Lesser:
                return `${left} lt ${right}`

            case LogicalOperatorType.LesserOrEqual:
                return `${left} le ${right}`

            case LogicalOperatorType.Equal:
                return `${left} eq ${right}`

            case LogicalOperatorType.NotEqual:
                return `${left} ne ${right}`

            case LogicalOperatorType.In:
                return `${left} in ${right}`
        }

        return '' //expression
    }

    public visitConditional(expression: IConditionalExpression): string {
        throw new Error('Conditional expressions is not supported by OData')
    }  
}