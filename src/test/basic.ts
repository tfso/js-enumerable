
describe('When doing basic logic', () => {

    it('should handle flattening of two-dimensional arrays', () => {
        let ar = [
            [1, 2, 3],
            [5, 6]
        ]

        // eslint-disable-next-line prefer-spread
        let flatten = [].concat.apply([], ar)

        chai.expect(flatten.length).to.equal(5)
        chai.expect(flatten).to.deep.equal([1, 2, 3, 5, 6])
    })

    it('should handle flattening of two-dimensional arrays and combining', () => {
        let master: Array<number>, ar: Array<Array<number>>

        master = [0, 4]
        ar = [
            [1, 2, 3],
            [5, 6]
        ]
        
        let combined: Array<number> = [].concat.apply(master, ar)

        chai.expect(combined.length).to.equal(7)
        chai.expect(combined).to.deep.equal([0, 4, 1, 2, 3, 5, 6])
    })
})