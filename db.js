// connectToMongo.js
require('dotenv').config();
 const mongoose = require('mongoose');
let Database = process.env.MONGODBURL;

 // This function code connecting MnogoDB Database..................
const connectToMongo = async () => {
    try {
        await mongoose.connect(Database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // ... other options
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = connectToMongo;

