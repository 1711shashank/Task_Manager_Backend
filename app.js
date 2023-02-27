const express = require("express");
const { all } = require("express/lib/application");
const { timeSheetDataBase, taskSheetDataBase } = require('./mongoDB');
const app = express();

var cors = require('cors');

app.use(cors({ origin: true, optionsSuccessStatus: 200, credentials: true }));
app.options( "*", cors({ origin: true, optionsSuccessStatus: 200, credentials: true }) );

app.use(express.json());

const port = 5000
app.listen(port);

app.get('/getTask', getTask);
app.get('/getSubTask', getSubTask);
app.get('/getActivity', getActivity);

app.post('/addTask', addTask);
app.post('/addSubTask', addSubTask);
app.post('/addActivity', addActivity);

app.post('/deleteTask', deleteTask);
app.post('/deleteSubTask', deleteSubTask);
app.post('/deleteActivity', deleteActivity);


async function getActivity(req,res){
    let TimeSheetData = await timeSheetDataBase.find();
    res.status(200).json({
        TimeSheetData
    })
}

async function addActivity(req, res) {
    try {
        const { Date, Activity } = req.body.newEntry;

        console.log(Date, Activity);

        await timeSheetDataBase.findOneAndUpdate(
            { Date: Date },                            // filter
            { $addToSet: { Activity: Activity } },        // update
            { upsert: true, new: true }                    // conduction
        );
        res.status(200).json({
            Message: "Activity Added"
        })

    } catch (err) {
        console.log(err);
    }

    // $pull in update => 2nd varible for delete
}
async function deleteActivity(req, res){
    try {
        const { _id, id } = req.body;
        
        const tt = await timeSheetDataBase.findOneAndUpdate(
            { 'Activity.id': id, _id:_id },             // filter
            { $pull: { Activity:{id:id} } },             // update
            { upsert: true, new: true }                  // conduction
        );


        res.status(200).json({
            Message: await timeSheetDataBase.find()
        })

    } catch (err) {
        console.log(err);
    }
}

async function getTask(req,res){
    let TaskSheetData = await taskSheetDataBase.find();
    res.status(200).json({
        TaskSheetData
    })
}

async function addTask(req, res) {
    try {
        const { TaskName, SubTasks } = req.body.newEntry;

        const newTask = new taskSheetDataBase({
            TaskName:TaskName, SubTasks:SubTasks
        });

        await newTask.save();

        res.status(200).json({
            Message: "Task Added"
        })
    } catch (err) {
        console.log(err);
    }
}

async function deleteTask(req, res){
    try {
        const { _id } = req.body;

        let taskToBeDeleted = await taskSheetDataBase.findOne({ _id: _id });
        if (taskToBeDeleted) {
            await taskSheetDataBase.deleteOne(taskToBeDeleted['_id']);
        }
        
        res.status(200).json({
            Message: "Task Deleted"
        })

    } catch (err) {
        console.log(err);
    }

}

async function getSubTask(req,res){
    let TaskSheetData = await taskSheetDataBase.find();
    res.status(200).json({
        TaskSheetData
    })
}

async function addSubTask(req, res){

    try {
        const {TaskId, SubTask} = req.body;
        console.log(req.body);

        await taskSheetDataBase.findOneAndUpdate(
            { _id: TaskId },                                     // filter
            { $addToSet: { SubTasks: SubTask } },               // update
            { upsert: true, new: true }                        // conduction
        );
        
        res.status(200).json({
            Message: "Sub Task Added"
        })

        
    } catch (err) {
        console.log(err);
    }
}

async function deleteSubTask(req, res){
    try {
        const { TaskId, SubTaskId } = req.body.subTaskToBeDeleted;
        console.log("delete",req.body);

        await taskSheetDataBase.findOneAndUpdate(
            { 'SubTasks.SubTaskId': SubTaskId, _id:TaskId },                            
            { $pull: {SubTasks:{SubTaskId: SubTaskId }}},                    
            { upsert: true, new: true }                   
        )

        res.status(200).json({
            Message: "Sub Task Deleted"
        })

    } catch (err) {
        console.log(err);
    }
}
