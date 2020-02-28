"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("./../repository/repository");
class TestRepository extends repository_1.Repository {
    query(...options) {
        throw new Error('Not implemented');
    }
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
    read(id) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
    update(item) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
}
describe('When using repository', () => {
    it('should', () => {
        chai.expect(5).to.equal(5);
    });
    // it("should handle query", async () => {
    //     let repo = new TestRepository()
    //     let entity = await repo.read(5) 
    // })
});
//# sourceMappingURL=repository.js.map