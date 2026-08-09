import {FastifyPluginCallback, FastifyRequest} from 'fastify'
import path from 'node:path'
import {storage} from './infra/storage/s3.js'


export const apiRoutes: FastifyPluginCallback = (instance, opts, done) => {
    instance.post(
        '/upload-file',
        {},
        async (req, reply) => {
            const data = await req.file();

            if (!data) {
                return await reply.status(401).send({message: 'Файл не прикреплён'});
            }
            if (!['.jpg', '.mp4', '.avi', '.mkv'].includes(path.extname(data.filename))) {
                return await reply.status(401).send({message: 'Неподдерживаемый формат'});
            }

            await storage.upload(data.file, data.filename);
            return await reply.status(200).send(true);
        }
    );

    instance.get(
        '/stream',
        {},
        async (req: FastifyRequest<{Querystring: {filename: string}}>, reply) => {
            const range = req.headers['range'];
            const res = await storage.getStream(req.query.filename, range);

            return await reply.headers(res.headers).status(res.status).send(res.body);
        }
    );

    instance.get(
        '/files',
        {},
        async (req, reply) => {
            const files = await storage.getFilesList();
            return await reply.status(200).send(files);
        }
    )

    done();
}
