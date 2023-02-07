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
    return response.status(404).json({error: 'Esse usuário já existe'})
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

  UserController.createUser(user)

  response.status(201).json({ "sucess": "Usuário criado com sucesso!", user })
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const user = request.user
  response.json(user)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const user = request.user
  const { title, deadline } = request.body

  const todo = {
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date()
  }

  UserController.createTodo(user.username, todo)
  response.status(201).json({ "sucess": "Tarefa criada com sucesso!", user })
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
