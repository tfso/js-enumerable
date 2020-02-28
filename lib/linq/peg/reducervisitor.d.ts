import { ExpressionVisitor, IExpression, ILiteralExpression, IMethodExpression, IBinaryExpression, ILogicalExpression, IConditionalExpression } from './expressionvisitor';
export declare class ReducerVisitor extends ExpressionVisitor {
    private _parentExpressionStack;
    private _it;
    constructor();
    get it(): string;
    visitLambda(predicate: (it: Record<string, any>, ...param: Array<any>) => any, ...param: Array<any>): IExpression;
    visitLiteral(expression: ILiteralExpression): IExpression;
    visitMethod(expression: IMethodExpression): IExpression;
    visitBinary(expression: IBinaryExpression): IExpression;
    visitConditional(expression: IConditionalExpression): IExpression;
    visitLogical(expression: ILogicalExpression): IExpression;
    evaluate(expression: IExpression, it?: Record<string, any>): IExpression;
    static evaluate(expression: IExpression, it?: Record<string, any>): any;
}
