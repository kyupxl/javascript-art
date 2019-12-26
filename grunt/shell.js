const child_process = require('child_process')

function exec(command, options={}) {
  let output = child_process.execSync(command)
  let outputStr = output.toString()
  if (options.print) {
    console.log(`$ ${command}`)
    if (outputStr.length > 0) console.log(outputStr)
  }
  return output.toString()
}
module.exports.exec = exec

