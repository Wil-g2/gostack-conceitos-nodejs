const express = require("express");
const cors = require("cors");
const verifyIfIdExist = require('./middleware/verifyIfIdExist');

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
    likes: 0,
  }
  repositories.push(repository); 

  return response.json(repository);
});

app.put("/repositories/:id", verifyIfIdExist(repositories), (request, response) => {
  const { index } = request;    
  const { id } = request.params;

  console.log(index);
  const { title, url, techs } = request.body;
  
  repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[index].likes
  } 
  repositories[index]=repository;
  return response.json(repository);
});

app.delete("/repositories/:id", verifyIfIdExist(repositories), (request, response) => {
  const { index } = request;

  repositories.splice(index, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", verifyIfIdExist(repositories), (request, response) => {
  const { index } = request;

  repositories[index].likes += 1;

  return response.json(repositories[index]);
});

module.exports = app;
