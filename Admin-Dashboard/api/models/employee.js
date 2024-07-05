const mongoose = require("mongoose");
const { Schema } = mongoose;

const EmployeeSchema = new Schema({
  name: String,
  position: String,
  description: String,
  experience: Number,
  tasks: {
    type: [
      {
        name: String,
        phone: String,
        completed: Boolean,
        details: String,
      },
    ],
    default: [],
  },
});

const EmployeeModel = mongoose.model("ExployeeSchema", EmployeeSchema);

module.exports = EmployeeModel;
