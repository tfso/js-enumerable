
import { Enumerable, IEnumerable } from './../linq'

/* eslint-disable-next-line */
if(jsEnumerable == null) {
    /* eslint-disable-next-line */
    var jsEnumerable: { Enumerable: typeof Enumerable } = require('./../linq/enumerable')
}

function * iterator() {
    yield 5
    yield 10
    yield 7
    yield 11
    yield 1
}

async function * asyncIterator() {
    yield 5
    yield 10
    yield 7
    yield 11
    yield 1
}

describe('When using enumerable', () => {
    describe('as an asynchronous iterable', () => {

        it('should async iterate normally', async () => {
            let total = 0,
                firstResult = asyncIterator().next(),
                firstValue = (await firstResult).value

            chai.expect(firstResult instanceof Promise).to.be.true
            chai.expect(firstValue).to.equal(5)

            for await (let num of asyncIterator())
                total += num

            chai.expect(total).to.equal(34)
        })

        it('should async iterate using Enumerable', async () => {
            let total = 0

            for await (let num of new jsEnumerable.Enumerable(asyncIterator()))
                total += num

            chai.expect(total).to.equal(34)
        })

        it('should async iterate using take', async () => {
            let total = 0
            
            for await (let num of new jsEnumerable.Enumerable(asyncIterator()).take(2))
                total += num

            chai.expect(total).to.equal(15)
        })

        it('should async iterate using skip', async () => {
            let total = 0

            for await (let num of new jsEnumerable.Enumerable(asyncIterator()).skip(3))
                total += num

            chai.expect(total).to.equal(12)
        })

        it('should async iterate using skip/take', async () => {
            let total = 0
            
            for await (let num of new jsEnumerable.Enumerable(asyncIterator()).skip(2).take(2))
                total += num

            chai.expect(total).to.equal(18)
        })

        it('should async iterate using slice', async () => {
            let total = 0

            for await (let num of new jsEnumerable.Enumerable(asyncIterator()).slice(2, 4))
                total += num

            chai.expect(total).to.equal(18)
        })

        it('should async iterate using where (javascript)', async () => {
            let ar = []
            
            for await (let num of new jsEnumerable.Enumerable(asyncIterator()).where(it => it >= 7))
                ar.push(num)

            chai.expect(ar).to.deep.equal([10, 7, 11])
        })

        it('should async iterate using where (odata)', async () => {
            let ar = []
            
            for await (let num of new jsEnumerable.Enumerable(asyncIterator()).where('this ge 7'))
                ar.push(num)

            chai.expect(ar).to.deep.equal([10, 7, 11])
        })

        it('should async iterate using orderBy', async () => {
            let ar = []
            
            for await (let num of new jsEnumerable.Enumerable(asyncIterator()).orderBy())
                ar.push(num)

            chai.expect(ar).to.deep.equal([1, 5, 7, 10, 11])
        })
    })

    describe('as a synchronous iterable', () => {
        
        it('should iterate normally', () => {
            let total = 0,
                firstResult = iterator().next(),
                firstValue = firstResult.value
    
            chai.expect(typeof firstResult == 'object').to.be.true
            chai.expect(firstValue).to.equal(5)
    
            for(let num of iterator()) 
                total += num
    
            chai.expect(total).to.equal(34)
        })
    
        it('should iterate using Enumerable', () => {
            let total = 0
    
            for(let num of new jsEnumerable.Enumerable(iterator()))
                total += num
    
            chai.expect(total).to.equal(34)
        })
    
        it('should iterate using take', () => {
            let total = 0
    
            for(let num of new jsEnumerable.Enumerable(iterator()).take(2))
                total += num
    
            chai.expect(total).to.equal(15)
        })

        it('should iterate using skip', () => {
            let total = 0
    
            for(let num of new jsEnumerable.Enumerable(iterator()).skip(3))
                total += num
    
            chai.expect(total).to.equal(12)
        })

        it('should iterate using skip/take', () => {
            let total = 0
    
            for(let num of new jsEnumerable.Enumerable(iterator()).skip(2).take(2))
                total += num
    
            chai.expect(total).to.equal(18)
        })

        it('should iterate using slice', () => {
            let total = 0
    
            for(let num of new jsEnumerable.Enumerable(iterator()).slice(2, 4))
                total += num
    
            chai.expect(total).to.equal(18)
        })

        it('should async iterate using where (javascript)', () => {
            let ar = []
            
            for(let num of new jsEnumerable.Enumerable(iterator()).where(it => it >= 7))
                ar.push(num)

            chai.expect(ar).to.deep.equal([10, 7, 11])
        })

        it('should async iterate using where (odata)', () => {
            let ar = []
            
            for(let num of new jsEnumerable.Enumerable(iterator()).where('this ge 7'))
                ar.push(num)

            chai.expect(ar).to.deep.equal([10, 7, 11])
        })

        it('should iterate using orderBy', () => {
            let ar = []
            
            for(let num of new jsEnumerable.Enumerable(iterator()).orderBy())
                ar.push(num)

            chai.expect(ar).to.deep.equal([1, 5, 7, 10, 11])
        })
    })
   
})