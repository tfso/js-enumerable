import { IExpression } from './iexpression'

export interface IMethodExpression extends IExpression {
    name: string
    parameters: Array<IExpression>
    caller: IExpression
}
