export type BaseEntityType = Record<string, any> | number | Date | string

export interface IEnumerable<TEntity extends BaseEntityType> extends Iterable<TEntity>, AsyncIterable<TEntity> {
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
}

export function isRecord(value: Record<string, any> | any): value is Record<string, any> {
    return value !== null && typeof value == 'object'
}