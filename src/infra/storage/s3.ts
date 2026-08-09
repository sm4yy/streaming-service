import {GetObjectCommand, ListObjectsV2Command, S3Client} from '@aws-sdk/client-s3'
import {Upload} from '@aws-sdk/lib-storage'
import {Readable} from 'node:stream'

import {ENV} from '../../constants/env.js'
import {createUniqueFilename} from '../../utils/uniqueFilename.js'


class Storage {
    constructor() {
        this.client = new S3Client({
            region: 'ru',
            endpoint: ENV.MINIO_ENDPOINT,
            forcePathStyle: true,
            credentials: {
                accessKeyId: ENV.MINIO_ROOT_USER,
                secretAccessKey: ENV.MINIO_ROOT_PASSWORD,
            },
        });
    }

    private readonly client: S3Client;

    public async upload(stream: Readable, filename: string): Promise<void> {
        try {
            const command = new Upload({
                client: this.client,
                params: {
                    Bucket: ENV.MINIO_BUCKET_NAME,
                    Key: createUniqueFilename(filename),
                    Body: stream,
                    Metadata: {
                        originalName: filename
                    }
                },
                // Размер одного чанка 5Мб для всех, кроме последнего
                partSize: 5 * 1024 * 1024,
                // Кол-во одновременных потоков загрузки
                queueSize: 4,
            });

            command.on("httpUploadProgress", (progress) => {
                console.log(`${progress.loaded}/${progress.total} bytes uploaded`);
            });
            await command.done();
            console.log('Файл отправлен успешно');
        } catch (e) {
            console.error('[S3]: Ошибка отправки файла:', e);
        }
    }

    public async getFilesList(): Promise<string[]> {
        const response = await this.client.send(new ListObjectsV2Command({
            Bucket: ENV.MINIO_BUCKET_NAME,
        }));
        if (!response.Contents) {
            return [];
        }

        return response.Contents
            .map(({Key}) => Key)
            .filter((item) => item !== undefined);

    }

    public async getStream(filename: string, range?: string) {
        const s3Response = await this.client.send(new GetObjectCommand({
            Bucket: ENV.MINIO_BUCKET_NAME,
            Key: filename,
            Range: range,
        }));

        const status = range ? 206 : 200;
        const headers: Record<string, string | number> = {
            'Content-type': s3Response.ContentType ?? 'video/mp4',
            'Content-Length': s3Response.ContentLength || 0,
            'Accept-Ranges': 'bytes',
        }
        if (s3Response.ContentRange) {
            headers['Content-Range'] = s3Response.ContentRange;
        }

        return {body: s3Response.Body, status, headers};
    }
}


export const storage = new Storage();
