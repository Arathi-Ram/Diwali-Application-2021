const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name:String,
    frndName:String,
    frndEmail:String
});

const UserData = mongoose.model('UserData',UserSchema);
module.exports = UserData;