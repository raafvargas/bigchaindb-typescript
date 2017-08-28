import { ExampleEntity } from '../core/entities/example.entity';
import { IStartup } from '../infrastructure/initializable.interface';
import { IBigchainRepository } from '../data-access-adapter/bigchaindb/bigchain.interface';
import { BigchainRepository } from '../data-access-adapter/bigchaindb/bigchain.repository';

export class BigchainExampleWorker implements IStartup {
    private repository: IBigchainRepository<ExampleEntity> = new BigchainRepository<ExampleEntity>();
    name: string = 'BigchainExampleWorker';

    Run(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.addBlock()
                .then(resolve); 
        });
    }

    addBlock(): Promise<any> {
        const block = new ExampleEntity();
        block.date = new Date();
        return this.repository.create(block);
    }

    getBlock(blockId: string): Promise<any> {
        return this.repository.getById(blockId);
    }
}