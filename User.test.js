const User = require('./User.js'); 

describe('User testttt', () => {
  it('needs an email'), () => {
    const user = new User(); 
    const { errors } = user.validateSync(); 
    expect(errors.email.message).toEqual(''); 
  };
});
