import { LinqOperator, LinqType } from './types'

export function takeOperator(count: number): LinqOperator {
    return { 
        type: LinqType.Take,
        count,
        evaluate: () => {
            let idx = 0

            return (item) => ({ type: idx++ == count ? 'break' : 'yield' })
        } 
    }
}