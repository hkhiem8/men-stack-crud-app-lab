const mongoose = require("mongoose");

const dogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    breed: { type: String, required: true },
    isGoodBoy: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Dog = mongoose.model("Dog", dogSchema);

module.exports = Dog;
