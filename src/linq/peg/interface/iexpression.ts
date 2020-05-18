import { ExpressionType } from '../expression/expressiontype'
import { IExpressionVisitor } from './iexpressionvisitor'

export interface IExpression {
    type: ExpressionType

    accept<T extends IExpressionVisitor>(visitor: T): IExpression
    equal(expression: IExpression): boolean

    readonly intersection: IExpression[]
    readonly union: IExpression[]

    toString(): string
}