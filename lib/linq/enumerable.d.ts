import Base from './base';
export declare class Enumerable<TEntity extends Record<string, any> | number | Date | string> extends Base<TEntity> {
    constructor(items?: Array<TEntity>);
    constructor(items?: Iterable<TEntity>);
    constructor(items?: AsyncIterable<TEntity>);
    skip(count: number): this;
    take(count: number): this;
    slice(begin: string | number, end?: number): this;
    includes(entity: Partial<TEntity>, fromIndex?: number): this;
    orderBy(property: keyof TEntity): this;
    orderBy(property: string): this;
    orderBy(): this;
}
