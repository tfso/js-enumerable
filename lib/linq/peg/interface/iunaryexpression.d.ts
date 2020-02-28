import { IExpression } from './iexpression';
export declare enum UnaryAffixType {
    Postfix = 0,
    Prefix = 1
}
export declare enum UnaryOperatorType {
    Increment = 0,
    Decrement = 1,
    Invert = 2,
    Negative = 3,
    Positive = 4,
    Complement = 5
}
export interface IUnaryExpression extends IExpression {
    operator: UnaryOperatorType;
    affix: UnaryAffixType;
    argument: IExpression;
}
