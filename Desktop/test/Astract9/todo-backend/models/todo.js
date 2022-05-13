const mongoose = require('mongoose');


const todoSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 5,
        required: true
    },
    date: {
        type: Date,
        required: false
    },
    checked: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


todoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Todo', todoSchema);