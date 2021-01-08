import { LinqOperator, LinqType } from './operator'
import { Repository } from './../repository/repository'

import { IEnumerable, Entity, EntityRecord } from './types'

export default abstract class Base<TEntity> implements IEnumerable<TEntity> {
    private iterableName: string | null = null
    private items: Iterable<TEntity> | AsyncIterable<TEntity> | null = null
    
    public operators: Array<LinqOperator<TEntity>> = []

    public constructor(items?: Array<TEntity>)
    public constructor(items?: Iterable<TEntity>)
    public constructor(items?: AsyncIterable<TEntity>)
    public constructor(items?: any) {
        if(items)
            this.from(items)
    }

    abstract skip(count: number): this
    
    abstract take(count: number): this
    
    abstract slice(begin: string | number, end?: number): this
    
    abstract includes(entity: Partial<TEntity>, fromIndex?: number): this

    abstract where(predicate: string): this
    abstract where(predicate: (it: TEntity, ...param: any[]) => boolean, ...param: any[]): this
    
    //abstract orderBy(property: (it: TEntity) => void): this
    abstract orderBy(property: keyof TEntity): this
    abstract orderBy(property: string): this
    abstract orderBy(): this

    abstract select<TRecord extends EntityRecord<TEntity>, TResult extends Record<string, any>>(selector: (it: TRecord) => TResult): IEnumerable<TResult>
    abstract select<TRecord extends EntityRecord<TEntity>, TResult extends Pick<TRecord, K>, K extends keyof TRecord>(...keys: Array<K>): IEnumerable<TResult>
    abstract select<TRecord extends EntityRecord<TEntity>, TResult extends Partial<TRecord>>(list: string): IEnumerable<TResult>
    
    public get name(): string {
        if(this.iterableName != null)
            return this.iterableName

        if(this.items)
            return this.iterableName = this.items.constructor.name

        return ''
    }

    public from(items: Iterable<TEntity>): this
    public from(items: AsyncIterable<TEntity>): this
    public from(items: any): this {
        if(items) {
            this.items = items
        }

        return this
    }

    public first(): TEntity | null {
        let result = this.getIterator().next()
        
        if(result.done == false)
            return result.value

        return null
    }

    public async firstAsync(items?: Array<TEntity>): Promise<TEntity | null> {
        let result = await this.getAsyncIterator().next()
        
        if(result.done == false)
            return result.value

        return null
    }

    public toArray() {
        let result: Array<TEntity> = []

        for(let item of this.getIterator()) 
            result.push(item)

        return result
    }

    public async toArrayAsync() {
        let result: Array<TEntity> = []

        for await(let item of this.getAsyncIterator())
            result.push(item)

        return result
    }

    protected async * getAsyncIterator() {
        if(!isAsyncIterable(this.items))
            throw new TypeError('Enumerable is not async iterable')

        async function* iterate(items: AsyncIterableIterator<TEntity>, operators: Array<LinqOperator<TEntity>>, idx: number | null = null): AsyncGenerator<TEntity> {
            if(idx == null)
                idx = operators.length

            let operator = idx > 0 ? operators[idx - 1] : null,
                evaluate: { (item: TEntity): { type: string, value?: TEntity } } = (item: TEntity) => ({ type: 'yield' }),
                generator: AsyncIterableIterator<TEntity>

            if(operator) {
                if('evaluate' in operator) {
                    switch(idx) {
                        case 0: generator = items; break
                        default: generator = iterate(items, operators, idx - 1)
                    }

                    evaluate = operator.evaluate()
                }
                else {
                    generator = operator.asyncIterator(items)
                }
            }
            else {
                generator = items
            }
            
            let result: IteratorResult<TEntity>
            while (!(result = await Promise.resolve(generator.next())).done) {
                let state = evaluate(result.value)

                if(state.type == 'break')
                    break

                if(state.type == 'continue')
                    continue

                yield state.value ?? result.value

                if(state.type == 'yield-last')
                    break
            }
        }

        let iterator = iterate(this.items instanceof Repository ? this.items[Symbol.asyncIterator](this) : this.items[Symbol.asyncIterator](), this.operators),
            result: IteratorResult<TEntity>

        while (!(result = await Promise.resolve(iterator.next())).done) {
            yield result.value
        }
    }

    protected * getIterator(): IterableIterator<TEntity> {
        if(!isIterable(this.items))
            throw new TypeError('Enumerable is not iterable')

        function* iterate(items: IterableIterator<TEntity>, operators: Array<LinqOperator<TEntity>>, idx: number | null = null): Generator<TEntity> {
            if(idx == null)
                idx = operators.length

            let operator = idx > 0 ? operators[idx - 1] : null,
                evaluate: { (item: TEntity): { type: string, value?: TEntity } } = (item: TEntity) => ({ type: 'yield' }),
                generator: IterableIterator<TEntity>

            if(operator) {
                if('evaluate' in operator) {
                    switch(idx) {
                        case 0: generator = items; break
                        default: generator = iterate(items, operators, idx - 1)
                    }

                    evaluate = operator.evaluate()
                }
                else {
                    generator = operator.iterator(items)
                }
            }
            else {
                generator = items
            }
        
            let result: IteratorResult<TEntity>
            while (!(result = generator.next()).done) {
                let state = evaluate(result.value)

                if(state.type == 'break')
                    break

                if(state.type == 'continue')
                    continue

                yield state.value ?? result.value

                if(state.type == 'yield-last')
                    break
            }
        }

        let iterator = iterate(this.items[Symbol.iterator](), this.operators),
            result: IteratorResult<TEntity>

        while (!(result = iterator.next()).done) {
            yield result.value
        }
    }

    [Symbol.iterator](): IterableIterator<TEntity> {
        //throw new Error('Enumerable is async iterable but is used as iterable')
        return this.getIterator()
    }

    [Symbol.asyncIterator](): AsyncIterableIterator<TEntity> {
        return this.getAsyncIterator()
    }
}

function isRecord(value: Record<string, any> | any): value is Record<string, any> {
    return value !== null && typeof value == 'object'
}

function isIterable<T>(value: Iterable<T> | IterableIterator<T> | AsyncIterable<T> | AsyncIterableIterator<T>): value is IterableIterator<T> {
    return isRecord(value) && typeof (<any>value)[Symbol.iterator] == 'function'
}

function isAsyncIterable<T>(value: Iterable<T> | IterableIterator<T> | AsyncIterable<T> | AsyncIterableIterator<T>): value is AsyncIterableIterator<T> {
    return isRecord(value) && typeof (<any>value)[Symbol.asyncIterator] == 'function'
}