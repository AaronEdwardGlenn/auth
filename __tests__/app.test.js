require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User.js'); 

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  // eslint-disable-next-line no-unused-vars
  let user; 
  beforeEach(async() => {
    user = await User.create({
      name: 'calvin',
      email: 'cool@cool.cool', 
      password: 'coolidge'
    }); 
  });


  it('should post a new user properly', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'cool@cool.cool', password: 'password' })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session=')); 
        expect(res.body).toEqual({
          _id: expect.any(String), 
          email: 'cool@cool.cool', 
          __v: 0
        }); 
      }); 
  }); 

  it('can login a user when their creditials are correct', async() => {
    await User.create({
      email: 'cool@cool.cool', 
      password: 'coolidge'
    }); 
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'cool@cool.cool', 
        password: 'coolidge'
      })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session=')); 
        expect(res.body).toEqual({
          _id: expect.any(String), 
          email: 'cool@cool.cool', 
          __v: 0
        }); 
      }); 
  }); 

  it('errors when logging in with the wrong email', async() => {
    await User.create({
      email: 'cool@cool.cool', 
      password: 'coolidge'
    }); 
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nay@nay.nay', password: 'coolidge' })
      .then(res => {
        expect(res.status).toEqual(401); 
        expect(res.body).toEqual({
          status: 401, 
          message: 'This email is invalid. Or maybe password. You will never know.'
        }); 
      }); 
  }); 

  it('cannot login with incorrect password', async() => {
    await User.create({
      email: 'cool@cool.cool', 
      password: 'coolidge'
    }); 
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'cool@cool.cool', password: 'jackson' })
      .then(res => {
        expect(res.status).toEqual(401); 
        expect(res.body).toEqual({
          status: 401, 
          message: 'That email or password is not correct. Sort it out.'
        }); 
      }); 
  }); 
}); 

