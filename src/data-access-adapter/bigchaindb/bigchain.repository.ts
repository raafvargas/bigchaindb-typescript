import { IEntity } from '../entity';
import * as driver from 'bigchaindb-driver'; 
import { Env } from '../../infrastructure/env';
import { IRepository } from '../repository.interface';
import { IBigchainRepository } from './bigchain.interface';

export class BigchainRepository<T extends IEntity> implements IBigchainRepository<T> {
    alice: any = new driver.Ed25519Keypair();
    apiAddress = 'https://test.ipdb.io/api/v1/';

    create(entry: T, metadata: any = null): Promise<any> {
        return this.createWithMetadata(entry, null);
    }

    createWithMetadata(entry: T, metadata: any): Promise<any> {
        if (metadata === null || metadata === undefined) {
            metadata = {
                entity: entry.constructor.name
            }
        } else {
            metadata.entity = entry.constructor.name;
        }

        const tx = driver.Transaction.makeCreateTransaction(
            entry,
            metadata,
            [
                driver.Transaction.makeOutput(
                    driver.Transaction.makeEd25519Condition(this.alice.publicKey))
            ],
            this.alice.publicKey
        );
        const txSigned = driver.Transaction.signTransaction(tx, this.alice.privateKey);
        const conn = new driver.Connection(this.apiAddress, this.getKeys());

        return (<Promise<any>>conn.postTransaction(txSigned))
            .then(() => {
                console.log(txSigned);
                return conn.pollStatusAndFetchTransaction(txSigned.id);
            })
            .then(retrievedTx => <string>retrievedTx.id);
    }

    getById(id: string): Promise<T> {
        const conn = new driver.Connection(this.apiAddress, this.getKeys());
        return (<Promise<any>>conn.getTransaction(id))
            .then(t => {
                if (!t || !t.asset) {
                    return null;
                }
                return <T>t.asset.data;
            });
    }

    private getKeys(): any {
        return {
            app_id: Env.bigchainAppId,
            app_key: Env.bigchainAppKey
        };
    }
}
