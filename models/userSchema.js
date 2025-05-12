const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: { type: String, required:true },
    email: { type: String,unique:true, required: true},
    password: { type: String,required: true },
    isAdmin: {type: Boolean, default: false}
},{timestamps: true});

const Users = mongoose.model('users',userSchema);
module.exports = { Users };