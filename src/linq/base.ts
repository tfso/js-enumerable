import { LinqOperator, LinqType } from './operator'
import { Repository } from './../repository/repository'

export interface IEnumerable<TEntity> extends Iterable<TEntity>, AsyncIterable<TEntity> {
    from(items: Iterable<TEntity>): this
    from(items: AsyncIterable<TEntity>): this

    skip(count: number): this
    
    take(count: number): this
    
    slice(begin: string | number, end?: number): this

    includes(entity: Partial<TEntity>, fromIndex?: number): this
    
    //orderBy(property: (it: TEntity) => void): this
    orderBy(property: keyof TEntity): this
    orderBy(property: string): this
    orderBy(): this
}

export default abstract class Base<TEntity extends any> implements IEnumerable<TEntity> {
    private iterableName: string | null = null
    private items: Iterable<TEntity> | AsyncIterable<TEntity> | null = null
    
    protected operators: Array<LinqOperator<TEntity>> = []

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
    
    //abstract orderBy(property: (it: TEntity) => void): this
    abstract orderBy(property: keyof TEntity): this
    abstract orderBy(property: string): this
    abstract orderBy(): this
    
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

    protected async * getAsyncIterator() {
        if(!isAsyncIterable(this.items))
            throw new TypeError('Enumerable is not async iterable')

        async function* iterate(items: AsyncIterableIterator<TEntity>, operators: Array<LinqOperator<TEntity>>, idx: number | null = null): AsyncGenerator<TEntity> {
            if(idx == null)
                idx = operators.length

            let operator = idx > 0 ? operators[idx - 1] : null,
                evaluate = (item: TEntity) => 'yield',
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

                if(state == 'break')
                    break

                if(state == 'continue')
                    continue

                yield result.value
            }
        }

        let iterator = iterate(this.items instanceof Repository ? this.items.query(this) : this.items[Symbol.asyncIterator](), this.operators),
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
                evaluate = (item: TEntity) => 'yield',
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

                if(state == 'break')
                    break

                if(state == 'continue')
                    continue

                yield result.value
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