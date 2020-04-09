const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function isValidUuid(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'id is not a valid uuid'})
  }

  return next();
}

const repositories = [];

app.use("/repositories/:id", isValidUuid);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;  
  repository = {
    id: uuid(),
    title,
    url, 
    techs,
    likes: 0
  }
  repositories.push(repository); 

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found'});
  }

  const { title, url, techs } = request.body;
  
  repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  } 
  repositories[repositoryIndex]=repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found'});
  }  

  let repository = repositories[repositoryIndex];
  
  repository.likes += 1;  

  repositories[repositoryIndex]=repository;
  return response.json(repository);
});

module.exports = app;
