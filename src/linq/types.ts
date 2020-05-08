export type RecordSafe<R = Record<string, any>> = R extends Date | number | string ? never : R

export type Entity = RecordSafe | Date | number | string

export type EntityRecord<T = Entity> = T extends RecordSafe<T> ? T : never

export interface IEnumerable<TEntity extends Entity> extends Iterable<TEntity>, AsyncIterable<TEntity> {
    from(items: Iterable<TEntity>): this
    from(items: AsyncIterable<TEntity>): this

    skip(count: number): this
    
    take(count: number): this
    
    slice(begin: string | number, end?: number): this

    includes(entity: Partial<TEntity>, fromIndex?: number): this
    
    where(predicate: string): this
    where(predicate: (it: TEntity, ...param: any[]) => boolean, ...param: any[]): this

    //orderBy(property: (it: TEntity) => void): this
    orderBy(property: keyof TEntity): this
    orderBy(property: string): this
    orderBy(): this

    first(): TEntity | null
    firstAsync(): Promise<TEntity | null>

    toArray(): Array<TEntity>
    toArrayAsync(): Promise<Array<TEntity>>

    select<TRecord extends EntityRecord<TEntity>, TResult extends Record<string, any>>(selector: (it: TRecord) => TResult): IEnumerable<TResult>
    select<TRecord extends EntityRecord<TEntity>, TResult extends Pick<TRecord, K>, K extends keyof TRecord>(...keys: Array<K>): IEnumerable<TResult>
    select<TRecord extends EntityRecord<TEntity>, TResult extends Partial<TRecord>>(list: string): IEnumerable<TResult>
}

export function isRecord(value: RecordSafe | any): value is RecordSafe {
    return value !== null && typeof value == 'object'
}