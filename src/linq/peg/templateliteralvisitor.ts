import { IExpression, Expression, ExpressionType } from './expression/expression'
import { ILiteralExpression, LiteralExpression } from './expression/literalexpression'
import { IIdentifierExpression, IdentifierExpression } from './expression/identifierexpression'

import { ITemplateLiteralExpression, TemplateLiteralExpression } from './expression/templateliteralexpression'
import { IObjectExpression, ObjectExpression, IObjectProperty } from './expression/objectexpression'

import { JavascriptVisitor } from './javascriptvisitor'

export class TemplateLiteralVisitor extends JavascriptVisitor {
    private _wrapper: (value: any) => string;

    constructor(wrapper?: (value: any) => string) {
        super()

        this._wrapper = wrapper || ((value: any) => value)
    }

    //public visitTemplateLiteral(expression: ITemplateLiteralExpression): IExpression {
    //    let elements = expression.elements.map((element) => element.accept(this));

    //    if (elements.every(expr => expr.type == ExpressionType.Literal)) 
    //    {
    //        return new LiteralExpression(elements.reduce((output, expr) => {
    //            return output + new String((<ILiteralExpression>expr).value).toString();
    //        }, ''));
    //    }

    //    return new TemplateLiteralExpression(elements);
    //}

    public evaluate(expression: IExpression, it: Record<string, any> = null): IExpression {
        let value: any = null

        if(expression == null)
            return null

        switch(expression.type) {
            case ExpressionType.TemplateLiteral:
                let templateExpr: ITemplateLiteralExpression = <ITemplateLiteralExpression>expression,
                    expressions = templateExpr.expressions.map(expr => this.evaluate(expr, it))
                
                if(it) {
                    if(expressions.every(el => el.type == ExpressionType.Literal) == true) {
                        return new LiteralExpression(
                            templateExpr.literals.reduce(
                                (out, str, idx) => out += str.value + this._wrapper(idx < expressions.length ? (<ILiteralExpression>expressions[idx]).value : ''), 
                                ''
                            )
                        )
                       
                        //return new LiteralExpression(elements.reduce((out, el) => out += this._wrapper((<ILiteralExpression>el).value), ''));
                    }
                }

                return new TemplateLiteralExpression(templateExpr.literals, expressions)

            case ExpressionType.Object:
                let properties = (<IObjectExpression>expression).properties.map(el => <IObjectProperty>{ key: this.evaluate(el.key, it), value: this.evaluate(el.value, it) })

                if(it) {
                    if(properties.every(el => el.value.type == ExpressionType.Literal) == true)
                        return new LiteralExpression(properties.reduce<Record<string, any>>((o, p) => {
                            o[p.key.type == ExpressionType.Identifier ? (<IdentifierExpression>p.key).name : (<ILiteralExpression>p.key).value] = (<ILiteralExpression>p.value).value
                            return o
                        }, {}))
                }

                return new ObjectExpression(properties)
                
            default:
                return super.evaluate(expression, it)
        }

        //return expression;
    }

    public static evaluate(predicate: (it: Record<string, any>, ...param: Array<any>) => any, it: Record<string, any>): any
    public static evaluate(expression: IExpression, it: Record<string, any>): any
    public static evaluate(expression: IExpression | ((it: Record<string, any>, ...param: Array<any>) => any), it: Record<string, any>): any {
        let reducer = new TemplateLiteralVisitor(),
            result: IExpression

        if(typeof expression == 'function')
            expression = reducer.visitLambda(expression)

        result = reducer.evaluate(expression, it)

        return result.type == ExpressionType.Literal ? (<ILiteralExpression>result).value : undefined
    }
}

export { IExpression, ExpressionType, ITemplateLiteralExpression }