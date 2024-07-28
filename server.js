require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
const PORT = 3000;
const Dog = require("./models/dog");
const logger = require("morgan");
const methodOverride = require("method-override");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("tiny"));

// Allowing PUT and DELETE methods in HTML forms
app.use(methodOverride("_method"));

// Setting EJS as the view engine
app.set("view engine", "ejs");

mongoose.connect(MONGO_URI);

mongoose.connection.once("open", () => {
  console.log("MongoDB working");
});

mongoose.connection.on("error", () => {
  console.error("MongoDB not working");
});

app.listen(PORT, () => {
  console.log(`The application is accepting requests on PORT ${PORT}`);
});

// Controller & Router Logic

// Shows a form to add new dogs
app.get("/dogs/new", (req, res) => {
  res.render("new");
});

//Create a new dog (POST request)
app.post("/dogs", async (req, res) => {
  try {
    const createdDog = await Dog.create(req.body);
    res.redirect("/dogs");
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

//Read
// Index - Displays a list of all dogs
app.get("/dogs", async (req, res) => {
  try {
    const foundDogs = await Dog.find({});
    res.render("index", { dogs: foundDogs });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

//  Displays a specific dog by its ID
app.get("/dogs/:id", async (req, res) => {
  try {
    const foundDog = await Dog.findOne({ _id: req.params.id });
    res.render("show", { dog: foundDog });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// Update a specific dog (form)
app.get("/dogs/:id/edit", async (req, res) => {
  try {
    const foundDog = await Dog.findOne({ _id: req.params.id });
    res.render("edit", { dog: foundDog });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// Updates a specific dog by its ID (PUT Request)
app.put("/dogs/:id", async (req, res) => {
  try {
    const updatedDog = await Dog.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.redirect("/dogs");
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// Deletes a specific dog by its ID
app.delete("/dogs/:id", async (req, res) => {
  try {
    await Dog.findOneAndDelete({ _id: req.params.id }).then((note) => {
        res.redirect("/dogs");
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});