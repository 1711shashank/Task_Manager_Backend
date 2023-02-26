const express = require("express");
const { all } = require("express/lib/application");
const { timeSheetDataBase, taskSheetDataBase } = require('./mongoDB');
const app = express();

app.use(express.json());

const port = 5000
app.listen(port);

app.post('/addTask', addTask);
app.post('/addSubTask', addSubTask);
app.post('/addActivity', addActivity);

app.post('/deleteTask', deleteTask);
app.post('/deleteSubTask', deleteSubTask);
app.post('/deleteActivity', deleteActivity);




async function addActivity(req, res) {
    try {
        const { Date, Activity } = req.body;

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
        const { _id, Activity } = req.body;

        await timeSheetDataBase.findOneAndUpdate(
            { _id: _id },                                  // filter
            { $pull: { Activity: Activity } },             // update
            { upsert: true, new: true }                    // conduction
        );
        res.status(200).json({
            Message: "Activity Deleted"
        })

    } catch (err) {
        console.log(err);
    }
}



async function addTask(req, res) {
    try {
        const { TaskName, SubTasks } = req.body;

        const newTask = new taskSheetDataBase({
            TaskName:TaskName, SubTasks:SubTasks
        });

        await newTask.save();

        res.status(200).json({
            Message: "Task Deleted"
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



async function addSubTask(req, res){

    try {
        const {TaskId, SubTask} = req.body;

        await taskSheetDataBase.findOneAndUpdate(
            { _id: TaskId },                                     // filter
            { $addToSet: { SubTasks: SubTask } },               // update
            { upsert: false, new: true }                        // conduction
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
        const { TaskId, SubTask } = req.body;

        await taskSheetDataBase.findOneAndUpdate(
            { _id: TaskId },                            
            { $pull: { SubTasks: SubTask } },                    
            { upsert: true, new: true }                   
        )

        res.status(200).json({
            Message: "Sub Task Deleted"
        })

    } catch (err) {
        console.log(err);
    }
}
