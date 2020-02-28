import { IMethodExpression } from '../interface/imethodexpression'
import { IExpression, Expression, ExpressionType } from './expression'

export class MethodExpression extends Expression implements IMethodExpression {
    constructor(public name: string, public parameters: Array<IExpression>, public caller: IExpression) {
        super(ExpressionType.Method)
    }

    public equal(expression: IMethodExpression): boolean {
        if(this.type == expression.type && this.name == expression.name && ((this.caller == null && expression.caller == null) || this.caller.equal(expression.caller))) {
            if(this.parameters == null && expression.parameters == null)
                return true

            if(this.parameters.length != expression.parameters.length)
                return false

            for(let i = 0; i < this.parameters.length; i++) {
                if(this.parameters[i].equal(expression.parameters[i]) == false)
                    return false
            }

            return true
        }

        return false
    }

    public toString() {
        return `${this.caller ? `${this.caller.toString()}.` : ''}${this.name}(${(this.parameters || []).map(parameter => parameter.toString()).join(', ')})`
    }
}

export { IMethodExpression }