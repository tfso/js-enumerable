export declare enum LinqType {
    Includes = 0,
    Skip = 1,
    Take = 2,
    Slice = 3,
    OrderBy = 4
}
declare type LinqOperatorSkip = {
    type: LinqType.Skip;
    count: number;
};
declare type LinqOperatorTake = {
    type: LinqType.Take;
    count: number;
};
declare type LinqOperatorSlice = {
    type: LinqType.Slice;
    begin: number | string;
    end?: number;
};
declare type LinqOperatorIncludes<T extends any = any> = {
    type: LinqType.Includes;
    entity: Partial<T>;
};
declare type LinqOperatorOrderBy<T extends any = any> = {
    type: LinqType.OrderBy;
    property: undefined | keyof T | string;
};
declare type LinqEvaluator<T extends any = any> = {
    evaluate: () => {
        (item: T): 'continue' | 'yield' | 'break';
    };
};
declare type LingIterator<T extends any = any> = {
    iterator: (items: Iterable<T>) => IterableIterator<T>;
    asyncIterator: (items: AsyncIterable<T>) => AsyncIterableIterator<T>;
};
export declare type LinqOperator<T extends any = any> = (LinqOperatorSkip | LinqOperatorTake | LinqOperatorSlice | LinqOperatorIncludes<T> | LinqOperatorOrderBy<T>) & (LinqEvaluator<T> | LingIterator<T>);
export {};
