const ejs = require('ejs')
const glob = require('glob')

const TEMPLATES_PATH  = 'src/templates/**/*.ejs'
const PIECES_PATH     = 'src/pieces/**/*.js'

module.exports = function(grunt) {

  grunt.registerTask('build',
    'render each ejs template and build website in docs',
    function() {
      let x = glob.sync(TEMPLATES_PATH)
  })

}