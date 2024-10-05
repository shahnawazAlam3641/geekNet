const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://shahnawazalam3641:nastoy3641@cluster0.k7zel.mongodb.net/GeekNet"
  );
};

module.exports = connectDB;
