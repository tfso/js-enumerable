import { IExpression } from './iexpression'

export interface IExpressionStack {
    length(): number    
    push(item: IExpression): void
    pop(): IExpression 
    peek(steps?: number): IExpression 
}