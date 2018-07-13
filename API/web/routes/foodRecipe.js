const express = require('express');
const cloudinary = require('cloudinary');
const multer  = require('multer')
const storage = multer.diskStorage({ 
  destination: function(req,file,callback){
    callback(null,'./uploads/');
  },
  filename: function(req,file,callback){
    callback(null,file.originalname);
  }
});
const upload = multer({ storage: storage })

const router = express.Router();

router.get('/',(req,res)=>{
    res.send("Hello foodrecipe!");
  });

 
  router.get('/a',(req,res)=>{
  cloudinary.uploader.upload("http://weknowyourdreams.com/images/nature/nature-12.jpg",function(result) { 
    res.send(result);
});
  });
  
  router.get('/b',(req,res)=>{
    const img =cloudinary.image("ng2otifhmygbs8oquaxj", { alt: "Sample Image" });
    res.send(img);

  });

  router.post('/c',upload.single('profpic'),(req,res)=>{
    cloudinary.uploader.upload(req.file.path,function(result) { 
    console.log(result);
    console.log(req.body.fullname);
    });
  });

  router.post('/addrecipe',(req,res)=>{
    console.log(req.body);
    res.json({state:true,msg:"data comed!"});

  });


  module.exports = router;