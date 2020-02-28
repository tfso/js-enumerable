import { IExpression } from './iexpression';
export interface IArrayExpression extends IExpression {
    elements: Array<IExpression>;
}
