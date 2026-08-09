import {cleanEnv, port, str} from 'envalid'

export const ENV = cleanEnv(Object.assign({}, process.env), {
    HOST: str(),
    PORT: port(),

    MINIO_ROOT_USER: str(),
    MINIO_ROOT_PASSWORD: str(),
    MINIO_ENDPOINT: str(),
    MINIO_BUCKET_NAME: str(),

    REDIS_CONNECTION_STRING: str(),
});
