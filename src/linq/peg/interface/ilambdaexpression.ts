import { IExpression } from './iexpression'

export interface ILambdaExpression extends IExpression {
    parameters: Array<IExpression>
    expression: IExpression
}
