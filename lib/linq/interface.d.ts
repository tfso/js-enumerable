export interface IEnumerable<TEntity> extends Iterable<TEntity>, AsyncIterable<TEntity> {
    from(items: Iterable<TEntity>): this;
    from(items: AsyncIterable<TEntity>): this;
    skip(count: number): this;
    take(count: number): this;
    slice(begin: string | number, end?: number): this;
    includes(entity: Partial<TEntity>, fromIndex?: number): this;
    orderBy(property: keyof TEntity): this;
    orderBy(property: string): this;
    orderBy(): this;
}
