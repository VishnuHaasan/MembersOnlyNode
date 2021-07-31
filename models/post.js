const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  description: {type: String, required: true},
  title: {type: String, required:true},
  created_at: {type: Date, default: Date.now()}
});

PostSchema
.virtual('delurl')
.get(function(){
  return '/post/delete/' + this._id;
})

PostSchema
.virtual('date')
.get(function(){
  return this.created_at.toDateString();
})

PostSchema
.virtual('time')
.get(function(){
  return this.created_at.getUTCHours().toString() + ':' + this.created_at.getUTCMinutes().toString() + ':' + this.created_at.getUTCSeconds().toString() ;
})

module.exports = mongoose.model('Post', PostSchema);