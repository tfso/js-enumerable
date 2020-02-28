import { IExpression } from './iexpression'

export enum LogicalOperatorType {
    And,            // &&
    Or,             // ||
    NotEqual,       // !=
    LesserOrEqual,  // <=
    GreaterOrEqual, // >=
    Lesser,         // <
    Greater,        // >
    Equal           // ==
}

export interface ILogicalExpression extends IExpression {
    operator: LogicalOperatorType
    left: IExpression
    right: IExpression
}