import Base from './base'
import { LinqType, skipOperator, takeOperator, sliceOperator } from './operator'

import { includeOperator } from './operator/includeoperator'
import { whereOperator } from './operator/whereoperator'
import { orderByOperator } from './operator/orderbyoperator'

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
        this.operators.push(skipOperator(count))
       
        return this
    }

    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return
     */
    public take(count: number): this {
        this.operators.push(takeOperator(count))

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
        this.operators.push(sliceOperator(begin, end))

        return this
    }

    /**
     * Returns all elements that matches the partially entity, exact match
     * @param entity
     */
    public includes(entity: Partial<TEntity>): this {
        this.operators.push(includeOperator(entity))

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
        this.operators.push(whereOperator.call(null, ...arguments))
        
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
    public orderBy(property?: keyof TEntity | string) {
        this.operators.push(orderByOperator(property))

        return this
    }
}
