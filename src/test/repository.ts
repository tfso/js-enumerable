import { Enumerable, IEnumerable } from './../linq'
import { LinqType } from '../linq/operator'

/* eslint-disable-next-line */
if(jsEnumerable == null) {
    /* eslint-disable-next-line */
    var jsEnumerable: { Enumerable: typeof Enumerable } = require('./../index')
}

import { RepositoryMock } from './setup/repository'

interface ICar {
    id: number
    location: string
    type: { 
        make: string
        model: string
    }
    year: number
}

class CarRepository extends RepositoryMock<ICar, number> {
    constructor(...cars: ICar[]) {
        super((entity) => entity.id, cars)
    }

    public async * query(enumerable?: IEnumerable<ICar>): AsyncIterableIterator<ICar> {
        yield * this.data
    }
}

describe('When using repository', () => {
    const repository = new CarRepository(
        { id: 1, location: 'SKIEN', year: 2016, type: { make: 'SAAB', model: '9-3' } },
        { id: 2, location: 'PORSGRUNN', year: 2010, type: { make: 'NISSAN', model: 'QASHQAI' } },
        { id: 3, location: 'PORSGRUNN', year: 2005, type: { make: 'SAAB', model: '9-3' } },
        { id: 4, location: 'LANGESUND', year: 2004, type: { make: 'NISSAN', model: 'LEAF' } },
        { id: 5, location: 'BREVIK', year: 2009, type: { make: 'TOYOTA', model: 'COROLLA' } },
        { id: 6, location: 'BREVIK', year: 2014, type: { make: 'HONDA', model: 'HRV' } },
        { id: 7, location: 'HEISTAD', year: 2013, type: { make: 'TOYOTA', model: 'YARIS' } },
        { id: 8, location: 'LARVIK', year: 2009, type: { make: 'HONDA', model: 'CIVIC' } }
    )

    describe('analyzing where operator', () => {

        it('should intersect expression properties that is only and\'ed', () => {
            let enumerable = new jsEnumerable.Enumerable(repository).where(car => car.year == 2015 && car.location.toUpperCase() == 'NO' && car.id > 5),
                operator = enumerable.operators.pop(),
                count = 0
            
            chai.expect(operator.type).to.equal(LinqType.Where)
            
            if(operator.type == LinqType.Where) {
                let list = operator.intersection
                for(let expression of list) {

                    switch(expression.property) {
                        case 'year':
                            chai.expect(expression.value).to.equal(2015)
                            chai.expect(expression.operator).to.equal('==')
                            break

                        case 'location':
                            chai.expect(expression.value).to.equal('NO')
                            chai.expect(expression.operator).to.equal('==')
                            break

                        case 'id':
                            chai.expect(expression.value).to.equal(5)
                            chai.expect(expression.operator).to.equal('>')
                            break

                        default:
                            chai.assert(false, `unexpected property "${expression.property}"`)
                            break
                    }

                    count++
                }
            }

            chai.expect(count).to.equal(3)
        })
    
        it('should intersect expression properties that is common', () => {
            let enumerable = new jsEnumerable.Enumerable(repository).where(car => (car.year == 2015 && car.location == 'NO') || car.year == 2015 || (car.location == 'SE' && car.year == 2015)),
                operator = enumerable.operators.pop(),
                count = 0
            
            chai.expect(operator.type).to.equal(LinqType.Where)
            
            if(operator.type == LinqType.Where) {
                for(let expression of operator.intersection) {

                    switch(expression.property) {
                        case 'year':
                            chai.expect(expression.value).to.equal(2015)
                            chai.expect(expression.operator).to.equal('==')
                            break

                        default:
                            chai.assert(false, `unexpected property "${expression.property}"`)
                            break
                    }

                    count++
                }
            }

            chai.expect(count).to.equal(1)
        })

        it('should intersect expression properties that is common but inverted', () => {
            let enumerable = new jsEnumerable.Enumerable(repository).where(car => (car.year >= 2015 && car.location == 'NO') || 2015 <= car.year || (car.location == 'SE' && car.year >= 2015)),
                operator = enumerable.operators.pop(),
                count = 0
            
            chai.expect(operator.type).to.equal(LinqType.Where)
            
            if(operator.type == LinqType.Where) {
                for(let expression of operator.intersection) {

                    switch(expression.property) {
                        case 'year':
                            chai.expect(expression.value).to.equal(2015)
                            chai.expect(expression.operator).to.equal('>=')
                            break

                        default:
                            chai.assert(false, `unexpected property "${expression.property}"`)
                            break
                    }

                    count++
                }
            }

            chai.expect(count).to.equal(1)
        })

        it('should not intersect expression properties that is not common', () => {
            let enumerable = new jsEnumerable.Enumerable(repository).where(car => (car.year > 2015 && car.location == 'NO') || car.year == 2015 || (car.location == 'SE' && car.year == 2015)),
                operator = enumerable.operators.pop()
            
            chai.expect(operator.type).to.equal(LinqType.Where)

            if(operator.type == LinqType.Where) {
                chai.expect(Array.from(operator.intersection).length).to.equal(0)
            }
        })

        it('should intersect expression properties that is using input params', () => {
            let enumerable = new jsEnumerable.Enumerable(repository).where((car, year, location, id) => car.year == year && car.location.toUpperCase() == location && car.id > id, 2015, 'NO', 5),
                operator = enumerable.operators.pop(),
                count = 0
            
            chai.expect(operator.type).to.equal(LinqType.Where)
            
            if(operator.type == LinqType.Where) {
                let list = operator.intersection
                for(let expression of list) {
                    switch(expression.property) {
                        case 'year':
                            chai.expect(expression.value).to.equal(2015)
                            chai.expect(expression.operator).to.equal('==')
                            break

                        case 'location':
                            chai.expect(expression.value).to.equal('NO')
                            chai.expect(expression.operator).to.equal('==')
                            break

                        case 'id':
                            chai.expect(expression.value).to.equal(5)
                            chai.expect(expression.operator).to.equal('>')
                            break

                        default:
                            chai.assert(false, `unexpected property "${expression.property}"`)
                            break
                    }

                    count++
                }
            }

            chai.expect(count).to.equal(3)
        })
    })

    it('should be able to iterate', async () => {
        let ar = await new jsEnumerable.Enumerable(repository).toArrayAsync()

        chai.expect(ar.length).to.equal(8)
    })

    it('should iterate using take', async () => {
        let total = 0

        for await(let car of new jsEnumerable.Enumerable(repository).take(2))
            total += car.year

        chai.expect(total).to.equal(2016 + 2010)
    })

    it('should work with random query', async () => {
        let car = await new jsEnumerable.Enumerable(repository)
            .where(it => it.id == 3 + 3)
            .firstAsync()

        chai.expect(car?.id).to.equal(6)
    })

    it('should work with random query using input param', async () => {
        let car = await new jsEnumerable.Enumerable(repository)
            .where((it, id) => it.id == id, 6)
            .firstAsync()

        chai.expect(car?.id).to.equal(6)
    })

    it('should work with select using keys', async () => {
        let car = await new jsEnumerable.Enumerable(repository)
            .where(it => it.id == 6)
            .select('id', 'location')
            .firstAsync()

        chai.expect(car).to.deep.equal({ id: 6, location: 'BREVIK' })
    })

    it('should work with select using selector', async () => {
        let car = await new jsEnumerable.Enumerable(repository)
            .where(it => it.id == 6)
            .select(({ id, type: { make } }) => ({ id, make }))
            .firstAsync()

        chai.expect(car).to.deep.equal({ id: 6, make: 'HONDA' })
    })

    it('should work with select using string', async () => {
        let car = await new jsEnumerable.Enumerable(repository)
            .where(it => it.id == 6)
            .select('id,type/make')
            .firstAsync()

        chai.expect(car).to.deep.equal({ id: 6, type: { make: 'HONDA' } })
    })

    describe('as CRUD', () => {

        it('should be able to update', () => {

            repository.update({  })

        })

    })
})