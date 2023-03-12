const express = require("express");
const { oauth, validateCallback } = require("./controller/authController");
const { getActivity, addActivity, updateActivity, deleteActivity } = require('./controller/activityController');
const { getTask, addTask, addSubTask, updateTask, updateSubTask, deleteTask, deleteSubTask } = require('./controller/taskController');

const app = express();
var cors = require("cors");

app.use(cors({ origin: '*', optionsSuccessStatus: 200, credentials: true }));
app.options(
    "*",
    cors({ origin: true, optionsSuccessStatus: 200, credentials: true })
);

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.options("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "https://example.com");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(204);
});



const port = process.env.PORT || 5000;
app.listen(port);

app.get("/getTask", getTask);
app.get("/getActivity", getActivity);

app.post("/addTask", addTask);
app.post("/addSubTask", addSubTask);
app.post("/addActivity", addActivity);

app.post("/deleteTask", deleteTask);
app.post("/deleteSubTask", deleteSubTask);
app.post("/deleteActivity", deleteActivity);

app.post("/updateTask", updateTask);
app.post("/updateSubTask", updateSubTask);
app.post("/updateActivity", updateActivity);

app.get("/oauth", oauth);
app.get("/validate-callback", validateCallback);
