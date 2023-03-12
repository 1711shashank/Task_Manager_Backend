const { taskSheetDataBase } = require('../models/mongoDB');

module.exports.getTask = async function getTask(req, res) {
    let taskSheetData = await taskSheetDataBase.find({Email : req.query.Email});
    res.status(200).json({
        taskSheetData,
    });
}


module.exports.addTask = async function addTask(req, res) {
    try {
        const { Email, TaskName, SubTasks } = req.body.newEntry;

        console.log("Add Task", Email, TaskName, SubTasks);

        const newTask = new taskSheetDataBase({
            Email: Email,
            TaskName: TaskName,
            SubTasks: SubTasks,
        });

        await newTask.save();

        res.status(200).json({
            Message: "Task Added",
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports.addSubTask = async function addSubTask(req, res) {
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


module.exports.deleteTask = async function deleteTask(req, res) {
    try {
        console.log("delete task");

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

module.exports.deleteSubTask = async function deleteSubTask(req, res) {
    try {
        console.log("delete sub task");

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


module.exports.updateTask = async function updateTask(req, res) {
    try {
        console.log("updateTask");
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

module.exports.updateSubTask = async function updateSubTask(req, res) {
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
