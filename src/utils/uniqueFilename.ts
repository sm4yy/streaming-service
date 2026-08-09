import {v4 as uuidv4} from 'uuid';
import path from 'node:path'

export function createUniqueFilename(originalName: string): string {
    return `${uuidv4()}${path.extname(originalName)}`;
}
