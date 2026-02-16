/**
 * Helper script to identify API routes that need error handling updates
 * Run this to audit which routes still need updating
 */

import fs from 'fs';
import path from 'path';

const API_DIR = path.join(process.cwd(), 'app/api');

function getAllTsFiles(dir: string): string[] {
    const files: string[] = [];

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
            files.push(...getAllTsFiles(fullPath));
        } else if (item.isFile() && item.name.endsWith('.ts')) {
            files.push(fullPath);
        }
    }

    return files;
}

function needsErrorHandling(filePath: string): boolean {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Check if already has error handling
    if (content.includes('from "@/lib/errors"') || content.includes('from \'@/lib/errors\'')) {
        return false;
    }

    // Check if has catch blocks
    if (content.includes('catch (error)') || content.includes('catch (e)')) {
        return true;
    }

    return false;
}

console.log('🔍 Scanning API routes for error handling updates needed...\n');

const allFiles = getAllTsFiles(API_DIR);
const needsUpdate = allFiles.filter(needsErrorHandling);

console.log(`📊 Summary:`);
console.log(`   Total API routes: ${allFiles.length}`);
console.log(`   Already updated: ${allFiles.length - needsUpdate.length}`);
console.log(`   Need updates: ${needsUpdate.length}\n`);

if (needsUpdate.length > 0) {
    console.log('📝 Routes that need error handling updates:\n');
    needsUpdate.forEach((file, index) => {
        const relativePath = path.relative(API_DIR, file);
        console.log(`   ${index + 1}. ${relativePath}`);
    });
}

console.log('\n✅ Scan complete!');
