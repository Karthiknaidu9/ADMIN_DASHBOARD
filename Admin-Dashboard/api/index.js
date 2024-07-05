const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const EmployeeModel = require("./models/employee");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://Karthik:kgIpTNH9gSLuHi3p@blog-application.mnxxefe.mongodb.net/<dbname>?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

app.get("/employees", async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching employee data" });
  }
});

app.get("/employee/:id", async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/addEmployee", async (req, res) => {
  const { name, position, description, experience } = req.body;
  console.log({ name, position, description, experience });
  const newEmployee = new EmployeeModel({
    name,
    position,
    description,
    experience,
  });

  try {
    const savedEmployee = await newEmployee.save();
    res.json(savedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving employee data" });
  }
});

app.put("/changestatus/:id", async (req, res) => {
  const { id } = req.params;
  const { taskId } = req.body;

  try {
    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Find the index of the task in the tasks array
    const taskIndex = employee.tasks.findIndex(
      (task) => task._id.toString() === taskId
    );

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Toggle the completed status
    employee.tasks[taskIndex].completed = !employee.tasks[taskIndex].completed;

    // Save the updated employee document
    await employee.save();

    res.json(employee.tasks[taskIndex].completed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.put("/addtasks/:id", async (req, res) => {
  const { id } = req.params;
  const { name, phone, completed, details } = req.body;

  try {
    // Find the employee by ID
    const employee = await EmployeeModel.findById(id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Add new task to the tasks array
    employee.tasks.push({ name, phone, completed, details });

    // Save the updated employee document
    const updatedEmployee = await employee.save();

    res.status(200).json(updatedEmployee); // Respond with the updated employee document
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Server error" });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
