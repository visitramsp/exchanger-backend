const mongoose = require("mongoose")
require('dotenv').config();
const dbConnection = () => {
    mongoose.connect(process.env.DATABASE_URL, {

    }).then(() => {
        console.log(
            "Your DB URL:", process.env.DATABASE_URL);
        console.log("server started...");
    }).catch((err) => {
        console.log("Error djkfhskjhfkjsd====>", err);
    })
}

module.exports = dbConnection