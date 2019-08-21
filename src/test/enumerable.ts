import { Enumerable } from "../enumerable";

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

describe("When using enumerable", () => {
    
    beforeEach(() => {
        
    })

    describe("as an asynchronous iterable", () => {

        it("should async iterate normally", async () => {
            let total = 0,
                firstResult = asyncIterator().next(),
                firstValue = (await firstResult).value

            chai.expect(firstResult instanceof Promise).to.be.true
            chai.expect(firstValue).to.equal(5)

            for await(let num of asyncIterator())
                total += num

            chai.expect(total).to.equal(34)
        })

        it("should async iterate using Enumerable", async () => {
            let total = 0

            for await(let num of new Enumerable(asyncIterator()))
                total += num

            chai.expect(total).to.equal(34)
        })

        it("should async iterate using Enumerable with take", async () => {
            let total = 0

            for await(let num of new Enumerable(asyncIterator()).take(2))
                total += num

            chai.expect(total).to.equal(15)
        })        

    
    })

    describe("as a synchronous iterable", () => {
        
        it("should iterate normally", () => {
            let total = 0,
                firstResult = iterator().next(),
                firstValue = firstResult.value
    
            chai.expect(typeof firstResult == 'object').to.be.true
            chai.expect(firstValue).to.equal(5)
    
            for (let num of iterator()) 
                total += num
    
            chai.expect(total).to.equal(34)
        })
    
        it("should iterate using Enumerable", async () => {
            let total = 0
    
            for(let num of new Enumerable(iterator()))
                total += num
    
            chai.expect(total).to.equal(34)
        })
    
        it("should iterate using Enumerable with take", async () => {
            let total = 0
    
            for(let num of new Enumerable(iterator()).take(2))
                total += num
    
            chai.expect(total).to.equal(15)
        })
    })
   
})