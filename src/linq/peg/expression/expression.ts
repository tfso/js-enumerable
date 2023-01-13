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

export abstract class IAccept {
    
}

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

    public accept<V, T extends IExpressionVisitor<V>>(visitor: T) {
        let expression: V

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
        let intersection: Array<IExpression> | undefined

        intersection = Array.from(visit(this)).reduce((acc, curr, idx) => {
            return Array.from(curr).filter((expr) => {
                return !acc || acc.some(intersect => expr.equal(intersect))
            })
        }, intersection)

        return intersection ?? []
    }

    public get difference(): IExpression[] {
        let difference: Array<IExpression> | undefined

        difference = Array.from(visit(this)).reduce((acc, curr, idx) => {
            return acc
        }, difference)

        return []
    }

    public get union(): IExpression[] {
        let union: Array<IExpression> | undefined

        union = Array.from(visit(this)).reduce((acc, curr, idx) => {
            return (acc || []).concat(Array.from(curr))
        }, union)

        return union ?? []
    }

    public get sets(): IExpression[][] {
        let sets: Array<IExpression[]> = []

        sets = Array.from(visit(this)).reduce((acc, curr, idx) => {
            acc.push(Array.from(curr))

            return acc
        }, sets)

        return sets
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
    else {
        yield expression
    }
}

export function isLogicalExpression(expression?: IExpression): expression is ILogicalExpression {
    return expression?.type == ExpressionType.Logical ?? false
}

export function isLambdaExpression(expression?: IExpression): expression is ILambdaExpression {
    return expression?.type == ExpressionType.Lambda ?? false
}

export function isBinaryExpression(expression?: IExpression): expression is IBinaryExpression {
    return expression?.type == ExpressionType.Binary ?? false
}

export function isMemberExpression(expression?: IExpression): expression is IMemberExpression {
    return expression?.type == ExpressionType.Member ?? false
}

export function isIdentifierExpression(expression?: IExpression): expression is IIdentifierExpression {
    return expression?.type == ExpressionType.Identifier ?? false
}

export function isLiteralExpression(expression?: IExpression): expression is ILiteralExpression {
    return expression?.type == ExpressionType.Literal ?? false
}

export { IExpression, ExpressionType }