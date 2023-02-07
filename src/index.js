const express = require('express');
const cors = require('cors');
const UserController = require('./controllers/UserController')

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json())
app.use(cors());
app.use(express.json());

// const users = [];

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

  UserController.createTodo(user.username, todo)
  response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const user = request.user
  const { title, deadline } = request.body
  const id = request.params.id

  if (!UserController.getTodo(user.username, id)) {
    return response.status(404).json({error: 'Esse id não existe'})
  }

  const todo = {
    title,
    deadline: new Date(deadline),
  }

  const newTodo = UserController.updateTodo(user.username, id, todo)
  response.status(201).json(newTodo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
