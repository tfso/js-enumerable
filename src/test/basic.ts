
describe("When doing basic logic", () => {
    
    beforeEach(() => {
        
    })

    it("should handle flattening of two-dimensional arrays", () => {
        var ar = [
            [1, 2, 3],
            [5, 6]
        ]

        var flatten = [].concat.apply([], ar)

        chai.expect(flatten.length).to.equal(5)
        chai.expect(flatten).to.deep.equal([1, 2, 3, 5, 6])
    })

    it("should handle flattening of two-dimensional arrays and combining", () => {
        var master: Array<number>, ar: Array<Array<number>>

        master = [0, 4];
        ar = [
            [1, 2, 3],
            [5, 6]
        ]
        
        var combined: Array<number> = [].concat.apply(master, ar)

        chai.expect(combined.length).to.equal(7)
        chai.expect(combined).to.deep.equal([0, 4, 1, 2, 3, 5, 6])
    })
})