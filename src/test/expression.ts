import * as assert from 'assert'
import * as Expr from './../linq/peg/expressionvisitor'

import { ODataVisitor } from './../linq/peg/odatavisitor'

describe('When using Expression', () => {
    let reducer: ODataVisitor

    beforeEach(() => {
        reducer = new ODataVisitor()
    })

    it('should use sets to intersect a expression', () => {
        let expression = reducer.parseOData(`(year eq 2015 and location eq 'NO') or year eq 2015 or (location eq 'SE' and year eq 2015)`)

        let count = 0
        for(let part of expression.intersection) {
            switch(part.toString()) {
                case 'year == 2015':
                    count++; break
            }
        }

        chai.expect(count).to.equal(1)
    })

    it('should use sets to union a expression', () => {
        let expression = reducer.parseOData(`(year eq 2015 and location eq 'NO') or year eq 2015 or (location eq 'SE' and year eq 2015)`)

        let count = 0
        for(let part of expression.union) {
            count++
        }

        chai.expect(count).to.equal(5)
    })

    it('should use sets for a expression', () => {
        let expression = reducer.parseOData(`(year eq 2015 and location eq 'NO') or year eq 2015 or (location eq 'SE' and year eq 2015)`)

        let count = 0
        for(let part of expression.sets) {
            switch(part.map(p => p.toString()).join(',')) {
                case 'year == 2015,location == "NO"': count++; break
                case 'year == 2015': count++; break
                case 'location == "SE",year == 2015': count++; break
            }
        }

        chai.expect(count).to.equal(3)
    })

    it('should use sets for a expression and only pick the usable ones', () => {
        let expression = reducer.parseOData(`(year eq 2015 and (location eq 'DK' or location eq 'NO')) or year eq 2015 or (location eq 'SE' and year eq 2015)`)

        let count = 0
        for(let part of expression.sets) {
            switch(part.map(p => p.toString()).join(',')) {
                case 'year == 2015': count++; break
                case 'year == 2015': count++; break
                case 'location == "SE",year == 2015': count++; break
            }
        }

        chai.expect(count).to.equal(3)

        chai.expect(Array.from(expression.sets).length).to.equal(3)
        chai.expect(Array.from(expression.union).length).to.equal(4)
        chai.expect(Array.from(expression.intersection).length).to.equal(1)
    })

    it('should use sets for a expression with only or', () => {
        let expression = reducer.parseOData(`year eq 2015 or location eq 'NO'`)

        let count = 0
        for(let part of expression.sets) {
            switch(part.map(p => p.toString()).join(',')) {
                case 'year == 2015': count++; break
                case 'location == "NO"': count++; break
            }
        }
        
        chai.expect(count).to.equal(2)
        
        chai.expect(Array.from(expression.sets).length).to.equal(2)
        chai.expect(Array.from(expression.union).length).to.equal(2)
        chai.expect(Array.from(expression.intersection).length).to.equal(0)

    })

})
