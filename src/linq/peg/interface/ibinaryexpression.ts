import { IExpression } from './iexpression'

export enum BinaryOperatorType {
    Subtraction,
    Addition,
    Division,
    Multiplication,

    Modulus,        // %
    And,            // &
    Or,             // |
    ExclusiveOr,    // ^
    LeftShift,      // <<
    RightShift,     // >>
}

export interface IBinaryExpression extends IExpression {
    operator: BinaryOperatorType
    left: IExpression
    right: IExpression
}