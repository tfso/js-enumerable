import { Repository } from './../repository/repository'

interface ICar {
    id: number
    model: string
    make: string
    year: number
}

class TestRepository extends Repository<ICar, number> {

    public query(...options: any[]): AsyncIterableIterator<ICar> {
        throw new Error('Not implemented')
    }

    public async create(item: Partial<ICar>): Promise<ICar> {
        throw new Error('Not implemented')
    }

    public async read(id: number): Promise<ICar> {
        throw new Error('Not implemented')
    }

    public async update(item: Partial<ICar>): Promise<ICar> {
        throw new Error('Not implemented')
    }

    public async delete(id: number): Promise<boolean> {
        throw new Error('Not implemented')
    }

}


describe("When using repository", () => {
    
    beforeEach(() => {
        
    })

    it("should", () => {
        chai.expect(5).to.equal(5)

    })

    // it("should handle query", async () => {
 
    //     let repo = new TestRepository()

    //     let entity = await repo.read(5) 




    // })
})