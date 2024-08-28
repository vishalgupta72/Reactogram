const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const profileSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        default: "add your description"
    },
    link:{
        type: String,
        default: "add your portfolio link"
    },
    profileImg:{
        type: String,
        default: "empty"
    },
    author:{
        type: ObjectId,
        ref: "UserModel"
    }
})

mongoose.model("ProfileModel", profileSchema);