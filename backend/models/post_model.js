const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    description:{
        type: String,
        require: true,
        
    },
    location:{
        type: String,
        require: true,

    },
    likes:[
        {
            type: ObjectId,
            ref: "UserModel"
        }
    ],
    comments:[
        {
            commentText: String,
            commentedBy: {type: ObjectId, ref: "UserModel"}
        }
    ],
    image:{
        type: String,
        require: true,

    },
    author:{
        type: ObjectId,
        ref: "UserModel"
    }
})


mongoose.model("PostModel", postSchema);