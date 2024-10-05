const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://shahnawazalam3641:password@cluster0.k7zel.mongodb.net/GeekNet"
  );
};

module.exports = connectDB;
