const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async () => {
    const db = process.env.DB_CNN;

    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('DB inline');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD. Ver Logs');
    }
}

module.exports = {
    dbConnection
}