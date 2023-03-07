const express = require("express");
const { timeSheetDataBase, taskSheetDataBase } = require("./mongoDB");
const { oauth, validateCallback } = require("./auth");
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



const port = 5000;
app.listen(port);

app.get("/getTask", getTask);
app.get("/getSubTask", getSubTask);
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




//Add
async function addActivity(req, res) {
    try {
        const { Date, Activity } = req.body.newEntry;

        await timeSheetDataBase.findOneAndUpdate(
            { Date: Date }, // filter
            { $addToSet: { Activity: Activity } }, // update
            { upsert: true, new: true } // conduction
        );
        res.status(200).json({
            Message: "Activity Added",
        });
    } catch (err) {
        console.log(err);
    }

    // $pull in update => 2nd varible for delete
}

async function addSubTask(req, res) {
    try {
        const { taskId, subTask } = req.body;
        console.log(req.body);

        await taskSheetDataBase.findOneAndUpdate(
            { _id: taskId }, // filter
            { $addToSet: { SubTasks: subTask } }, // update
            { upsert: true, new: true } // conduction
        );

        res.status(200).json({
            Message: "Sub Task Added",
        });
    } catch (err) {
        console.log(err);
    }
}

async function addTask(req, res) {
    try {
        const { taskName, subTasks } = req.body.newEntry;

        console.log(taskName, subTasks)

        const newTask = new taskSheetDataBase({
            TaskName: taskName,
            SubTasks: subTasks,
        });

        await newTask.save();

        res.status(200).json({
            Message: "Task Added",
        });
    } catch (err) {
        console.log(err);
    }
}



//Get
async function getActivity(req, res) {
    let TimeSheetData = await timeSheetDataBase.find();
    res.status(200).json({
        TimeSheetData,
    });
}

async function getTask(req, res) {
    let taskSheetData = await taskSheetDataBase.find();
    res.status(200).json({
        taskSheetData,
    });
}

async function getSubTask(req, res) {
    let TaskSheetData = await taskSheetDataBase.find();
    res.status(200).json({
        TaskSheetData,
    });
}



//Delete
async function deleteActivity(req, res) {
    try {
        const { _id, id } = req.body;

        await timeSheetDataBase.findOneAndUpdate(
            { "Activity.id": id, _id: _id }, // filter
            { $pull: { Activity: { id: id } } }, // update
            { upsert: true, new: true } // conduction
        );

        res.status(200).json({
            Message: "Activity Deleted",
        });
    } catch (err) {
        console.log(err);
    }
}

async function deleteTask(req, res) {
    try {
        const { _id } = req.body;

        let taskToBeDeleted = await taskSheetDataBase.findOne({ _id: _id });
        if (taskToBeDeleted) {
            await taskSheetDataBase.deleteOne(taskToBeDeleted["_id"]);
        }

        res.status(200).json({
            Message: "Task Deleted",
        });
    } catch (err) {
        console.log(err);
    }
}

async function deleteSubTask(req, res) {
    try {
        const { taskId, subTaskId } = req.body.subTaskToBeDeleted;
        console.log("delete", req.body);

        await taskSheetDataBase.findOneAndUpdate(
            { "SubTasks.SubTaskId": subTaskId, _id: taskId },
            { $pull: { SubTasks: { SubTaskId: subTaskId } } },
            { upsert: true, new: true }
        );

        res.status(200).json({
            Message: "Sub Task Deleted",
        });
    } catch (err) {
        console.log(err);
    }
}



// Update
async function updateSubTask(req, res) {
    try {
        const { taskId, subTaskId, newSubTaskName } = req.body.subTaskToBeUpdated;
        console.log("update", req.body);

        await taskSheetDataBase.updateOne(
            { "SubTasks.SubTaskId": subTaskId, _id: taskId },
            { "SubTasks.$.SubTaskName": newSubTaskName },
            { upsert: false }
        );

        res.status(200).json({
            Message: "Sub Task update",
        });
    } catch (err) {
        console.log(err);
    }
}

async function updateTask(req, res) {
    try {
        const { taskId, newTaskName } = req.body.taskToBeUpdated;
        console.log(taskId, newTaskName);

        await taskSheetDataBase.updateOne(
            { _id: taskId },
            { "TaskName": newTaskName },
            { upsert: false }
        );


        res.status(200).json({
            Message: "Task Deleted",
        });
    } catch (err) {
        console.log(err);
    }
}

async function updateActivity(req, res) {
    try {
        const { id1, id2, newTopic, newDate, newDescription } = req.body.activityToBeUpdated;
        console.log(id1, id2, newTopic, newDate, newDescription);

        await timeSheetDataBase.updateOne(
            { "Activity.id": id2, _id: id1 },
            { "Activity.$.Topic": newTopic, "Activity.$.Date": newDate, "Activity.$.Description": newDescription },
            { upsert: false }
        );
        res.status(200).json({
            Message: "Activity Added",
        });
    } catch (err) {
        console.log(err);
    }
}
