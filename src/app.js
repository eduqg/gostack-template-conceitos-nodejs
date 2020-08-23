const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(newRepository)

  return response.status(200).json(newRepository)
});

app.put("/repositories/:id", async (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryFound = await repositories.find(repository => repository.id === id)

  if (!repositoryFound) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  repositoryFound.title = title;
  repositoryFound.url = url;
  repositoryFound.techs = techs;

  return response.status(200).json(repositoryFound)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryFoundId = repositories.findIndex(repository =>
    repository.id === id);

  if (repositoryFoundId >= 0) {
    repositories.splice(repositoryFoundId, 1);
  } else {
    return response.status(400).json({ error: 'Repository not found' })
  }

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryFoundId = repositories.findIndex(repository =>
    repository.id === id);

  if (repositoryFoundId === -1) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  repositories[repositoryFoundId].likes += 1;

  return response.status(200).json(repositories[repositoryFoundId])
});

module.exports = app;
