const ejs = require('ejs')
const glob = require('glob')
const template_handler = require('./src/template_handler')
const shell = require('./grunt/shell.js').exec

const TEMPLATES_PATH  = 'src/templates/**/*.ejs'
const PIECES_PATH     = 'src/pieces/**/*.js'

module.exports = function(grunt) {

  grunt.registerTask('build',
    'render each ejs template and build website in docs',
    function() {
      let x = glob.sync(TEMPLATES_PATH)
      shell('ls')
  })

}