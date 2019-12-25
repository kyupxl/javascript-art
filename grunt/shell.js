const child_process = require('child_process')

function exec(command, options={}) {
  let output = child_process.execSync(command)
  console.log(output.toString())
}
module.exports.exec = exec
