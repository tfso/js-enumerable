import { LinqOperator, LinqType } from './types'
import { BaseEntityType } from '../types'

import { ReducerVisitor } from './../peg/reducervisitor'
import { IExpression } from './../peg/expressionvisitor'
import { ODataVisitor } from './../peg/odatavisitor'

export function whereOperator<TEntity extends BaseEntityType>(predicate: string): LinqOperator<TEntity>
export function whereOperator<TEntity extends BaseEntityType>(predicate: (it: TEntity, ...param: any[]) => boolean, ...param: any[]): LinqOperator<TEntity>
export function whereOperator<TEntity extends BaseEntityType>(): LinqOperator<TEntity> {
    let predicate: any = arguments[0],
        parameters: Array<any> = [],
        expression: IExpression,
        validate: (entity: TEntity) => boolean

    if(arguments.length >= 2)
        parameters = Array.from(arguments).slice(1)

    switch(typeof predicate) {
        case 'string':
            expression = new ODataVisitor().visitOData(predicate)
            validate = (entity: TEntity) => ODataVisitor.evaluate(expression, entity) === true

            break

        case 'function':
            expression = new ReducerVisitor().visitLambda(predicate, ...parameters)
            validate = (entity: TEntity) => predicate.apply({}, [entity].concat(parameters))

            break

        default:
            throw new Error('Where operator can not recognize predicate either as javascript or odata')
    }

    return { type: LinqType.Where,
        expression,
        evaluate: () => {
            return (item) => ({ type: validate(item) == true ? 'yield' : 'continue', value: item })
        }
    }
}