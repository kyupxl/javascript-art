const ejs = require('ejs')
const glob = require('glob')
const fs = require('fs')
const browserify = require('browserify')()
const docs_builder = require('./src/docs_builder')
const shell = require('./grunt/shell').exec

// Build inputs
const INDEX_EJS = glob.sync('src/index*.ejs')
const INDEX_JS = glob.sync('src/index*.js')
const TEMPLATES_EJS = glob.sync('src/templates/*.ejs')
const PAGES_JS = glob.sync('src/pages/**/*.js')
const LIB_JS = glob.sync('src/lib/**/*.js')

// Build outputs
const OUTPUT_DIR = 'docs'

function printInputs() {
  console.log(
    'Build Inputs:', '\n',
    'index_ejs:', INDEX_EJS, '\n',
    'index_js:', INDEX_JS, '\n',
    'templates_ejs:', TEMPLATES_EJS, '\n',
    'pages_js:', PAGES_JS, '\n',
    'lib_js:', LIB_JS
  )
}

function browserifyJsP(inputJs, outputJs) {
  return new Promise((resolve, reject) => {
    browserify.add(inputJs)
    browserify.bundle((err, buf) => {
      if (err) reject(err)
      fs.writeFile(outputJs, buf, (err) => {
        if (err) reject(err)
        console.log('Browserified JS:', inputJs, '->', outputJs)
      })
    })
  })
}

function ejsRenderP(inputEjs, outputHtml, data={}) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(inputEjs, {}, {}, function(err, str){
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
  shell(`mkdir -p ${OUTPUT_DIR}`)
  shell(`rm -rf ${OUTPUT_DIR}/*`)
  console.log('Cleaned:', OUTPUT_DIR)
}

module.exports = function(grunt) {

  grunt.registerTask('build', 'render each ejs template and build website in docs',
    async function() {
      const done = this.async()
      printInputs()
      cleanOutputDir()
      await ejsRenderP(INDEX_EJS[0], `${OUTPUT_DIR}/index.html`)
      await browserifyJsP(INDEX_JS[0], `${OUTPUT_DIR}/index.js`)
      done()
  })

}