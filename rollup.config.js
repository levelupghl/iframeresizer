import esbuild from "rollup-plugin-esbuild"
import replace from "@rollup/plugin-replace"
import { readFileSync } from "node:fs"

const esBuildConfig = {
  target: "es6",
}

const BANNER = readFileSync("./src/snippets/banner.css", { encoding: "utf8" })

const getPlugins = (esOpts = {}) => {
  return [
    replace({
      preventAssignment: false,
      __theme_version__: `v${process.env.npm_package_version}`,
      __theme_name__: "Level Up iFrame Resizer",
      __theme_website__: "https://levelupthemes.com",
    }),
    esbuild({ ...esBuildConfig, ...esOpts }),
  ]
}

export default [
  {
    input: "src/js/iframeResizer.ts",
    plugins: getPlugins(),
    output: [
      {
        dir: "dist/js",
        format: "iife",
        sourcemap: true,
        banner: BANNER,
      },
    ],
  },
  {
    input: "src/js/iframeResizer.ts",
    // Minify
    plugins: getPlugins({ minify: true }),
    output: [
      {
        file: "dist/js/iframeResizer.min.js",
        format: "iife",
        sourcemap: true,
        banner: BANNER,
      },
    ],
  },
]
