import Fastify from "fastify";
import {ENV} from './constants/env.js';


const server = Fastify({
    logger: true,
    ajv: {},
});

export function start(): void {
    server.listen({port: ENV.PORT}, (err, address) => {
        if (err) {
            server.log.error(err);
        } else {
            server.log.info(`Server started on ${address}:${ENV.PORT}`)
        }
    })
}
