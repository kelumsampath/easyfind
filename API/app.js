const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
var blacklist = require('express-jwt-blacklist');
const cors = require('cors');
const cloudinary = require('cloudinary');

const app = express();
const port = process.env.PORT || 3000;
const user = require('./web/routes/user');
const foodRecipe = require('./web/routes/foodRecipe');
const config = require('./config/configuration');

http.createServer(app).listen(port,(err)=>{
  if (err) {
    console.error(err);
  } else {
    console.log("App listen to port:"+port);
  }
});

const connectDB = mongoose.connect(config.database,(err)=>{
if(err){
  console.log("Warning! Database not connected");
}else{
  console.log("Database connected"); 
}
});

app.use(express.static(path.join(__dirname,"public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());


app.use(passport.initialize());
app.use(passport.session());

cloudinary.config({ 
  cloud_name: config.cloud_name, 
  api_key: config.api_key, 
  api_secret: config.api_secrete 
});


/*url routings*/
app.get('/',(req,res)=>{
  res.send("Hello food!!");
});

app.use('/user',user);
app.use('/foodrecipe',foodRecipe);
