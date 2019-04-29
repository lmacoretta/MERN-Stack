const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true //solucion de un warning
    });

    console.log('Database connected...');
  } catch (err) {
    console.error(err.message);

    //exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
