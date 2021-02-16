const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var mongodbErrorHandler = require("mongoose-mongodb-errors");
require("dotenv").config();
const apiRouter = require("./api/routes/routes");
app.use(express.static("public"));

let http = require("http").createServer(app);
let io = require("socket.io")(http);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/api", apiRouter);

app.get("/", function (req, res) {
  res.sendFile("index.html");
});

let RandomGenerateModel = require("./api/models/RandomGenerate_Model");
let { Random_Generate,Type } = require("./api/helper/commonhelper");

io.on("connection", (socket) => {
  console.log("a user connected :D");
  setInterval(() => {
    Test();
    console.log("Hello");
  }, 3000);
});

async function Test() {
  let length = 14;
  let generateString = await Random_Generate(length);
  let items = ['one', 'two', 'three'];
  let item = items[Math.floor(Math.random() * items.length)];
  let random = new RandomGenerateModel({
    type: item,
    generateRandom: generateString,
    createdAt: new Date(),
  });
  await random.save();
}

// test
setTimeout(function() {
  mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("mongo connected");
  }); 
},10);


http.listen(process.env.PORT, () => {
  console.log("server started at ", process.env.PORT);
});

