import { IIdentifierExpression } from '../interface/iidentifierexpression';
import { Expression } from './expression';
export declare class IdentifierExpression extends Expression implements IIdentifierExpression {
    name: string;
    constructor(name: string);
    equal(expression: IIdentifierExpression): boolean;
    toString(): string;
}
export { IIdentifierExpression };
