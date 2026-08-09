import {createClient} from 'redis'
import {ENV} from '../../constants/env.js'


class RedisConnection {
    constructor() {
        this.client = createClient({
            url: ENV.REDIS_CONNECTION_STRING,
            name: 'streaming-service',
        });
    }

    public async connect(): Promise<void> {
        this.client.connect()
            .then(() => console.log('Redis connected'))
            .catch((err) => console.error('Redis connection error', err));
    }

    public async getHash(key: string) {
        await this.client.get(key);
    }

    public async set(key: string, value: string) {
        await this.client.set(key, value);
    }

    private readonly client;
}

export const redisConnection = new RedisConnection();