import { IIndexExpression } from '../interface/iindexexpression'
import { IExpression, Expression, ExpressionType } from './expression'

export class IndexExpression extends Expression implements IIndexExpression {
    constructor(public object: IExpression, public index: IExpression) {
        super(ExpressionType.Index)
    }

    public equal(expression: IIndexExpression): boolean {
        return this.type == expression.type && this.object.equal(expression.object) && this.index.equal(expression.index)
    }

    public toString() {
        return `${this.object.toString()}[${this.index.toString()}]`
    }

    public static instanceof(expression: IExpression): expression is IIndexExpression {
        return expression != null && expression.type == ExpressionType.Index
    }
}

export { IIndexExpression }