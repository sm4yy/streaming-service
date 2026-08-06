import {S3Client} from '@aws-sdk/client-s3'
import {Upload} from '@aws-sdk/lib-storage'

import {ENV} from '../../constants/env.js'


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
        })
    }

    private client: S3Client;

    public async upload(stream: ReadableStream, filename: string): Promise<void> {
        try {
            const command = new Upload({
                client: this.client,
                params: {
                    Bucket: ENV.MINIO_BUCKET_NAME,
                    Key: filename,
                    Body: stream,
                },
                // Размер одного чанка 5Мб для всех, кроме последнего
                partSize: 5 * 1024 * 1024,
                // Кол-во одновременных потоков загрузки
                queueSize: 4,
            });
            await command.done();
            console.log('Файл отправлен успешно');
        } catch (e) {
            console.error('[S3]: Ошибка отправки файла:', e);
        }
    }
}


export const storage = new Storage();