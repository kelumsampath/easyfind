const express = require('express');
const cloudinary = require('cloudinary');
const multer  = require('multer');
const token = require('../../config/token');
const date = require('date-and-time');
const recipemodels = require('../../datamodels/foodrecipe');
const likerecipemodel= require('../../datamodels/likerecipe');
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
    let now = new Date();
    cloudinary.uploader.upload(req.file.path,function(result) { 
      const img =cloudinary.image(result.public_id, { alt: "Sample Image" });
      const link = img.split("'");
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
      imageUrl:link[1],
      date:date.format(now, 'YYYY/MM/DD HH:mm:ss')
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

  router.post('/getmostliked',(req,res)=>{
   
    recipemodels.getmostliked("csc",(err,recipe)=>{
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


  
  router.post('/getviewrecipe',(req,res)=>{
   //console.log(req.body.recipename);
   //res.json({state:false});
    recipemodels.getViewrecipe(req.body.recipename,(err,recipe)=>{
      if(err) {
        //throw err;
        console.log("Allrecipe data retrive error");
        res.json({state:false});
       
      }
      else{
       // console.log(recipe[0]);
        res.json({state:true,recipe:recipe[0]});
      }
    })
    
  });

  router.post('/likerecipe',token.verifytoken,(req,res)=>{
    //console.log(req.body.recipename);
    //console.log(req.user.username);
    const likeData = new likerecipemodel({
      recipename:req.body.recipename,
      username:req.user.username
    });
    likerecipemodel.dbSave(likeData,(err,user)=>{
      if(err){
          if (err.name === 'MongoError' && err.code === 11000) {
             // console.log('There was a duplicate key error');
             res.json({state:false,msg:"You already liked!"}) 
          }else{
             res.json({state:false,msg:"Something Went wrong!"})
          }
        
      }else{
        
        likerecipemodel.likecount(likeData,(err,count)=>{
          if(err){
            console.log(err);
          }else{
            
            likedetails ={
              "recipename":req.body.recipename,
              "count":count
            }
            recipemodels.updatelikes(likedetails,(err,callback)=>{
              if(err){
                console.log("like not counted!");
                res.json({state:false});
              }else{
                //console.log(callback);
                res.json({state:true,likecount:count})
              }
            })
          }
        })
        //console.log(likedetails.count);
       
      }
    })
  });

  router.post('/checklike',token.verifytoken2,(req,res)=>{
   // console.log(req.body.recipename);
    //console.log(req.user.username);
    const likeData = new likerecipemodel({
      recipename:req.body.recipename,
      username:req.user.username
    });
    likerecipemodel.Isliked(likeData,(err,user)=>{
      if(err){
          if (err.name === 'MongoError' && err.code === 11000) {
             // console.log('There was a duplicate key error');
             res.json({state:false,msg:"You already liked!"}) 
          }else{
             res.json({state:false,msg:"Something Went wrong!"})
          }
        
      }else{
        if(user[0]!=null){
        //console.log(user[0].username);
        res.json({state:true,msg:"liked!"});
        }else{
         // console.log("undi");
         res.json({state:false,msg:"not liked!"});
        }  
      }
    })
   
  });

  router.post('/unlikerecipe',token.verifytoken,(req,res)=>{
    //console.log(req.body.recipename);
    //console.log(req.user.username);
    const likeData = new likerecipemodel({
      recipename:req.body.recipename,
      username:req.user.username
    });
    likerecipemodel.deleteLikeData(likeData,(err,user)=>{
      if(err){
          if (err.name === 'MongoError' && err.code === 11000) {
             // console.log('There was a duplicate key error');
             res.json({state:false,msg:"You already noliked!"}) 
          }else{
             res.json({state:false,msg:"Something Went wrong!"})
          }
        
      }else{
       // console.log(user);
       likerecipemodel.likecount(likeData,(err,count)=>{
        if(err){
          console.log(err);
        }else{
          likedetails ={
            "recipename":req.body.recipename,
            "count":count
          }
          recipemodels.updatelikes(likedetails,(err,callback)=>{
            if(err){
                console.log("like not counted!");
                res.json({state:false});
              }else{
                //console.log(callback);
                res.json({state:true,likecount:count})
              }
          })
        }
      })
       // res.json({state:true,msg:"unliked!"})
      }
    })
  });

  module.exports = router;