import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Helper function to get the directory name in a cross-platform compatible way
 * that works with both import.meta.dirname (newer Node.js) and __dirname (older Node.js)
 * 
 * @param importMetaUrl import.meta.url from ESM or __filename from CJS
 * @returns The directory path
 */
export function getDirname(importMetaUrl: string): string {
  try {
    // For ESM modules using import.meta.url
    const filename = fileURLToPath(importMetaUrl);
    return path.dirname(filename);
  } catch (error) {
    // Fallback for CommonJS modules using __filename
    return path.dirname(importMetaUrl);
  }
}

/**
 * Use this as a replacement for import.meta.dirname in vite configuration files
 * without modifying the original code
 */
export function getProjectRoot(): string {
  // For project root (at the repo level, not at client or server level)
  return process.cwd();
}