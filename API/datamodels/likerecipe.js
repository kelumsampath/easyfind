const mongoose = require('mongoose');
const schema = mongoose.Schema;


const likerecipeschema = new schema({
    username:{type:String,required:true},
    recipename:{type:String,required:true},
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