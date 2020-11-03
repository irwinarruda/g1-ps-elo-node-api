const mongoose = require("mongoose");

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    urlImg: {
        type: String, 
        default: ""
    },
    movieDB: {
        type: [Number],
        default: []
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("user", User);