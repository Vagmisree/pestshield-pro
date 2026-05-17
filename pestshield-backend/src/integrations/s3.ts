import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import { logger } from '../utils/logger.js';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function uploadToS3(
  bufferOrFile: Buffer | Express.Multer.File,
  key: string,
  _contentType?: string
): Promise<string> {
  const dir = path.join(UPLOAD_DIR, path.dirname(key));
  ensureDir(dir);
  const dest = path.join(UPLOAD_DIR, key);

  if (Buffer.isBuffer(bufferOrFile)) {
    fs.writeFileSync(dest, bufferOrFile);
  } else {
    fs.copyFileSync(bufferOrFile.path, dest);
  }

  logger.info(`[LocalStorage] Saved: ${dest}`);
  return `/uploads/${key}`;
}

export function buildS3Key(folder: string, filename: string): string {
  const ext = path.extname(filename);
  return `${folder}/${nanoid(12)}${ext}`;
}

export async function getSignedS3Url(key: string, _expiresIn?: number): Promise<string> {
  // Strip leading /uploads/ if present
  const cleanKey = key.startsWith('/uploads/') ? key.slice(9) : key;
  return `/uploads/${cleanKey}`;
}

export async function deleteFromS3(key: string): Promise<boolean> {
  try {
    const filePath = path.join(UPLOAD_DIR, key);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return true;
  } catch {
    return false;
  }
}
