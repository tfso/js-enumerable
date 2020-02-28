import { ITemplateLiteralExpression } from '../interface/itemplateliteralexpression';
import { IExpression, Expression } from './expression';
import { ILiteralExpression } from './literalexpression';
export declare class TemplateLiteralExpression extends Expression implements ITemplateLiteralExpression {
    private _elements;
    private indexerLiterals;
    private indexerExpressions;
    /**
     * Literals and Expressions comes always in pairs, so first literal and last expression may be empty
     * @param literals
     * @param expressions
     */
    constructor(literals?: Array<ILiteralExpression>, expressions?: Array<IExpression>);
    equal(expression: ITemplateLiteralExpression): boolean;
    get elements(): IExpression[];
    set elements(value: IExpression[]);
    get literals(): Array<ILiteralExpression>;
    get expressions(): Array<IExpression>;
    toString(): string;
    private combine;
}
export { ITemplateLiteralExpression };
