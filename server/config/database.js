const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((c) => {
      console.log(`MongoDB Connected to: ${c.connection.host}`);
    })
    .catch((e) => {
      console.log("MongoDB Connection Error:", e);
    });
};

module.exports = connectDatabase;