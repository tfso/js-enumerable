import { Enumerable } from './../linq';
export interface IRepository<TEntity, TEntityId> extends AsyncIterable<TEntity> {
    query(linq?: Enumerable<TEntity>, meta?: Partial<{
        continuationToken: string;
    }>): AsyncIterableIterator<TEntity>;
    create(item: Partial<TEntity>): Promise<TEntity>;
    read(id?: TEntityId): Promise<TEntity>;
    update(entity: Partial<TEntity>): Promise<TEntity>;
    delete(id: TEntityId): Promise<boolean>;
}
export declare abstract class Repository<TEntity, TEntityId> implements IRepository<TEntity, TEntityId>, AsyncIterable<TEntity> {
    abstract query(linq?: Enumerable<TEntity>, meta?: Partial<{
        continuationToken: string;
    }>): AsyncIterableIterator<TEntity>;
    abstract create(item: Partial<TEntity>): Promise<TEntity>;
    abstract read(id?: TEntityId): Promise<TEntity>;
    abstract update(item: Partial<TEntity>): Promise<TEntity>;
    abstract delete(id: TEntityId): Promise<boolean>;
    [Symbol.iterator](...options: any[]): IterableIterator<Promise<TEntity>>;
    [Symbol.asyncIterator](linq?: Enumerable<TEntity>, meta?: Partial<{
        continuationToken: string;
    }>): AsyncIterableIterator<TEntity>;
}
