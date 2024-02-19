import * as esbuild from 'esbuild';
import { htmlPlugin } from '@craftamap/esbuild-plugin-html';

const isDevelopment = process.argv.includes('--development');

const options = {
    entryPoints: ['src/client/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: 'esm',
    target: ['chrome58', 'firefox57', 'safari11', 'edge18'],
    tsconfig: 'tsconfig.client.json',
    outdir: 'build/public/',
    outbase: 'src/client',
    metafile: true,
    treeShaking: true,
    plugins: [
        htmlPlugin({
            files: [
                {
                    entryPoints: [
                        'src/client/index.ts',
                    ],
                    filename: 'index.html',
                    htmlTemplate: 'src/client/index.html',
                    title: 'Game',
                    scriptLoading: 'module',
                }
            ]
        }),
    ]
}

if (isDevelopment) {
    const context = await esbuild.context({ ...options, logLevel: 'info' });
    console.log('ESBuild :: Watching for Client changes.');
    await context.watch();
} else {
    await esbuild.build(options);
}