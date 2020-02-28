import { ILogicalExpression, LogicalOperatorType } from '../interface/ilogicalexpression';
import { IExpression, Expression } from './expression';
export declare class LogicalExpression extends Expression implements ILogicalExpression {
    operator: LogicalOperatorType;
    left: IExpression;
    right: IExpression;
    constructor(operator: LogicalOperatorType, left: IExpression, right: IExpression);
    equal(expression: ILogicalExpression): boolean;
    toString(): string;
}
export { ILogicalExpression, LogicalOperatorType };
