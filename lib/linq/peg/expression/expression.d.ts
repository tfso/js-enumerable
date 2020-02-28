import { IExpression } from '../interface/iexpression';
import { ExpressionType } from './expressiontype';
import { IExpressionVisitor } from '../interface/iexpressionvisitor';
export declare abstract class Expression implements IExpression {
    private _type;
    constructor(type: ExpressionType);
    get type(): ExpressionType;
    set type(value: ExpressionType);
    accept<T extends IExpressionVisitor>(visitor: T): IExpression;
    abstract equal(expression: IExpression): boolean;
    abstract toString(): string;
}
export { IExpression, ExpressionType };
