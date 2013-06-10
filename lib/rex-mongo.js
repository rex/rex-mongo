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
  , fs = require('fs')
  , path = require('path')
  , optimist = require('optimist')
  , argv = require('optimist')
      .alias('c','count')
      .alias('l','list')
      .alias('d','database')
      .alias('s','snapshot')
      .alias('r','restore')
      .argv
  , commands = {
    'list' : 'mongo {{dbname}} --quiet --eval "printjson(db.getCollectionNames())"',
    'count' : 'mongo {{dbname}} --quiet --eval "printjson(db.getCollectionNames().forEach(function(coll){printjson(coll+\"-\"+db[coll].count())}))"',
    'drop' : 'mongo {{dbname}} --eval "db.getCollectionNames().forEach( function(coll) { if(coll!=\"system.indexes\") { db[coll].drop(); db[coll].dropIndexes()}})"',
    'snapshot' : '',
    'restore' : ''
  }
  , dbs
  , colls
  , list
  , count
  , drop
  , snapshot
  , restore

exports.list = list = function(db, callback) {
  if(typeof db != 'function') {
    exec(commands.list.replace('{{dbname}}', db), callback ) 
   /*      
    function(stderr, stdout) {
      if(stderr) throw err
        cli("Mongo collections: " + stdout)
    })
    */
  } else {
    cli("running list!alskfhklashflkasf")
    exec('mongo --eval --nodb --quiet "printjson(db.adminCommand(\'listDatabases\'))"', callback )
        
    /*
    function(stderr, stdout) {
      cli("Mongo database listing: " + stdout, stderr)
    })
    */
  }
}


exports.count = count = function(callback) {
  //
}

exports.drop = drop = function(callback) {
  //
}

exports.snapshot = snapshot = function(callback) {
  //
}

exports.restore = restore = function(callback) {
  //
}

exports.init = function() {
  
  if(argv.list) {
    return list()
  }

}
