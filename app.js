const express = require("express");
const { all } = require("express/lib/application");
const timeSheetDataBase = require('./mongoDB');
const app = express();

app.use(express.json());

const port = 5000
app.listen(port);

//create read updated delete
app.post('/addActivity', addActivity);


async function addActivity(req, res) {
    try {

        const { Date, Activity } = req.body;

        await timeSheetDataBase.findOneAndUpdate(
            {Date :  Date },                            // filter
            {$addToSet: {Activity : Activity} },        // update
            {upsert:true, new:true }                    // conduction
        );

        let temp = await timeSheetDataBase.find();
        res.json({
            Message: temp
        })

    } catch (err) {
        console.log(err);
    }

    
    // $pull in update => 2nd varible
}


























































async function readTask(req, res) {
    let allTask = await taskDataBase.find();
    res.send(allTask);
}

async function updateTask(req, res) {
    let oldTask = req.body.old;
    let newTask = req.body.new;

    let taskToBeUpdated = await taskDataBase.findOne({ Task: oldTask });
    if (taskToBeUpdated) {
        taskToBeUpdated['Task'] = newTask;
        taskToBeUpdated.save();
    }

    res.json({
        message: "Task has been updated"
    })

}

async function deleteTask(req, res) {

    let taskToBeDeleted = await taskDataBase.findOne({ Task: req.body.Task });
    if (taskToBeDeleted) {
        await taskDataBase.deleteOne(taskToBeDeleted['_id']);
    }

    res.json({
        message: "Task has been removed"
    })
}