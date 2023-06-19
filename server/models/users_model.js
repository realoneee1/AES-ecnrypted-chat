const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {
        type: String
    },
    fname: {
        type: String,
        required: true,
        minlength: 4
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    password: {
        type: String,
        minlength: 4
    }
})


module.exports = users_model = mongoose.model('users', userSchema);