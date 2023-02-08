const express = require('express');
const cors = require('cors');
const UserController = require('./controllers/UserController')
const TodoController = require('./controllers/TodoController')

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json())
app.use(cors());
app.use(express.json());

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers
  const user = UserController.getUser(username)
  if (!user) {
    return response.status(404).json({error: 'Esse usuário não existe'})
  }

  request.user = user
  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body
  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  if (UserController.getUser(username)) {
    return response.status(400).json({error: 'Esse username ja esta sendo utilizado'})
  }

  UserController.createUser(user)

  response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { todos } = request.user
  response.json(todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const user = request.user
  const { title, deadline } = request.body

  const todo = {
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date()
  }

  TodoController.createTodo(user.username, todo)
  response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const user = request.user
  const { title, deadline } = request.body
  const id = request.params.id

  if (!TodoController.getTodo(user.username, id)) {
    return response.status(404).json({error: 'Esse id não existe'})
  }

  const todo = {
    title,
    deadline: new Date(deadline),
  }

  const newTodo = TodoController.updateTodo(user.username, id, todo)
  response.status(201).json(newTodo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const user = request.user
  const id = request.params.id

  if (!TodoController.getTodo(user.username, id)) {
    return response.status(404).json({error: 'Esse id não existe'})
  }

  const todo = TodoController.doneTodo(user.username, id)
  response.status(201).json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const user = request.user
  const id = request.params.id

  if (!TodoController.getTodo(user.username, id)) {
    return response.status(404).json({error: 'Esse id não existe'})
  }

  TodoController.deleteTodo(user.username, id)
  response.status(204).json()
});

module.exports = app;
