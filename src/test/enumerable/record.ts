import { Enumerable, IEnumerable, LinqType } from './../../linq'

/* eslint-disable-next-line */
if(jsEnumerable == null) {
    /* eslint-disable-next-line */
    var jsEnumerable: { Enumerable: typeof Enumerable } = require('./../../index')
}

function * iterator() {
    yield { id: 1, make: 'Toyota', model: 'Corolla', year: 1990, details: { revisions: [{ year: 1966, name: 'E10' }, { year: 1970, name: 'E20' }, { year: 1974, name: 'E30-E60' }, { year: 1979, name: 'E70' }, { year: 1983, name: 'E80' }, { year: 1987, name: 'E90' }, { year: 1991, name: 'E100' }, { year: 1995, name: 'E110' }, { year: 2000, name: 'E120-130' }, { year: 2006, name: 'E140-150' }, { year: 2012, name: 'E160-180' }, { year: 2018, name: 'E210' }]} }
    yield { id: 2, make: 'Nissan', model: 'Leaf', year: 2019, details: { revisions: [{ year: 2010, name: 'MY2011' }, { year: 2013, name: 'MY2013' }, { year: 2016, name: 'MY2016' }, { year: 2017, name: 'MY2017' }]} }
    yield { id: 3, make: 'Nissan', model: 'Qashqai', year: 2009, details: { revisions: [{ year: 2006, name: 'J10' }, { year: 2010, name: 'J10-2' }, { year: 2013, name: 'J11' }, { year: 2017, name: 'J11-2' }]} }
    yield { id: 4, make: 'Volkswagen', model: 'Golf', year: 1999, details: { revisions: [{ year: 1974, name: 'Mk1' }, { year: 1983, name: 'Mk2' }, { year: 1991, name: 'Mk3' }, { year: 1997, name: 'Mk4' }, { year: 2003, name: 'Mk5' }, { year: 2008, name: 'Mk6' }, { year: 2012, name: 'Mk7' }, { year: 2019, name: 'Mk8' }]} }
    yield { id: 5, make: 'Mazda', model: '323', year: 2004, details: { revisions: [{ year: 1963, name: '1gen' }, { year: 1967, name: '2gen' }, { year: 1977, name: 'FA4' }, { year: 1980, name: 'BD' }, { year: 1985, name: 'BF' }, { year: 1989, name: 'BG' }, { year: 1994, name: 'BH' }, { year: 1998, name: 'BJ' }]} }
}

async function * asyncIterator() {
    yield { id: 1, make: 'Toyota', model: 'Corolla', year: 1990, details: { revisions: [{ year: 1966, name: 'E10' }, { year: 1970, name: 'E20' }, { year: 1974, name: 'E30-E60' }, { year: 1979, name: 'E70' }, { year: 1983, name: 'E80' }, { year: 1987, name: 'E90' }, { year: 1991, name: 'E100' }, { year: 1995, name: 'E110' }, { year: 2000, name: 'E120-130' }, { year: 2006, name: 'E140-150' }, { year: 2012, name: 'E160-180' }, { year: 2018, name: 'E210' }]} }
    yield { id: 2, make: 'Nissan', model: 'Leaf', year: 2019, details: { revisions: [{ year: 2010, name: 'MY2011' }, { year: 2013, name: 'MY2013' }, { year: 2016, name: 'MY2016' }, { year: 2017, name: 'MY2017' }]} }
    yield { id: 3, make: 'Nissan', model: 'Qashqai', year: 2009, details: { revisions: [{ year: 2006, name: 'J10' }, { year: 2010, name: 'J10-2' }, { year: 2013, name: 'J11' }, { year: 2017, name: 'J11-2' }]} }
    yield { id: 4, make: 'Volkswagen', model: 'Golf', year: 1999, details: { revisions: [{ year: 1974, name: 'Mk1' }, { year: 1983, name: 'Mk2' }, { year: 1991, name: 'Mk3' }, { year: 1997, name: 'Mk4' }, { year: 2003, name: 'Mk5' }, { year: 2008, name: 'Mk6' }, { year: 2012, name: 'Mk7' }, { year: 2019, name: 'Mk8' }]} }
    yield { id: 5, make: 'Mazda', model: '323', year: 2004, details: {  revisions: [{ year: 1963, name: '1gen' }, { year: 1967, name: '2gen' }, { year: 1977, name: 'FA4' }, { year: 1980, name: 'BD' }, { year: 1985, name: 'BF' }, { year: 1989, name: 'BG' }, { year: 1994, name: 'BH' }, { year: 1998, name: 'BJ' }]} }
}

