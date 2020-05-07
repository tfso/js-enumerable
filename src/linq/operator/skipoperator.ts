import { LinqOperator, LinqType } from './types'

export function skipOperator(count: number): LinqOperator {
    return { 
        type: LinqType.Skip,
        count,
        evaluate: () => {
            let idx = 0

            return (item) => ({ type: idx++ < count ? 'continue' : 'yield' })
        }
    }
}