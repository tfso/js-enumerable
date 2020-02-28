import { IExpression } from './expression/expression';
import { IMemberExpression } from './expression/memberexpression';
import { IMethodExpression } from './expression/methodexpression';
import { ReducerVisitor } from './reducervisitor';
export declare class JavascriptVisitor extends ReducerVisitor {
    constructor();
    visitMember(expression: IMemberExpression): IExpression;
    visitMethod(expression: IMethodExpression): IExpression;
    static evaluate(predicate: (it: Record<string, any>, ...param: Array<any>) => any, it: Record<string, any>): any;
    static evaluate(expression: IExpression, it: Record<string, any>): any;
}
