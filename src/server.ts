import { IStartup } from './infrastructure/initializable.interface';
import { BigchainExampleWorker } from './worker/bigchain-example.worker';

const servers: IStartup[] = new Array<IStartup>();

servers.push(new BigchainExampleWorker());

const initAll = async (server: IStartup) => {
    console.log('%s Starting...', server.name);
    await server.Run();
    console.log('%s Started!', server.name);
};

servers.forEach(initAll);
