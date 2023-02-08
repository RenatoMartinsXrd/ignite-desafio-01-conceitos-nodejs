const users = []

module.exports = {
  createUser(user) {
    users.push(user)
  },
  getUser(username) {
    const user = users.find(item => item.username == username)
    return user
  }
}
