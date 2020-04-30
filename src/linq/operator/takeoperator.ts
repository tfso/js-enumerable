import { LinqOperator, LinqType } from './types'

export function takeOperator(count: number): LinqOperator {
    return { 
        type: LinqType.Take,
        count,
        evaluate: () => {
            let idx = 0

            return (item) => {
                if(idx++ == count)
                    return 'break'

                return 'yield'
            }
        } 
    }
}