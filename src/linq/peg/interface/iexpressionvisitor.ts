import { IExpression } from './iexpression'
import { IExpressionStack } from './iexpressionstack'

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

export interface IExpressionVisitor<V = IExpression> {
    readonly stack: IExpressionStack

    visit(expression: IExpression): V
    visitLambda(expression: ILambdaExpression): V
    visitLiteral(expression: ILiteralExpression): V 
    visitArray(expression: IArrayExpression): V 
    visitTemplateLiteral(expression: ITemplateLiteralExpression): V
    visitObject(expression: IObjectExpression): V
    visitIndex(expression: IIndexExpression): V 
    visitCompound(expression: ICompoundExpression): V
    visitIdentifier(expression: IIdentifierExpression): V
    visitBinary(expression: IBinaryExpression): V 
    visitMethod(expression: IMethodExpression): V
    visitUnary(expression: IUnaryExpression): V
    visitMember(expression: IMemberExpression): V
    visitLogical(expression: ILogicalExpression): V
    visitConditional(expression: IConditionalExpression): V
}