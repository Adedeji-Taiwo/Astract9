const Todo = require('../models/todo');
const User = require('../models/user');


const initialTodos = [
    {
        content: 'Meet admin',
        checked: true
    },
    {
        content: 'Hit the grocery store',
        checked: false
    }
];



const nonExistingId = async () => {
    const todo = new Todo(
        {
            content: 'Delete todo',
            checked: true
        }
    );

    await todo.save();
    await todo.remove();

    return todo._id.toString();
};


const todosInDb = async () => {
    const todos = await Todo.find({});
    return todos.map(todo => todo.toJSON());
};

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(user => user.toJSON());
};

module.exports = {
    initialTodos, nonExistingId, todosInDb, usersInDb,
};