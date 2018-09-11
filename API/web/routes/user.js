const express = require('express');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
const multer  = require('multer')

const router = express.Router();
const datamodelds = require('../../datamodels/user');
const tokenmodels = require('../../datamodels/token');
const recipemodels = require('../../datamodels/foodrecipe');
const likerecipemodel= require('../../datamodels/likerecipe');
const token = require('../../config/token');
const email=require('../../thirdparymodule/sendgrid');

const storage = multer.diskStorage({ 
  destination: function(req,file,callback){
    callback(null,'./uploads/');
  },
  filename: function(req,file,callback){
    callback(null,"ab.jpg");
  }
});
const upload = multer({ storage: storage })


router.get('/',(req,res)=>{
 res.send("HELLO FOOD MASTER")
});




router.post('/register',upload.single('profpic'),(req,res)=>{
  //console.log(req.body);
  cloudinary.uploader.upload(req.file.path,function(result) { 
    //console.log(result);
  const regUser = new datamodelds({
    fullname:req.body.fullname,
    username:req.body.username,
    email:req.body.email,
    phoneno:req.body.phoneno,
    password:req.body.password,
    profpic_cloud_id:result.public_id,
    usertype:"cook"
  });
  const userdata={
    email:regUser.email,
    username:regUser.username,
    password:regUser.password
  }
      datamodelds.dbSave(regUser,(err,user)=>{
                if(err){
                  cloudinary.uploader.destroy(result.public_id, function(result) {
                    if (err.name === 'MongoError' && err.code === 11000) {
                      // console.log('There was a duplicate key error');
                      res.json({state:false,msg:"Your username already used!"}) 
                    }else{
                      res.json({state:false,msg:"Something Went wrong!"})
                    }
                  })
                }else{
                  email.unamepasssend(userdata,(err,resp)=>{
                    if(err){
                      res.json({state:false,msg:"Server Error!!"})
                    }else{
                        res.json({state:true,msg:"Your password has been send to the email!"})
                      }
                    })
                }
              })  
      });
});

router.post('/login',(req,res)=>{
  //res.send("Hello login!");
  const username = req.body.username;
  const password = req.body.password;

  datamodelds.searchUser(username,function(err,user){
    if(err) throw err;

    if(user){
      //console.log(user);
      datamodelds.matchpassword(password,user.password,function(err,match){
        if(err) throw err;
        if(match){
          //console.log({user});
         // res.json({state:true,msg:"Username, password mached!"});
         const obj = { _id: user._id,
          fullname:user.fullname,
          username:user.username,
          email:user.email,
          phoneno:user.phoneno,
          password:user.password,
          __v: user.__v };
      const newtoken = jwt.sign(obj,token.secrete,(err,newtoken)=>{
        if(err) {throw err;}
        else{
          const newtoken2 = new tokenmodels({
            token: newtoken
          });
          
          tokenmodels.tokenSave(newtoken2,(err,saved)=>{
            if(err) res.json({state:false,msg:err}) ;
            else{
                res.json({
                state:true,
                token:"Bearer "+newtoken,
                user:{
                  id: user._id,
                  fullname:user.fullname,
                  username:user.username,
                  email:user.email,
                  phoneno:user.phoneno,
                }
              });
            }
            });
        }
      });
        }else{
          res.json({state:false,msg:"Wrong password!"});
        }
      })
      
    }else{
      res.json({state:false,msg:"No user found!"});
    }
  })

});


router.get('/profile',token.verifytoken,(req,res)=>{
 // var userdata = req.user;
  //console.log(userdata.username);
  datamodelds.getUserDetails(req.user.username,function(err,user){
    if(err) {//throw err;
    //console.log(user.email);
    res.json({state:false});
    }else{
    const img =cloudinary.image(user.profpic_cloud_id, { alt: "Sample Image" });
    const link = img.split("'");
    //console.log(link[1]);
    const loggeduser = { "_id": user._id,
      "fullname":user.fullname,
      "username":user.username,
      "email":user.email,
      "phoneno":user.phoneno,
      "password":user.password,
      "profpic_cloud_id":user.profpic_cloud_id,
      "prof_pic_link":link[1],
      "prof_pic_alt":link[3],
      "__v": user.__v };

    res.json({state:true,loggeduser:loggeduser});


    }
  });

});

