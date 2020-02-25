import Base from './base'
import { LinqOperator, LinqType } from './operator'

export class Enumerable<TEntity extends Record<string, any> | number | Date | string> extends Base<TEntity> {
    constructor(items?: Array<TEntity>)
    constructor(items?: Iterable<TEntity>)
    constructor(items?: AsyncIterable<TEntity>)
    constructor(items?: any) {
        super(items)
    }

    public skip(count: number): this {
        this.operators.push({ type: LinqType.Skip, count, evaluate: () => {
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
        this.operators.push({ type: LinqType.Take, count, evaluate: () => {
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
        this.operators.push({
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
        this.operators.push({ type: LinqType.Includes, entity, evaluate: () => {
            let values = Object.entries(entity)

            return (item) => {
                if(typeof item == 'object' && values.every(([key, value]) => key in item && (value == undefined || value == (item as any )[key])) )
                    return 'yield'
                    
                return 'continue'
            }
        }})

        return this
    }

    //public orderBy(property: (it: TEntity) => void): this
    public orderBy(property: keyof TEntity): this
    public orderBy(property: string): this
    public orderBy(): this
    public orderBy(property?: any) {
        this.operators.push({ 
            type: LinqType.OrderBy, 
            property, 
            iterator: function* (items) {
                let ar = Array.from(items)

                ar.sort((a, b) => {
                    if(typeof property == 'string') {
                        if(isRecord(a) && isRecord(b)) {
                            return a[property] == b[property] ? 0 : a[property] < b[property] ? -1 : 1;
                        }
                    }
                    else {
                        return a == b ? 0 : a < b ? -1 : 1;
                    }

                    return 0
                })

                yield* ar;
            },
            asyncIterator: async function* (items) {
                let ar: Array<TEntity> = [];
                
                for await(let item of items)
                    ar.push(item);

                ar.sort((a, b) => {
                    if(typeof property == 'string') {
                        if(isRecord(a) && isRecord(b)) {
                            return a[property] == b[property] ? 0 : a[property] < b[property] ? -1 : 1;
                        }
                    }
                    else {
                        return a == b ? 0 : a < b ? -1 : 1;
                    }

                    return 0
                })

                yield* ar; 
            }
        })

        return this
    }
}

function isRecord(value: Record<string, any> | any): value is Record<string, any> {
    return typeof value == 'object'
}