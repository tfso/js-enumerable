import { IExpression } from './iexpression';
export interface IMemberExpression extends IExpression {
    object: IExpression;
    property: IExpression;
}
