import { IExpressionVisitor, IExpressionStack } from './interface/iexpressionvisitor';
import { IExpression } from './expression/expression';
import { ILiteralExpression } from './expression/literalexpression';
import { IIndexExpression } from './expression/indexexpression';
import { ICompoundExpression } from './expression/compoundexpression';
import { IIdentifierExpression } from './expression/identifierexpression';
import { IMemberExpression } from './expression/memberexpression';
import { IMethodExpression } from './expression/methodexpression';
import { IUnaryExpression } from './expression/unaryexpression';
import { IBinaryExpression } from './expression/binaryexpression';
import { ILogicalExpression } from './expression/logicalexpression';
import { IConditionalExpression } from './expression/conditionalexpression';
import { IArrayExpression } from './expression/arrayexpression';
import { ITemplateLiteralExpression } from './expression/templateliteralexpression';
import { IObjectExpression } from './expression/objectexpression';
import { LambdaExpression } from './expression/lambdaexpression';
export declare class ExpressionStack implements IExpressionStack {
    private items;
    private count;
    constructor();
    length(): number;
    push(item: IExpression): void;
    pop(): IExpression;
    peek(steps?: number): IExpression;
}
export declare class ExpressionVisitor implements IExpressionVisitor {
    protected _lambdaExpression: LambdaExpression;
    private _expressionStack;
    constructor();
    get stack(): ExpressionStack;
    visitOData(filter: string): IExpression;
    visitLambdaExpression(expression: string): IExpression;
    visitLambda(predicate: (it: any, ...param: Array<any>) => any): IExpression;
    visit(expression: IExpression): IExpression;
    visitLiteral(expression: ILiteralExpression): IExpression;
    visitArray(expression: IArrayExpression): IExpression;
    visitTemplateLiteral(expression: ITemplateLiteralExpression): IExpression;
    visitObject(expression: IObjectExpression): IExpression;
    visitIndex(expression: IIndexExpression): IExpression;
    visitCompound(expression: ICompoundExpression): IExpression;
    visitIdentifier(expression: IIdentifierExpression): IExpression;
    visitBinary(expression: IBinaryExpression): IExpression;
    visitMethod(expression: IMethodExpression): IExpression;
    visitUnary(expression: IUnaryExpression): IExpression;
    visitMember(expression: IMemberExpression): IExpression;
    visitLogical(expression: ILogicalExpression): IExpression;
    visitConditional(expression: IConditionalExpression): IExpression;
    /**
     * transform pegjs expression ast tree to our internal ast tree to make it easier to swap expression parser at a later time
     * @see
     * http://www.odata.org/documentation/odata-version-2-0/uri-conventions/
     *
     * @param expression pegjs expression object
     * @returns
     */
    private transform;
}
export { IExpression, Expression, ExpressionType } from './expression/expression';
export { ILiteralExpression, LiteralExpression } from './expression/literalexpression';
export { ICompoundExpression } from './expression/compoundexpression';
export { IIdentifierExpression, IdentifierExpression } from './expression/identifierexpression';
export { IMemberExpression, MemberExpression } from './expression/memberexpression';
export { IMethodExpression, MethodExpression } from './expression/methodexpression';
export { IUnaryExpression, UnaryExpression, UnaryOperatorType, UnaryAffixType } from './expression/unaryexpression';
export { IBinaryExpression, BinaryExpression, BinaryOperatorType } from './expression/binaryexpression';
export { ILogicalExpression, LogicalExpression, LogicalOperatorType } from './expression/logicalexpression';
export { IConditionalExpression, ConditionalExpression } from './expression/conditionalexpression';
export { IArrayExpression, ArrayExpression } from './expression/arrayexpression';
export { IIndexExpression, IndexExpression } from './expression/indexexpression';
export { ITemplateLiteralExpression, TemplateLiteralExpression } from './expression/templateliteralexpression';
export { IObjectExpression, ObjectExpression, IObjectProperty } from './expression/objectexpression';
