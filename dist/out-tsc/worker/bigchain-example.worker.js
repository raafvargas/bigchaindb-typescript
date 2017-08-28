"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var example_entity_1 = require("../core/entities/example.entity");
var bigchain_repository_1 = require("../data-access-adapter/bigchaindb/bigchain.repository");
var BigchainExampleWorker = (function () {
    function BigchainExampleWorker() {
        this.repository = new bigchain_repository_1.BigchainRepository();
        this.name = 'BigchainExampleWorker';
    }
    BigchainExampleWorker.prototype.Run = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.addBlock()
                .then(resolve);
        });
    };
    BigchainExampleWorker.prototype.addBlock = function () {
        var block = new example_entity_1.ExampleEntity();
        block.date = new Date();
        return this.repository.create(block);
    };
    BigchainExampleWorker.prototype.getBlock = function (blockId) {
        return this.repository.getById(blockId);
    };
    return BigchainExampleWorker;
}());
exports.BigchainExampleWorker = BigchainExampleWorker;
//# sourceMappingURL=bigchain-example.worker.js.map