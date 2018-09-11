const generator = require('generate-password');

module.exports.genaratepass= function(callback){
    var password = generator.generate({
        length: 10,
        numbers: true
    });
      callback(password);
}