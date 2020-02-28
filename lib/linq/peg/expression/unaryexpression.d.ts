import { IUnaryExpression, UnaryOperatorType, UnaryAffixType } from '../interface/iunaryexpression';
import { IExpression, Expression } from './expression';
export declare class UnaryExpression extends Expression implements IUnaryExpression {
    operator: UnaryOperatorType;
    affix: UnaryAffixType;
    argument: IExpression;
    constructor(operator: UnaryOperatorType, affix: UnaryAffixType, argument: IExpression);
    equal(expression: IUnaryExpression): boolean;
    toString(): string;
}
export { IUnaryExpression, UnaryOperatorType, UnaryAffixType };
