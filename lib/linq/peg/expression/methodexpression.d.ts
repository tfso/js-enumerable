import { IMethodExpression } from '../interface/imethodexpression';
import { IExpression, Expression } from './expression';
export declare class MethodExpression extends Expression implements IMethodExpression {
    name: string;
    parameters: Array<IExpression>;
    caller: IExpression;
    constructor(name: string, parameters: Array<IExpression>, caller: IExpression);
    equal(expression: IMethodExpression): boolean;
    toString(): string;
}
export { IMethodExpression };
