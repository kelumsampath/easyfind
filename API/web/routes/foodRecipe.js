const express = require('express');
const cloudinary = require('cloudinary');
const multer  = require('multer');
const token = require('../../config/token');
const recipemodels = require('../../datamodels/foodrecipe');
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

  router.post('/addrecipe',upload.single('foodimg'),token.verifyfiletoken,(req,res)=>{
   // console.log(req.body.recipename);
    //console.log(req.user.username);
    cloudinary.uploader.upload(req.file.path,function(result) { 
    const regRecipe = new recipemodels({
      username:req.user.username,
      recipename:req.body.recipename,
      ingredients:req.body.ingredients,
      directions:req.body.directions,
      preptime:req.body.preptime,
      cooktime:req.body.cooktime,
      readytime:req.body.readytime,
      serves:req.body.serves,
      notes:req.body.notes,
      rate:req.body.rate,
      catagory:req.body.catagory,
      description:req.body.description,
      imageUrl:result.public_id
    });
    recipemodels.dbSave(regRecipe,(err,user)=>{
      if(err){
        cloudinary.uploader.destroy(result.public_id, function(result) {
          if (err.name === 'MongoError' && err.code === 11000) {
             // console.log('There was a duplicate key error');
             res.json({state:false,msg:"Your FOOD RECIPE already in store!"}) 
          }else{
             res.json({state:false,msg:"Something Went wrong!"})
          }
        })
      }else{
        res.json({state:true,msg:"You have been Recipe Stored!"})
      }
    })
   // res.json({state:true,msg:"data comed!"});
  })
  });

  router.post('/getallrecipe',(req,res)=>{
   
    recipemodels.getAllrecipe("csc",(err,recipe)=>{
      if(err) {
        //throw err;
        console.log("Allrecipe data retrive error");
        res.json({state:false});
       
      }
      else{
        res.json({state:true,recipe:recipe});
      }
    })
    
  });


  module.exports = router;