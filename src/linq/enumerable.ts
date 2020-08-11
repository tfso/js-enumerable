import Base from './base'
import { skipOperator, takeOperator, sliceOperator, includeOperator, orderByOperator, whereOperator, selectOperator } from './operator'
import { Entity, EntityRecord } from './types'

export class Enumerable<TEntity> extends Base<TEntity> {
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
     * @param token a token (bookmark) that indicates where to begin extraction
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
    
    /**
     * Returns a new shape based on the selector function returning the new shape
     * @param selector the selector function
     */
    public select<TRecord extends EntityRecord<TEntity>, TResult extends Record<string, any>>(selector: (it: TRecord) => TResult): Enumerable<TResult>
    /**
     * Returns a partial record based on the property keys
     * @param keys a list of property keys
     */
    public select<TRecord extends EntityRecord<TEntity>, TResult extends Pick<TRecord, K>, K extends keyof TRecord>(...keys: Array<K>): Enumerable<TResult>
    /**
     * Returns a partial record based on the property keys in OData format, where child record is separated by /, eg: 'id,parent/child'
     * @param list OData select list
     */
    public select<TRecord extends EntityRecord<TEntity>, TResult extends Partial<TRecord>>(list: string): Enumerable<TResult>
    public select(...args: any[]) {
        this.operators.push(<any>selectOperator(...args))

        return this
    }
}
