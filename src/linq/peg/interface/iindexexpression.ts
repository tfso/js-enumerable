import { IExpression } from './iexpression'

export interface IIndexExpression extends IExpression {
    object: IExpression
    index: IExpression
}
