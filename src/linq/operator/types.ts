import { IExpression } from './../peg/interface/iexpression'
import { Entity } from './../types'

export enum LinqType { Includes, Skip, Take, Slice, Where, OrderBy, Select }

type LinqOperatorSkip = { type: LinqType.Skip, count: number }
type LinqOperatorTake = { type: LinqType.Take, count: number }
type LinqOperatorSlice = { type: LinqType.Slice, begin: number | string, end?: number }
type LinqOperatorIncludes<T extends Entity = Entity> = { type: LinqType.Includes, entity: Partial<T> }
type LinqOperatorWhere<T extends Entity = Entity> = { type: LinqType.Where, expression: IExpression, readonly intersection: IterableIterator<{ property: string, operator: '==' | '!=' | '>' | '>=' | '<' | '<=', value: any, wildcard: 'none' | 'left' | 'right' | 'both' }> }
type LinqOperatorOrderBy<T extends Entity = Entity> = { type: LinqType.OrderBy, property: undefined | keyof T | string }
type LinqOperatorSelect = { type: LinqType.Select }

type LinqEvaluator<T extends Entity> = {
    evaluate: () => { (item: T): { type: 'continue' | 'break' | 'yield', value?: T } }
}

type LingIterator<T extends Entity> = {
    iterator: (items: Iterable<T>) => IterableIterator<T>
    asyncIterator: (items: AsyncIterable<T>) => AsyncIterableIterator<T>
}

export type LinqOperator<T extends Entity = Entity> = 
    (LinqOperatorSkip | LinqOperatorTake | LinqOperatorSlice | LinqOperatorIncludes<T> | LinqOperatorWhere<T> | LinqOperatorOrderBy<T> | LinqOperatorSelect) & (LinqEvaluator<T> | LingIterator<T>)