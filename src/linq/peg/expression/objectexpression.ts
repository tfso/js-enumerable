import { IObjectExpression, IObjectProperty } from '../interface/iobjectexpression'
import { IExpression, Expression, ExpressionType } from './expression'

export class ObjectExpression extends Expression implements IObjectExpression {
    constructor(public properties: Array<IObjectProperty>) {
        super(ExpressionType.Object)
    }

    public equal(expression: IObjectExpression): boolean {
        if(this.type == expression.type && this.properties.length == expression.properties.length) {
            for(let i = 0; i < this.properties.length; i++) {
                if(this.properties[i].key.equal(expression.properties[i].key) == false || this.properties[i].value.equal(expression.properties[i].value) == false)
                    return false
            }

            return true
        }

        return false
    }

    public toString() {
        return `{${
            this.properties
                .map(property => {
                    let key = property.key.toString()

                    if(key.charAt(0) == '"' && key.charAt(key.length - 1) == '"')
                        return `${key}: ${property.value}`

                    return `"${key}": ${property.value.toString()}`
                })
                .join(', ')
        }}`
    }

    public static instanceof(expression: IExpression): expression is IObjectExpression {
        return expression != null && expression.type == ExpressionType.Object
    }
}

export { IObjectExpression, IObjectProperty }