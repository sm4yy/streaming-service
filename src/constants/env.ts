import {cleanEnv, port, str} from 'envalid'

export const ENV = cleanEnv(Object.assign({}, process.env), {
    HOST: str(),
    PORT: port(),
})
