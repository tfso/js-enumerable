import { IObjectExpression, IObjectProperty } from '../interface/iobjectexpression';
import { Expression } from './expression';
export declare class ObjectExpression extends Expression implements IObjectExpression {
    properties: Array<IObjectProperty>;
    constructor(properties: Array<IObjectProperty>);
    equal(expression: IObjectExpression): boolean;
    toString(): string;
}
export { IObjectExpression, IObjectProperty };
