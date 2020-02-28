import { ILiteralExpression } from '../interface/iliteralexpression';
import { Expression } from './expression';
export declare class LiteralExpression extends Expression implements ILiteralExpression {
    value: any;
    constructor(value: any);
    equal(expression: ILiteralExpression): boolean;
    toString(): string;
}
export { ILiteralExpression };
