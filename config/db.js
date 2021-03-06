const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true, //solucion de un warning
      useCreateIndex: true, //otro warning
      useFindAndModify: false //Warning de findOneAndUpdate
    });

    console.log('Database connected...');
  } catch (err) {
    console.error(err.message);

    //exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
