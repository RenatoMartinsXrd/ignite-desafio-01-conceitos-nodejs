const UserController = require('./UserController')

module.exports = {
  createTodo(username, todo) {
    const { todos } = UserController.getUser(username)
    todos.push(todo)
  },
  getTodo(username, id) {
    const { todos } = UserController.getUser(username)
    const todo = todos.find(item => item.id == id)
    return todo
  },
  updateTodo(username, id, newTodo) {
    const { todos } = UserController.getUser(username)
    const index = todos.findIndex(item => item.id == id)
    const todo = todos[index]

    todos[index] = {
      ...todo,
      ...newTodo,
    }
    return todos[index]
  },
}
