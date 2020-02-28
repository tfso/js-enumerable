import { IExpression } from './iexpression'
import { ILiteralExpression } from './iliteralexpression'

export interface ITemplateLiteralExpression extends IExpression {
    elements: Array<IExpression>
    
    readonly literals: Array<ILiteralExpression>
    readonly expressions: Array<IExpression>
}
