/*###############################################################################
#
#             _ __ _____  __   Welcome to the      _
#            | '__/ _ \ \/ / ___ __ ___ ____  _ __| |_ ___ _ __
#            | | |  __/>  < / -_) _/ _ (_-< || (_-<  _/ -_) '  \
#            |_|  \___/_/\_\\___\__\___/__/\_, /__/\__\___|_|_|_|
#                                          |__/
#
# The rex-* ecosystem is a collection of like-minded modules for Node.js/NPM
#   that allow developers to reduce their time spent developing by a wide margin.
#
#   Header File Version: 0.0.1, 06/08/2013
#
# The MIT License (MIT)
#
# Copyright (c) 2013 Pierce Moore <me@prex.io>
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
#
#######*/
var cli = require('rex-shell')
  , exec = require('rex-exec')
  , utils = require('rex-utils')
  , _ = require('rex-utils')._
  , commands = _.rex_commands().mongo
  , package = require('../package')

cli.config.appName(package.name)

exports.version = package.version
exports.package = package

exports.list = list = function(db, callback) {
  if(typeof db == 'string') {
    exec(commands.list.replace('{{dbname}}', db), function(stderr, stdout) {
      if(stderr) throw err
      var colls = JSON.parse(stdout)
      // @todo: Bring in the async library and handle this right
      cli( colls.length + " collections found in the " + db + " database:" )
      colls.forEach(function(collection) {
        var cmd = 'mongo '+ db +' --quiet --eval "printjson(db.' + collection + '.count())"' 
        exec(cmd, function(stderr, stdout) {
          // @todo: Write a string width/padding mixin for rex-utils that will be used to uniformly space logging
          var count = stdout.trim()
          if(count == "0")
            console.log( cli.$$.b(" > "+collection+ cli.$$.g(" ( Empty )") ) )
          else
            console.log( cli.$$.b(" > "+collection+ cli.$$.g(" ( "+ cli.$$.r(stdout.trim() ) ) + cli.$$.g(" documents )") ) )
        })
      })
    })
  } else {
    exec('mongo --quiet --eval "printjson(db.adminCommand(\'listDatabases\'))"', function(stderr, stdout) {
      var dbs = JSON.parse(stdout).databases
      cli(dbs.length + " databases found:")
      var totalSize = parseFloat( parseInt( JSON.parse(stdout).totalSize ) / 1024 / 1024 ) + " MiB"
      console.log( cli.$$.b(">>> Total Size: "+ cli.$$.g("[") + cli.$$.r(totalSize) + cli.$$.g("]") ) ) 
      dbs.forEach(function(db) {
        if(db.empty == false)
          var size = parseFloat( parseInt(db.sizeOnDisk) / 1024 / 1024 ) + " MiB"
        else
          var size = "Empty"
        console.log( cli.$$.b(" > "+ db.name + cli.$$.g(" ( ") + cli.$$.r(size) + cli.$$.g(" )") ) ) 
      })
    })
  }
}


exports.count = count = function(db, callback) {
  if(!db) {
    cli.error("No DB selected to count! Pick one of these: ")
    list()
  } else {
    list(db)
  }
}

exports.drop = drop = function(db, callback) {
  if(typeof db == 'string') {
    var cmd = commands.drop.replace('{{dbname}}', db)
    exec(cmd, function(stderr, stdout) {
      if(stderr) throw stderr
      cli.success("Database dropped: "+ cli.$$.g(db))
    })
  } else {
    cli.error("No DB selected to drop! Pick one of these: ")
    list()
  }
}

exports.snapshot = snapshot = function(callback) {
  //
}

exports.restore = restore = function(callback) {
  //
}

exports.init = function() {
  var operation = process.argv[2] || 'help'
  var db = process.argv[3] || null

  switch(operation) {
    case 'list':
      list(db)
      break;
    case 'count':
      count(db)
      break;
    case 'drop':
      drop(db)
      break;
    case 'version':
      _.displayVersion(package, {
        "rex-exec" : exec.version,
        "rex-utils" : utils.version,
        "rex-shell" : cli.version
      })
      break;
    case 'help':
    default:
      _.showHelp(package)   
  }
}
