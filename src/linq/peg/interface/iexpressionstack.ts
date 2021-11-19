import { IExpression } from './iexpression'

export interface IExpressionStack {
    length(): number    
    push(item: IExpression): void
    pop(): IExpression | undefined
    peek(steps?: number): IExpression 
}