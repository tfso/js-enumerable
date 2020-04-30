import { IExpression } from './../peg/interface/iexpression'

export enum LinqType { Includes, Skip, Take, Slice, Where, OrderBy }

type LinqOperatorSkip = { type: LinqType.Skip, count: number }
type LinqOperatorTake = { type: LinqType.Take, count: number }
type LinqOperatorSlice = { type: LinqType.Slice, begin: number | string, end?: number }
type LinqOperatorIncludes<T extends any = any> = { type: LinqType.Includes, entity: Partial<T> }
type LinqOperatorWhere<T extends any = any> = { type: LinqType.Where, expression: IExpression }
type LinqOperatorOrderBy<T extends any = any> = { type: LinqType.OrderBy, property: undefined | keyof T | string }

type LinqEvaluator<T extends any = any> = {
    evaluate: () => { (item: T): 'continue' | 'yield' | 'break' }
}

type LingIterator<T extends any = any> = {
    iterator: (items: Iterable<T>) => IterableIterator<T>
    asyncIterator: (items: AsyncIterable<T>) => AsyncIterableIterator<T>
}

export type LinqOperator<T extends any = any> = 
    (LinqOperatorSkip | LinqOperatorTake | LinqOperatorSlice | LinqOperatorIncludes<T> | LinqOperatorWhere<T> | LinqOperatorOrderBy<T>) & (LinqEvaluator<T> | LingIterator<T>)