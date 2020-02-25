import { LinqOperator, LinqType } from './operator'
import { Repository } from './../repository/repository'

export interface IEnumerable<TEntity> extends Iterable<TEntity>, AsyncIterable<TEntity> {
    from(items: Iterable<TEntity>) : this
    from(items: AsyncIterable<TEntity>) : this

    skip(count: number): this
    take(count: number): this
    slice(begin: string | number, end?: number): this
    includes(entity: Partial<TEntity> , fromIndex?: number): this
}

export default abstract class Base<TEntity> implements IEnumerable<TEntity> {
    private iterableName: string | null = null
    private items: Iterable<TEntity> | AsyncIterable<TEntity> | null = null
    
    protected operations: Array<LinqOperator<TEntity>> = []

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
    abstract includes(entity: Partial<TEntity> , fromIndex?: number): this
    
    public get name(): string {
        if (this.iterableName != null)
            return this.iterableName;

        if(this.items)
            return this.iterableName = this.items.constructor.name;

        return "";
    }

    public from(items: Iterable<TEntity>) : this
    public from(items: AsyncIterable<TEntity>) : this
    public from(items: any): this {
        if (items) {
            this.items = items
        }

        return this
    }

    protected async * getAsyncIterator() {
        if((this.items && typeof this.items == 'object' && typeof (this.items as any)[Symbol.asyncIterator] == 'function') == false)
            throw new TypeError('Enumerable is not async iterable')

        async function* iterate(items: Iterator<TEntity>, operations: Array<LinqOperator<TEntity>>, idx: number | null = null): AsyncGenerator<TEntity> {
            if(idx == null)
                idx = operations.length

            let generator: AsyncIterator<TEntity> | Iterator<TEntity>

            switch(idx) {
                case 0: generator = items; break
                default: generator = iterate(items, operations, idx - 1)
            }

            let op = idx > 0 ? operations[idx - 1].evaluate() : (item: TEntity) => 'yield'
            
            while(!(result = await Promise.resolve(generator!.next())).done) {
                let state = op(result.value)

                if(state == 'break')
                    break

                if(state == 'continue')
                    continue

                yield result.value
            }
        }

        let iterator = iterate(this.items instanceof Repository ? this.items.query(this) : (this.items as any)![Symbol.asyncIterator](), this.operations),
            result: IteratorResult<TEntity>

        while(!(result = await Promise.resolve(iterator.next())).done ) {
            yield result.value
        }
    }

    protected * getIterator(): IterableIterator<TEntity> {
        if((this.items && typeof this.items == 'object' && typeof (this.items as any)[Symbol.iterator] == 'function') == false)
            throw new TypeError('Enumerable is not iterable')

        function* iterate(items: Iterator<TEntity>, operations: Array<LinqOperator<TEntity>>, idx: number | null = null): Generator<TEntity> {
            if(idx == null)
                idx = operations.length

            let generator: Iterator<TEntity>

            switch(idx) {
                case 0: generator = items; break
                default: generator = iterate(items, operations, idx - 1)
            }

            let op = idx > 0 ? operations[idx - 1].evaluate() : (item: TEntity) => 'yield'
            
            while(!(result = generator!.next()).done) {
                let state = op(result.value)

                if(state == 'break')
                    break

                if(state == 'continue')
                    continue

                yield result.value
            }
        }

        let iterator = iterate(this.items instanceof Repository ? this.items.query(this) : (this.items as any)![Symbol.iterator](), this.operations),
            result: IteratorResult<TEntity>

        while(!(result = iterator.next()).done ) {
            yield result.value
        }

        //yield * <any>this.getIterator() //items
    }

    [Symbol.iterator](): IterableIterator<TEntity> {
        //throw new Error('Enumerable is async iterable but is used as iterable')
        return this.getIterator()
    }

    [Symbol.asyncIterator](): AsyncIterableIterator<TEntity> {
        return this.getAsyncIterator()
    }
}