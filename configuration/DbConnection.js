const mongose = require('mongoose');
const connectionString = process.env.MONGODB_URI;

// Connect to MongoDB
const DbConnection = async () =>{
    try{
        await mongose.connect(connectionString);
        console.log('Connected to MongoDB');
    }
    catch(err){
        console.error('Failed to connect to MongoDB', err);
    }
}

module.exports = DbConnection;