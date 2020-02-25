export enum LinqType { Includes, Skip, Take, Slice }

export type LinqOperatorSkip = { type: LinqType.Skip, count: number }
export type LinqOperatorTake = { type: LinqType.Take, count: number }
export type LinqOperatorSlice = { type: LinqType.Slice, begin: number | string, end?: number }
export type LinqOperatorIncludes<T extends any = any> = { type: LinqType.Includes, entity: Partial<T> }

export type LinqOperator<T extends any = any> = (LinqOperatorSkip | LinqOperatorTake | LinqOperatorSlice | LinqOperatorIncludes<T>) & { 
    evaluate: () => { (item: T): 'continue' | 'yield' | 'break' }
}