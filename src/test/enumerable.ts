
/* eslint-disable-next-line */
if(jsEnumerable == null) {
    /* eslint-disable-next-line */
    var jsEnumerable = require('./../linq/enumerable')
}

import { IEnumerable } from './../linq'

// declare global {
//     export const jsEnumerable: {
//         Enumerable: IEnumerable<any>
//     }
// }


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
            let enumerable: IEnumerable<number> = new jsEnumerable.Enumerable(asyncIterator())

            for await (let num of enumerable)
                total += num

            chai.expect(total).to.equal(34)
        })

        it('should async iterate using take', async () => {
            let total = 0
            let enumerable: IEnumerable<number> = new jsEnumerable.Enumerable(asyncIterator())

            for await (let num of enumerable.take(2))
                total += num

            chai.expect(total).to.equal(15)
        })

        it('should async iterate using skip', async () => {
            let total = 0
            let enumerable: IEnumerable<number> = new jsEnumerable.Enumerable(asyncIterator())

            for await (let num of enumerable.skip(3))
                total += num

            chai.expect(total).to.equal(12)
        })

        it('should async iterate using skip/take', async () => {
            let total = 0
            let enumerable: IEnumerable<number> = new jsEnumerable.Enumerable(asyncIterator())

            for await (let num of enumerable.skip(2).take(2))
                total += num

            chai.expect(total).to.equal(18)
        })

        it('should async iterate using slice', async () => {
            let total = 0
            let enumerable: IEnumerable<number> = new jsEnumerable.Enumerable(asyncIterator())

            for await (let num of enumerable.slice(2, 4))
                total += num

            chai.expect(total).to.equal(18)
        })

        it('should async iterate using where (javascript)', async () => {
            let ar = []
            let enumerable: IEnumerable<number> = new jsEnumerable.Enumerable(asyncIterator())
            
            for await (let num of enumerable.where(it => it >= 7))
                ar.push(num)

            chai.expect(ar).to.deep.equal([10, 7, 11])
        })

        it('should async iterate using where (odata)', async () => {
            let ar = []
            let enumerable: IEnumerable<number> = new jsEnumerable.Enumerable(asyncIterator())
            
            for await (let num of enumerable.where('this ge 7'))
                ar.push(num)

            chai.expect(ar).to.deep.equal([10, 7, 11])
        })

        it('should async iterate using orderBy', async () => {
            let ar = []
            let enumerable: IEnumerable<number> = new jsEnumerable.Enumerable(asyncIterator())
            
            for await (let num of enumerable.orderBy())
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
            let enumerable: IEnumerable<number> = new jsEnumerable.Enumerable(iterator())
    
            for(let num of enumerable)
                total += num
    
            chai.expect(total).to.equal(34)
        })
    
        it('should iterate using take', () => {
            let total = 0
            let enumerable: IEnumerable<number> = new jsEnumerable.Enumerable(iterator())
    
            for(let num of enumerable.take(2))
                total += num
    
            chai.expect(total).to.equal(15)
        })

        it('should iterate using skip', () => {
            let total = 0
            let enumerable: IEnumerable<number> = new jsEnumerable.Enumerable(iterator())
    
            for(let num of enumerable.skip(3))
                total += num
    
            chai.expect(total).to.equal(12)
        })

        it('should iterate using skip/take', () => {
            let total = 0
            let enumerable: IEnumerable<number> = new jsEnumerable.Enumerable(iterator())
    
            for(let num of enumerable.skip(2).take(2))
                total += num
    
            chai.expect(total).to.equal(18)
        })

        it('should iterate using slice', () => {
            let total = 0
            let enumerable: IEnumerable<number> = new jsEnumerable.Enumerable(iterator())
    
            for(let num of enumerable.slice(2, 4))
                total += num
    
            chai.expect(total).to.equal(18)
        })

        it('should async iterate using where (javascript)', () => {
            let ar = []
            let enumerable: IEnumerable<number> = new jsEnumerable.Enumerable(iterator())
            
            for(let num of enumerable.where(it => it >= 7))
                ar.push(num)

            chai.expect(ar).to.deep.equal([10, 7, 11])
        })

        it('should async iterate using where (odata)', () => {
            let ar = []
            let enumerable: IEnumerable<number> = new jsEnumerable.Enumerable(iterator())
            
            for(let num of enumerable.where('this ge 7'))
                ar.push(num)

            chai.expect(ar).to.deep.equal([10, 7, 11])
        })

        it('should iterate using orderBy', () => {
            let ar = []
            let enumerable: IEnumerable<number> = new jsEnumerable.Enumerable(iterator())
            
            for(let num of enumerable.orderBy())
                ar.push(num)

            chai.expect(ar).to.deep.equal([1, 5, 7, 10, 11])
        })
    })
   
})