const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    minlength: 1
  },
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255
  },
  firstName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
    unique: true
  },
  lastName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
    unique: true
  },
  age: {
    type: Number,
    required: false,
    minlength: 1,
    maxlength: 3,
  },
  gender: {
    type: String,
    required: false,
    minlength: 4,
    maxlength: 6,
  },
  isAdmin: Boolean
});

UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('myPrivateKey'));
  return token;
};

const User = mongoose.model('User', UserSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
  };

  return Joi.validate(user, schema);
}
