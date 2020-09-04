import { ILambdaExpression } from './../interface/ilambdaexpression'
import { IExpression, Expression, ExpressionType } from './expression'

export class LambdaExpression extends Expression implements ILambdaExpression {
    private _expression: string;
    private _parameters: Array<string> 

    constructor(public parameters: Array<IExpression>, public expression: IExpression) {
        super(ExpressionType.Lambda)
    }

    public equal(expression: ILambdaExpression): boolean {
        if(this.type == expression.type && this.parameters.length == expression.parameters.length) {
            for(let i = 0; i < this.parameters.length; i++) {
                if(this.parameters[i].equal(expression.parameters[i]) == false)
                    return false
            }

            if(this.expression.type == expression.expression.type && this.expression.equal(expression.expression))
                return true
        }

        return false
    }

    public toString() {
        return `(${(this.parameters || []).map(param => param.toString()).join(', ')}) => ${this.expression.toString()}`
    }
}

export { ILambdaExpression }