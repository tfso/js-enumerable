import { IExpression } from './expression/expression';
import { IMethodExpression } from './expression/methodexpression';
import { ReducerVisitor } from './reducervisitor';
export declare class ODataVisitor extends ReducerVisitor {
    constructor();
    visitOData(filter: string): IExpression;
    get it(): string;
    visitMethod(expression: IMethodExpression): IExpression;
    static evaluate(expression: string, it?: Record<string, any>): any;
    static evaluate(expression: IExpression, it?: Record<string, any>): any;
}
