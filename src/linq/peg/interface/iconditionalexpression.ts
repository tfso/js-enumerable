import { IExpression } from './iexpression'

export interface IConditionalExpression extends IExpression {
    condition: IExpression
    success: IExpression
    failure: IExpression
}