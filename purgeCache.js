import { readFile } from "node:fs/promises"
import chalk from "chalk"

const FILE_OPTS = { encoding: "utf8" }

async function getPackageVersion() {
  if (process.env.npm_package_version) {
    return `v${process.env.npm_package_version}`
  }
  const data = await readFile("./package.json", FILE_OPTS)
  const version = JSON.parse(data).version
  return `v${version}`
}

async function showPurgeMessage() {
  const latest = await getPackageVersion()
  const version = latest.substr(0, 2)

  const log = (msg) => console.log(chalk.yellow(msg))

  console.log(
    chalk.green(
      "Remember to purge cache on jsDelivr: https://www.jsdelivr.com/tools/purge"
    )
  )
  log(
    `https://cdn.jsdelivr.net/gh/leveluptools/iframeresizer@${version}/dist/js/iframeResizer.js`
  )
  log(
    `https://cdn.jsdelivr.net/gh/leveluptools/iframeresizer@${version}/dist/js/iframeResizer.min.js`
  )
}

showPurgeMessage()
