const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

console.log("PORT =", process.env.PORT);
console.log("MONGO_URI =", process.env.MONGO_URI);

const Member = require("./models/Member");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error");
    console.log(err);
  });

// Home Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =======================
// Register Member
// =======================
app.post("/register", async (req, res) => {
  try {
    const member = new Member({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });

    await member.save();

    res.json({
      success: true,
      message: "Registration Successful!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error Saving Member",
    });
  }
});

// =======================
// Get All Members
// =======================
app.get("/members", async (req, res) => {
  try {
    const members = await Member.find().sort({ _id: -1 });
    res.json(members);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Unable to fetch members",
    });
  }
});

// =======================
// Update Member
// =======================
app.put("/update/:id", async (req, res) => {
  try {
    await Member.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });

    res.json({
      message: "Member Updated Successfully!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Update Failed",
    });
  }
});

// =======================
// Delete Member
// =======================
app.delete("/delete/:id", async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);

    res.json({
      message: "Member Deleted Successfully!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Delete Failed",
    });
  }
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on http://localhost:${PORT}`);
});