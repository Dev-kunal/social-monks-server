const mongoose = require("mongoose");

const initializeDBConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongoose Connected Successfully");
  } catch (err) {
    cosnole.log("Mongoose Connectin Failed", err);
  }
};

module.exports = initializeDBConnection;
