const users = []

module.exports = {
  createUser(user) {
    users.push(user)
  },
  getUser(username) {
    const user = users.find(item => item.username == username)
    return user
  },
  createTodo(username, todo) {
    const { todos } = this.getUser(username)
    todos.push(todo)
  },
  getTodo(username, id) {
    const { todos } = this.getUser(username)
    const todo = todos.find(item => item.id == id)
    return todo
  },
  updateTodo(username, id, newTodo) {
    const { todos } = this.getUser(username)
    const index = todos.findIndex(item => item.id == id)
    const todo = todos[index]

    todos[index] = {
      ...todo,
      ...newTodo,
    }
    return todos[index]
  },
}
