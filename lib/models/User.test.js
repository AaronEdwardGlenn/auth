const User = require('./User.js'); 

describe('User testttt', () => {
  it('needs an email', () => {
    const user = new User(); 
    const { errors } = user.validateSync(); 
    expect(errors.email.message).toEqual('Path `email` is required.'); 
  });
});
it('should have the password hash', () => {
  const user = new User(); 
  const { errors } = user.validateSync(); 
  expect(errors.passwordHash.message).toEqual('Path `passwordHash` is required.'); 
});
it('should hash the password', () => {
  const user = new User({
    email: 'cool@cool.cool', 
    password: 'passing'
  }); 
  expect(user.passwordHash).toEqual(expect.any(String)); 
});
