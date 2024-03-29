const express = require('express');
const cors = require('cors');
// const { uuid, validate, isUuid } = require('uuidv4');
const { v4: uuid_v4, validate } = require('uuid');

const app = express();
app.use(cors()); //perimite que qualquer frontend vindo de qualquer url tenha acesso ao BD

app.use(express.json()); // faz o express ler arquivos JSON

const projects = [];

function logRequest(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  console.time(logLabel);
  //return next();
  next();
  console.timeEnd(logLabel);
}

function validadeProjectId(request, response, next) {
  const { id } = request.params;

  if(!validate(id)) {
    return response.status(400).json({ error: 'Invalid project ID.' })
  }

  return next();
}

app.use(logRequest);
app.use('/projects/:id', validadeProjectId);

app.get('/projects', (request, response) => {
  const { title } = request.query;
  // console.log(title, owner);

  const result = title 
    ? projects.filter(project => project.title.includes(title))
    : projects;

  return response.json(result);
});

app.post('/projects', (request, response) => {
  // const body = request.body;
  // console.log(body);
  // const projects = { title, owner };

  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json(project);
});

app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex(project => project.id === id);
  
  if (projectIndex < 0) {
    console.log(projectIndex);
    return response.status(400).json({ error: 'Project not found.' });
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);
  
  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  projects.splice(projectIndex, 1);

  
  return response.status(204).send();
});

app.listen(3333, () => {
  console.log('Back-end started!');
});