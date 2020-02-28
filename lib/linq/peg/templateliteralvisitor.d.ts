import { IExpression, ExpressionType } from './expression/expression';
import { ITemplateLiteralExpression } from './expression/templateliteralexpression';
import { JavascriptVisitor } from './javascriptvisitor';
export declare class TemplateLiteralVisitor extends JavascriptVisitor {
    private _wrapper;
    constructor(wrapper?: (value: any) => string);
    evaluate(expression: IExpression, it?: Record<string, any>): IExpression;
    static evaluate(predicate: (it: Record<string, any>, ...param: Array<any>) => any, it: Record<string, any>): any;
    static evaluate(expression: IExpression, it: Record<string, any>): any;
}
export { IExpression, ExpressionType, ITemplateLiteralExpression };
