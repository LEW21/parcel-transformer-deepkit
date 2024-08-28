// Forked from https://github.com/parcel-bundler/parcel/blob/v2/packages/transformers/typescript-tsc/src/TSCTransformer.js

import { Transformer } from '@parcel/plugin'
// @ts-ignore
import { loadTSConfig } from '@parcel/ts-utils'
import typescript from 'typescript'
import SourceMap from '@parcel/source-map'
import { transformer, declarationTransformer } from '@deepkit/type-compiler'

export default new Transformer<typescript.CompilerOptions>({
	loadConfig({config, options}) {
		return loadTSConfig(config, options)
	},

	async transform({asset, config, options}) {
		let [code, originalMap] = await Promise.all([
			asset.getCode(),
			asset.getMap(),
		])

		let transpiled = typescript.transpileModule(
			code,
			{
				compilerOptions: {
					// React is the default. Users can override this by supplying their own tsconfig,
					// which many TypeScript users will already have for typechecking, etc.
					jsx: typescript.JsxEmit.React,
					...config,
					// Always emit output
					noEmit: false,
					// Don't compile ES `import`s -- scope hoisting prefers them and they will
					// otherwise compiled to CJS via babel in the js transformer
					module: typescript.ModuleKind.ESNext,
					sourceMap: Boolean(asset.env.sourceMap),
					mapRoot: options.projectRoot,
				},
				fileName: asset.filePath, // Should be relativePath?
				transformers: {
					before: [transformer],
					afterDeclarations: [declarationTransformer],
				}
			},
		)

		let {outputText, sourceMapText} = transpiled

		if (sourceMapText != null) {
			outputText = outputText.substring(
				0,
				outputText.lastIndexOf('//# sourceMappingURL'),
			)

			let map = new SourceMap(options.projectRoot)
			map.addVLQMap(JSON.parse(sourceMapText))
			if (originalMap) {
				// @ts-ignore Fixed in https://github.com/parcel-bundler/source-map/commit/b290dae1bea9bf249a0691e06014e09f974f70dd
				map.extends(originalMap)
			}
			asset.setMap(map)
		}

		asset.type = 'js'
		asset.setCode(outputText)

		return [asset]
	},
})
