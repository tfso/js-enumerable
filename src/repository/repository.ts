import { IEnumerable } from './../linq'

export interface IRepository<TEntity extends Record<string, any>, TEntityId> extends AsyncIterable<TEntity> {
    query(enumerable?: IEnumerable<TEntity>, meta?: Partial<{ etag: string, continuationToken: string }>): AsyncIterableIterator<TEntity>
    query<T extends TEntity>(enumerable?: IEnumerable<T>, meta?: Partial<{ etag: string, continuationToken: string }>): AsyncIterableIterator<T>

    create(entity: TEntity, meta?: Partial<{ etag: string }>): Promise<TEntity | null>
    create(entity: Partial<TEntity>, meta?: Partial<{ etag: string }>): Promise<TEntity | null>
    create<T extends TEntity>(entity: T, meta?: Partial<{ etag: string }>): Promise<T | null>

    read(id?: TEntityId): Promise<TEntity | null>

    update(entity: Partial<TEntity>, meta?: Partial<{ etag: string }>, ...fields: Array<keyof TEntity>): Promise<TEntity | boolean>
    update<T extends TEntity>(entity: Partial<T>, meta?: Partial<{ etag: string }>, ...fields: Array<keyof T>): Promise<T | boolean>
    
    delete(id: TEntity | TEntityId, meta?: Partial<{ etag: string }>): Promise<boolean>

    getIterable(meta?: Partial<{ continuationToken: string }>): AsyncIterable<TEntity>
}

export abstract class Repository<TEntity extends Record<string, any>, TEntityId> implements IRepository<TEntity, TEntityId> {
    
    abstract query(enumerable?: IEnumerable<TEntity>, meta?: Partial<{ etag: string, continuationToken: string }>): AsyncIterableIterator<TEntity>
    abstract query<T extends TEntity>(enumerable?: IEnumerable<T>, meta?: Partial<{ etag: string, continuationToken: string }>): AsyncIterableIterator<T>

    abstract create(entity: TEntity, meta?: Partial<{ etag: string }>): Promise<TEntity | null>
    abstract create<K extends keyof TEntity = null>(entity: Omit<TEntity, K>, meta: Partial<{ etag: string }>, ...excludedFields: Array<K>): Promise<TEntity | null>
    abstract create<T extends TEntity>(entity: T, meta?: Partial<{ etag: string }>): Promise<T | null>
    
    abstract read(id?: TEntityId): Promise<TEntity | null>
    
    abstract update(entity: Partial<TEntity>, meta?: Partial<{ etag: string }>, ...updateFields: Array<keyof TEntity>): Promise<TEntity | boolean>
    abstract update<T extends TEntity>(entity: Partial<T>, meta?: Partial<{ etag: string }>, ...updateFields: Array<keyof T>): Promise<T | boolean>
    
    abstract delete(id: TEntity | TEntityId, meta?: Partial<{ etag: string }>): Promise<boolean>

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