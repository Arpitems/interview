const express = require("express");
const cors = require('cors') //use require cors
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var mongodbErrorHandler = require("mongoose-mongodb-errors");
require("dotenv").config();
const apiRouter = require("./api/routes/routes");
app.use(express.static("public"));

let http = require("http").createServer(app);
let io = require("socket.io")(http, { 
  cors: {
    origin: ["http://65.1.3.88:4000","http://localhost","http://localhost:4200", "http://127.0.0.1:5501"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Access-Control-Allow-Origin","*","Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"],
    credentials: true
  }
});

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

// io.on("connection", (socket) => {
//   console.log("a user connected :D",socket.id);
  
//   socket.emit('socket_Id:',socket.id)
//   socket.emit('gennerate_key',async function(){
//     //setInterval(async() => {
//       // let str = await  randomSave();
//       //  console.log("gennerate_key =>",str);
//        return "Key"
//      //}, 2000);
//   })
// });

io.on('connection', function(socket) {
  console.log("a user connected :D",socket.id);
  var str = randomSave();
setInterval(async() => {
  str = await  randomSave();
  console.log("gennerate_key =>",str);
  io.sockets.emit('gennerate_key',{ gennerated_key:  str});
 }, 100000);
  
   socket.on('disconnect', function () {
    console.log("a user disconnect :D",socket.id);
   });
});



async function randomSave() {
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
  return generateString;
}

//option mongodb
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    serverSelectionTimeoutMS: 50000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  };
 
 //mongodb 
 mongoose
  .connect(process.env.MONGO_URL,options)
  .then(() => {
    console.log("mongo connected");
  }); 

http.listen(process.env.PORT, () => {
  console.log("server started at ", process.env.PORT);
});

