import { IExpression, Expression, ExpressionType, isIdentifierExpression, isMemberExpression } from './expression/expression'
import { IIdentifierExpression, IdentifierExpression } from './expression/identifierexpression'
import { IMemberExpression, MemberExpression } from './expression/memberexpression'
import { ILiteralExpression, LiteralExpression } from './expression/literalexpression'
import { ILogicalExpression } from './expression/logicalexpression'
import { IMethodExpression } from './expression/methodexpression'
import { ILambdaExpression, LambdaExpression } from './expression/lambdaexpression'

import { ExpressionVisitor } from './expressionvisitor'

import { parse } from './parser'

export class RewriteVisitor extends ExpressionVisitor {
    private renamed: Map<IExpression | undefined, string>
    private renames: Map<string, { to?: string, convert?: (value: any) => any }>
    
    private scope: string | undefined = undefined

    constructor(...renames: Array<{ from: string, to?: string, convert?: (value: any) => any }>) {
        super()

        this.renamed = new Map()
        this.renames = new Map()

        for(const { from = '', to = undefined, convert = undefined } of renames) {
            if(typeof from == 'string' && from.length > 0) {

                this.renames.set(from, { to, convert })
            }
        }
    }

    // public parse(type: 'odata', predicate: string): ReturnType<typeof parse>
    // public parse(type: 'javascript', lambda: (it: any, ...param: Array<any>) => boolean, ...params: Array<any>): ReturnType<typeof parse>
    // public parse(type: 'javascript', predicate: string, ...params: Array<any>): ReturnType<typeof parse>
    // public parse(type: 'odata' | 'javascript', predicate: any, ...params: Array<any>): ReturnType<typeof parse> {
    //     let { original, expression } = parse(<any>type, predicate) ?? { }

    //     if(type == 'javascript') {
    //         if(expression?.type == ExpressionType.Lambda) {
    //             for(let idx = 0; idx < (<ILambdaExpression>expression).parameters.length; idx++) {
    //                 let param = (<ILambdaExpression>expression).parameters[idx]

    //                 if(param.type == ExpressionType.Identifier) {
    //                     if(idx == 0) {
    //                         this.scope = (<IIdentifierExpression>param).name
    //                     }
    //                 }
    //             }

    //             return {
    //                 type: 'javascript', 
    //                 original,
    //                 expression: new LambdaExpression((<ILambdaExpression>expression).parameters, this.visit((<ILambdaExpression>expression).expression))
    //             }
    //         }
    //     }

    //     return {
    //         type, 
    //         original,
    //         expression: this.visit(expression)
    //     }
    // }

    // public parseLambda(lambda: string, ...params: Array<any>): IExpression
    // public parseLambda(lambda: (it: Record<string, any>, ...params: Array<any>) => any, ...params: Array<any>): IExpression
    // public parseLambda(lambda: any, ...params: Array<any>): IExpression {
    //     return this.parse('javascript', lambda, ...params)?.expression
    // }

    public visitLambda(expression: ILambdaExpression): IExpression {
        if(expression.parameters.length > 0) {
            const param = (<ILambdaExpression>expression).parameters[0]

            if(isIdentifierExpression(param)) {
                if(this.scope)
                    throw new Error('Nested lambda expressions is not supported')

                this.scope = param.name
            }
        }

        expression.parameters = expression.parameters.map((element) => element.accept(this))
        expression.expression = expression.expression.accept(this)

        return expression
    }

    public visitLiteral(expression: ILiteralExpression): IExpression {
        const parent = this.stack.peek()
        const parentIdentifier = this.findIdentifier(parent) ?? undefined

        if(parentIdentifier) {
            const { propertyName: parentName } = this.getPropertyName(undefined, parentIdentifier)
            
            if(parentName) {
                const rewrite = this.findRewrite(parentName)

                if(rewrite?.convert) {
                    const value = rewrite.convert(expression.value)

                    return new LiteralExpression(value)
                }
            }
        }

        return new LiteralExpression(expression.value)
    }

    public visitIdentifier(expression: IIdentifierExpression): IExpression {
        const rewrite = this.findRewrite(expression.name)

        if(rewrite?.to) {
            const rewrittenExpression = new IdentifierExpression(rewrite.to)

            this.renamed.set(rewrittenExpression, expression.name)

            return rewrittenExpression
        }

        return expression
    }

    public visitMember(expression: IMemberExpression): IExpression {
        const parent = this.stack.peek()

        const { scope, propertyName } = this.getPropertyName(parent, expression)
        const rewrite = this.findRewrite(propertyName)

        if(rewrite?.to) {
            const rewrittenExpression = scope ? this.unflattenMember(`${scope}.${rewrite.to}`) : this.unflattenMember(rewrite.to)

            this.renamed.set(rewrittenExpression, propertyName)

            return rewrittenExpression
        }

        return new MemberExpression(expression.object.accept(this), expression.property.accept(this))
    }

    private getPropertyName(parent: IExpression | undefined, expression: IExpression): { scope?: string, propertyName: string } {
        if(this.renamed.has(expression))
            return { scope: undefined, propertyName: String(this.renamed.get(expression)) }

        if(isMemberExpression(expression)) {
            const scope = !isMemberExpression(parent) && isIdentifierExpression(expression.object) && expression.object.name == this.scope ? this.scope : undefined
            const propertyName = scope ? this.flattenMember(expression.property) : this.flattenMember(expression)
            
            return { scope, propertyName }
        } 
        else {
            return { scope: undefined, propertyName: this.flattenMember(expression) }
        }
    }

    private flattenMember(expression: IExpression): string
    private flattenMember(expression: IExpression | null | undefined): string | null
    private flattenMember(expression: IExpression | null | undefined): string | null {
        if(!expression)
            return null

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
        const parts = path.split('.')

        if(idx + 1 >= parts.length)
            return new IdentifierExpression(parts[idx])

        return new MemberExpression(new IdentifierExpression(parts[idx]), this.unflattenMember(path, idx + 1))
    }

    private findRewrite(property: string) {
        return this.renames.get(property)
    }

    private findIdentifier(expression: IExpression): IIdentifierExpression | IMemberExpression | null {
        let member: any

        switch(expression?.type) {
            case ExpressionType.Logical:
                if((member = this.findIdentifier((<ILogicalExpression>expression).left)) != null)
                    return member

                if((member = this.findIdentifier((<ILogicalExpression>expression).right)) != null)
                    return member

                break

            case ExpressionType.Identifier:
                return <IIdentifierExpression>expression

            case ExpressionType.Member:
                return <IMemberExpression>expression

            case ExpressionType.Method:
                const caller = (<IMethodExpression>expression).caller
                const parameters = (<IMethodExpression>expression).parameters

                if(caller != null && (member = this.findIdentifier(caller)) != null)
                    return member

                if(parameters.length >= 1 && (member = this.findIdentifier(parameters[0])) != null)
                    return member

                break
        }

        return null
    }
}
