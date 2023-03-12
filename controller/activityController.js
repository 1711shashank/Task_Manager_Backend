const { timeSheetDataBase } = require('../models/mongoDB');

module.exports.addActivity = async function addActivity(req, res) {
    try {
        const { Email, Date, Activity } = req.body.newEntry;

        console.log(Email, Date, Activity);

        await timeSheetDataBase.findOneAndUpdate(
            { Date: Date, Email: Email }, // filter
            { $addToSet: { Activity: Activity } }, // update
            { upsert: true, new: true } // conduction
        );


        res.status(200).json({
            Message: "Activity Added",
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports.getActivity = async function getActivity(req, res) {
    console.log("getActivity", req.query.Email);
    
    let timeSheetData = await timeSheetDataBase.find( {Email : req.query.Email} );
    timeSheetData.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    
    res.status(200).json({
        timeSheetData,
    });
}

module.exports.deleteActivity = async function deleteActivity(req, res) {
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

module.exports.updateActivity = async function updateActivity(req, res) {
    try {
        const { id1, id2, newTopic, newDate, newDescription } = req.body.activityToBeUpdated;
        const newActivity = { id: id2, Topic: newTopic, Description: newDescription };

        console.log(newActivity);

        await timeSheetDataBase.findOneAndUpdate(
            { "Activity.id": id2, _id: id1 }, // filter
            { $pull: { Activity: { id: id2 } } }, // update
            { upsert: true, new: true } // conduction
        );


        await timeSheetDataBase.findOneAndUpdate(
            { Date: newDate }, // filter
            { $addToSet: { Activity: newActivity } }, // update
            { upsert: true, new: true } // conduction
        );


        res.status(200).json({
            Message: "Update Activity",
        });
    } catch (err) {
        console.log(err);
    }
}
