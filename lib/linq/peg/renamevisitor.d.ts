import { IExpression } from './expression/expression';
import { IIdentifierExpression } from './expression/identifierexpression';
import { IMemberExpression } from './expression/memberexpression';
import { ExpressionVisitor } from './expressionvisitor';
export declare class RenameVisitor extends ExpressionVisitor {
    private renames;
    constructor(...renames: Array<{
        from: string;
        to: string;
    }>);
    visit(expression: IExpression): IExpression;
    visitIdentifier(expression: IIdentifierExpression): IExpression;
    visitMember(expression: IMemberExpression): IExpression;
    private flattenMember;
    private unflattenMember;
}
