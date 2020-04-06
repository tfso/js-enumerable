import { IEnumerable } from './../linq'

export interface IRepository<TEntity, TEntityId> extends AsyncIterable<TEntity> {
    query(linq?: IEnumerable<TEntity>, meta?: Partial<{ continuationToken: string }>): AsyncIterableIterator<TEntity>

    create(item: Partial<TEntity>): Promise<TEntity> 
    read(id?: TEntityId): Promise<TEntity>
    update(entity: Partial<TEntity>): Promise<TEntity>
    delete(id: TEntityId): Promise<boolean>
}

export abstract class Repository<TEntity, TEntityId> implements IRepository<TEntity, TEntityId>, AsyncIterable<TEntity> {
    abstract query(linq?: IEnumerable<TEntity>, meta?: Partial<{ continuationToken: string }>): AsyncIterableIterator<TEntity>

    abstract async create(item: Partial<TEntity>): Promise<TEntity>
    abstract async read(id?: TEntityId): Promise<TEntity>
    abstract async update(item: Partial<TEntity>): Promise<TEntity>
    abstract async delete(id: TEntityId): Promise<boolean>

    [Symbol.iterator](...options: any[]): IterableIterator<Promise<TEntity>> {
        throw new TypeError('Repository is async iterable but it used as iterable')
    }

    [Symbol.asyncIterator](linq?: IEnumerable<TEntity>, meta?: Partial<{ continuationToken: string }>): AsyncIterableIterator<TEntity> {
        return this.query(linq, meta)
    }
}