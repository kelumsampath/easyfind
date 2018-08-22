const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

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
    imageUrl:{type:String,required:false},
    likes:{type:Number,required:false,default:0},
    date:{type: Date}
});

const recipemodels=module.exports = mongoose.model("recipemodels",recepeSchema);

module.exports.dbSave = function(regRecipe,callback){
    regRecipe.save(callback);
 
}

module.exports.getAllrecipe = function(dd,callback){
    const query = {};
    recipemodels.find(query,callback);
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
