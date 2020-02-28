import { LinqOperator } from './operator';
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
export default abstract class Base<TEntity extends any> implements IEnumerable<TEntity> {
    private iterableName;
    private items;
    protected operators: Array<LinqOperator<TEntity>>;
    constructor(items?: Array<TEntity>);
    constructor(items?: Iterable<TEntity>);
    constructor(items?: AsyncIterable<TEntity>);
    abstract skip(count: number): this;
    abstract take(count: number): this;
    abstract slice(begin: string | number, end?: number): this;
    abstract includes(entity: Partial<TEntity>, fromIndex?: number): this;
    abstract orderBy(property: keyof TEntity): this;
    abstract orderBy(property: string): this;
    abstract orderBy(): this;
    get name(): string;
    from(items: Iterable<TEntity>): this;
    from(items: AsyncIterable<TEntity>): this;
    protected getAsyncIterator(): AsyncGenerator<any, void, unknown>;
    protected getIterator(): IterableIterator<TEntity>;
    [Symbol.iterator](): IterableIterator<TEntity>;
    [Symbol.asyncIterator](): AsyncIterableIterator<TEntity>;
}
