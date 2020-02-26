import { Enumerable } from '../linq'

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

            for await (let num of new Enumerable(asyncIterator()))
                total += num

            chai.expect(total).to.equal(34)
        })

        it('should async iterate using Enumerable with take', async () => {
            let total = 0

            for await (let num of new Enumerable(asyncIterator()).take(2))
                total += num

            chai.expect(total).to.equal(15)
        })

        it('should async iterate using Enumerable with skip', async () => {
            let total = 0

            for await (let num of new Enumerable(asyncIterator()).skip(3))
                total += num

            chai.expect(total).to.equal(12)
        })

        it('should async iterate using Enumerable with skip/take', async () => {
            let total = 0

            for await (let num of new Enumerable(asyncIterator()).skip(2).take(2))
                total += num

            chai.expect(total).to.equal(18)
        })

        it('should async iterate using Enumerable with slice', async () => {
            let total = 0

            for await (let num of new Enumerable(asyncIterator()).slice(2, 4))
                total += num

            chai.expect(total).to.equal(18)
        })

        it('should async iterate using Enumerable with orderBy', async () => {
            let ar = []
            
            for await (let num of new Enumerable(asyncIterator()).orderBy())
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
    
            for(let num of new Enumerable(iterator()))
                total += num
    
            chai.expect(total).to.equal(34)
        })
    
        it('should iterate using Enumerable with take', () => {
            let total = 0
    
            for(let num of new Enumerable(iterator()).take(2))
                total += num
    
            chai.expect(total).to.equal(15)
        })

        it('should iterate using Enumerable with skip', () => {
            let total = 0
    
            for(let num of new Enumerable(iterator()).skip(3))
                total += num
    
            chai.expect(total).to.equal(12)
        })

        it('should iterate using Enumerable with skip/take', () => {
            let total = 0
    
            for(let num of new Enumerable(iterator()).skip(2).take(2))
                total += num
    
            chai.expect(total).to.equal(18)
        })

        it('should iterate using Enumerable with slice', () => {
            let total = 0
    
            for(let num of new Enumerable(iterator()).slice(2, 4))
                total += num
    
            chai.expect(total).to.equal(18)
        })

        it('should iterate using Enumerable with orderBy', () => {
            
            let ar = Array.from(new Enumerable(iterator()).orderBy())

            chai.expect(ar).to.deep.equal([1, 5, 7, 10, 11])
        })
    })
   
})