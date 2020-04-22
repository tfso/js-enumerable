import { Enumerable, IEnumerable } from './../../linq'

/* eslint-disable-next-line */
if(jsEnumerable == null) {
    /* eslint-disable-next-line */
    var jsEnumerable: { Enumerable: typeof Enumerable } = require('./../../index')
}

function * iterator() {
    yield { make: 'Toyota', model: 'Corolla', year: 1990 }
    yield { make: 'Nissan', model: 'Leaf', year: 2019 }
    yield { make: 'Nissan', model: 'Qashqai', year: 2009 }
    yield { make: 'Volkswagen', model: 'Golf', year: 1999 }
    yield { make: 'Mazda', model: '323 F-type', year: 2004 }
}

async function * asyncIterator() {
    yield { make: 'Toyota', model: 'Corolla', year: 1990 }
    yield { make: 'Nissan', model: 'Leaf', year: 2019 }
    yield { make: 'Nissan', model: 'Qashqai', year: 2009 }
    yield { make: 'Volkswagen', model: 'Golf', year: 1999 }
    yield { make: 'Mazda', model: '323 F-type', year: 2004 }
}

describe('When using enumerable for record type', () => {
    describe('as an asynchronous iterable', () => {
        it('should iterate normally', async () => {
            let count = 0,
                firstResult = iterator().next(),
                firstValue = firstResult.value
    
            chai.expect(typeof firstResult == 'object').to.be.true
            chai.expect(firstValue).to.deep.equal({ make: 'Toyota', model: 'Corolla', year: 1990 })
    
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
    })

    describe('as a synchronous iterable', () => {
        it('should iterate normally', () => {
            let count = 0,
                firstResult = iterator().next(),
                firstValue = firstResult.value
    
            chai.expect(typeof firstResult == 'object').to.be.true
            chai.expect(firstValue).to.deep.equal({ make: 'Toyota', model: 'Corolla', year: 1990 })
    
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
    })
})