const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs'); const jwt = require('jsonwebtoken'); 
const schema = new mongoose.Schema(
  {
    email: {
      type: String, 
      required: true, 
      unique: true
    }, 
    passwordHash: {
      type: String, 
      required: true
    }
  }, {
    toJSON: {
      transform: (doc, ret) => {
        delete
        ret.passwordHash; 
      }   
    }
  });

schema.virtual('password').set(function(password) {
  const passwordHash = bcrypt.hashSync(password);
  this.passwordHash = passwordHash;
});

schema.methods.authToken = function() {
  return jest.sign(this.toJSON(), process.env.APP_SECRET, {
    expiresIn: '24h'
  }); 
};

schema.statics.authorize = async function({ email, password }) {
  const user = await this.findOne ({ email }); 
  if(!user) {
    const err = new Error('This email is invalid'); 
    err.status = 401; 
    throw err; 
  }
  const validPassword = await bcrypt.compare(password, user.passwordHash); 
  if(!validPassword){
    const err = new Error('That password is not correct. Sort it out.'); 
    err.status = 401; 
    throw err; 
  }
  return user; 
};

module.exports = mongoose.model('User', schema); 
