const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var mongodbErrorHandler = require("mongoose-mongodb-errors");
require("dotenv").config();
const apiRouter = require("./api/routes/routes");
const cors = require('cors') //use require cors
app.use(express.static("public"));

let http = require("http").createServer(app);
let io = require("socket.io")(http);

//use cors 
app.use(cors());

//bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});




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
// setTimeout(function() {

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    poolSize: 500, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 50000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

  // {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true, 
  //   useFindAndModify: false,
  //   useCreateIndex: true,
  //   connectTimeoutMS: 1000
  // }
 mongoose
  .connect(process.env.MONGO_URL,options)
  .then(() => {
    console.log("mongo connected");
  }); 





http.listen(process.env.PORT, () => {
  console.log("server started at ", process.env.PORT);
});

