import { LinqOperator, LinqType } from './types'
import { Entity, EntityRecord } from './../types'

export function selectOperator<T extends EntityRecord<Entity>, TResult extends Partial<T>>(...args: any[]): LinqOperator<TResult> {
    let selector: (entity: T) => TResult

    if(args.length > 1) {
        selector = ((keys: string[]) => {
            return (entity: T) => <TResult>reselect(keys, entity)
        })(args)
    }
    else {
        switch(typeof args[0]) {
            case 'function':
                selector = args[0]

                break

            case 'string':
                selector = ((keys: string[]) => {
                    return (entity: T) => <TResult>reselect(keys, entity)
                })(args[0].split(','))

                break
            default:
                throw new Error(`Unexpected argument of type "${typeof args[0]}" for select operator`)
        }
    }

    return {
        type: LinqType.Select,
        evaluate: () => {
            return (item) => ({
                type: 'yield',
                value: selector(<any>item)
            })
        }
    }
}


function reselect(keys: string[], object: Record<string, any>): Record<string, any> | null {
    if(!keys || keys.length == 0)
        return null

    let remapped: Record<string, any> = {},
        groups: { [key: string]: string[] } = {}

    for(let key of keys.map(k => k.trim())) {
        let match = /([^/]+)\/(.*)/i.exec(key)

        if(match) {
            if(!groups[match[1]]) 
                groups[match[1]] = []

            groups[match[1]].push(match[2])
        }
        else {
            remapped[key] = object[key]
        }
    }

    for(let [prop, keys] of Object.entries(groups)) {
        remapped[prop] = reselect(keys, object[prop])
    }

    return remapped 
}