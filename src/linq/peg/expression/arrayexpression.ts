import { IArrayExpression } from '../interface/iarrayexpression'
import { IExpression, Expression, ExpressionType } from './expression'

export class ArrayExpression extends Expression implements IArrayExpression {
    constructor(public elements: Array<IExpression>) {
        super(ExpressionType.Array)
    }

    public equal(expression: IArrayExpression): boolean {
        if(this.type == expression.type && this.elements.length == expression.elements.length) {

            for(let i = 0; i < this.elements.length; i++) {
                if(this.elements[i].equal(expression.elements[i]) == false)
                    return false
            }

            return true
        }

        return false
    }

    public toString() {
        return `[${(this.elements || []).map(element => element.toString()).join(', ')}]`
    }

    public static instanceof(expression: IExpression): expression is IArrayExpression {
        return expression != null && expression.type == ExpressionType.Array
    }
}

export { IArrayExpression }