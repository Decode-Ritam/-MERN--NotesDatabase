const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,  // Capitalize 'String'
        required: true  // 'required' instead of 'require'
    },
    email: {
        type: String,  // Capitalize 'String'
        required: true,
        unique: true
    },
    password: {
        type: String,  // Capitalize 'String'
        required: true
    },
    date: {
        type: Date,  // Capitalize 'Date'
        default: Date.now
    }

});
module.exports = mongoose.model('user', UserSchema)
// const User = mongoose.model('user', UserSchema);
// User.createIndexes();
// module.exports = User;   