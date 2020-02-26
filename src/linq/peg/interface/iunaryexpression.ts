import { IExpression } from './iexpression'

export enum UnaryAffixType {
    Postfix,
    Prefix
}

export enum UnaryOperatorType {
    Increment,      // ++
    Decrement,      // --
    Invert,         // !
    Negative,       // -
    Positive,       // +
    Complement      // ~
}

export interface IUnaryExpression extends IExpression {
    operator: UnaryOperatorType
    affix: UnaryAffixType
    argument: IExpression
}