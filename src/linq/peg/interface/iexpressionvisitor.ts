import { IExpression } from './iexpression'

import { ILiteralExpression } from './iliteralexpression'
import { ICompoundExpression } from './icompoundexpression'
import { IIdentifierExpression } from './iidentifierexpression'
import { IMemberExpression } from './imemberexpression'
import { IMethodExpression } from './imethodexpression'
import { IUnaryExpression } from './iunaryexpression'
import { IBinaryExpression } from './ibinaryexpression'
import { ILogicalExpression } from './ilogicalexpression'
import { IConditionalExpression } from './iconditionalexpression'
import { IArrayExpression } from './iarrayexpression'
import { IIndexExpression } from './iindexexpression'
import { ITemplateLiteralExpression } from './itemplateliteralexpression'
import { IObjectExpression } from './iobjectexpression'
import { ILambdaExpression } from './ilambdaexpression'

export interface IExpressionStack {
    length(): number    
    push(item: IExpression): void
    pop(): IExpression 
    peek(steps?: number): IExpression 
}

export interface IExpressionVisitor {
    readonly stack: IExpressionStack

    visit(expression: IExpression): IExpression
    visitLambda(expression: ILambdaExpression): IExpression
    visitLiteral(expression: ILiteralExpression): IExpression 
    visitArray(expression: IArrayExpression): IExpression 
    visitTemplateLiteral(expression: ITemplateLiteralExpression): IExpression 
    visitObject(expression: IObjectExpression): IExpression 
    visitIndex(expression: IIndexExpression): IExpression 
    visitCompound(expression: ICompoundExpression): IExpression 
    visitIdentifier(expression: IIdentifierExpression): IExpression 
    visitBinary(expression: IBinaryExpression): IExpression 
    visitMethod(expression: IMethodExpression): IExpression 
    visitUnary(expression: IUnaryExpression): IExpression 
    visitMember(expression: IMemberExpression): IExpression 
    visitLogical(expression: ILogicalExpression): IExpression 
    visitConditional(expression: IConditionalExpression): IExpression
}