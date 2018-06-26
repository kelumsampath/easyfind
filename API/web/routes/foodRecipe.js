const express = require('express');
const cloudinary = require('cloudinary');

const router = express.Router();

router.get('/',(req,res)=>{
    res.send("Hello foodrecipe!");
  });

  cloudinary.config({ 
    cloud_name: 'defah2zln', 
    api_key: '227588295695171', 
    api_secret: 'H3qw5KLfuUeLAi6dYvhqXFKu3I8' 
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