const mongoose = require('mongoose');

//blue print of the data
const postSchema = mongoose.Schema({
    title: {type: String, required: true },
    content : { type: String, required : true }
})

//to create object model base on the definition// name of the model and schema
module.exports = mongoose.model('Post', postSchema)

