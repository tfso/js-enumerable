import { LinqOperator, LinqType } from './types'
import { Entity, isRecord } from './../types'

export function orderByOperator<T extends Entity>(property?: keyof T | string): LinqOperator<T> {
    return { 
        type: LinqType.OrderBy, 
        property, 
        iterator: function* (items) {
            let ar = Array.from(items)

            ar.sort((a, b) => {
                let left: any = null, right: any = null

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
            let ar: Array<T> = []
            
            for await(let item of items)
                ar.push(item)

            ar.sort((a, b) => {
                let left: any = null, 
                    right: any = null

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