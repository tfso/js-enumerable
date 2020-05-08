import { LinqOperator, LinqType } from './types'
import { Entity, isRecord } from '../types'

export function orderByOperator<TEntity extends Entity>(property?: keyof TEntity | string): LinqOperator<TEntity> {
    return { 
        type: LinqType.OrderBy, 
        property, 
        iterator: function* (items) {
            let ar = Array.from(items)

            ar.sort((a, b) => {
                let left = null, right = null

                if(typeof property == 'string') {
                    if(isRecord(a) && isRecord(b)) {
                        left = a[property] 
                        right = b[property]
                    }
                }
                else {
                    left = a
                    right = b
                }

                return left >= right && left <= right ? 0 : left < right ? -1 : 1 // using >= && <= instead of == fixes comparisons for dates
            })

            yield* ar
        },
        asyncIterator: async function* (items) {
            let ar: Array<TEntity> = []
            
            for await(let item of items)
                ar.push(item)

            ar.sort((a, b) => {
                let left = null, 
                    right = null

                if(typeof property == 'string') {
                    if(isRecord(a) && isRecord(b)) {
                        left = a[property] 
                        right = b[property]
                    }
                }
                else {
                    left = a
                    right = b
                }

                return left >= right && left <= right ? 0 : left < right ? -1 : 1 // using >= && <= instead of == fixes comparisons for dates
            })

            yield* ar 
        }
    }
}