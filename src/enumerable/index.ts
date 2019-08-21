
// if(Symbol["asyncIterator"] === undefined) 
//     ((Symbol as any)["asyncIterator"]) = Symbol.for("asyncIterator")

import { Repository } from './../repository/repository'

export enum LinqType { Includes, Skip, Take, Slice }

type LinqOperatorSkip = { type: LinqType.Skip, count: number }
type LinqOperatorTake = { type: LinqType.Take, count: number }
type LinqOperatorSlice = { type: LinqType.Slice, begin: number | string, end?: number }
type LinqOperatorIncludes<T extends any = any> = { type: LinqType.Includes, entity: Partial<T> }

type LinqOperator<T extends any = any> = (LinqOperatorSkip | LinqOperatorTake | LinqOperatorSlice | LinqOperatorIncludes<T>) & { 
    asyncEvaluator: (iterator: AsyncIterator<T>) => AsyncIterableIterator<T>
    evaluator: (iterator: Iterator<T>) => IterableIterator<T>
}

export class Enumerable<TEntity> implements Iterable<TEntity>, AsyncIterable<TEntity>
{
    private iterableName: string | null = null
    private items: Iterable<TEntity> | AsyncIterable<TEntity> | null = null
    private operations: Array<LinqOperator<TEntity>> = []

    constructor(items?: Array<TEntity>)
    constructor(items?: Iterable<TEntity>)
    constructor(items?: AsyncIterable<TEntity>)
    constructor(items?: any) {
        if(items) 
            this.from(items)
    }

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

    public skip(count: number): this {
        const evaluate = (() => {
            let idx = 0

            return (entity: TEntity) => {
                return idx++ >= count
            }
        })()

        this.operations.push({
            type: LinqType.Skip,
            count, 
            evaluator: this.evaluatorHelper(evaluate),
            asyncEvaluator: this.asyncEvaluatorHelper(evaluate)
        })

        return this
    }

    public take(count: number): this {
        const evaluate = (() => {
            let idx = 0

            return (entity: TEntity) => {
                return idx++ < count // performance hit, should be able to break?
            }
        })()

        this.operations.push({
            type: LinqType.Take,
            count,
            evaluator: this.evaluatorHelper(evaluate),
            asyncEvaluator: this.asyncEvaluatorHelper(evaluate)
        })

        return this
    }

    public includes(entity: Partial<TEntity> , fromIndex?: number): this {

        const evaluate: (entity: TEntity) => boolean = (() => {
            let values = Object.entries(entity)

            return (entity: TEntity) => {
                return typeof entity == 'object' && values.every(([key, value]) => key in entity && (value == undefined || value == (entity as any)[key]))
            }
        })()

        this.operations.push({
            type: LinqType.Includes,
            entity,
            evaluator: this.evaluatorHelper(evaluate),
            asyncEvaluator: this.asyncEvaluatorHelper(evaluate)
        })

        return this
    }

    protected async * getAsyncIterator() {
        if((this.items && typeof this.items == 'object' && typeof (this.items as any)[Symbol.asyncIterator] == 'function') == false)
            throw new TypeError('Enumerable is not async iterable')

        // let generator: AsyncIterator<TEntity> = this.items instanceof AsyncRepository ? this.items.query(this) : this.items![Symbol.asyncIterator](), // why cant IE11 iterate AsyncIterableIterator in `for await`
        //     result: IteratorResult<TEntity>

        async function* iterate(items: AsyncIterator<TEntity>, operations: Array<LinqOperator<TEntity>>, idx: number | null = null) {
            if(idx == null)
                idx = operations.length - 1

            let generator: AsyncIterator<TEntity> | Iterator<TEntity>

            switch(idx) {
                case -1:
                    generator = items
                    break

                case 0: 
                    generator = operations[idx].asyncEvaluator(items)
                    break

                default: 
                    generator = operations[idx].asyncEvaluator(iterate(items, operations, idx - 1))
                    break
            }

            while(!(result = await Promise.resolve(generator!.next())).done) {
                yield result.value
            }
        }

        let iterator = iterate(this.items instanceof Repository ? this.items.query(this) : (this.items as any)![Symbol.asyncIterator](), this.operations),
            result: IteratorResult<TEntity>

        while(!(result = await Promise.resolve(iterator.next())).done ) {
            yield result.value
        }
        


        // if(this.items != null)
        //     yield * this.items instanceof AsyncRepository ? iterate(this.items.query(this)) : iterate(<AsyncIterable<TEntity>>this.items)

        //yield * this.asyncIterate(<AsyncIterable<TEntity>>this.items)
    }

    protected * getIterator(): IterableIterator<TEntity> {
        if((this.items && typeof this.items == 'object' && typeof (this.items as any)[Symbol.iterator] == 'function') == false)
            throw new TypeError('Enumerable is not iterable')

        function* iterate(items: Iterator<TEntity>, operations: Array<LinqOperator<TEntity>>, idx: number | null = null) {
            if(idx == null)
                idx = operations.length - 1

            let generator: Iterator<TEntity>

            switch(idx) {
                case -1:
                    generator = items
                    break

                case 0: 
                    generator = operations[idx].evaluator(items)
                    break

                default: 
                    generator = operations[idx].evaluator(iterate(items, operations, idx - 1))
                    break
            }

            while(!(result = generator!.next()).done) {
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

    private evaluatorHelper(evaluate: (entity: TEntity) => boolean): (items: Iterator<TEntity>) => IterableIterator<TEntity>  {    
        const iterator = function * (items: Iterator<TEntity>) {
            let result: IteratorResult<TEntity>

            while(!(result = items.next()).done) {
                if(evaluate(result.value))
                    yield result.value
            }
        }

        return iterator
    }

    private asyncEvaluatorHelper(evaluate: (entity: TEntity) => boolean): (items: AsyncIterator<TEntity>) => AsyncIterableIterator<TEntity>  {    
        const iterator = async function * (items: AsyncIterator<TEntity>) {
            let result: IteratorResult<TEntity>

            while(!(result = await Promise.resolve(items.next())).done) {
                if(evaluate(result.value))
                    yield result.value
            }
        }

        return iterator
    }    

    [Symbol.iterator](): IterableIterator<TEntity> {
        //throw new Error('Enumerable is async iterable but is used as iterable')
        return this.getIterator()
    }

    [Symbol.asyncIterator](): AsyncIterableIterator<TEntity> {
        return this.getAsyncIterator()
    }
}