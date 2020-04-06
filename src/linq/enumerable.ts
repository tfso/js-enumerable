import Base from './base'
import { LinqOperator, LinqType } from './operator'

import { ReducerVisitor } from './peg/reducervisitor'
import { IExpression } from './peg/expressionvisitor'
import { ODataVisitor } from './peg/odatavisitor'

export class Enumerable<TEntity extends Record<string, any> | number | Date | string> extends Base<TEntity> {
    constructor(items?: Array<TEntity>)
    constructor(items?: Iterable<TEntity>)
    constructor(items?: AsyncIterable<TEntity>)
    constructor(items?: any) {
        super(items)
    }

    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements
     * @param count The number of elements to skip before returning the remaining elements
     */
    public skip(count: number): this {
        this.operators.push({ 
            type: LinqType.Skip,
            count,
            evaluate: () => {
                let idx = 0

                return (item) => {
                    if(idx++ < count)
                        return 'continue'
                
                    return 'yield'
                }
            } })

        return this
    }

    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return
     */
    public take(count: number): this {
        this.operators.push({ 
            type: LinqType.Take,
            count,
            evaluate: () => {
                let idx = 0

                return (item) => {
                    if(idx++ == count)
                        return 'break'

                    return 'yield'
                }
            } })

        return this
    }

    /**
     * Bypasses all elements before beginning and returns the remaining elements or up to the specified end
     * @param begin zero-based index at which to begin extraction
     * @param end zero-based index before which to end extraction
     */
    public slice(begin: number, end?: number): this
    /**
     * Bypasses all elements before beginning and returns the remaining elements
     * Note: If the beginning is not an index it's up to the repository to handle slicing.
     * @param token a token that indicates where to begin extraction
     */
    public slice(token: string): this
    public slice(begin: string | number, end?: number): this {
        this.operators.push({
            type: LinqType.Slice,
            begin,
            end,
            evaluate: () => {
                let idx = 0,
                    skip = typeof begin === 'string' ? 0 : begin
                    
                return (item) => {
                    idx++

                    if(idx <= skip)
                        return 'continue'
                    
                    if(end && idx > end)
                        return 'break'

                    return 'yield'
                }
            }
        })

        return this
    }

    /**
     * Returns all elements that matches the partially entity, exact match
     * @param entity
     */
    public includes(entity: Partial<TEntity>): this {
        this.operators.push({ type: LinqType.Includes,
            entity,
            evaluate: () => {
                let values = Object.entries(entity)

                return (item) => {
                    if(isRecord(item) && values.every(([key, value]) => key in item && (value == undefined || value == item[key])))
                        return 'yield'
                    
                    return 'continue'
                }
            } })

        return this
    }

    /**
     * Where clause using OData $filter expression returning either true or false. Any parameters used is properties of TEntity
     * @param predicate OData expression
     */
    public where(predicate: string): this 
    /**
     * Where clause using Javascript expression returning either true or false
     * @param predicate javascript expression
     * @param parameters any javascript parameters has to be declared
     */
    public where(predicate: (it: TEntity, ...param: any[]) => boolean, ...param: any[]): this
    public where(): this {
        let predicate: any = arguments[0],
            parameters: Array<any> = [],
            expression: IExpression,
            validate: (entity: TEntity) => boolean

        if(arguments.length >= 2)
            parameters = Array.from(arguments).slice(1)

        switch(typeof predicate) {
            case 'string':
                expression = new ODataVisitor().visitOData(predicate)
                validate = (entity: TEntity) => ODataVisitor.evaluate(expression, entity) === true

                break

            case 'function':
                expression = new ReducerVisitor().visitLambda(predicate, ...parameters)
                validate = (entity: TEntity) => predicate.apply({}, [entity].concat(parameters))

                break

            default:
                throw new Error('Where operator can not recognize predicate either as javascript or odata')
        }

        this.operators.push({ type: LinqType.Where,
            expression,
            evaluate: () => {
                return (item) => validate(item) == true ? 'yield' : 'continue'
            }
        })
        
        return this
    }

    /**
     * A sort that will iterate through all entities and sort the result by a given property
     * @param property a property key
     */
    public orderBy(property: keyof TEntity): this
    /**
     * A sort that will iterate through all entities and sort the result by a given property
     * @param property a property
     */
    public orderBy(property: string): this
    /**
     * A sort that iterate through all entities and sorts the entities (eg a primary data type)
     * @param property a property key
     */
    public orderBy(): this
    public orderBy(property?: any) {
        this.operators.push({ 
            type: LinqType.OrderBy, 
            property, 
            iterator: function* (items) {
                let ar = Array.from(items)

                ar.sort((a, b) => {
                    let left = null, right = null

                    if(typeof property == 'string') {
                        if(isRecord(a) && isRecord(b)) {
                            left = a[property] 
                            right = b[property]
                        }
                    }
                    else {
                        left = a
                        right = b
                    }

                    return left >= right && left <= right ? 0 : left < right ? -1 : 1 // using >= && <= instead of == fixes comparisons for dates
                })

                yield* ar
            },
            asyncIterator: async function* (items) {
                let ar: Array<TEntity> = []
                
                for await(let item of items)
                    ar.push(item)

                ar.sort((a, b) => {
                    let left = null, 
                        right = null

                    if(typeof property == 'string') {
                        if(isRecord(a) && isRecord(b)) {
                            left = a[property] 
                            right = b[property]
                        }
                    }
                    else {
                        left = a
                        right = b
                    }

                    return left >= right && left <= right ? 0 : left < right ? -1 : 1 // using >= && <= instead of == fixes comparisons for dates
                })

                yield* ar 
            }
        })

        return this
    }
}

function isRecord(value: Record<string, any> | any): value is Record<string, any> {
    return value !== null && typeof value == 'object'
}