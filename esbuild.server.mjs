import * as esbuild from 'esbuild';

const isDevelopment = process.argv.includes('--development');

const options = {
    entryPoints: ['src/server/index.ts'],
    bundle: true,
    minify: false,
    sourcemap: true,
    format: 'esm',
    platform: 'node',
    target: 'esnext',
    tsconfig: 'tsconfig.server.json',
    outdir: 'build/private/',
    outbase: 'src/server',
    mainFields: ['module', 'main'],
    metafile: true,
    treeShaking: true,
    banner: {
        js: `
const require = (await import("node:module")).createRequire(import.meta.url);
const __filename = (await import("node:url")).fileURLToPath(import.meta.url);
const __dirname = (await import("node:path")).dirname(__filename);
        `
    }
}

if (isDevelopment) {
    const context = await esbuild.context({ ...options, logLevel: 'info' });
    console.log('ESBuild :: Watching for Server changes.');
    await context.watch();
} else {
    await esbuild.build(options);
}