export class LambdaExpression {
    private _expression: string;
    private _parameters: Array<string>;
    private _lambdaFn: ((...it: Array<any>) => any);

    constructor(lambda: (...it: Array<any>) => any) {
        this.parseExpression(this._lambdaFn = lambda)
    }

    public get expression(): string {
        return this._expression
    }

    public get parameters(): Array<string> {
        return this._parameters
    }

    public get lambda(): ((...it: Array<any>) => any) {
        return this._lambdaFn
    }

    /**
    * decompilation of a predicate expression extracting the actual expression
    * @param predicate
    * @return string
    */
    private parseExpression(lambda: (...it: Array<any>) => any): void {
        let regexs = [
            /^\(?\s*([^)]*?)\s*\)?\s*(?:=>)+\s*(.*)$/i, //  arrow function; (item) => 5 + 1
            /^(?:function\s*)?\(\s*([^)]*?)\s*\)\s*(?:=>)?\s*\{\s*.*?(?:return)\s*(.*?)\;?\s*\}\s*$/i // () => { return 5 + 1 } or function() { return 5 + 1 }
        ]

        let raw = lambda.toString()

        regexs.forEach((regex) => {
            let match: RegExpMatchArray

            if((match = raw.match(regex)) !== null) {
                this._parameters = match[1].split(',').map((el) => el.trim())
                this._expression = match[2].replace(/_this/gi, 'this')

                return false
            }
            return true
        })
    }
}