const mongoose = require('mongoose');
const schema = mongoose.Schema;


const likerecipeschema = new schema({
    username:{type:String,required:true},
    recipename:{type:String,required:true},
    author:{type:String,require:true}
});
likerecipeschema.index({ username: 1, recipename: 1 }, { unique: true });
const likerecipemodel=module.exports = mongoose.model("likerecipemodel",likerecipeschema);

module.exports.dbSave = function(likeData,callback){
   // console.log(likeData);
    likeData.save(callback);
 
}

module.exports.Isliked = function(likeData,callback){
     //console.log(likeData.recipename);
     //console.log(likeData.username);
     const query={
        $and: [{recipename : likeData.recipename}, {username : likeData.username}] 
    }
        likerecipemodel.find(query,callback);  
     //likeData.save(callback);
  
 }

 module.exports.deleteLikeData = function(likeData,callback){
    //console.log(likeData.recipename);
    //console.log(likeData.username);
    const query={
       $and: [{recipename : likeData.recipename}, {username : likeData.username}] 
   }
       likerecipemodel.remove(query,callback);  
    
}

module.exports.deletelikebyrecipe = function(recipedata,callback){
    const query= {recipename : recipedata.recipename} 
       likerecipemodel.remove(query,callback);     
}
module.exports.likecount = function(likeData,callback){
    //console.log(likeData.recipename);
    //console.log(likeData.username);
    const query={recipename : likeData.recipename};
    likerecipemodel.count(query,callback);  
    //likeData.save(callback);
 
}

module.exports.deleterecipe = function(recipedata,callback){
    const query={
        $and: [{recipename : recipedata.recipename}, {username : recipedata.username}] }
    likerecipemodel.remove(query,callback);    
    
};

module.exports.deletelikebyauthor = function(authorname,callback){
    const query= {author  : authorname} 
       likerecipemodel.remove(query,callback);     
}