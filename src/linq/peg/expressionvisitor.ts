import { transform, parse } from './parser'

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
    //protected _rawExpression: { expression: string, parameters: Array<string>, fn: ((...args: Array<any>) => any) }
    private _expressionStack: ExpressionStack

    constructor() {
        this._expressionStack = new ExpressionStack()
    }

    public get stack(): ExpressionStack {
        return this._expressionStack
    }

    public parse(type: 'odata', predicate: string): ReturnType<typeof parse>
    public parse(type: 'javascript', lambda: (it: any, ...param: Array<any>) => boolean, ...params: Array<any>): ReturnType<typeof parse>
    public parse(type: 'javascript', predicate: string): ReturnType<typeof parse>
    public parse(type: 'odata' | 'javascript', predicate: any, ...params: Array<any>): ReturnType<typeof parse> {
        let { original, expression } = parse(<any>type, predicate) ?? { }

        return {
            type, 
            original,
            expression: this.visit(expression)
        }
    }

    public parseOData(filter: string): IExpression {
        return this.parse('odata', arguments[0])?.expression
    }

    public parseLambda(lambda: string): IExpression
    public parseLambda(lambda: (it: any, ...param: Array<any>) => any): IExpression
    public parseLambda(): IExpression {
        return this.parse('javascript', arguments[0])?.expression
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