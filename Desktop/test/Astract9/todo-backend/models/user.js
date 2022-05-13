const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'basic',
        enum: ['basic', 'admin']
    },
    todos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ],
});


userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash;
    }
});



userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const hash = await bcrypt.hash(this.password, Number(10));
    this.password = hash;
    next();
});





const User = mongoose.model('User', userSchema);

module.exports = User;