import { IExpression } from './iexpression'

export interface ICompoundExpression extends IExpression {
    body: Array<IExpression>
}