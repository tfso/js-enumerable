import { IExpression } from './iexpression';
export interface IObjectExpression extends IExpression {
    properties: Array<IObjectProperty>;
}
export interface IObjectProperty {
    key: IExpression;
    value: IExpression;
}
