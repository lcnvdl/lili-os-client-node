const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const EventEmitter = require('events');

class MainServer extends EventEmitter {
  start(port, app) {
    return new Promise((resolve, reject) => {
      if (!app) {
        app = express();
      }

      app.use(bodyParser.json());
      app.use(cors());

      app.get("/mount", (_, res) => {
        this.emit("mount", { res });
      });

      app.post("/read", (req, res) => {
        const { body } = req;
        this.emit("read", { body, res });
      });

      app.post("/list", (req, res) => {
        const { body } = req;
        this.emit("list", { body, res });
      });

      app.post("/exists", (req, res) => {
        const { body } = req;
        this.emit("exists", { body, res });
      });

      app.post("/write", (req, res) => {
        const { body } = req;
        this.emit("write", { body, res });
      });

      app.listen(port || 3663, () => {
        console.log(`App listening at http://localhost:${port}`);
        this.emit("start");
        resolve();
      });
    });
  }
}

module.exports = MainServer;
