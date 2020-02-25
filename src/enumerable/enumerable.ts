import Base from './base'
import { LinqOperator, LinqType } from './operator'

export class Enumerable<TEntity> extends Base<TEntity> {
    constructor(items?: Array<TEntity>)
    constructor(items?: Iterable<TEntity>)
    constructor(items?: AsyncIterable<TEntity>)
    constructor(items?: any) {
        super(items)
    }

    public skip(count: number): this {
        this.operations.push({ type: LinqType.Skip, count, evaluate: () => {
            let idx = 0

            return (item) => {
                if( idx++ < count)
                    return 'continue'
                
                return 'yield'
            }
        }})

        return this
    }

    public take(count: number): this {
        this.operations.push({ type: LinqType.Take, count, evaluate: () => {
            let idx = 0

            return (item) => {
                if( idx++ == count)
                    return 'break'

                return 'yield'
            }
        }})

        return this
    }

    public slice(begin: string | number, end?: number): this {
        this.operations.push({
            type: LinqType.Slice, begin, end, evaluate: () => {
                let idx = 0,
                    skip = typeof begin === 'string' ? 0 : begin
                    
                return (item) => {
                    idx++

                    if (idx <= skip)
                        return 'continue'
                    
                    if (end && idx > end)
                        return 'break'

                    return 'yield'
                }
            }
        })

        return this
    }

    public includes(entity: Partial<TEntity> , fromIndex?: number): this {
        this.operations.push({ type: LinqType.Includes, entity, evaluate: () => {
            let values = Object.entries(entity)

            return (item) => {
                if(typeof item == 'object' && values.every(([key, value]) => key in item && (value == undefined || value == (item as any )[key])) )
                    return 'yield'
                    
                return 'continue'
            }
        }})

        return this
    }
}