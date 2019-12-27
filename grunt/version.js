const fs = require('fs')

let versionString = undefined

function readVersion(packageJsonPath) {

  let packageStr = fs.readFileSync(packageJsonPath).toString()
  let packageObj = JSON.parse(packageStr)
  versionString = packageObj.version.toString()
  let versionNums = versionString.split('.').map((verSubStr) => {
    return parseInt(verSubStr)
  })

  return {
    major: versionNums[0],
    minor: versionNums[1],
    revision: versionNums[2]
  }
}

function writeVersion(version, packageJsonPath) {
  let packageStr = fs.readFileSync(packageJsonPath).toString()
  let packageObj = JSON.parse(packageStr)
  packageObj.version = `${version.major}.${version.minor}.${version.revision}`
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageObj, undefined, 2))
}

module.exports = function(PACKAGE_JSON_PATH) {
  return {

    getPackageName() {
      let packageStr = fs.readFileSync(PACKAGE_JSON_PATH).toString()
      let packageObj = JSON.parse(packageStr)
      return packageObj.name.toString()
    },

    getString() {
      let ver = readVersion(PACKAGE_JSON_PATH)
      return `${ver.major}.${ver.minor}.${ver.revision}`
    },

    incrementRevision() {
      let currVersion = readVersion(PACKAGE_JSON_PATH)
      currVersion.revision += 1
      writeVersion(currVersion, PACKAGE_JSON_PATH)
    },

    incrementMinorVersion() {
      let currVersion = readVersion(PACKAGE_JSON_PATH)
      currVersion.minor += 1
      writeVersion(currVersion, PACKAGE_JSON_PATH)
    },

    incrementMajorVersion() {
      let currVersion = readVersion(PACKAGE_JSON_PATH)
      currVersion.major += 1
      writeVersion(currVersion, PACKAGE_JSON_PATH)
    },

  }
}
