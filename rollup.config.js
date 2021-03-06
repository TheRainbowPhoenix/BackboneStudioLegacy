import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
    input: 'src/main.ts',
    output: {
        format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js',
        sourcemap: !production,
    },
    plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),
        /**
         * Recommended (but not required):
         *
         * alias allow us to use release builds in production
         * minified builds in PixiJS exclude verbose logs
         * and other non-critical debugging information.
         */
        ...process.env.BUILD === 'production' ? [alias({
            entries: [{
                find: /^(@pixi\/([^\/]+))$/,
                replacement: '$1/dist/esm/$2.min.js',
            }, {
                find: 'pixi.js',
                replacement: 'pixi.js/dist/esm/pixi.min.js',
            }]
        })] : [],
        /**
         * Required!
         * 
         * `preferBuiltins` is required to not confuse Rollup with
         * the 'url' dependence that is used by PixiJS utils
         */
        resolve({
            preferBuiltins: false,
			browser: true,
			dedupe: ['svelte']
        }),
        /**
         * Required!
         *
         * PixiJS third-party dependencies use CommonJS exports
         * and do not have modules bundles available 
         */
        commonjs(),
        typescript({
			sourceMap: !production,
			inlineSources: !production
        }),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
    ],
	watch: {
		clearScreen: false
	}
};