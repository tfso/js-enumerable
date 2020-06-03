import { LinqOperator, LinqType } from './types'
import { Entity } from './../types'

export function skipOperator<T extends Entity>(count: number): LinqOperator<T> {
    return {
        type: LinqType.Skip,
        count,
        evaluate: () => {
            let idx = 0

            return (item) => ({ type: idx++ < count ? 'continue' : 'yield' })
        }
    }
}