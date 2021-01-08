import { LinqOperator, LinqType } from './types'
import { Entity } from './../types'

export function takeOperator<T extends Entity>(count: number): LinqOperator<T> {
    return { 
        type: LinqType.Take,
        count,
        evaluate: () => {
            let idx = 0

            return (item) => ({ type: idx++ == count ? 'break' : (idx == count ? 'yield-last' : 'yield') })
        } 
    }
}