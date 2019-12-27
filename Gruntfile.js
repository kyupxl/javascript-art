const ejs = require('ejs')
const glob = require('glob')
const fs = require('fs')
const browserify = require('browserify')()

// Grunt helpers
const shell = require('./grunt/shell').exec
const version = require('./grunt/version')('./package.json')

// Build inputs
const PAGES_JS = glob.sync('src/pages/**/*.js')
const LIB_JS = glob.sync('src/lib/**/*.js')
const PAGE_TEMPLATE_EJS = 'src/templates/page.html.ejs'
const INDEX_EJS = 'src/index.html.ejs'
const INDEX_JS = 'src/index.js'

// Build outputs
const OUTPUT_DIR = 'docs'

function printInputs() {
  console.log(
    'Build Inputs:', '\n',
    INDEX_EJS, '\n',
    INDEX_JS, '\n',
    PAGE_TEMPLATE_EJS, '\n',
    'pages:', PAGES_JS, '\n',
    'lib:', LIB_JS
  )
}

function browserifyJsP(inputJs, outputJs) {
  return new Promise((resolve, reject) => {
    browserify.reset()
    browserify.add(inputJs)
    browserify.bundle((err, buf) => {
      if (err) reject(err)
      fs.writeFile(outputJs, buf, (err) => {
        if (err) reject(err)
        console.log('Browserified JS:', inputJs, '->', outputJs)
        resolve(true)
      })
    })
  })
}

function ejsRenderP(inputEjs, outputHtml, data={}) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(inputEjs, data, {}, function(err, str){
      if (err) reject(err)
      fs.writeFile(outputHtml, str, (err) => {
        if (err) reject(err)
        console.log('Rendered EJS:', inputEjs, '->', outputHtml)
        resolve(true)
      })
    })
  })
}

function cleanOutputDir() {
  shell(`mkdir -p ${OUTPUT_DIR}`, { print: true })
  shell(`rm -rf ${OUTPUT_DIR}/*`, { print: true })
  console.log('Cleaned:', OUTPUT_DIR)
}

function prettyVersionString() {
  return version.getPackageName() + ' v' + version.getString()
}

module.exports = function(grunt) {

  grunt.registerTask('build', 'render each ejs template and build website in docs',
    async function() {
      const done = this.async()
      version.incrementRevision()
      console.log(prettyVersionString())
      printInputs()

      // Clean up previous build
      console.log('\nCLEANUP')
      cleanOutputDir()

      // Generate index.js and index.html
      console.log('\nGENERATE INDEX PAGES')
      await ejsRenderP(INDEX_EJS, `${OUTPUT_DIR}/index.html`)
      await browserifyJsP(INDEX_JS, `${OUTPUT_DIR}/index.js`)

      // TODO: create src/assets and copy to docs/assets for static assets like images

      // Generate a page for each js file in pages
      console.log('\nGENERATE PAGES')
      shell(`mkdir -p ${OUTPUT_DIR}/pages`, { print: true })
      await Promise.all(PAGES_JS.map((pageJs) => {
        return new Promise(async (resolve) => {
          let pageFileName = pageJs.split('/').pop()
          let pageName = pageFileName.split('.')[0]
          let pageData = {
            pageFileName: pageFileName,
            pageName: pageName,
          }
          await ejsRenderP(PAGE_TEMPLATE_EJS, `${OUTPUT_DIR}/pages/${pageName}.html`, pageData)
          await browserifyJsP(pageJs, `${OUTPUT_DIR}/pages/${pageFileName}`)
          console.log(`Generated Page: ${pageName}`)
          resolve(true)
        })
      }))

      done()
  })

  grunt.registerTask('masterPreCommit', 'trigger this before commit to master', function() {
    version.incrementMinorVersion()
    console.log(prettyVersionString())
  })

}