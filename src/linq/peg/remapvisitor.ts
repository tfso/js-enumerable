import { IExpression, Expression, ExpressionType } from './expression/expression'
import { IIdentifierExpression, IdentifierExpression } from './expression/identifierexpression'
import { IMemberExpression, MemberExpression } from './expression/memberexpression'
import { ILogicalExpression, LogicalExpression, LogicalOperatorType } from './expression/logicalexpression'
import { IMethodExpression } from './expression/methodexpression'
import { ILiteralExpression, LiteralExpression } from './expression/literalexpression'

import { ExpressionVisitor } from './expressionvisitor'

export class RemapVisitor extends ExpressionVisitor {
    constructor(private remapKey: (name: string) => string, private remapValue: (name: string, value: any) => any) {
        super()

        if(typeof this.remapKey != 'function')
            this.remapKey = null

        if(typeof this.remapValue != 'function')
            this.remapValue = null
    }

    public visit(expression: IExpression): IExpression {
        return expression.accept(this)
    }

    public visitLiteral(expression: ILiteralExpression): IExpression {
        let parent = this.stack.peek(),
            property: IExpression,
            value: any
        
        if(this.remapValue && (property = this.findIdentifier(parent)) && (value = this.remapValue(this.flattenMember(property), expression.value)) !== undefined)
            return new LiteralExpression(value)

        return new LiteralExpression(expression.value)
    }

    public visitIdentifier(expression: IIdentifierExpression): IExpression {
        let parent = this.stack.peek(),
            name: string

        if(this.remapKey && parent.type != ExpressionType.Member) {
            if((name = this.remapKey(expression.name)) != null)
                return new IdentifierExpression(name)
        }

        return new IdentifierExpression(expression.name)
    }

    public visitMember(expression: IMemberExpression): IExpression {       
        let path: string
   
        if(this.remapKey && (path = this.remapKey(this.flattenMember(expression))) != null)
            return this.unflattenMember(path)

        return new MemberExpression(expression.object.accept(this), expression.property.accept(this))
    }

    private findIdentifier(expression: IExpression): IExpression {
        let member: any

        switch(expression.type) {
            case ExpressionType.Logical:
                if((member = this.findIdentifier((<ILogicalExpression>expression).left)) != null)
                    return member

                if((member = this.findIdentifier((<ILogicalExpression>expression).right)) != null)
                    return member

                break

            case ExpressionType.Identifier:
                return expression

            case ExpressionType.Member:
                return expression

            case ExpressionType.Method:
                if((<IMethodExpression>expression).caller != null && (member = this.findIdentifier((<IMethodExpression>expression).caller)) != null)
                    return member

                if((<IMethodExpression>expression).parameters.length >= 1 && (member = this.findIdentifier((<IMethodExpression>expression).parameters[0])) != null)
                    return member

                break
        }

        return null
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
