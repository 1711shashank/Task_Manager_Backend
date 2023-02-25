const mongoose = require('mongoose');
const env = require('dotenv');
env.config();

const db_link = process.env.MONGO_URL;

mongoose.set('strictQuery', false);
mongoose.connect(db_link)
    .then(()=>{
        console.log("db connected");
    }).catch((err)=>{
        console.log(err);
    })

// database stracture
const timeSheetSchema = mongoose.Schema({
    Date: String,
    Activity: []
})

const timeSheetDataBase = mongoose.model("timeSheetDataBase", timeSheetSchema);
module.exports = timeSheetDataBase;