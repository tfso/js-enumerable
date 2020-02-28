export declare class LambdaExpression {
    private _expression;
    private _parameters;
    private _lambdaFn;
    constructor(lambda: (...it: Array<any>) => any);
    get expression(): string;
    get parameters(): Array<string>;
    get lambda(): ((...it: Array<any>) => any);
    /**
    * decompilation of a predicate expression extracting the actual expression
    * @param predicate
    * @return string
    */
    private parseExpression;
}
