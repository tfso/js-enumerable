import Base from './base'
import { skipOperator, takeOperator, sliceOperator, includeOperator, orderByOperator, whereOperator, selectOperator, LinqType, LinqOperator } from './operator'
import { Entity, EntityRecord } from './types'

import { RemapVisitor } from './peg/remapvisitor'
import { RewriteVisitor } from './peg/rewritevisitor'

export class Enumerable<TEntity extends Entity> extends Base<TEntity> {
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
    public includes<TRecord extends EntityRecord<TEntity>>(entity: Partial<TRecord>): this {
        this.operators.push(<any>includeOperator(entity))

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
    public where(predicate: (it: Required<TEntity>, ...param: any[]) => boolean, ...param: any[]): this
    public where(predicate: any, ...param: any[]): this {
        this.operators.push(<LinqOperator<TEntity>>whereOperator(predicate, ...param))
        
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

    /**
     * A remapper of identifier names, members is seperated with dot.
     * @param remapper Function that returns the new name of the identifier
     */
    public remap<TRecord extends EntityRecord<TEntity>, M extends (name: K) => T | string, K extends keyof TRecord, T extends string>(remapper: M): Enumerable<Record<ReturnType<M>, any>>
    /**
     * A remapper of identifier names, members is seperated with dot.
     * @param remapper Function that returns the new name of the identifier
     */
    public remap<TRecord extends Record<string, any>>(remapper: (name: string) => string): Enumerable<TRecord>
    /**
     * A remapper of values that corresponds to a identifier name
     * @param remapper Function that returns the new value
     */
    public remap(remapper: (name: string, value: any) => any): this
    public remap(remapper: (...args: any) => any): any {
        let visitor = remapper.length == 2 ? new RemapVisitor(null, remapper) : new RemapVisitor(remapper, null)
    
        for(let item of this.operators) {
            switch(item.type) {
                case LinqType.Where:
                    item.expression = visitor.visit(item.expression)
                    break

                case LinqType.OrderBy:
                    if(remapper.length == 1)
                        item.property = remapper(item.property)
                    break
            }
        }

        return this
    }

    public rewrite<TRecord extends EntityRecord<TEntity>, M extends { from: K, to: T, convert?: (value: any) => any }, K extends keyof TRecord, T extends string>(...rewrites: M[]): Enumerable<Record<M['to'] | keyof Omit<TRecord, M['from']>, any>>
    /**
     * A rewrite of previous where/orderBy to a new identifier name, where members is seperated with dot.
     * @param rewrites array of rewrite from a identifier name to a new one, with a possibility convert the value as well
     */
    public rewrite<TRecord extends Record<string, any>>(...rewrites: { from: string, to?: string, convert?: (value: any) => any }[]): Enumerable<TRecord>
    /**
     * A rewrite of previous where/orderBy to a new identifier name, where members is seperated with dot.
     * @param rewrites array of rewrite from a identifier name to a new one, with a possibility convert the value as well
     */
    public rewrite(...rewrites: { from: string, to?: string, convert?: (value: any) => any }[]): this
    public rewrite(...rewrites: { from: string, to?: string, convert: (value: any) => any }[]): any {
        let visitor = new RewriteVisitor(...rewrites)

        for(let item of this.operators) {
            switch(item.type) {
                case LinqType.Where:
                    item.expression = visitor.visit(item.expression)
                    break

                case LinqType.OrderBy:
                    for(const rewrite of rewrites) {
                        if(rewrite.to && rewrite.from === item.property) {
                            item.property = rewrite.to
                        }
                    }
                    break
            }
        }

        return this
    }
}
