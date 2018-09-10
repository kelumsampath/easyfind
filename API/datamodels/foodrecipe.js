const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary');

const recepeSchema = new schema({
    username:{type:String,required:true},
    recipename:{type:String,required:true ,unique:true},
    ingredients:{type:String,required:false},
    directions:{type:String,required:false},
    preptime:{type:String,required:false},
    cooktime:{type:String,required:false},
    readytime:{type:String,required:false},
    serves:{type:String,required:false},
    notes:{type:String,required:false},
    rate:{type:String,required:false},
    catagory:{type:String,required:false},
    description:{type:String,required:false},
    image_id:{type:String,required:false},
    imageUrl:{type:String,required:false},
    likes:{type:Number,required:false,default:0},
    date:{type: Date},
    status:{type:String,required:false,default:"pending"}
});

const recipemodels=module.exports = mongoose.model("recipemodels",recepeSchema);

module.exports.dbSave = function(regRecipe,callback){
    regRecipe.save(callback);
 
}

module.exports.getAcceptedrecipe = function(dd,callback){
    const query = {status:"accepted"};
    recipemodels.find(query,callback).sort({"date":-1});
};

module.exports.getAllrecipe = function(dd,callback){
    const query = {};
    recipemodels.find(query,callback).sort({"date":-1});
};

module.exports.getmostliked = function(dd,callback){
    const query = {status:"accepted"};
    recipemodels.find(query,callback).sort({"likes":-1}).limit(5);
};

module.exports.getViewrecipe = function(myrecipename,callback){
    const query = { recipename:myrecipename };
    recipemodels.find(query,callback);
}; 

module.exports.updatelikes = function(likedetails,callback){
    const query = { recipename:likedetails.recipename };
    recipemodels.update(
        query,
        { $set: { "likes": likedetails.count } },callback
     )
}; 


module.exports.getUserRecipe = function(username,callback){
    const query = {username:username};
    recipemodels.find(query,callback).sort({"date":-1});
};

module.exports.deleterecipe = function(myrecipename,callback){
    const query = { recipename:myrecipename };
    recipemodels.remove(query,callback);
}; 

module.exports.updatestatus = function(statusData,callback){
    const query = { recipename:statusData.recipename };
    recipemodels.update(
        query,
        { $set: { "status": statusData.status } },callback
     )
}; 

module.exports.searchrecipe = function(reciname,callback){
    const query =  { recipename: { $regex: reciname } } ;
    recipemodels.find(query,callback).sort({"date":-1});
};

module.exports.deleterecipebyauthor = function(author,callback){
    const query = { username:author };
    
    recipemodels.count(query,(err,count)=>{
        if(err){
            callback(err)
        }else{
            recipemodels.find(query,(err,rows)=>{
                if(err){
                    callback(err)
                }else{
                    for (i = 0; i < count; i++) { 
                       cloudinary.uploader.destroy(rows[i].image_id, function(result) {
                       })
                      
                       
                    }
                    recipemodels.remove(query,(err,msg)=>{
                        if(err){
                            callback(err);
                        }else{
                            callback(null,true);
                        }
                    });
                    
                }
        })
    }
    
    });


}; 