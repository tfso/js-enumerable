import { Enumerable } from '../enumerable/index'

export interface IRepository<TEntity, TEntityId> extends AsyncIterable<TEntity> {
    query(...options: any[]): AsyncIterableIterator<TEntity>

    create(item: Partial<TEntity>): Promise<TEntity> 
    read(id?: TEntityId): Promise<TEntity>
    update(entity: Partial<TEntity>): Promise<TEntity>
    delete(id: TEntityId): Promise<boolean>
}

export abstract class Repository<TEntity, TEntityId> implements IRepository<TEntity, TEntityId>, AsyncIterable<TEntity> {
    abstract query(linq?: Enumerable<TEntity>, meta?: Partial<{ continuationToken: string }>): AsyncIterableIterator<TEntity>

    abstract async create(item: Partial<TEntity>): Promise<TEntity>
    abstract async read(id?: TEntityId): Promise<TEntity>
    abstract async update(item: Partial<TEntity>): Promise<TEntity>
    abstract async delete(id: TEntityId): Promise<boolean>

    [Symbol.iterator](...options: any[]): IterableIterator<Promise<TEntity>> {
        throw new TypeError('Repository is async iterable but it used as iterable')
    }

    [Symbol.asyncIterator](linq?: Enumerable<TEntity>, meta?: Partial<{ continuationToken: string }>): AsyncIterableIterator<TEntity> {
        return this.query(linq, meta)
    }
}