import { LinqOperator, LinqType } from './types'
import { Entity, isRecord, RecordSafe } from './../types'

export function includeOperator<T extends RecordSafe>(entity: Partial<T>): LinqOperator<T> {
    return { 
        type: LinqType.Includes,
        entity,
        evaluate: () => {
            let values = Object.entries(entity)

            return (item) => ({ type: isRecord(item) && values.every(([key, value]) => key in item && (value == undefined || value == item[key])) ? 'yield' : 'continue' })
        }
    }
}