describe('When using enumerable for record type', () => {
    describe('as an asynchronous iterable', () => {
        it('should async iterate normally', async () => {
            let count = 0,
                firstResult = iterator().next(),
                firstValue = firstResult.value || undefined
    
            chai.expect(typeof firstResult == 'object').to.be.true
            chai.expect(firstValue.id).to.equal(1)
    
            for await(let num of asyncIterator()) 
                count++
    
            chai.expect(count).to.equal(5)
        })

        it('should async iterate using Enumerable', async () => {
            let total = 0
    
            for await(let car of new jsEnumerable.Enumerable(asyncIterator()))
                total += car.year
    
            chai.expect(total).to.equal(1990 + 2019 + 2009 + 1999 + 2004)
        })
    
        it('should async iterate using take', async () => {
            let total = 0
    
            for await(let car of new jsEnumerable.Enumerable(asyncIterator()).take(2))
                total += car.year
    
            chai.expect(total).to.equal(1990 + 2019)
        })

        it('should async iterate using skip', async () => {
            let total = 0
    
            for await(let car of new jsEnumerable.Enumerable(asyncIterator()).skip(3))
                total += car.year
    
            chai.expect(total).to.equal(1999 + 2004)
        })

        it('should async iterate using skip/take', async () => {
            let total = 0
    
            for await(let car of new jsEnumerable.Enumerable(asyncIterator()).skip(2).take(2))
                total += car.year
    
            chai.expect(total).to.equal(2009 + 1999)
        })

        it('should async iterate using slice', async () => {
            let total = 0
    
            for await(let car of new jsEnumerable.Enumerable(asyncIterator()).slice(2, 4))
                total += car.year
    
            chai.expect(total).to.equal(2009 + 1999)
        })

        it('should async iterate using where (javascript)', async () => {
            let ar = []
            
            for await(let car of new jsEnumerable.Enumerable(asyncIterator()).where(it => it.year >= 2005))
                ar.push(car.year)

            chai.expect(ar).to.deep.equal([2019, 2009])
        })

        it('should async iterate using where (odata)', async () => {
            let ar = []
            
            for await(let car of new jsEnumerable.Enumerable(asyncIterator()).where('year ge 2005'))
                ar.push(car.year)

            chai.expect(ar).to.deep.equal([2019, 2009])
        })

        it('should async iterate using orderBy', async () => {
            let ar = []
            
            for await(let car of new jsEnumerable.Enumerable(asyncIterator()).orderBy('year'))
                ar.push(car.year)

            chai.expect(ar).to.deep.equal([1990, 1999, 2004, 2009, 2019])
        })

        it('should async iterate using select with property keys', async () => {
            let car = await new jsEnumerable.Enumerable(asyncIterator()).select('make', 'year').firstAsync()

            chai.expect(car).to.deep.equal({ make: 'Toyota', year: 1990 })
        })

        it('should async iterate using select with selector', async () => {
            let car = await new jsEnumerable.Enumerable(asyncIterator()).select(({ make, year }) => ({ make, year })).firstAsync()

            chai.expect(car).to.deep.equal({ make: 'Toyota', year: 1990 })
        })

        it('should async iterate using select with string', async () => {
            let car = await new jsEnumerable.Enumerable(asyncIterator()).select('make, year').firstAsync()

            chai.expect(car).to.deep.equal({ make: 'Toyota', year: 1990 })
        })

        it('should async iterate using where cars having face lift newer than 2015 (odata)', async () => {
            let cars = []
            
            for await(let car of new jsEnumerable.Enumerable(asyncIterator()).where('details/revisions/any(e: e/year gt 2015)'))
                cars.push(car)
            
            chai.expect(cars.length).to.equal(4)
            chai.expect(cars.map(car => car.id)).to.deep.equal([1, 2, 3, 4])
        })

        it('should async iterate using where cars having face lift newer than 2015 (javascript)', async () => {
            let cars = []
            
            for await(let car of new jsEnumerable.Enumerable(asyncIterator()).where(car => car.details.revisions.some(rev => rev.year > 2015)))
                cars.push(car)
            
            chai.expect(cars.length).to.equal(4)
            chai.expect(cars.map(car => car.id)).to.deep.equal([1, 2, 3, 4])
        })

        it('should async iterate using where cars having face lift newer than 2020 (odata)', async () => {
            let cars = []
            
            for await(let car of new jsEnumerable.Enumerable(asyncIterator()).where('details/revisions/any(e: e/year gt 2020)'))
                cars.push(car)
            
            chai.expect(cars.length).to.equal(0)
        })

        it('should async iterate using where cars having face lift newer than 2020 (javascript)', async () => {
            let cars = []
            
            for await(let car of new jsEnumerable.Enumerable(asyncIterator()).where(car => car.details.revisions.some(rev => rev.year > 2020)))
                cars.push(car)
            
            chai.expect(cars.length).to.equal(0)
        })

        it('should async iterate using where cars having models for over 40 years since 1970 (odata)', async () => {
            let cars = [],
                enumerable = new jsEnumerable.Enumerable(asyncIterator()).where('details/revisions/any(e: e/year le 1970) and details/revisions/any(e: e/year gt 1970 add 40)')
            
            for await(let car of enumerable)
                cars.push(car)
            
            chai.expect(cars.length).to.equal(1)

            let operator = enumerable.operators.pop(),
                count = 0

            chai.expect(operator.type).to.equal(LinqType.Where)

            if(operator.type == LinqType.Where) {
                let list = operator.intersection
                for(let expression of list) {
                    switch(expression.property) {
                        case 'details.revisions':
                            if(expression.operator == 'any') {
                                for(let anyExpression of expression.value) {
                                    chai.expect(anyExpression.property).to.equal('year')
                                    count++
                                }
                            }
                            else {
                                chai.assert(false, `expected operator 'any'`)
                            }
                            
                            break

                        default:
                            chai.assert(false, `unexpected property "${expression.property}"`)
                            break
                    }

                    count++
                }
            }

            chai.expect(count).to.equal(4)
        })
        
        it('should async iterate using where cars having models for over 40 years since 1970 (javascript)', async () => {
            let cars = [],
                enumerable = new jsEnumerable.Enumerable(asyncIterator()).where((car, seventies) => car.details.revisions.some(rev => rev.year <= seventies) && car.details.revisions.some(rev => rev.year > seventies + 40), 1970)
            
            for await(let car of enumerable)
                cars.push(car)
            
            chai.expect(cars.length).to.equal(1)

            let operator = enumerable.operators.pop(),
                count = 0

            chai.expect(operator.type).to.equal(LinqType.Where)

            if(operator.type == LinqType.Where) {
                let list = operator.intersection
                for(let expression of list) {
                    switch(expression.property) {
                        case 'details.revisions':
                            if(expression.operator == 'any') {
                                for(let anyExpression of expression.value) {
                                    chai.expect(anyExpression.property).to.equal('year')
                                    count++
                                }
                            }
                            else {
                                chai.assert(false, `expected operator 'any'`)
                            }
                            break

                        default:
                            chai.assert(false, `unexpected property "${expression.property}"`)
                            break
                    }

                    count++
                }
            }

            chai.expect(count).to.equal(4)
        })
    })

    describe('as a synchronous iterable', () => {
        it('should iterate normally', () => {
            let count = 0,
                firstResult = iterator().next(),
                firstValue = firstResult.value || undefined
    
            chai.expect(typeof firstResult == 'object').to.be.true
            chai.expect(firstValue.id).to.equal(1)
    
            for(let num of iterator()) 
                count++
    
            chai.expect(count).to.equal(5)
        })

        it('should iterate using Enumerable', () => {
            let total = 0
    
            for(let car of new jsEnumerable.Enumerable(iterator()))
                total += car.year
    
            chai.expect(total).to.equal(1990 + 2019 + 2009 + 1999 + 2004)
        })
    
        it('should iterate using take', () => {
            let total = 0
    
            for(let car of new jsEnumerable.Enumerable(iterator()).take(2))
                total += car.year
    
            chai.expect(total).to.equal(1990 + 2019)
        })

        it('should iterate using skip', () => {
            let total = 0
    
            for(let car of new jsEnumerable.Enumerable(iterator()).skip(3))
                total += car.year
    
            chai.expect(total).to.equal(1999 + 2004)
        })

        it('should iterate using skip/take', () => {
            let total = 0
    
            for(let car of new jsEnumerable.Enumerable(iterator()).skip(2).take(2))
                total += car.year
    
            chai.expect(total).to.equal(2009 + 1999)
        })

        it('should iterate using slice', () => {
            let total = 0
    
            for(let car of new jsEnumerable.Enumerable(iterator()).slice(2, 4))
                total += car.year
    
            chai.expect(total).to.equal(2009 + 1999)
        })

        it('should iterate using where (javascript)', () => {
            let ar = []
            
            for(let car of new jsEnumerable.Enumerable(iterator()).where(it => it.year >= 2005))
                ar.push(car.year)

            chai.expect(ar).to.deep.equal([2019, 2009])
        })

        it('should iterate using where (odata)', () => {
            let ar = []
            
            for(let car of new jsEnumerable.Enumerable(iterator()).where('year ge 2005'))
                ar.push(car.year)

            chai.expect(ar).to.deep.equal([2019, 2009])
        })

        it('should iterate using orderBy', () => {
            let ar = []
            
            for(let car of new jsEnumerable.Enumerable(iterator()).orderBy('year'))
                ar.push(car.year)

            chai.expect(ar).to.deep.equal([1990, 1999, 2004, 2009, 2019])
        })

        it('should iterate using select with property keys', () => {
            let car = new jsEnumerable.Enumerable(iterator()).select('make', 'year').first()

            chai.expect(car).to.deep.equal({ make: 'Toyota', year: 1990 })
        })

        it('should iterate using select with selector', () => {
            let car = new jsEnumerable.Enumerable(iterator()).select(({ make, year }) => ({ make, year })).first()

            chai.expect(car).to.deep.equal({ make: 'Toyota', year: 1990 })
        })

        it('should iterate using select with string', () => {
            let car = new jsEnumerable.Enumerable(iterator()).select('make, year').first()

            chai.expect(car).to.deep.equal({ make: 'Toyota', year: 1990 })
        })

        it('should iterate using where cars having face lift newer than 2015 (odata)', () => {
            let cars = []
            
            for(let car of new jsEnumerable.Enumerable(iterator()).where('details/revisions/any(e: e/year gt 2015)'))
                cars.push(car)
            
            chai.expect(cars.length).to.equal(4)
            chai.expect(cars.map(car => car.id)).to.deep.equal([1, 2, 3, 4])
        })
        
        it('should iterate using where cars having face lift newer than 2015 (javascript)', () => {
            let cars = []
            
            for(let car of new jsEnumerable.Enumerable(iterator()).where(car => car.details.revisions.some(r => r.year > 2015)))
                cars.push(car)
            
            chai.expect(cars.length).to.equal(4)
            chai.expect(cars.map(car => car.id)).to.deep.equal([1, 2, 3, 4])
        })

        it('should iterate using where cars having face lift newer than 2020 (odata)', () => {
            let cars = []
            
            for(let car of new jsEnumerable.Enumerable(iterator()).where('details/revisions/any(e: e/year gt 2020)'))
                cars.push(car)
            
            chai.expect(cars.length).to.equal(0)
        })

        it('should iterate using where cars having face lift newer than 2020 (javascript)', () => {
            let cars = []
            
            for(let car of new jsEnumerable.Enumerable(iterator()).where(car => car.details.revisions.some(r => r.year > 2020)))
                cars.push(car)
            
            chai.expect(cars.length).to.equal(0)
        })

        it('should iterate using where cars having models for over 40 years since 1970 (odata)', () => {
            let cars = []
            
            for(let car of new jsEnumerable.Enumerable(iterator()).where('details/revisions/any(e: e/year le 1970) and details/revisions/any(e: e/year gt 1970 add 40)'))
                cars.push(car)
            
            chai.expect(cars.length).to.equal(1)
        })
        
        it('should iterate using where cars having models for over 40 years since 1970 (javascript)', () => {
            let cars = []
            
            for(let car of new jsEnumerable.Enumerable(iterator()).where(car => car.details.revisions.some(rev => rev.year <= 1970) && car.details.revisions.some(rev => rev.year > 1970 + 40)))
                cars.push(car)
            
            chai.expect(cars.length).to.equal(1)
        })
    })
})