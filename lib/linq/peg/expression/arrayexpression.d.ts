import { IArrayExpression } from '../interface/iarrayexpression';
import { IExpression, Expression } from './expression';
export declare class ArrayExpression extends Expression implements IArrayExpression {
    elements: Array<IExpression>;
    constructor(elements: Array<IExpression>);
    equal(expression: IArrayExpression): boolean;
    toString(): string;
}
export { IArrayExpression };
