const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const userSchema = new schema({
    fullname:{type:String,required:true},
    lastname:{type:String,required:true},
    username:{type:String,required:true, unique:true},
    email:{type:String,required:true},
    phoneno:{type:Number,required:true},
    password:{type:String,required:true},
    profpic_cloud_id:{type:String,required:true},
    usertype:{type:String,required:false},
    tepmpassword:{type:String,required:false},
});

const datamodels = module.exports = mongoose.model("datamodels",userSchema);

module.exports.dbSave = function(regUser,callback){

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(regUser.password, salt, function(err, hash) {
                //console.log(hash);
                regUser.password = hash;
                regUser.tepmpassword = hash;
                if(err){
                    throw err;
                }else{
                    regUser.save(err, callback);
                   
                    
                }
            });
        });

};


module.exports.searchUser = function(username,callback){
    const query = {username:username};
    datamodels.findOne(query,callback);
}; 



module.exports.matchpassword = function(password,hash,tepmpassword,callback){
    //console.log(password+" "+hash);
    bcrypt.compare(password, hash, function(err, res) {
        if(err) throw  err;
        if (res){
            callback(null,res);
        } else{
            bcrypt.compare(password, tepmpassword, function(err, res) {
                if(err) throw  err;
                if (res){
                    callback(null,res);
                } else{
                    callback(null,res);
                }
               // console.log(res);
            });
        }
       // console.log(res);
    });
}

module.exports.getUserDetails = function(username,callback){
    const query = {username:username};
    datamodels.findOne(query,callback); 
}

module.exports.updateUser = function(upadatedata,callback){
    datamodels.update
	(
		{
			username : upadatedata.username
		},
		{
			$set :
			{
                fullname : upadatedata.fullname,
                lastname : upadatedata.lastname,
                email : upadatedata.email,
                phoneno: upadatedata.phoneno
			}
		},callback
	)
}

module.exports.piceditidsave = function(picupdatedata,callback){
    datamodels.update
	(
		{
			username : picupdatedata.username
		},
		{
			$set :
			{
				profpic_cloud_id : picupdatedata.profpic_cloud_id
			}
		},callback
	)
}

module.exports.changepassword = function(object,callback){
    //console.log(object.password);
    //console.log(object.username);
    query={username:object.username}
    datamodels.findOne(query,function(err, user) {
        if (err) {
            return callback(err);
        }else{
        bcrypt.compare(object.password.oldpassword, user.password, function(err, result) {
            if(err){
                return callback(err);
            }
            else if (result === true) {
                //console.log("matched")
                bcrypt.genSalt(10, function(err, salt) {
                    if(err){
                        return callback(err);  
                    }else{
                    bcrypt.hash(object.password.newpassword, salt, function(err, hash) {
                        //console.log(hash);
                        const newpass = hash;
                        if(err){
                            return callback(err);
                        }else{
                            datamodels.update(query,{$set :{ password : newpass}},function(err,msg){
                                if(err){
                                 return callback(err);  
                                }else{
                                 return callback(null,true);
                                }
                            });   
                        }
                    });
                }
                });
            } else {
               // console.log("not match")
                    bcrypt.compare(object.password.oldpassword, user.tepmpassword, function(err, result) {
                        if(err){
                            return callback(err);
                        }
                        else if (result === true) {
                            //console.log("matched")
                            bcrypt.genSalt(10, function(err, salt) {
                                if(err){
                                    return callback(err);  
                                }else{
                                bcrypt.hash(object.password.newpassword, salt, function(err, hash) {
                                    //console.log(hash);
                                    const newpass = hash;
                                    if(err){
                                        return callback(err);
                                    }else{
                                        datamodels.update(query,{$set :{ password : newpass}},function(err,msg){
                                            if(err){
                                            return callback(err);  
                                            }else{
                                            return callback(null,true);
                                            }
                                        });   
                                    }
                                });
                            }
                            });
                        } else {
                        // console.log("not match")
                            return callback(null,false);
                        }
                    })
            }
        })
    }
    })
    //console.log(callback);
}

module.exports.deleteuser = function(username,callback){
    const query = {username:username};
    datamodels.remove(query,callback); 
}

module.exports.savetemppass=function(tempuser,callback){
    query={username:tempuser.username};
    
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(tempuser.password, salt, function(err, hash) {
            //console.log(hash);
            tempuser.password = hash;
            if(err){
                throw err;
            }else{
                datamodels.update(query,{$set :{ tepmpassword : tempuser.password}},function(err,msg){
                    if(err){
                     return callback(err);  
                    }else{
                     return callback(null,true);
                    }
                })
               
                
            }
        });
    });

}

module.exports.searchUser;