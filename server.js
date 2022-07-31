const express = require('express');
const bodyParser = require('body-parser');
const mainRouter = require('./routers/index');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT;
var app = express();

app.use(bodyParser.json());

app.use(bodyParser.json({limit: '50mb', extended: true}));

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());
app.use(cors({ origin: true }));
app.use(mainRouter);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
  

app.get("/api", (req, res) => {
    res.json({
        message: "This is rest api working....."
    });
});

app.listen(port, () => {
    console.log(`server is running on ${port}`);
});