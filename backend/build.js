const esbuild = require('esbuild');
const { glob } = require('glob');
const path = require('path');

async function build() {
  // Get all TypeScript files
  const entryPoints = await glob('src/**/*.ts', { ignore: ['**/*.test.ts', '**/*.spec.ts'] });
  
  console.log(`Building ${entryPoints.length} files...`);
  
  await esbuild.build({
    entryPoints,
    outdir: 'dist',
    platform: 'node',
    target: 'node20',
    format: 'cjs',
    sourcemap: true,
    bundle: false,
    // Don't bundle, just transpile
    packages: 'external',
  });
  
  console.log('Build completed successfully!');
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
