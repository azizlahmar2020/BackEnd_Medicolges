const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    lastname: String,
    email: String,
    password: String,
    gender: String,
    birthdate: Date,
    role: {
        type: String,
        default: "visitor"
    },
    profileImage: String  

});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
