import { IEnumerable } from './../../linq'
import { Repository } from './../../repository'

export abstract class RepositoryMock<TEntity extends Record<string, any>, EntityId> extends Repository<TEntity, EntityId> {
    public constructor(public getEntityId: (entity: Partial<TEntity>) => EntityId, public readonly data: Array<TEntity>) {
        super()
    }

    public async * query(enumerable?: IEnumerable<TEntity>, meta?: Partial<{ etag: string, continuationToken: string }>): AsyncIterableIterator<TEntity> {
        yield * this.data
    }

    public async create(entity: TEntity) {
        if(await this.read(this.getEntityId(entity)) != null)
            throw new Error('409 Duplicate')

        this.data.push(entity)

        return entity
    }

    public async read(id: EntityId): Promise<TEntity | null> {
        return this.data.find(item => this.equality(id, this.getEntityId(item))) ?? null
    }

    public async update(entity: Partial<TEntity>): Promise<TEntity | null> {
        const id = this.getEntityId(entity)
        const idx: number = this.data.findIndex(item => this.equality(id, this.getEntityId(item)))

        if(idx >= 0) {
            this.apply(this.data[idx], entity)

            return this.data[idx]
        }

        return null
    }

    public async delete(id: EntityId): Promise<boolean> {
        const idx: number = this.data.findIndex(item => this.equality(id, this.getEntityId(item)))

        if(idx !== undefined) {
            this.data.splice(idx, 1)

            return true
        }

        return false
    }

    private equality(left: any, right: any): boolean {
        if(!left || !right)
            return false

        if(isRecord(left)) {
            for(const [k, v] of Object.entries(left)) 
                if(isRecord(right) && right[k] != v) 
                    return false

            return true
        }

        return left == right
    }

    private apply(entity: Record<string, any>, updated: Record<string, any>) {
        for(const [propertyName, value] of Object.entries(updated)) {
            if(value == null) {
                if(value !== undefined)
                    entity[propertyName] = updated[propertyName]

                continue
            }
                
            if(typeof entity[propertyName] == 'object') {
                if(entity[propertyName] == null)
                    entity[propertyName] = {}

                this.apply(entity[propertyName], updated[propertyName])
            }
            else {
                entity[propertyName] = updated[propertyName]
            }
        }

        return entity
    }
}

function isRecord(item: any): item is Record<string, any> {
    return typeof item == 'object'
}