import { IExpression, Expression, ExpressionType } from './expression/expression'
import { IIdentifierExpression, IdentifierExpression } from './expression/identifierexpression'
import { IMemberExpression, MemberExpression } from './expression/memberexpression'

import { ExpressionVisitor } from './expressionvisitor'

export class RenameVisitor extends ExpressionVisitor {
    private renames: Map<string, string>;

    constructor(...renames: Array<{ from: string, to: string }>) {
        super()

        this.renames = new Map()
        
        for(let rename of renames)
            if(typeof (rename) == 'object' && typeof rename.from == 'string' && rename.from.length > 0)
                this.renames.set(rename.from, rename.to)
    }

    public visit(expression: IExpression): IExpression {
        return expression.accept(this)
    }

    public visitIdentifier(expression: IIdentifierExpression): IExpression {
        let name

        if((name = this.renames.get(expression.name)) == null)
            name = expression.name

        return new IdentifierExpression(name)
    }

    public visitMember(expression: IMemberExpression): IExpression {       
        let path: string | undefined
   
        if((path = this.renames.get(this.flattenMember(expression))) == null)
            return new MemberExpression(expression.object.accept(this), expression.property.accept(this))

        return this.unflattenMember(path)
    }

    private flattenMember(expression: IExpression): string {
        switch(expression.type) {
            case ExpressionType.Member:
                let prop = this.flattenMember((<IMemberExpression>expression).property)

                return this.flattenMember((<IMemberExpression>expression).object) + (prop.length > 0 ? '.' + prop : '')
                
            case ExpressionType.Identifier:
                return (<IIdentifierExpression>expression).name

            default:
                return ''
        }
    }

    private unflattenMember(path: string, idx = 0): IExpression {
        let parts = path.split('.')

        if(idx + 1 >= parts.length)
            return new IdentifierExpression(parts[idx])

        return new MemberExpression(new IdentifierExpression(parts[idx]), this.unflattenMember(path, idx + 1))
    }

}
