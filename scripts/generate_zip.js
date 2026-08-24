/**
 * ControlFlow AI — Automated Project Archiver Script
 * Packages the entire production project into a clean, standalone ZIP file.
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.resolve(__dirname, '..');
const zipPath = path.join(outputDir, 'controlflow-ai.zip');

console.log(`\n======================================================`);
console.log(`📦 Packaging ControlFlow AI Full Project Source Code...`);
console.log(`📁 Source directory: ${projectRoot}`);
console.log(`🎁 Output ZIP: ${zipPath}`);
console.log(`======================================================\n`);

const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', {
  zlib: { level: 9 }, // Maximum compression
});

output.on('close', () => {
  const sizeMb = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`✅ ZIP package created successfully!`);
  console.log(`📊 Total Archive Size: ${sizeMb} MB (${archive.pointer()} bytes)`);
  console.log(`📂 Location: ${zipPath}\n`);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('Archive warning:', err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Append all files in project root, excluding transient directories
archive.glob('**/*', {
  cwd: projectRoot,
  ignore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.git/**',
    '**/.DS_Store',
    '**/*.log',
    'controlflow-ai.zip',
    'controlflow-ai-complete-source.zip',
  ],
  dot: true,
});

archive.finalize();
