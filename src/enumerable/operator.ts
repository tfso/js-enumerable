export enum LinqType { Includes, Skip, Take, Slice, OrderBy }

type LinqOperatorSkip = { type: LinqType.Skip, count: number }
type LinqOperatorTake = { type: LinqType.Take, count: number }
type LinqOperatorSlice = { type: LinqType.Slice, begin: number | string, end?: number }
type LinqOperatorIncludes<T extends any = any> = { type: LinqType.Includes, entity: Partial<T> }
type LinqOperatorOrderBy<T extends any = any> = { type: LinqType.OrderBy, property: undefined | keyof T | string }

type LinqEvaluator<T extends any = any> = { 
    evaluate: () => { (item: T): 'continue' | 'yield' | 'break' }
}

type LingIterator<T extends any = any> = {
    iterator: (items: Iterable<T>) => IterableIterator<T>
    asyncIterator: (items: AsyncIterable<T>) => AsyncIterableIterator<T>
}

export type LinqOperator<T extends any = any> = 
    (LinqOperatorSkip | LinqOperatorTake | LinqOperatorSlice | LinqOperatorIncludes<T> | LinqOperatorOrderBy<T>) & (LinqEvaluator<T> | LingIterator<T>)