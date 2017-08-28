import { IEntity } from '../entity';
import { IRepository } from '../repository.interface';


export interface IBigchainRepository<T extends IEntity> extends IRepository<T> {
    createWithMetadata(entry: T, metadata: any): Promise<any>;
}
