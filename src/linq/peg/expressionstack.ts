import { IExpression } from './interface/iexpression'
import { IExpressionStack } from './interface/iexpressionstack'

export class ExpressionStack implements IExpressionStack {
    private items: Array<IExpression>
    private count: number

    constructor() {
        this.items = []
        this.count = 0
    }

    public length() {
        return this.count
    }

    public push(item: IExpression) {
        this.items.push(item)
        this.count = this.count + 1
    }

    public pop(): IExpression | undefined {
        if(this.count > 0) {
            this.count = this.count - 1
        }

        return this.items.pop()
    }

    public peek(steps = 0): IExpression {
        if((this.count + steps) <= 1)
            return <any>{ // dummy
                type: 0
            }

        return this.items[this.count - 2 + steps] // current object is always last
    }
}