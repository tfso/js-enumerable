import { IEnumerable } from './../linq'

export interface IRepository<TEntity extends Record<string, any>, TEntityId> extends AsyncIterable<TEntity> {
    query(enumerable?: IEnumerable<TEntity>, meta?: Partial<{ etag: string, continuationToken: string }>): AsyncIterableIterator<TEntity>

    create(item: Partial<TEntity>, meta?: Partial<{ etag: string }>): Promise<TEntity> 
    read(id?: TEntityId): Promise<TEntity>
    update(entity: Partial<TEntity>, meta?: Partial<{ etag: string }>, ...fields: Array<keyof TEntity>): Promise<TEntity>
    delete(id: TEntity | TEntityId, meta?: Partial<{ etag: string }>): Promise<boolean>

    getIterable(meta?: Partial<{ continuationToken: string }>): AsyncIterable<TEntity>
}

export abstract class Repository<TEntity extends Record<string, any>, TEntityId> implements IRepository<TEntity, TEntityId>, AsyncIterable<TEntity> {
    
    abstract query(enumerable?: IEnumerable<TEntity>, meta?: Partial<{ etag: string, continuationToken: string }>): AsyncIterableIterator<TEntity>

    abstract async create(item: Partial<TEntity>, meta?: Partial<{ etag: string }>): Promise<TEntity>
    abstract async read(id?: TEntityId): Promise<TEntity>
    abstract async update(item: Partial<TEntity>, meta?: Partial<{ etag: string }>, ...fields: Array<keyof TEntity>): Promise<TEntity>
    abstract async delete(id: TEntityId, meta?: Partial<{ etag: string }>): Promise<boolean>

    public getIterable(meta?: Partial<{ etag: string, continuationToken: string }>): AsyncIterable<TEntity> {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this, {
            [Symbol.asyncIterator]: (enumerable?: IEnumerable<TEntity>) => {
                return this.query(enumerable, meta)
            }
        })
    }

    [Symbol.iterator](...options: any[]): IterableIterator<TEntity> {
        throw new TypeError('Repository is async iterable but it used as iterable')
    }

    [Symbol.asyncIterator](enumerable?: IEnumerable<TEntity>, meta?: Partial<{ etag: string, continuationToken: string }>): AsyncIterableIterator<TEntity> {
        return this.query(enumerable, meta)
    }
}