const assert = require('assert');
const fs = require('fs');
const mongodb = require('mongodb');


const uri = 'mongodb://localhost:27017';
const dbName = 'test';

mongodb.MongoClient.connect(uri, function(error, client) {
  assert.ifError(error);

  const db = client.db(dbName);

  var bucket = new mongodb.GridFSBucket(db);

    // fs.createReadStream('./sample.png').
    //     pipe(bucket.openUploadStream('sample.png')).
    //     on('error', function(error) {
    //     assert.ifError(error);
    //     }).
    //     on('finish', function() {
    //     console.log('done!');
    //     process.exit(0);
    // });

    bucket.openDownloadStreamByName('sample.png').
    pipe(fs.createWriteStream('./sample2.png')).
    on('error', function(error) {
      assert.ifError(error);
    }).
    on('finish', function() {
      console.log('done!');
      process.exit(0);
    });

});