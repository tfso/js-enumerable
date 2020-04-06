import { IExpression } from '../interface/iexpression'
import { ExpressionType } from './expressiontype'

import { ILiteralExpression } from '../interface/iliteralexpression'
import { ICompoundExpression } from '../interface/icompoundexpression'
import { IIdentifierExpression } from '../interface/iidentifierexpression'
import { IMemberExpression } from '../interface/imemberexpression'
import { IMethodExpression } from '../interface/imethodexpression'
import { IUnaryExpression } from '../interface/iunaryexpression'
import { IBinaryExpression } from '../interface/ibinaryexpression'
import { ILogicalExpression } from '../interface/ilogicalexpression'
import { IConditionalExpression } from '../interface/iconditionalexpression'
import { IArrayExpression } from '../interface/iarrayexpression'
import { IIndexExpression } from '../interface/iindexexpression'
import { ITemplateLiteralExpression } from '../interface/itemplateliteralexpression'
import { IObjectExpression } from '../interface/iobjectexpression'

import { IExpressionVisitor } from '../interface/iexpressionvisitor'

export abstract class Expression implements IExpression {
    private _type: ExpressionType;

    constructor(type: ExpressionType) { //(predicate: (it: Object) => boolean, parameters?: any) {
        this._type = type
    }

    get type() {
        return this._type
    }

    set type(value) {
        this._type = value
    }

    public accept<T extends IExpressionVisitor>(visitor: T) {
        let expression: IExpression

        // add this as parent to stack for next acceptance/visit
        visitor.stack.push(this)

        switch(this.type) {
            case ExpressionType.Literal:
                expression = visitor.visitLiteral(<ILiteralExpression><Record<string, any>>this); break

            case ExpressionType.Compound:
                expression = visitor.visitCompound(<ICompoundExpression><Record<string, any>>this); break

            case ExpressionType.Identifier:
                expression = visitor.visitIdentifier(<IIdentifierExpression><Record<string, any>>this); break

            case ExpressionType.Member:
                expression = visitor.visitMember(<IMemberExpression><Record<string, any>>this); break

            case ExpressionType.Method:
                expression = visitor.visitMethod(<IMethodExpression><Record<string, any>>this); break

            case ExpressionType.Unary:
                expression = visitor.visitUnary(<IUnaryExpression><Record<string, any>>this); break

            case ExpressionType.Binary:
                expression = visitor.visitBinary(<IBinaryExpression><Record<string, any>>this); break

            case ExpressionType.Logical:
                expression = visitor.visitLogical(<ILogicalExpression><Record<string, any>>this); break

            case ExpressionType.Conditional:
                expression = visitor.visitConditional(<IConditionalExpression><Record<string, any>>this); break

            case ExpressionType.Array:
                expression = visitor.visitArray(<IArrayExpression><Record<string, any>>this); break

            case ExpressionType.Index:
                expression = visitor.visitIndex(<IIndexExpression><Record<string, any>>this); break

            case ExpressionType.TemplateLiteral:
                expression = visitor.visitTemplateLiteral(<ITemplateLiteralExpression><Record<string, any>>this); break

            case ExpressionType.Object:
                expression = visitor.visitObject(<IObjectExpression><Record<string, any>>this); break
        }

        // remove it from stack
        visitor.stack.pop()

        // return the newly visited expression
        return expression
    }

    public abstract equal(expression: IExpression): boolean
    public abstract toString(): string
}

export { IExpression, ExpressionType }