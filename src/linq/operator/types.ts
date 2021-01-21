import { IExpression } from './../peg/interface/iexpression'
import { Entity } from './../types'

export enum LinqType { Includes, Skip, Take, Slice, Where, OrderBy, Select }

type LinqOperatorSkip = { type: LinqType.Skip, count: number }
type LinqOperatorTake = { type: LinqType.Take, count: number }
type LinqOperatorSlice = { type: LinqType.Slice, begin: number | string, end?: number }
type LinqOperatorIncludes<T extends Entity = Entity> = { type: LinqType.Includes, entity: Partial<T> }
type LinqOperatorWhere<T extends Entity = Entity> = { type: LinqType.Where, expression: IExpression, readonly intersection: IterableIterator<WhereExpression>, readonly sets: IterableIterator<IterableIterator<WhereExpression>> }
type LinqOperatorOrderBy<T extends Entity = Entity> = { type: LinqType.OrderBy, property: undefined | keyof T | string }
type LinqOperatorSelect = { type: LinqType.Select }

type LinqEvaluator<T extends Entity> = {
    evaluate: () => { (item: T): { type: 'continue' | 'break' | 'yield' | 'yield-last', value?: T } }
}

type LingIterator<T extends Entity> = {
    iterator: (items: Iterable<T>) => IterableIterator<T>
    asyncIterator: (items: AsyncIterable<T>) => AsyncIterableIterator<T>
}

export type LinqOperator<T extends Entity = Entity> = 
    (LinqOperatorSkip | LinqOperatorTake | LinqOperatorSlice | LinqOperatorIncludes<T> | LinqOperatorWhere<T> | LinqOperatorOrderBy<T> | LinqOperatorSelect) & (LinqEvaluator<T> | LingIterator<T>)

type NullExpression = { type: 'null', operator: '==' | '!=' | '>' | '>=' | '<' | '<=', property: string, value: any }
type StringExpression = { type: 'string', operator: '==' | '!=' | '>' | '>=' | '<' | '<=', property: string, value: any, wildcard: 'none' | 'left' | 'right' | 'both' }
type NumberExpression = { type: 'number', operator: '==' | '!=' | '>' | '>=' | '<' | '<=', property: string, value: number }
type BigIntExpression = { type: 'bigint', operator: '==' | '!=' | '>' | '>=' | '<' | '<=', property: string, value: bigint | number }
type RecordExpression = { type: 'record', operator: '==' | '!=' | '>' | '>=' | '<' | '<=', property: string, value: Record<string, any> }
type DateExpression = { type: 'date', operator: '==' | '!=' | '>' | '>=' | '<' | '<=', property: string, value: Date }
type BooleanExpression = { type: 'boolean', operator: '==' | '!=' | '>' | '>=' | '<' | '<=', property: string, value: boolean }
type ArrayExpression = { type: 'array', operator: '==' | '!=' | '>' | '>=' | '<' | '<=', property: string, value: Array<any> }
type InExpression = { type: 'expression', operator: 'any' | 'all', property: string, value: IterableIterator<WhereExpression> }

export type WhereExpression = NullExpression | StringExpression | NumberExpression | BigIntExpression | RecordExpression | DateExpression | BooleanExpression | ArrayExpression | InExpression