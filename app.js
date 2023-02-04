const { rejects } = require('assert');
const assert = require('assert');
const fs = require('fs');
const mongodb = require('mongodb');
const { default: mongoose } = require('mongoose');
const { pipeline } = require('stream/promises');
const express=require('express'); 


const app = express();
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
const upload = async ()=>{
  await pipeline(      
      fs.createReadStream('sample.png'),
      bucket.openUploadStream('sample.png')
)}


// To retrieve file from database and write the contentes in FS as temporary cache
const get = async() =>{

        await pipeline(
          bucket.openDownloadStreamByName('sample.png'), 
          fs.createWriteStream('./sample2.png')
          .on('finish' , ()=>{
            // process.exit(0)
          })
        )

}


const main = async ()=>{
  await upload().catch(console.error);
  await get().catch(console.error);
}


main();

app.get('/' , (req , res)=>{
  res.json({
    hello : 'hello'
  })
})

app.listen(5000 , ()=>{
  console.log("server is good");
})
