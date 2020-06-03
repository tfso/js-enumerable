import { LinqOperator, LinqType } from './types'
import { Entity } from './../types'

export function sliceOperator<T extends Entity>(begin: string | number, end?: number): LinqOperator<T> {
    return {
        type: LinqType.Slice,
        begin,
        end,
        evaluate: () => {
            let idx = 0,
                skip = typeof begin === 'string' ? 0 : begin
                
            return (item) => {
                idx++

                if(idx <= skip)
                    return { type: 'continue' }
                
                if(end && idx > end)
                    return { type: 'break' }

                return { type: 'yield' }
            }
        }
    }
}