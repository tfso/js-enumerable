import { expect } from 'chai'
import { LinqType, whereOperator } from '../../linq/operator'

type Car = {
    id: number
    location: string
    type: { 
        make: string
        model: string
    }
    year: number
}

describe('When using operator', () => {
    describe('where', () => {

        describe('for javascript', () => {
            it('should use sets for an expression', () => {
                const operator = whereOperator<Car>(car => (car.year == 2015 && car.location == 'DK') || car.location == 'NO')

                if(operator.type !== LinqType.Where)
                    throw new Error('expecting where operator')

                const sets = Array.from(operator.sets)
                const expressions = sets.flatMap(sets => Array.from(sets))

                expect(sets.length).to.equal(2)
                expect(expressions.length).to.equal(3)
            })

            it('should use intersection for an expression', () => {
                const operator = whereOperator<Car>(car => car.location == 'NO' && (car.year == 2019 || car.year == 2020 || car.year == 2021))

                if(operator.type !== LinqType.Where)
                    throw new Error('expecting where operator')

                const intersection = Array.from(operator.intersection)

                expect(intersection.length).to.equal(1)
            })

            it('should use intersection for an expression using multiple ands', () => {
                const operator = whereOperator<Car>(car => car.year == 2015 && car.location == 'NO' && car.id > 5)

                if(operator.type !== LinqType.Where)
                    throw new Error('expecting where operator')

                const intersection = Array.from(operator.intersection)

                expect(intersection.length).to.equal(3)
            })

            it('should use intersection correct for an in expression', () => {
                const operator = whereOperator<Car>(car => car.location == 'NO' && [2019, 2020, 2021].includes(car.year))

                if(operator.type !== LinqType.Where)
                    throw new Error('expecting where operator')

                expect(operator.expression.toString()).to.equal(`(car) => (car.location == "NO" && car.year in [2019, 2020, 2021])`)

                const intersection = Array.from(operator.intersection)

                expect(intersection.length).to.equal(2)

                const inExpr = intersection[1]

                expect(inExpr.operator).to.equal('in')
                expect(inExpr.property).to.equal('year')
                expect(inExpr.type).to.equal('array')
                expect(inExpr.value).to.have.members([2021, 2020, 2019])
            })

            it('should use intersection correct for an in expression with single element', () => {
                const operator = whereOperator<Car>(car => [2021].includes(car.year))

                if(operator.type !== LinqType.Where)
                    throw new Error('expecting where operator')

                expect(operator.expression.toString()).to.equal(`(car) => (car.year in [2021])`)

                const intersection = Array.from(operator.intersection)

                expect(intersection.length).to.equal(1)

                const inExpr = intersection[0]

                expect(inExpr.operator).to.equal('in')
                expect(inExpr.property).to.equal('year')
                expect(inExpr.type).to.equal('array')
                expect(inExpr.value).to.have.members([2021])
            })

            it('should use intersection correct for an in expression with nested object', () => {
                const operator = whereOperator<Car>(car => car.location == 'NO' && ['toyota', 'ford'].includes(car.type.make))

                if(operator.type !== LinqType.Where)
                    throw new Error('expecting where operator')

                expect(operator.expression.toString()).to.equal(`(car) => (car.location == "NO" && car.type.make in ["toyota", "ford"])`)

                const intersection = Array.from(operator.intersection)

                expect(intersection.length).to.equal(2)

                const inExpr = intersection[1]

                expect(inExpr.operator).to.equal('in')
                expect(inExpr.property).to.equal('type.make')
                expect(inExpr.type).to.equal('array')
                expect(inExpr.value).to.have.members(['ford', 'toyota'])
            })
        })

        describe('for odata', () => {
            it('should use sets for an expression', () => {
                const operator = whereOperator<Car>(`(year eq 2015 and location eq 'DK') or location eq 'NO'`)

                if(operator.type !== LinqType.Where)
                    throw new Error('expecting where operator')

                const sets = Array.from(operator.sets)
                const expressions = sets.flatMap(sets => Array.from(sets))

                expect(sets.length).to.equal(2)
                expect(expressions.length).to.equal(3)
            })

            it('should use intersection for an expression', () => {
                const operator = whereOperator<Car>(`location eq 'NO' and (year eq 2019 or year eq 2020 or year eq 2021)`)

                if(operator.type !== LinqType.Where)
                    throw new Error('expecting where operator')

                const intersection = Array.from(operator.intersection)

                expect(intersection.length).to.equal(1)
            })

            it('should use intersection for an expression using multiple ands', () => {
                const operator = whereOperator<Car>(`year eq 2015 and location eq 'NO' and id gt 5`)

                if(operator.type !== LinqType.Where)
                    throw new Error('expecting where operator')

                const intersection = Array.from(operator.intersection)

                expect(intersection.length).to.equal(3)
            })

            it('should use intersection correct for an in expression', () => {
                const operator = whereOperator<Car>(`location eq 'NO' and year in (2019, 2020, 2021)`)

                if(operator.type !== LinqType.Where)
                    throw new Error('expecting where operator')

                expect(operator.expression.toString()).to.equal(`(location == "NO" && year in [2019, 2020, 2021])`)

                const intersection = Array.from(operator.intersection)

                expect(intersection.length).to.equal(2)

                const inExpr = intersection[1]

                expect(inExpr.operator).to.equal('in')
                expect(inExpr.property).to.equal('year')
                expect(inExpr.type).to.equal('array')
                expect(inExpr.value).to.have.members([2021, 2020, 2019])
            })

            it('should use intersection correct for an in expression with single element', () => {
                const operator = whereOperator<Car>(`year in (2021)`)

                if(operator.type !== LinqType.Where)
                    throw new Error('expecting where operator')

                expect(operator.expression.toString()).to.equal(`year in 2021`)

                const intersection = Array.from(operator.intersection)

                expect(intersection.length).to.equal(1)

                const inExpr = intersection[0]

                expect(inExpr.operator).to.equal('in')
                expect(inExpr.property).to.equal('year')
                expect(inExpr.type).to.equal('array')
                expect(inExpr.value).to.have.members([2021])
            })

            it('should use intersection correct for an in expression with nested object', () => {
                const operator = whereOperator<Car>(`location eq 'NO' and type/make in ('toyota', 'ford')`)

                if(operator.type !== LinqType.Where)
                    throw new Error('expecting where operator')

                expect(operator.expression.toString()).to.equal(`(location == "NO" && type.make in ["toyota", "ford"])`)

                const intersection = Array.from(operator.intersection)

                expect(intersection.length).to.equal(2)

                const inExpr = intersection[1]

                expect(inExpr.operator).to.equal('in')
                expect(inExpr.property).to.equal('type.make')
                expect(inExpr.type).to.equal('array')
                expect(inExpr.value).to.have.members(['ford', 'toyota'])
            })
        })
    })
})
