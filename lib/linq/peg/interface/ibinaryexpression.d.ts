import { IExpression } from './iexpression';
export declare enum BinaryOperatorType {
    Subtraction = 0,
    Addition = 1,
    Division = 2,
    Multiplication = 3,
    Modulus = 4,
    And = 5,
    Or = 6,
    ExclusiveOr = 7,
    LeftShift = 8,
    RightShift = 9
}
export interface IBinaryExpression extends IExpression {
    operator: BinaryOperatorType;
    left: IExpression;
    right: IExpression;
}
