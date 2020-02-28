"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Repository {
    [Symbol.iterator](...options) {
        throw new TypeError('Repository is async iterable but it used as iterable');
    }
    [Symbol.asyncIterator](linq, meta) {
        return this.query(linq, meta);
    }
}
exports.Repository = Repository;
//# sourceMappingURL=repository.js.map