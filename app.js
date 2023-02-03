const assert = require('assert');
const fs = require('fs');
const mongodb = require('mongodb');
const { default: mongoose } = require('mongoose');

// creation of the gridfs bucket
const uri = 'mongodb://localhost:27017';
const dbName = 'test';
mongoose.connect('mongodb://localhost:27017/test?retryWrites=true&w=majority').then((data)=>{
    console.log(`mongoDB connected succesfully on server ${data.connection.host}`);
})
const client = new mongoose.mongo.MongoClient(uri);


// The main controller of the file 

  const db = client.db(dbName);
  let bucket = new mongodb.GridFSBucket(db);
    //To upload the image to the bucket
const upload =async ()=>{
        fs.createReadStream('sample.png').
        pipe(bucket.openUploadStream('sample.png')).
        on('error', function(error) {
        assert.ifError(error);
        }).
        on('finish', function() {
        console.log('done!');
        process.exit(0);
    });
}

    // to retrieve the file by fethcing data from the db and then writing the file in FS 
    // as a temporary cache


const getFile = ()=>{
    bucket.openDownloadStreamByName('sample.png').
    pipe(fs.createWriteStream('./sample2.png')).
    on('error', function(error) {
      assert.ifError(error);
    }).on('finish', function() {
      process.exit(0);
    });
    let x = bucket.openDownloadStreamByName('sample.png').on('end' , ()=>{
        process.exit(0);
    })
    console.log(x);
}


upload()
getFile()


