import { LinqOperator, LinqType } from './types'
import { BaseEntityType, isRecord } from '../types'

export function includeOperator<TEntity extends BaseEntityType>(entity: Partial<TEntity>): LinqOperator<TEntity> {
    return { 
        type: LinqType.Includes,
        entity,
        evaluate: () => {
            let values = Object.entries(entity)

            return (item) => {
                if(isRecord(item) && values.every(([key, value]) => key in item && (value == undefined || value == item[key])))
                    return 'yield'
                
                return 'continue'
            }
        } 
    }
}