import { IExpression } from './../peg/interface/iexpression'
import { Entity } from './../types'

export enum LinqType { Includes, Skip, Take, Slice, Where, OrderBy, Select }

type LinqOperatorSkip = { type: LinqType.Skip, count: number }
type LinqOperatorTake = { type: LinqType.Take, count: number }
type LinqOperatorSlice = { type: LinqType.Slice, begin: number | string, end?: number }
type LinqOperatorIncludes<T extends Entity = Entity> = { type: LinqType.Includes, entity: Partial<T> }
type LinqOperatorWhere<T extends Entity = Entity> = { type: LinqType.Where, expression: IExpression, readonly intersection: IterableIterator<WhereExpression>, readonly sets: IterableIterator<IterableIterator<WhereExpression>>, toString(language?: 'javascript' | 'odata' | 'raw'): string }
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

type NullExpression = { type: 'null', operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'in', property: string, value: any }
type StringExpression = { type: 'string', operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'in', property: string, value: any, wildcard: 'none' | 'left' | 'right' | 'both' }
type NumberExpression = { type: 'number', operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'in', property: string, value: number }
type BigIntExpression = { type: 'bigint', operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'in', property: string, value: bigint | number }
type RecordExpression = { type: 'record', operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'in', property: string, value: Record<string, any> }
type DateExpression = { type: 'date', operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'in', property: string, value: Date }
type BooleanExpression = { type: 'boolean', operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'in', property: string, value: boolean }
type ArrayExpression = { type: 'array', operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'in', property: string, value: Array<any> }
type CollectionExpression = { type: 'expression', operator: 'any' | 'all', property: string, value: IterableIterator<WhereExpression> }

export type WhereExpression = NullExpression | StringExpression | NumberExpression | BigIntExpression | RecordExpression | DateExpression | BooleanExpression | ArrayExpression | CollectionExpression