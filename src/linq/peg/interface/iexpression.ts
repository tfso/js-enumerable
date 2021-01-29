import { ExpressionType } from '../expression/expressiontype'
import { IExpressionVisitor } from './iexpressionvisitor'

export interface IExpression {
    type: ExpressionType

    accept<V, T extends IExpressionVisitor<V>>(visitor: T): V
    
    equal(expression: IExpression): boolean

    readonly intersection: IExpression[]
    readonly union: IExpression[]
    readonly difference: IExpression[]
    readonly sets: IExpression[][]

    toString(): string
}