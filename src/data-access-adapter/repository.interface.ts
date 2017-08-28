import { IEntity } from './entity';

export interface IRepository<T extends IEntity> {
    create(entry: T): Promise<any>;
    getById(id: string): Promise<T>;
}