router.get('/about',token.verifytoken,(req,res)=>{
  var userdata = req.user;
  res.send("I'm "+userdata.fullname+". my user name is "+userdata.username);
});

router.get('/logout',token.verifytoken,(req,res)=>{
    const token = req.token;
    //console.log(token);
    tokenmodels.revokeToken(token,(err,removed)=>{
      if(err) throw err;
      else if(removed){
        res.json({state:true,msg:"successfully loged out!"});
      }else{
        res.json({state:false,msg:"no token found to revoke!"});
      }
    })
  
});


router.post('/updateprofile',token.verifytoken,(req,res)=>{
 // console.log(req.body.fullname);
  //console.log(req.user);
  const updatedata={
    username:req.user.username,
    fullname:req.body.fullname,
    email:req.body.email,
    phoneno:req.body.phoneno
  }
 // console.log(updatedata);
  datamodelds.updateUser(updatedata,(err,rep)=>{
    if(err) 
    res.json({state:false,msg:"Data not updated"});
    else{
      res.json({state:true,msg:"Profile updated!"});
    }
  })
  

});


router.post('/profpicchange',upload.single('editprofpic'),token.verifyfiletoken,(req,res)=>{
 //console.log(req.user);
 //console.log("dsc");
 datamodelds.getUserDetails(req.user.username,(err,user)=>{
   if(err){
    res.json({state:false});
   }else{
     const oldpicid=user.profpic_cloud_id;
     
      cloudinary.uploader.upload(req.file.path,function(result) {
        const picupdatedata={
          username:req.user.username,
          profpic_cloud_id:result.public_id
        }
        datamodelds.piceditidsave(picupdatedata,(err,sucess)=>{
          if(err){
            res.json({state:false,msg:"server error!"}); 
          }else{
            cloudinary.uploader.destroy(oldpicid, function(result) {

            });
            res.json({state:true,msg:"Profile picture changed!"});
          }
        });
      }); 
   }
 })
 
});


router.post('/changepassword',token.verifytoken,(req,res)=>{
  var userdata = req.user;
  //console.log(req.body)
  datamodelds.changepassword({password:req.body,username:userdata.username},(err,call)=>{
   if(err){
    res.send({state:false,msg:"Server Error!"});
   }else if(call){
    res.send({state:true,msg:"password changed"});
   }else{
    res.send({state:false,msg:"Wrong password!"});
   }
  })
  
});


router.post('/isadmin',token.verifytoken,(req,res)=>{
  var userdata = req.user;
  
  datamodelds.searchUser(userdata.username,(err,user)=>{
    if(err){
      res.send({state:false,msg:"Server Error!"});
    }else{
      if(user.usertype=="admin"){
        res.send({state:true,msg:"Admin user!"});
      }else{
        res.send({state:false,msg:"not admin user!"});
      } 
    }
  })
  
});

router.post('/deleteuser',token.verifytoken,(req,res)=>{
  var userdata = req.user;
  
  datamodelds.searchUser(userdata.username,function(err,user){
    if(err){
    res.send({state:false,msg:"Server Error!"});}
    else if(user){
      //console.log(user);
      datamodelds.matchpassword(req.body.password,user.password,function(err,match){
        if(err){
          res.send({state:false,msg:"Server Error!"});
        }
        if(match){
          likerecipemodel.deletelikebyauthor(userdata.username,(err,msg)=>{
            if(err){
              res.send({state:false,msg:"Server Error!"});
            }else{
              recipemodels.deleterecipebyauthor(user.username,(err,msg)=>{
                if(err){
                  res.send({state:false,msg:"Server Error!"}); 
                }else{
                  cloudinary.uploader.destroy(user.profpic_cloud_id, function(result) {
                      datamodelds.deleteuser(user.username,(err,msg)=>{
                        if(err){
                          res.send({state:false,msg:"Server Error!"});
                        }else{
                          res.send({state:true,msg:"Account deactivated succesfully!"});
                        }
                      })
                  })
                }
              })
            }
          })
        }else{
          res.send({state:false,msg:"Wrong Password!"});
        }
      })
    }else{
      res.send({state:false,msg:"No User Found!"});
    }
  })
  
});


module.exports = router;