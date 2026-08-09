import Fastify from "fastify";

import {ENV} from './constants/env.js';
import {apiRoutes} from './routes.js';


const server = Fastify({
    logger: true,
    bodyLimit: 100 * 1024 * 1024,
    ajv: {},
});

void server.register(import ('@fastify/multipart'));
void server.register(import ('@fastify/cors'), {
    origin: 'localhost',
    methods: ['GET', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Range', 'Content-Type'],
    exposedHeaders: ['Content-Range', 'Content-Length', 'Accept-Ranges'],
    credentials: false
})
void server.register(apiRoutes, {prefix: '/api'});

export function start(): void {
    server.listen({port: ENV.PORT}, (err, address) => {
        if (err) {
            server.log.error(err);
        } else {
            server.log.info(`Server started on ${address}:${ENV.PORT}`)
        }
    })
}
