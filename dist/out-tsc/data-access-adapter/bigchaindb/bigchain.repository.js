"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var driver = require("bigchaindb-driver");
var env_1 = require("../../infrastructure/env");
var BigchainRepository = (function () {
    function BigchainRepository() {
        this.alice = new driver.Ed25519Keypair();
        this.apiAddress = 'https://test.ipdb.io/api/v1/';
    }
    BigchainRepository.prototype.create = function (entry, metadata) {
        if (metadata === void 0) { metadata = null; }
        return this.createWithMetadata(entry, null);
    };
    BigchainRepository.prototype.createWithMetadata = function (entry, metadata) {
        if (metadata === null || metadata === undefined) {
            metadata = {
                entity: entry.constructor.name
            };
        }
        else {
            metadata.entity = entry.constructor.name;
        }
        var tx = driver.Transaction.makeCreateTransaction(entry, metadata, [
            driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(this.alice.publicKey))
        ], this.alice.publicKey);
        var txSigned = driver.Transaction.signTransaction(tx, this.alice.privateKey);
        var conn = new driver.Connection(this.apiAddress, this.getKeys());
        return conn.postTransaction(txSigned)
            .then(function () {
            console.log(txSigned);
            return conn.pollStatusAndFetchTransaction(txSigned.id);
        })
            .then(function (retrievedTx) { return retrievedTx.id; });
    };
    BigchainRepository.prototype.getById = function (id) {
        var conn = new driver.Connection(this.apiAddress, this.getKeys());
        return conn.getTransaction(id)
            .then(function (t) {
            if (!t || !t.asset) {
                return null;
            }
            return t.asset.data;
        });
    };
    BigchainRepository.prototype.getKeys = function () {
        return {
            app_id: env_1.Env.bigchainAppId,
            app_key: env_1.Env.bigchainAppKey
        };
    };
    return BigchainRepository;
}());
exports.BigchainRepository = BigchainRepository;
//# sourceMappingURL=bigchain.repository.js.map