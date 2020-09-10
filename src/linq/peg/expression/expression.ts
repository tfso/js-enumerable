import { IExpression } from '../interface/iexpression'
import { ExpressionType } from './expressiontype'

import { ILiteralExpression } from '../interface/iliteralexpression'
import { ICompoundExpression } from '../interface/icompoundexpression'
import { IIdentifierExpression } from '../interface/iidentifierexpression'
import { IMemberExpression } from '../interface/imemberexpression'
import { IMethodExpression } from '../interface/imethodexpression'
import { IUnaryExpression } from '../interface/iunaryexpression'
import { IBinaryExpression } from '../interface/ibinaryexpression'
import { ILogicalExpression, LogicalOperatorType } from '../interface/ilogicalexpression'
import { IConditionalExpression } from '../interface/iconditionalexpression'
import { IArrayExpression } from '../interface/iarrayexpression'
import { IIndexExpression } from '../interface/iindexexpression'
import { ITemplateLiteralExpression } from '../interface/itemplateliteralexpression'
import { IObjectExpression } from '../interface/iobjectexpression'
import { ILambdaExpression } from '../interface/ilambdaexpression'

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
            case ExpressionType.Lambda:
                expression = visitor.visitLambda(<ILambdaExpression><Record<string, any>>this); break
                
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

    public get intersection(): IExpression[] {
        let intersection: Array<IExpression>

        intersection = Array.from(visit(this)).reduce((acc, curr, idx) => {
            return Array.from(curr).filter((expr) => {
                return !acc || acc.some(intersect => expr.equal(intersect))
            })
        }, intersection)

        return intersection ?? []
    }

    public get union(): IExpression[] {
        let union: Array<IExpression>

        union = Array.from(visit(this)).reduce((acc, curr, idx) => {
            return (acc || []).concat(Array.from(curr))
        }, union)

        return union ?? []
    }
}

function * visit(expression: IExpression): Iterable<IterableIterator<IExpression>> {
    if(isLogicalExpression(expression)) {
        if(expression.operator == LogicalOperatorType.Or) {
            yield* visit(expression.left)
            yield* visit(expression.right)
        }
        else {
            yield visitLeaf(expression)
        }
    }
    else if(isLambdaExpression(expression)) {
        yield* visit(expression.expression)
    }
    else {
        yield visitLeaf(expression)
    }
}

function * visitLeaf(expression: IExpression): IterableIterator<IExpression> {
    if(isLogicalExpression(expression)) {
        switch(expression.operator) {
            case LogicalOperatorType.Or:
                break

            case LogicalOperatorType.And:
                yield* visitLeaf(expression.left)
                yield* visitLeaf(expression.right)
                
                break

            default:
                yield expression

                break
        }
    }
}

function isLogicalExpression(expression: IExpression): expression is ILogicalExpression {
    return expression.type == ExpressionType.Logical
}

function isLambdaExpression(expression: IExpression): expression is ILambdaExpression {
    return expression.type == ExpressionType.Lambda
}

export { IExpression, ExpressionType }