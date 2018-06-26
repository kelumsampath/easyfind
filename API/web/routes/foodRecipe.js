const express = require('express');
const cloudinary = require('cloudinary');

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
    const img =cloudinary.image("piuipwj6i5vuzejf279j.jpg", { alt: "Sample Image" });
    res.send(img);

  });



  module.exports = router;