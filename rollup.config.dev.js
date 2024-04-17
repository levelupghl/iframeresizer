import serve from "rollup-plugin-serve"
import esbuild from "rollup-plugin-esbuild"
import replace from "@rollup/plugin-replace"
import { readFileSync } from "node:fs"

const DEV_DIR = ".dev"
const esBuildConfig = {
  target: "es6",
}

const serveConfig = {
  open: process.env.OPENPAGE === "true",
  openPage: "/src/index.html",
  verbose: true,
  host: "localhost",
  port: 1236,
  https: {
    key: readFileSync(".certs/private.pem"),
    cert: readFileSync(".certs/primary.crt"),
  },
}



export default [
  {
    input: "src/js/iframeResizer.ts",
    plugins: [
      replace({
        preventAssignment: false,
        __theme_version__: `v${process.env.npm_package_version}`,
        __theme_name__: `[LOCALHOST DEV] Level Up iFrame Resizer`,
        __theme_website__: "https://levelupthemes.com",
      }),
      esbuild(esBuildConfig),
      serve(serveConfig),
    ],
    watch: {
      include: "./src/js/**",
    },
    output: [
      {
        dir: `${DEV_DIR}/js`,
        format: "iife",
        sourcemap: true,
      },
    ],
  },
]
