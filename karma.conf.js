module.exports = function(config) {
	'use strict';
	config.set({
		frameworks: ['mocha', 'chai', 'chai-spies', 'esm'],
		plugins: [
			// load plugin
			require.resolve('@open-wc/karma-esm'),

			// fallback: resolve any karma- plugins
			'karma-*',
		],
		files: [
			{ pattern: 'src/**/*.test.js', type: 'module' }
		],
		client: {
			mocha: {
				// change Karma's debug.html to the mocha web reporter
				reporter: 'html'
			}
		},
		esm: {
			// if you are using 'bare module imports' you will need this option
			nodeResolve: true,
		}
	});
};
