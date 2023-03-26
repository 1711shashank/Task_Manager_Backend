const express = require("express");
const { getUserData, addUserData } = require('./controller/userController');

const app = express();
var cors = require("cors");

app.use(cors({ origin: '*', optionsSuccessStatus: 200, credentials: true }));
app.options("*",cors({ origin: true, optionsSuccessStatus: 200, credentials: true }));

app.use(express.json());



const port = 5000 || process.env.PORT;
app.listen(port);



app.get("/getUserData", getUserData);
app.post("/addUserData", addUserData);

