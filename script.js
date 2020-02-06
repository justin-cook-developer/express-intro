const express = require("express");
const morgan = require("morgan");
const path = require("path");

const dbMethods = require("./dbMethods");

const PORT = process.env.PORT || 3000;
const DBPath = "./todos.json";

const app = express();

app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "static")));

app.use(express.json());

app.get("/api/todos", async (request, response, next) => {
  try {
    const todos = await dbMethods.readFile(DBPath);
    response.json(JSON.parse(todos));
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/todos", ({ body: { text } }, response, next) => {
  dbMethods
    .readFile(DBPath)
    .then((todos) => {
      todos = JSON.parse(todos);

      todos.push({ text });

      return dbMethods.writeFile(DBPath, JSON.stringify(todos));
    })
    .then(() => {
      response.json({ text });
    })
    .catch(next);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
