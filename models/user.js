const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  displayname: {type: String, required: true},
  isAdmin: {type: Boolean, default: false},
  isMember: {type: Boolean, default: false},
  created_at: {type: Date, default: Date.now()}
});

UserSchema
.virtual('url')
.get(function(){
  return '/user/' + this._id;
});

UserSchema
.virtual('editurl')
.get(function(){
  return '/user/update/' + this._id;
})

module.exports = mongoose.model('User', UserSchema);