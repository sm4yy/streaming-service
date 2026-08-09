import 'dotenv/config.js'

import {start} from './server.js'
import {redisConnection} from './infra/storage/redis.js'

redisConnection.connect()
    .then(() => {
        start();
    });

