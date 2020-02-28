import { IMemberExpression } from '../interface/imemberexpression';
import { IExpression, Expression } from './expression';
export declare class MemberExpression extends Expression implements IMemberExpression {
    object: IExpression;
    property: IExpression;
    constructor(object: IExpression, property: IExpression);
    equal(expression: IMemberExpression): boolean;
    toString(): string;
}
export { IMemberExpression };
